import * as mediasoup from 'mediasoup';
import { config } from './config';
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

// Types
interface Room {
  id: string;
  router: mediasoup.types.Router;
  peers: Map<string, Peer>;
}

interface Peer {
  id: string;
  name: string;
  transports: Map<string, mediasoup.types.Transport>;
  producers: Map<string, mediasoup.types.Producer>;
  consumers: Map<string, mediasoup.types.Consumer>;
}

interface JoinRoomParams {
  roomId: string;
  name: string;
}

interface CreateWebRtcTransportParams {
  sender: boolean;
}

interface TransportParams {
  transportId: string;
  dtlsParameters: mediasoup.types.DtlsParameters;
}

interface ProduceParams {
  transportId: string;
  kind: mediasoup.types.MediaKind;
  rtpParameters: mediasoup.types.RtpParameters;
}

// Global variables
const rooms = new Map<string, Room>();
const workers: mediasoup.types.Worker[] = [];
let nextWorkerIndex = 0;

// Express and Socket.io setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Get next mediasoup Worker
const getNextWorker = () => {
  const worker = workers[nextWorkerIndex];
  nextWorkerIndex = (nextWorkerIndex + 1) % workers.length;
  return worker;
};

// Initialize mediasoup
async function initializeMediasoup() {
  // Create mediasoup workers
  const numWorkers = 1; // Fixed value instead of from config
  
  console.log(`Creating ${numWorkers} mediasoup workers...`);
  
  for (let i = 0; i < numWorkers; i++) {
    const worker = await mediasoup.createWorker({
      logLevel: config.mediasoup.worker.logLevel as mediasoup.types.WorkerLogLevel,
      logTags: config.mediasoup.worker.logTags as mediasoup.types.WorkerLogTag[],
      rtcMinPort: config.mediasoup.worker.rtcMinPort,
      rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
    });
    
    worker.on('died', () => {
      console.error(`Worker ${worker.pid} died, exiting...`);
      setTimeout(() => process.exit(1), 2000);
    });
    
    workers.push(worker);
  }
}

// Create a new mediasoup Router
async function createRouter() {
  const worker = getNextWorker();
  // Convert the config media codecs to the correct type
  const mediaCodecs = config.mediasoup.router.mediaCodecs.map(codec => ({
    ...codec,
    kind: codec.kind as mediasoup.types.MediaKind
  }));
  
  return await worker.createRouter({ mediaCodecs });
}

// Create a new WebRTC Transport
async function createWebRtcTransport(router: mediasoup.types.Router) {
  const {
    listenIps,
    initialAvailableOutgoingBitrate,
    maxIncomingBitrate
  } = config.mediasoup.webRtcTransport;
  
  const transport = await router.createWebRtcTransport({
    listenIps,
    initialAvailableOutgoingBitrate,
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
  });
  
  if (maxIncomingBitrate) {
    await transport.setMaxIncomingBitrate(maxIncomingBitrate);
  }
  
  return transport;
}

