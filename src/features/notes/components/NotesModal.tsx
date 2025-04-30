import React, { useMemo } from 'react';
import { useTheme } from '../../theme';
import '../styles/NotesModal.css';

// Define a Note type
interface Note {
  id?: string;
  content: string;
  messageId?: string;
  userId?: string;
  createdAt?: Date;
}

interface NotesModalProps {
  isOpen: boolean;
  modalType?: 'note' | 'task' | 'schedule';
  messageId?: string;
  messageContent?: string;
  userId?: string;
  onClose: () => void;
  onSave?: (note: Note) => void;
}

const NotesModal: React.FC<NotesModalProps> = ({
  isOpen,
  modalType = 'note',
  messageContent,
  onClose,
}) => {
  const { currentTheme } = useTheme();
  
  // Computed properties converted to useMemo
  const modalTitle = useMemo(() => {
    switch (modalType) {
      case 'task':
        return 'Create Task';
      case 'schedule':
        return 'Schedule Follow-up';
      case 'note':
      default:
        return 'Notes';
    }
  }, [modalType]);

  const modalDescription = useMemo(() => {
    switch (modalType) {
      case 'task':
        return 'The task creation feature is coming soon! You\'ll be able to create and track tasks based on conversation messages.';
      case 'schedule':
        return 'The follow-up scheduling feature is coming soon! You\'ll be able to set reminders and schedule follow-ups for important conversations.';
      case 'note':
      default:
        return 'The notes feature is coming soon! You\'ll be able to create, edit, and organize notes from your conversations.';
    }
  }, [modalType]);

  const featureIcons = useMemo(() => {
    switch (modalType) {
      case 'task':
        return [
          'fas fa-tasks',
          'fas fa-bell',
          'fas fa-calendar-check'
        ];
      case 'schedule':
        return [
          'fas fa-calendar-alt',
          'fas fa-bell',
          'fas fa-history'
        ];
      case 'note':
      default:
        return [
          'fas fa-sticky-note',
          'fas fa-tags',
          'fas fa-comment'
        ];
    }
  }, [modalType]);

  const featureTitles = useMemo(() => {
    switch (modalType) {
      case 'task':
        return [
          'Task Management',
          'Notifications',
          'Deadline Tracking'
        ];
      case 'schedule':
        return [
          'Calendar Integration',
          'Smart Reminders',
          'Follow-up History'
        ];
      case 'note':
      default:
        return [
          'Create Notes',
          'Tag System',
          'Message Integration'
        ];
    }
  }, [modalType]);

  const featureDescriptions = useMemo(() => {
    switch (modalType) {
      case 'task':
        return [
          'Organize tasks with priorities and categories',
          'Get timely alerts about upcoming deadlines',
          'Track progress and meet your goals on time'
        ];
      case 'schedule':
        return [
          'Sync with your favorite calendar platforms',
          'AI-powered reminders based on conversation context',
          'Keep track of all scheduled follow-ups in one place'
        ];
      case 'note':
      default:
        return [
          'Easily create and organize personal notes',
          'Organize with customizable tags',
          'Save important messages as notes'
        ];
    }
  }, [modalType]);

  const truncatedMessage = useMemo(() => {
    if (!messageContent) return '';
    return messageContent.length > 150
      ? messageContent.substring(0, 150) + '...'
      : messageContent;
  }, [messageContent]);

  // Handle close button
  const handleClose = () => {
    console.log('NotesModal close button clicked');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="notes-modal">
      <div
        className="notes-modal__content"
        style={{
          backgroundColor: currentTheme.colors.backgroundAlt,
          borderColor: currentTheme.colors.border
        }}
      >
        <div
          className="notes-modal__header"
          style={{ borderBottomColor: currentTheme.colors.border }}
        >
          <h2 style={{ color: currentTheme.colors.textPrimary }}>{modalTitle}</h2>
          <button
            className="notes-modal__close"
            onClick={handleClose}
            style={{ color: currentTheme.colors.textSecondary }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="notes-modal__body">
          <p style={{ color: currentTheme.colors.textSecondary }}>
            {modalDescription}
          </p>

          {/* Display message content if provided */}
          {messageContent && (
            <div
              className="notes-modal__message-preview"
              style={{
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.backgroundLight
              }}
            >
              <h4 style={{ color: currentTheme.colors.textPrimary }}>Referenced Message:</h4>
              <p style={{ color: currentTheme.colors.textSecondary }}>{truncatedMessage}</p>
            </div>
          )}

          <div className="notes-modal__features">
            {[0, 1, 2].map(index => (
              <div
                key={index}
                className="feature-card"
                style={{
                  borderColor: currentTheme.colors.border,
                  backgroundColor: currentTheme.colors.backgroundLight
                }}
              >
                <i
                  className={featureIcons[index]}
                  style={{ color: currentTheme.colors.primary }}
                ></i>
                <h3 style={{ color: currentTheme.colors.textPrimary }}>{featureTitles[index]}</h3>
                <p style={{ color: currentTheme.colors.textSecondary }}>{featureDescriptions[index]}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="notes-modal__footer"
          style={{ borderTopColor: currentTheme.colors.border }}
        >
          <div 
            className="availability-badge" 
            style={{ 
              backgroundColor: `${currentTheme.colors.warning}33`, 
              color: currentTheme.colors.warning 
            }}
          >
            <i className="fas fa-clock"></i>
            <span>Coming Soon</span>
          </div>

          <button
            className="notes-modal__button"
            onClick={handleClose}
            style={{
              backgroundColor: currentTheme.colors.primary,
              color: currentTheme.colors.textLight
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesModal; 