# MediaSoupCalling

This is a simple WebRTC implementation using [MediaSoup](https://mediasoup.org) for real-time audio/video communication.

## Setup Instructions for Google Cloud Platform (GCP)

### 1. Compute Engine Setup

1. Create a new VM instance in GCP:
   - Name: mediasoupcalling-instance
   - Machine type: e2-standard-2 (2 vCPU, 8 GB memory) or higher
   - Boot disk: Ubuntu 20.04 LTS
   - Allow HTTP/HTTPS traffic
   - Enable public IP

2. Set up firewall rules:
   - Create a new firewall rule to allow TCP/UDP traffic on the ports used by MediaSoup:
     - Name: mediasoupcalling-ports
     - Target tags: mediasoupcalling
     - Source IP ranges: 0.0.0.0/0
     - Protocols and ports: tcp:3000,10000-10100; udp:10000-10100
   - Add the 'mediasoupcalling' network tag to your VM instance

### 2. Server Deployment

1. SSH into the VM instance:
   ```
   gcloud compute ssh mediasoupcalling-instance
   ```

2. Install Node.js and build tools:
   ```
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs build-essential
   ```

3. Clone your application repository:
   ```
   git clone [YOUR_REPO_URL]
   cd mediasoupcalling
   ```

4. Install dependencies:
   ```
   npm install
   ```

5. Update the MediaSoup configuration:
   - Edit `src/server/config.ts`
   - Set the `announcedIp` to your VM's public IP address:
     ```javascript
     listenIps: [
       {
         ip: '0.0.0.0',
         announcedIp: '[YOUR_VM_PUBLIC_IP]'  // Replace with your VM's public IP
       }
     ]
     ```

6. Start the server:
   ```
   # For development
   npm run dev

   # For production (with PM2)
   npm install -g pm2
   pm2 start src/server/mediasoup-server.ts --interpreter ./node_modules/.bin/ts-node
   ```

### 3. Client Configuration

Update the client to connect to your GCP server:

1. Set the environment variable in your client application:
   ```
   REACT_APP_SERVER_URL=https://[YOUR_VM_PUBLIC_IP]:3000
   ```

   Or update the serverUrl in your VideoRoom component:
   ```javascript
   const serverUrl = 'https://[YOUR_VM_PUBLIC_IP]:3000';
   ```

### 4. TURN Server (Optional but Recommended)

For better connectivity through firewalls, set up a TURN server:

1. Use either Google's STUN server or set up your own TURN server (like Coturn)
2. Update the ICE server configuration in your client by modifying the VideoRoom component to include ICE servers:
   ```javascript
   // In VideoRoom.tsx
   const iceServers = [
     { urls: 'stun:stun.l.google.com:19302' },
     // Add your TURN server here if you have one
     // { 
     //   urls: 'turn:your-turn-server.com:3478',
     //   username: 'username',
     //   credential: 'credential'
     // }
   ];
   
   // Then when creating the send transport:
   const transport = device.createSendTransport({
     ...params,
     iceServers
   });
   ``` 