import React, { useEffect, useState, useRef } from 'react';
import * as mediasoupClient from 'mediasoup-client';
import io from 'socket.io-client';

// Types
interface Props {
  roomId: string;
  userName: string;
}

interface VideoRef {
  id: string;
  stream: MediaStream;
}

interface RtpCapabilities {
  rtpCapabilities: mediasoupClient.types.RtpCapabilities;
}

interface TransportParams {
  params: {
    id: string;
    iceParameters: mediasoupClient.types.IceParameters;
    iceCandidates: mediasoupClient.types.IceCandidate[];
    dtlsParameters: mediasoupClient.types.DtlsParameters;
  };
}

interface ProducerResponse {
  id: string;
}

interface ConsumerParams {
  peerId: string;
  producerId: string;
  id: string;
  kind: mediasoupClient.types.MediaKind;
  rtpParameters: mediasoupClient.types.RtpParameters;
}

interface PeerDisconnectedParams {
  peerId: string;
}

const VideoRoom: React.FC<Props> = ({ roomId, userName }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [videoRefs, setVideoRefs] = useState<VideoRef[]>([]);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const deviceRef = useRef<mediasoupClient.types.Device | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const producerTransportRef = useRef<mediasoupClient.types.Transport | null>(null);
  const videoProducerRef = useRef<mediasoupClient.types.Producer | null>(null);
  const audioProducerRef = useRef<mediasoupClient.types.Producer | null>(null);

  useEffect(() => {
    // Initialize connection
    const init = async () => {
      try {
        // Connect to the server
        const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3000';
        const socket = io(serverUrl);
        socketRef.current = socket;

        // Join room
        socket.emit('joinRoom', { roomId, name: userName }, async ({ rtpCapabilities }: RtpCapabilities) => {
          console.log('Joined room', roomId);
          
          // Create mediasoup device
          const device = new mediasoupClient.Device();
          await device.load({ routerRtpCapabilities: rtpCapabilities });
          deviceRef.current = device;
          
          // Create send transport
          socket.emit('createWebRtcTransport', { sender: true }, async ({ params }: TransportParams) => {
            // Add ICE servers configuration
            const iceServers = [
              { urls: 'stun:stun.l.google.com:19302' },
              // Add your TURN server configuration here if you have one
            ];
            
            const transport = device.createSendTransport({
              ...params,
              iceServers
            });
            
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
              }, ({ id }: ProducerResponse) => {
                callback({ id });
              });
            });
            
            producerTransportRef.current = transport;
            
            // Get local media
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: true,
              video: true
            });
            
            // Display local video
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
            
            // Create producers
            const videoTrack = stream.getVideoTracks()[0];
            const audioTrack = stream.getAudioTracks()[0];
            
            if (videoTrack) {
              videoProducerRef.current = await transport.produce({
                track: videoTrack
              });
            }
            
            if (audioTrack) {
              audioProducerRef.current = await transport.produce({
                track: audioTrack
              });
            }
            
            setIsConnected(true);
          });
        });
        
        // Handle new consumers
        socket.on('newConsumer', async ({ peerId, producerId, id, kind, rtpParameters }: ConsumerParams) => {
          if (!deviceRef.current) return;
          
          // Use the consume method from the device instance
          const consumerTransport = deviceRef.current.createRecvTransport({
            id: 'recv-transport-' + peerId,
            iceParameters: {} as mediasoupClient.types.IceParameters,
            iceCandidates: [] as mediasoupClient.types.IceCandidate[],
            dtlsParameters: {} as mediasoupClient.types.DtlsParameters
          });
          
          const consumer = await consumerTransport.consume({
            id,
            producerId,
            kind,
            rtpParameters
          });
          
          if (consumer) {
            const stream = new MediaStream([consumer.track]);
            setVideoRefs(prev => [...prev, { id: peerId, stream }]);
          }
        });
        
        // Handle peer disconnect
        socket.on('peerDisconnected', ({ peerId }: PeerDisconnectedParams) => {
          setVideoRefs(prev => prev.filter(ref => ref.id !== peerId));
        });

      } catch (error) {
        console.error('Failed to initialize media connection:', error);
      }
    };

    init();

    // Cleanup
    return () => {
      if (videoProducerRef.current) {
        videoProducerRef.current.close();
      }
      
      if (audioProducerRef.current) {
        audioProducerRef.current.close();
      }
      
      if (producerTransportRef.current) {
        producerTransportRef.current.close();
      }
      
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId, userName]);

  return (
    <div className="video-room">
      <h1>Room: {roomId}</h1>
      <div className="video-container">
        <div className="local-video">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="video-element"
          />
          <div className="video-label">You ({userName})</div>
        </div>
        
        {videoRefs.map(videoRef => (
          <div key={videoRef.id} className="remote-video">
            <video
              autoPlay
              playsInline
              className="video-element"
              ref={el => {
                if (el) {
                  el.srcObject = videoRef.stream;
                }
              }}
            />
            <div className="video-label">Peer {videoRef.id}</div>
          </div>
        ))}
      </div>
      
      {!isConnected && (
        <div className="connecting-overlay">
          <p>Connecting to room...</p>
        </div>
      )}
    </div>
  );
};

export default VideoRoom; 