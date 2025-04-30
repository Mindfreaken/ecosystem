import React, { useState } from 'react';
import VideoRoom from './VideoRoom';
import '../styles';

const WebRTCView: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId && userName) {
      setIsJoined(true);
    }
  };

  return (
    <div className="webrtc-container">
      {!isJoined ? (
        <div className="join-form-container">
          <h1>Join Video Room</h1>
          <form onSubmit={handleJoinRoom} className="join-form">
            <div className="form-group">
              <label htmlFor="roomId">Room ID</label>
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="userName">Your Name</label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <button type="submit" className="join-button">
              Join Room
            </button>
          </form>
        </div>
      ) : (
        <VideoRoom roomId={roomId} userName={userName} />
      )}
    </div>
  );
};

export default WebRTCView; 