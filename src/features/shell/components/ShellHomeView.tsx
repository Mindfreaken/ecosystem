import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ShellLayout from './ShellLayout';
import UnderConstruction from './UnderConstruction';
import FriendsPage from '../../friends/components/FriendsPage';
import { ChatView } from '../../chat/components';
import '../styles/ShellHomeView.css';

const ShellHomeView: React.FC = () => {
  return (
    <ShellLayout>
      <Routes>
        <Route path="/" element={
          <div className="shell-home-view">
            <UnderConstruction pageName="Home" />
          </div>
        } />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/chat" element={<ChatView />} />
        {/* Add more routes here as needed */}
      </Routes>
    </ShellLayout>
  );
};

export default ShellHomeView; 