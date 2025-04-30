import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../theme';
import { uploadEncryptedFile } from '../../../services/firebaseStorage';

interface ChatInputBarProps {
  onSendMessage: (content: string, attachments?: Array<{
    type: string;
    fileName: string;
    fileUrl: string;
    encryptionKey: string;
    iv: string;
    mimeType: string;
    size: number;
  }>) => void;
  disabled?: boolean;
  placeholder?: string;
}

// Sanitize text to prevent XSS attacks
const sanitizeText = (text: string): string => {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

const MAX_CHARS = 10000;

const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type a message..."
}) => {
  const { currentTheme } = useTheme();
  const [message, setMessage] = useState('');
  const [rageMode, setRageMode] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [showExpandedEditor, setShowExpandedEditor] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState<Array<{
    type: string;
    fileName: string;
    fileUrl: string;
    encryptionKey: string;
    iv: string;
    mimeType: string;
    size: number;
  }>>([]);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const expandedEditorRef = useRef<HTMLTextAreaElement>(null);
  const formatButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close format menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        formatButtonRef.current && 
        !formatButtonRef.current.contains(event.target as Node) &&
        showFormatMenu
      ) {
        setShowFormatMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFormatMenu]);

  // Handle expanded editor modal close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        showExpandedEditor
      ) {
        // Don't close immediately, give the user a chance to interact
        // with the modal content first
      }
    };

    if (showExpandedEditor) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus the expanded editor when opened
      if (expandedEditorRef.current) {
        expandedEditorRef.current.focus();
        // Place cursor at the end of the text
        expandedEditorRef.current.selectionStart = expandedEditorRef.current.value.length;
        expandedEditorRef.current.selectionEnd = expandedEditorRef.current.value.length;
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExpandedEditor]);

  const handleSend = () => {
    if ((message.trim() || attachments.length > 0) && !disabled) {
      // If in rage mode, convert to uppercase
      const processedMessage = rageMode ? message.toUpperCase() : message;
      
      // Clean and format the message before sending
      const sanitizedMessage = sanitizeText(processedMessage.substring(0, MAX_CHARS));
      
      onSendMessage(sanitizedMessage, attachments);
      setMessage('');
      setAttachments([]);
      setShowExpandedEditor(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRageMode = () => {
    setRageMode(!rageMode);
    if (!rageMode) {
      // Trigger shake animation
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      
      // Convert existing text to uppercase if entering rage mode
      setMessage(message.toUpperCase());
    }
  };

  // Get the border style based on rage mode
  const getBorderStyle = () => {
    if (rageMode) {
      return `2px solid red`;
    }
    return `1px solid ${currentTheme.colors.border}`;
  };

  // Apply the animation class if shaking
  const getAnimationClass = () => {
    return isShaking ? 'shake-animation' : '';
  };

  // Determine if input has a scrollbar
  const hasScrollbar = () => {
    if (inputRef.current) {
      return inputRef.current.scrollHeight > inputRef.current.clientHeight;
    }
    return false;
  };

  // Toggle the expanded editor modal
  const toggleExpandedEditor = () => {
    setShowExpandedEditor(!showExpandedEditor);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newAttachments = await Promise.all(
        Array.from(files).map(async (file) => {
          const isImage = file.type.startsWith('image/');
          const result = await uploadEncryptedFile(file, isImage ? 'images' : 'files');
          
          return {
            type: isImage ? 'image' : 'file',
            fileName: file.name,
            fileUrl: result.downloadUrl,
            encryptionKey: result.encryptionKey,
            iv: result.iv,
            mimeType: file.type,
            size: file.size,
          };
        })
      );

      setAttachments([...attachments, ...newAttachments]);
    } catch (error) {
      console.error('Error uploading files:', error);
      // TODO: Show error message to user
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* Expanded Editor Modal */}
      {showExpandedEditor && (
        <div className="modal-overlay" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div 
            ref={modalRef}
            className="expanded-editor-modal"
            style={{
              backgroundColor: currentTheme.colors.card,
              color: currentTheme.colors.text,
              border: `1px solid ${currentTheme.colors.border}`,
            }}
          >
            <div className="modal-header">
              <h3>Edit Message</h3>
              <button 
                className="close-button"
                onClick={() => setShowExpandedEditor(false)}
                style={{ color: currentTheme.colors.textSecondary }}
              >
                ✕
              </button>
            </div>
            
            <div className="editor-container">

              
              <textarea
                ref={expandedEditorRef}
                className="expanded-textarea"
                value={message}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) {
                    setMessage(rageMode ? e.target.value.toUpperCase() : e.target.value);
                  }
                }}
                onKeyDown={handleKeyDown}
                maxLength={MAX_CHARS}
                style={{
                  backgroundColor: currentTheme.colors.backgroundAlt,
                  color: currentTheme.colors.text,
                  borderColor: rageMode ? 'red' : currentTheme.colors.border,
                }}
              />
            </div>
            
            <div className="modal-footer">
              <span className="char-count">
                {message.length}/{MAX_CHARS}
              </span>
              <button
                className="send-button"
                onClick={handleSend}
                disabled={disabled || !message.trim()}
                style={{
                  backgroundColor: currentTheme.colors.primary,
                  color: 'white',
                  opacity: (disabled || !message.trim()) ? 0.5 : 1,
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="chat-input-container">
        <div 
          className={`chat-input-bar ${getAnimationClass()}`}
          style={{
            backgroundColor: currentTheme.colors.backgroundAlt,
            borderTop: getBorderStyle(),
          }}
        >
          <div className="left-buttons">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <button 
              className="icon-button" 
              title="Attach file"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              style={{ 
                color: currentTheme.colors.textSecondary,
                opacity: isUploading ? 0.5 : 1 
              }}
            >
              <span>{isUploading ? '⏳' : '📎'}</span>
            </button>
          </div>
          
          <textarea
            ref={inputRef}
            className="message-input"
            placeholder={placeholder}
            value={message}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setMessage(rageMode ? e.target.value.toUpperCase() : e.target.value);
              }
            }}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={MAX_CHARS}
            style={{
              backgroundColor: currentTheme.colors.card,
              color: currentTheme.colors.text,
              borderColor: rageMode ? 'red' : currentTheme.colors.border,
            }}
          />
          
          {attachments.length > 0 && (
            <div className="attachments-preview">
              {attachments.map((attachment, index) => (
                <div key={index} className="attachment-item">
                  <span>{attachment.type === 'image' ? '🖼️' : '📄'} {attachment.fileName}</span>
                  <button
                    className="remove-attachment"
                    onClick={() => removeAttachment(index)}
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="right-buttons">
            {/* Show expand editor button only when there's a scrollbar */}
            {hasScrollbar() && (
              <button 
                className="icon-button expand-editor-button" 
                title="Open expanded editor"
                onClick={toggleExpandedEditor}
                style={{ color: currentTheme.colors.textSecondary }}
              >
                <span>📝</span>
              </button>
            )}
            
            <button 
              className={`icon-button rage-button ${rageMode ? 'active' : ''}`}
              title={rageMode ? "Disable rage mode" : "Enable rage mode"}
              onClick={toggleRageMode}
              style={{ 
                color: rageMode ? 'red' : currentTheme.colors.textSecondary 
              }}
            >
              <span>🔥</span>
            </button>
      
            <button 
              className="icon-button emoji-button" 
              title="Add emoji"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              <span>😊</span>
            </button>
      
            <button
              className="send-button"
              onClick={handleSend}
              disabled={disabled || !message.trim()}
              style={{
                backgroundColor: currentTheme.colors.primary,
                color: 'white',
                opacity: (disabled || !message.trim()) ? 0.5 : 1,
              }}
            >
              Send
            </button>
          </div>
          
          {message.length > 0 && (
            <span className="char-count" style={{ color: message.length > MAX_CHARS * 0.9 ? 'red' : currentTheme.colors.textSecondary }}>
              {message.length}/{MAX_CHARS}
            </span>
          )}
        </div>
      </div>
      
      <style>
        {`
        .chat-input-container {
          position: relative;
          width: 100%;
        }
        
        .chat-input-bar {
          display: flex;
          align-items: flex-end;
          padding: 10px;
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .left-buttons, .right-buttons {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          z-index: 2;
        }
        
        .right-buttons {
          align-items: flex-end;
          padding-bottom: 8px;
        }
        
        .message-input {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          resize: none;
          min-height: 40px;
          max-height: 120px;
          z-index: 1;
        }
        
        .expand-editor-button {
          position: relative;
        }
        
        .expand-editor-button:after {
          content: '';
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background-color: red;
          border-radius: 50%;
        }
        
        .format-menu-container {
          position: relative;
          display: inline-block;
        }
        
        .format-menu {
          position: absolute;
          bottom: 100%;
          right: 0;
          width: 150px;
          margin-bottom: 5px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }
        
        .format-option {
          width: 100%;
          text-align: left;
          padding: 8px 12px;
          border: none;
          background: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .format-option:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .icon-button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          margin: 0 5px;
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .format-menu-button {
          font-size: 16px;
          font-weight: bold;
        }
        
        .send-button {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-left: 10px;
        }
        
        .rage-button.active {
          transform: scale(1.2);
        }
        
        .char-count {
          position: absolute;
          bottom: 5px;
          right: 80px;
          font-size: 12px;
        }
        
        .shake-animation {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .expanded-editor-modal {
          width: 90%;
          max-width: 900px;
          height: 90vh;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }
        
        .modal-header h3 {
          margin: 0;
          font-size: 18px;
        }
        
        .close-button {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }
        
        .editor-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 15px 20px;
          min-height: 0;
        }
        
        .formatting-toolbar {
          display: flex;
          gap: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }
        
        .format-button {
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          cursor: pointer;
        }
        
        .format-button:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .expanded-textarea {
          width: 100%;
          flex: 1;
          padding: 12px;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          resize: none;
          min-height: 0;
          height: 100%;
        }
        
        .live-preview {
          margin-top: 10px;
        }
        
        .live-preview h4 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.6);
        }
        
        .preview-content {
          padding: 12px;
          min-height: 100px;
          border-radius: 8px;
          overflow-y: auto;
        }
        
        .modal-footer {
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }
        
        @keyframes shake {
          10%, 90% {
            transform: translate3d(-1px, 0, 0);
          }
          
          20%, 80% {
            transform: translate3d(2px, 0, 0);
          }
          
          30%, 50%, 70% {
            transform: translate3d(-4px, 0, 0);
          }
          
          40%, 60% {
            transform: translate3d(4px, 0, 0);
          }
        }
        
        .attachments-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 8px;
          border-top: 1px solid ${currentTheme.colors.border};
        }
        
        .attachment-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px;
          background-color: ${currentTheme.colors.card};
          border-radius: 4px;
          font-size: 14px;
        }
        
        .remove-attachment {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0 4px;
        }
        
        .remove-attachment:hover {
          opacity: 0.7;
        }
        `}
      </style>
    </>
  );
};

export default ChatInputBar; 