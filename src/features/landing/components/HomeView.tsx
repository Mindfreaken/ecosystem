import { useState } from 'react';
import { useTheme } from '../../../features/theme';
import FeatureGrid from './FeatureGrid';
import { AuthModal } from '../../../features/auth';
import '../styles/Home.css';

interface HomeViewProps {
  onSkipSignIn?: () => void;
}

export const HomeView = ({ onSkipSignIn }: HomeViewProps) => {
  // Initialize state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'signin' | 'signup'>('signin');
  const { currentTheme } = useTheme();
  
  // Extract colors from the current theme
  const colors = currentTheme.colors;

  // Open modal with specific type
  const openModal = (type: 'signin' | 'signup') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Button hover effect handlers
  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    target.style.backgroundColor = colors.primary;
    target.style.boxShadow = `0 0 20px ${colors.primary}80, 0 0 10px ${colors.primary}40 inset`;
    target.style.textShadow = `0 0 8px ${colors.text}`;
    target.style.color = '#000000'; // Set to black for maximum contrast
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    target.style.backgroundColor = 'transparent';
    target.style.boxShadow = 'none';
    target.style.textShadow = 'none';
    target.style.color = colors.text;
  };

  // Primary button hover handlers
  const handlePrimaryMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    target.style.boxShadow = `0 0 25px ${colors.primary}80, 0 0 15px ${colors.primary}40 inset`;
    target.style.textShadow = `0 0 8px ${colors.backgroundDark}`;
    target.style.transform = 'translateY(-2px)';
  };

  const handlePrimaryMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    target.style.boxShadow = 'none';
    target.style.textShadow = 'none';
    target.style.transform = 'translateY(0)';
  };

  return (
    <div 
      className="h-screen flex flex-col relative w-full"
      style={{
        background: `linear-gradient(145deg, ${colors.background} 0%, ${colors.backgroundDark} 100%)`,
        color: colors.text,
        height: '100vh', // Explicitly set height
        overflow: 'auto' // Allow scrolling if content exceeds viewport
      }}
    >
      {/* Main Content Container */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full">
        {/* Welcome Section */}
        <section className="w-full flex flex-col justify-center items-center text-center px-4 py-12 md:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              <span 
                className="bg-clip-text text-transparent bg-gradient-to-r"
                style={{
                  backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`
                }}
              >
                Welcome to Your EcoSystem
              </span>
            </h1>
            
            <p 
              className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
              style={{ color: colors.textSecondary }}
            >
              Your Digital Oasis for thriving online communities
            </p>
            
            <div 
              className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
              style={{ 
                // Force row layout on all screen sizes including mobile
                flexDirection: 'row',
              }}
            >
              <button 
                className="px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg font-medium transition-all duration-300 border-2 neon-button-outline"
                style={{
                  borderColor: colors.primary,
                  color: colors.text,
                  backgroundColor: 'transparent',
                }}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                onClick={() => openModal('signin')}
              >
                Login
              </button>
              
              <button 
                className="px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg font-medium transition-all duration-300 neon-button-primary"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                }}
                onMouseOver={handlePrimaryMouseOver}
                onMouseLeave={handlePrimaryMouseLeave}
                onClick={() => openModal('signup')}
              >
                Get Started
              </button>
              
              {onSkipSignIn && (
                <button 
                  className="px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg font-medium transition-all duration-300 border-2 neon-button-outline"
                  style={{
                    borderColor: colors.secondary,
                    color: colors.text,
                    backgroundColor: 'transparent',
                  }}
                  onMouseOver={(e) => {
                    const target = e.currentTarget;
                    target.style.backgroundColor = colors.secondary;
                    target.style.boxShadow = `0 0 20px ${colors.secondary}80, 0 0 10px ${colors.secondary}40 inset`;
                    target.style.textShadow = `0 0 8px ${colors.text}`;
                    target.style.color = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget;
                    target.style.backgroundColor = 'transparent';
                    target.style.boxShadow = 'none';
                    target.style.textShadow = 'none';
                    target.style.color = colors.text;
                  }}
                  onClick={onSkipSignIn}
                >
                  Skip Sign In
                </button>
              )}
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section 
          className="w-full py-8 md:py-12"
          style={{ backgroundColor: 'transparent' }}
        >
          <FeatureGrid />
        </section>
      </div>
      
      {/* Decorative Elements */}
      <div 
        className="absolute top-10 left-5 md:top-20 md:left-10 w-32 md:w-64 h-32 md:h-64 rounded-full opacity-20 blur-xl"
        style={{ background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)` }}
      />
      <div 
        className="absolute bottom-10 right-5 md:bottom-20 md:right-10 w-40 md:w-80 h-40 md:h-80 rounded-full opacity-20 blur-xl"
        style={{ background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)` }}
      />
      
      {/* Footer */}
      <footer 
        className="w-full py-4 text-center"
        style={{ color: colors.textSecondary }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm">© 2023 EcoSystem. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Auth Modal */}
      {isModalOpen && (
        <AuthModal 
          type={modalType}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default HomeView; 