// Socket.io connection handler
io.on('connection', (socket: Socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  // Handle join room request
  socket.on('joinRoom', async ({ roomId, name }: JoinRoomParams, callback: (params: { rtpCapabilities: mediasoup.types.RtpCapabilities }) => void) => {
    // Create room if it doesn't exist
    if (!rooms.has(roomId)) {
      const router = await createRouter();
      rooms.set(roomId, {
        id: roomId,
        router,
        peers: new Map()
      });
    }
    
    const room = rooms.get(roomId)!;
    
    // Create peer
    const peer: Peer = {
      id: socket.id,
      name,
      transports: new Map(),
      producers: new Map(),
      consumers: new Map()
    };
    
    // Add peer to room
    room.peers.set(socket.id, peer);
    
    // Join socket to room
    socket.join(roomId);
    
    // Return router RTP capabilities
    callback({ rtpCapabilities: room.router.rtpCapabilities });
  });
  
  // Handle WebRTC transport creation request
  socket.on('createWebRtcTransport', async ({ sender }: CreateWebRtcTransportParams, callback) => {
    // Find the room this peer belongs to
    let room: Room | undefined;
    let peer: Peer | undefined;
    
    for (const [roomId, roomData] of rooms.entries()) {
      if (roomData.peers.has(socket.id)) {
        room = roomData;
        peer = roomData.peers.get(socket.id);
        break;
      }
    }
    
    if (!room || !peer) {
      return callback({ error: 'Not in a room' });
    }
    
    try {
      // Create a new WebRTC transport
      const transport = await createWebRtcTransport(room.router);
      
      // Store the transport
      peer.transports.set(transport.id, transport);
      
      // Handle transport close
      transport.on('close', () => {
        console.log(`Transport ${transport.id} closed`);
        peer?.transports.delete(transport.id);
      });
      
      callback({
        params: {
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        }
      });
    } catch (error) {
      console.error('Error creating WebRTC transport:', error);
      callback({ error: 'Failed to create transport' });
    }
  });
  
  // Handle transport connect request
  socket.on('connectTransport', async ({ transportId, dtlsParameters }: TransportParams, callback) => {
    // Find the peer and transport
    let transport: mediasoup.types.Transport | undefined;
    let peer: Peer | undefined;
    
    for (const room of rooms.values()) {
      peer = room.peers.get(socket.id);
      if (peer) {
        transport = peer.transports.get(transportId);
        if (transport) break;
      }
    }
    
    if (!transport) {
      return callback({ error: 'Transport not found' });
    }
    
    try {
      await transport.connect({ dtlsParameters });
      callback({ success: true });
    } catch (error) {
      console.error('Error connecting transport:', error);
      callback({ error: 'Failed to connect transport' });
    }
  });
  
  // Handle produce request
  socket.on('produce', async ({ transportId, kind, rtpParameters }: ProduceParams, callback) => {
    // Find the peer and transport
    let transport: mediasoup.types.Transport | undefined;
    let peer: Peer | undefined;
    let room: Room | undefined;
    
    for (const roomData of rooms.values()) {
      peer = roomData.peers.get(socket.id);
      if (peer) {
        transport = peer.transports.get(transportId);
        if (transport) {
          room = roomData;
          break;
        }
      }
    }
    
    if (!transport || !peer || !room) {
      return callback({ error: 'Transport not found' });
    }
    
    try {
      // Create producer
      const producer = await transport.produce({ kind, rtpParameters });
      
      // Store the producer
      peer.producers.set(producer.id, producer);
      
      // Handle producer close
      producer.on('close', () => {
        console.log(`Producer ${producer.id} closed`);
        peer?.producers.delete(producer.id);
      });
      
      // Notify other peers in the room
      for (const otherPeerId of room.peers.keys()) {
        if (otherPeerId !== socket.id) {
          io.to(otherPeerId).emit('newConsumer', {
            peerId: socket.id,
            producerId: producer.id,
            id: producer.id,
            kind,
            rtpParameters: producer.rtpParameters
          });
        }
      }
      
      callback({ id: producer.id });
    } catch (error) {
      console.error('Error producing:', error);
      callback({ error: 'Failed to produce' });
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    // Cleanup
    for (const room of rooms.values()) {
      if (room.peers.has(socket.id)) {
        const peer = room.peers.get(socket.id)!;
        
        // Notify other peers about disconnection
        socket.to(room.id).emit('peerDisconnected', { peerId: socket.id });
        
        // Close all producers
        for (const producer of peer.producers.values()) {
          producer.close();
        }
        
        // Close all consumers
        for (const consumer of peer.consumers.values()) {
          consumer.close();
        }
        
        // Close all transports
        for (const transport of peer.transports.values()) {
          transport.close();
        }
        
        // Remove peer from room
        room.peers.delete(socket.id);
        
        // Remove room if empty
        if (room.peers.size === 0) {
          rooms.delete(room.id);
        }
      }
    }
  });
});

// Start the server
async function start() {
  // Initialize mediasoup
  await initializeMediasoup();
  
  // Start HTTP server
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`MediaSoupCalling server is running on port ${port}`);
  });
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});

// Run the server
start(); 