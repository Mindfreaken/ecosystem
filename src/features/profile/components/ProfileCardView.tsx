import React, { useMemo } from 'react';
import { useTheme } from '../../theme/components/ThemeProvider';
import { DEFAULT_AVATAR_URL, DEFAULT_COVER_URL } from '../constants/defaultImages';
import { useProfile } from '../hooks/useProfile';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

interface ProfileCardViewProps {
  userId: Id<"users">;
  isCurrentUser?: boolean;
}

// Helper function to generate glitter particles based on seed
const generateGlitterParticles = (seed: number, count: number) => {
  const particles = [];
  // Use the seed to create a deterministic random generator
  const seededRandom = (n: number) => {
    const x = Math.sin(n + seed) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < count; i++) {
    particles.push({
      left: `${seededRandom(i) * 100}%`,
      top: `${seededRandom(i + count) * 100}%`,
      size: 2 + seededRandom(i * 2) * 4,
      animationDelay: `${seededRandom(i * 3) * 5}s`,
      animationDuration: `${2 + seededRandom(i * 4) * 3}s`,
      opacity: 0.1 + seededRandom(i * 5) * 0.6
    });
  }
  return particles;
};

const ProfileCardView: React.FC<ProfileCardViewProps> = ({ 
  userId,
  isCurrentUser = false
}) => {
  const { currentTheme } = useTheme();
  const { profile, isLoading, followUser, unfollowUser } = useProfile(userId);
  
  // Get the glitter seed from profiles directly
  const glitterSeedFromConvex = useQuery(api.profiles.getGlitterSeed, { 
    userId: typeof userId === 'string' ? userId : userId.toString() 
  });

  // Generate glitter particles based on profile's glitterSeed
  const glitterParticles = useMemo(() => {
    if (!profile) return [];
    
    // Use the retrieved glitter seed or fall back to a derived value
    const seed = glitterSeedFromConvex || 
      parseInt(userId.toString().replace(/\D/g, '').slice(-6)) || 
      Math.floor(Math.random() * 1000000);
      
    return generateGlitterParticles(seed, 20);
  }, [profile, userId, glitterSeedFromConvex]);

  if (isLoading || !profile) {
    return (
      <div 
        className="profile-card-view loading"
        style={{
          width: '100%',
          maxWidth: '340px',
          height: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: currentTheme.colors.backgroundAlt,
          borderColor: currentTheme.colors.primary,
          color: currentTheme.colors.textPrimary,
          boxShadow: `0 8px 24px ${currentTheme.colors.shadow}`,
          borderWidth: '3px',
          borderStyle: 'solid',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="loading-spinner" />
        <style>
          {`
            .loading-spinner {
              width: 40px;
              height: 40px;
              border: 3px solid rgba(255, 255, 255, 0.1);
              border-top-color: ${currentTheme.colors.primary};
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }

            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Computed values
  const coverImageUrl = profile.coverUrl || DEFAULT_COVER_URL;
  const avatarUrl = profile.avatarUrl || DEFAULT_AVATAR_URL;
  const shortenedBio = profile.bio && profile.bio.length > 100
    ? profile.bio.substring(0, 97) + '...'
    : profile.bio;

  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleFollowClick = async () => {
    try {
      if (profile.isFollowing) {
        await unfollowUser();
      } else {
        await followUser();
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  return (
    <div 
      className="profile-card-view"
      style={{
        width: '100%',
        maxWidth: '340px',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        overflow: 'hidden',
        backgroundColor: currentTheme.colors.backgroundAlt,
        borderColor: currentTheme.colors.primary,
        color: currentTheme.colors.textPrimary,
        boxShadow: `0 8px 24px ${currentTheme.colors.shadow}`,
        borderWidth: '3px',
        borderStyle: 'solid'
      }}
    >
      {/* Glitter effect container */}
      <div 
        className="glitter-container"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 10,
          opacity: 0.7
        }}
      >
        {glitterParticles.map((particle, index) => (
          <div
            key={`glitter-${index}`}
            className="glitter-particle"
            style={{
              position: 'absolute',
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              backgroundColor: currentTheme.colors.primary,
              opacity: particle.opacity,
              animation: `twinkle ${particle.animationDuration} infinite alternate`,
              animationDelay: particle.animationDelay
            }}
          />
        ))}
      </div>

      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px 15px 15px',
          textAlign: 'center',
          overflow: 'hidden',
          zIndex: 2
        }}
      >
        {/* Card number at top */}
        {profile.joinNumber && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              borderRadius: '8px',
              padding: '4px 10px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: currentTheme.colors.info,
              color: currentTheme.colors.textLight,
              zIndex: 10
            }}
          >
            #{profile.joinNumber}
          </div>
        )}
        
        {/* Background and overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '180px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundImage: `url(${coverImageUrl})`,
            zIndex: 1
          }}
        />
        
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(
              to bottom,
              ${currentTheme.colors.backgroundDark}33 0%,
              ${currentTheme.colors.backgroundDark} 180px
            )`,
            zIndex: 2
          }}
        />
        
        {/* Avatar section */}
        <div
          style={{
            marginTop: '20px',
            position: 'relative',
            zIndex: 5
          }}
        >
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: `linear-gradient(
                135deg, 
                ${currentTheme.colors.primary} 0%, 
                ${currentTheme.colors.secondary} 100%
              )`,
              boxShadow: `0 4px 20px ${currentTheme.colors.shadow}`,
              padding: '4px'
            }}
          >
            <img 
              src={avatarUrl} 
              alt="User avatar" 
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                borderColor: currentTheme.colors.backgroundDark,
                borderWidth: '2px',
                borderStyle: 'solid'
              }}
            />
          </div>
        </div>
        
        {/* User identity */}
        <div
          style={{
            marginTop: '12px',
            position: 'relative',
            zIndex: 5,
            textAlign: 'center'
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              margin: 0,
              color: currentTheme.colors.textLight
            }}
          >
            {profile.displayName}
          </h2>
          <p
            style={{
              margin: '2px 0',
              fontSize: '16px',
              color: currentTheme.colors.textMuted
            }}
          >
            @{profile.username}
          </p>
        </div>
        
        {/* Custom status or bio */}
        {(profile.customStatus || shortenedBio) && (
          <div
            style={{
              margin: '10px 0 15px',
              position: 'relative',
              zIndex: 5,
              padding: '0 15px',
              fontStyle: 'italic',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '100%'
            }}
          >
            <p
              style={{
                fontSize: '18px',
                lineHeight: '0',
                opacity: 0.6,
                margin: '0 4px',
                color: currentTheme.colors.primary
              }}
            >
              &#8220;
            </p>
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                lineHeight: 1.4,
                flex: 1,
                color: currentTheme.colors.textMuted
              }}
            >
              {profile.customStatus || shortenedBio}
            </p>
            <p
              style={{
                fontSize: '18px',
                lineHeight: '0',
                opacity: 0.6,
                margin: '0 4px',
                color: currentTheme.colors.primary
              }}
            >
              &#8221;
            </p>
          </div>
        )}
        
        {/* Stats */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            margin: '16px 0 20px',
            position: 'relative',
            zIndex: 5,
            padding: '0 20px'
          }}
        >
          {/* Followers */}
          <div
            style={{
              textAlign: 'center',
              padding: '0 5px'
            }}
          >
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '18px',
                color: currentTheme.colors.textLight
              }}
            >
              {formatNumber(profile.stats.followers)}
            </div>
            <div
              style={{
                fontSize: '14px',
                marginTop: '4px',
                color: currentTheme.colors.textMuted
              }}
            >
              Followers
            </div>
          </div>
          
          {/* Achievements */}
          <div
            style={{
              textAlign: 'center',
              padding: '0 5px'
            }}
          >
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '18px',
                color: currentTheme.colors.textLight
              }}
            >
              {formatNumber(profile.achievements.length)}
            </div>
            <div
              style={{
                fontSize: '14px',
                marginTop: '4px',
                color: currentTheme.colors.textMuted
              }}
            >
              Achievements
            </div>
          </div>
          
          {/* Role */}
          <div
            style={{
              textAlign: 'center',
              padding: '0 5px'
            }}
          >
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '18px',
                color: currentTheme.colors.textLight
              }}
            >
              {profile.role}
            </div>
            <div
              style={{
                fontSize: '14px',
                marginTop: '4px',
                color: currentTheme.colors.textMuted
              }}
            >
              Role
            </div>
          </div>
        </div>
        
        {/* Social score */}
        <div
          style={{
            background: `linear-gradient(
              135deg, 
              ${currentTheme.colors.primary} 0%, 
              ${currentTheme.colors.secondary} 100%
            )`,
            color: currentTheme.colors.textLight,
            borderRadius: '20px',
            padding: '6px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            minWidth: '160px',
            marginBottom: '20px',
            position: 'relative',
            zIndex: 5,
            boxShadow: `0 3px 8px ${currentTheme.colors.shadow}`
          }}
        >
          <span style={{ fontSize: '15px' }}>Social Score</span>
          {profile.stats.isMaxScore ? (
            <span style={{
              fontSize: '18px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <span style={{ color: '#FFD700' }}>⭐</span>
              <span>MAX</span>
            </span>
          ) : (
            <span style={{
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              {formatNumber(profile.stats.socialScore)}
            </span>
          )}
        </div>

        {/* Follow button */}
        {!isCurrentUser && (
          <button
            onClick={handleFollowClick}
            style={{
              background: profile.isFollowing ? currentTheme.colors.danger : currentTheme.colors.primary,
              color: currentTheme.colors.textLight,
              border: 'none',
              borderRadius: '20px',
              padding: '8px 24px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '20px',
              zIndex: 5
            }}
          >
            {profile.isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
        
        {/* Join date */}
        <p
          style={{
            marginTop: '15px',
            fontSize: '13px',
            position: 'relative',
            zIndex: 5,
            color: currentTheme.colors.textMuted
          }}
        >
          Joined {formatDate(profile.createdAt)}
        </p>
      </div>

      {/* Add the animation keyframes */}
      <style>
        {`
          @keyframes twinkle {
            0% { opacity: 0; transform: scale(0.8); }
            50% { opacity: 0.8; transform: scale(1.2); }
            100% { opacity: 0.3; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default ProfileCardView; 