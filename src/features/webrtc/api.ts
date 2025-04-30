/**
 * MediaSoupCalling API
 * Provides functions to interact with the MediaSoup WebRTC system
 */

import io, { Socket } from 'socket.io-client';
import * as mediasoupClient from 'mediasoup-client';

/**
 * Configuration for the MediaSoup client
 */
interface MediaSoupConfig {
  serverUrl: string;
  iceServers?: RTCIceServer[];
}

/**
 * Connection object returned by the connect function
 */
interface MediaSoupConnection {
  socket: Socket;
  device: mediasoupClient.types.Device;
  rtpCapabilities: mediasoupClient.types.RtpCapabilities;
  producerTransport?: mediasoupClient.types.Transport;
  videoProducer?: mediasoupClient.types.Producer;
  audioProducer?: mediasoupClient.types.Producer;
  consumers: Map<string, mediasoupClient.types.Consumer>;
  isConnected: boolean;
  
  // Methods
  createProducerTransport: () => Promise<mediasoupClient.types.Transport>;
  getLocalStream: () => Promise<MediaStream>;
  closeConnection: () => void;
}

/**
 * Default configuration
 */
const defaultConfig: MediaSoupConfig = {
  serverUrl: process.env.REACT_APP_SERVER_URL || 'http://localhost:3000',
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
};

/**
 * Connect to a MediaSoup room
 * @param roomId The ID of the room to join
 * @param userName The name of the user
 * @param config Configuration options
 * @returns A MediaSoupConnection object
 */
export async function connect(
  roomId: string, 
  userName: string, 
  config: Partial<MediaSoupConfig> = {}
): Promise<MediaSoupConnection> {
  // Merge config with defaults
  const fullConfig = { ...defaultConfig, ...config };
  
  // Connect to the server
  const socket = io(fullConfig.serverUrl);
  
  // Create a new MediaSoup device
  const device = new mediasoupClient.Device();
  
  // Join the room and get RTP capabilities
  const rtpCapabilities = await new Promise<mediasoupClient.types.RtpCapabilities>((resolve, reject) => {
    socket.emit('joinRoom', { roomId, name: userName }, (response: any) => {
      if (response.error) {
        reject(new Error(response.error));
      } else {
        resolve(response.rtpCapabilities);
      }
    });
  });
  
  // Load the device with the router's RTP capabilities
  await device.load({ routerRtpCapabilities: rtpCapabilities });
  
  // Create the connection object
  const connection: MediaSoupConnection = {
    socket,
    device,
    rtpCapabilities,
    consumers: new Map(),
    isConnected: true,
    
    // Create a producer transport
    createProducerTransport: async () => {
      const transportParams = await new Promise<any>((resolve, reject) => {
        socket.emit('createWebRtcTransport', { sender: true }, (response: any) => {
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response.params);
          }
        });
      });
      
      // Create the send transport
      const transport = device.createSendTransport({
        ...transportParams,
        iceServers: fullConfig.iceServers
      });
      
      // Handle transport events
      transport.on('connect', ({ dtlsParameters }, callback) => {
        socket.emit('connectTransport', {
          transportId: transport.id,
          dtlsParameters
        }, callback);
      });
      
      transport.on('produce', async ({ kind, rtpParameters }, callback) => {
        socket.emit('produce', {
          transportId: transport.id,
          kind,
          rtpParameters
        }, ({ id }: { id: string }) => {
          callback({ id });
        });
      });
      
      connection.producerTransport = transport;
      return transport;
    },
    
    // Get the local media stream
    getLocalStream: async () => {
      return await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });
    },
    
    // Close the connection
    closeConnection: () => {
      // Close producers
      if (connection.videoProducer) {
        connection.videoProducer.close();
      }
      
      if (connection.audioProducer) {
        connection.audioProducer.close();
      }
      
      // Close transport
      if (connection.producerTransport) {
        connection.producerTransport.close();
      }
      
      // Close consumers
      for (const consumer of connection.consumers.values()) {
        consumer.close();
      }
      
      // Disconnect socket
      socket.disconnect();
      
      // Update connection state
      connection.isConnected = false;
    }
  };
  
  // Set up socket event handlers
  
  // Handle new consumers
  socket.on('newConsumer', async (consumerParams) => {
    if (!device.rtpCapabilities) return;
    
    // Implementation would be added here to handle new consumers
  });
  
  // Handle peer disconnected
  socket.on('peerDisconnected', ({ peerId }) => {
    // Implementation would be added here to handle peer disconnection
  });
  
  return connection;
} 