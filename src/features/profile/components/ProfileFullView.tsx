import React, { useState } from 'react';
import { useTheme } from '../../theme/components/ThemeProvider';
import { useProfile } from '../hooks/useProfile';
import { Id } from '../../../../convex/_generated/dataModel';
import ProfileEditModal, { ProfileData } from './ProfileEditModal';

interface ProfileFullViewProps {
  userId: Id<"users">;
  isCurrentUser: boolean;
  onEdit?: () => void;
}

const ProfileFullView: React.FC<ProfileFullViewProps> = ({
  userId,
  isCurrentUser,
  onEdit
}) => {
  const { currentTheme } = useTheme();
  const { profile, isLoading, error, followUser, unfollowUser } = useProfile(userId);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'activity'>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
    if (onEdit) onEdit();
  };
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };
  
  const handleProfileUpdated = (updatedProfile: ProfileData) => {
    // You might want to refresh profile data here 
    console.log('Profile updated:', updatedProfile);
  };

  if (isLoading) {
    return (
      <div 
        className="profile-full-view loading"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: currentTheme.colors.textPrimary,
          backgroundColor: currentTheme.colors.background
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

  if (error || !profile) {
    return (
      <div 
        className="profile-full-view error"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: currentTheme.colors.textPrimary,
          backgroundColor: currentTheme.colors.background
        }}
      >
        <p style={{ color: currentTheme.colors.primary }}>{error?.message || "Profile not found"}</p>
      </div>
    );
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to get activity icon
  const getActivityIcon = (type: string): string => {
    switch (type) {
      case 'post':
        return '💬';
      case 'achievement':
        return '🏆';
      case 'friend':
        return '👥';
      case 'event':
        return '📅';
      default:
        return '⭐';
    }
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
      className="profile-full-view"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        color: currentTheme.colors.textPrimary,
        backgroundColor: currentTheme.colors.background
      }}
    >
      {/* Cover Image */}
      <div 
        className="cover-image-container"
        style={{
          height: '180px',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: currentTheme.colors.card
        }}
      >
        {profile.coverUrl ? (
          <img 
            src={profile.coverUrl}
            alt="Profile Cover"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
          }} />
        )}
      </div>

      {/* Profile Header */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ 
          display: 'flex', 
          marginTop: '-40px',
          marginBottom: '15px',
          position: 'relative'
        }}>
          {/* Avatar */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: `4px solid ${currentTheme.colors.background}`,
            backgroundColor: currentTheme.colors.card,
            boxShadow: `0 2px 8px ${currentTheme.colors.shadow}`
          }}>
            {profile.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt={profile.displayName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }} 
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: currentTheme.colors.primary,
                color: currentTheme.colors.textLight,
                fontSize: '48px',
                fontWeight: 'bold'
              }}>
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* User Info and Actions */}
          <div style={{ 
            flex: 1,
            marginLeft: '20px',
            paddingTop: '60px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <h1 style={{ 
                  margin: '0 0 4px 0',
                  fontSize: '28px',
                  fontWeight: 'bold'
                }}>
                  {profile.displayName}
                </h1>
              </div>
              
              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {isCurrentUser ? (
                  <button
                    onClick={handleOpenEditModal}
                    style={{
                      background: currentTheme.colors.primary,
                      color: currentTheme.colors.textLight,
                      border: 'none',
                      borderRadius: '20px',
                      padding: '8px 24px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Edit Profile
                  </button>
                ) : (
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
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {profile.isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Custom Status */}
        {profile.customStatus ? (
          <div style={{
            padding: '12px 16px',
            marginBottom: '20px',
            backgroundColor: `${currentTheme.colors.primary}20`,
            borderRadius: '8px',
            fontSize: '15px',
            border: `1px solid ${currentTheme.colors.primary}30`
          }}>
            {profile.customStatus}
          </div>
        ) : (
          <div style={{
            padding: '12px 16px',
            marginBottom: '20px',
            backgroundColor: `${currentTheme.colors.primary}10`,
            borderRadius: '8px',
            fontSize: '15px',
            border: `1px dashed ${currentTheme.colors.border}`,
            color: currentTheme.colors.textSecondary
          }}>
            No custom status set
          </div>
        )}

        {/* Bio Section */}
        {profile.bio ? (
          <div style={{ 
            padding: '16px',
            backgroundColor: currentTheme.colors.card,
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3 style={{ 
              fontSize: '18px',
              marginTop: '0',
              marginBottom: '12px'
            }}>
              Bio
            </h3>
            <p style={{
              margin: 0,
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {profile.bio}
            </p>
          </div>
        ) : (
          <div style={{ 
            padding: '16px',
            backgroundColor: currentTheme.colors.card,
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3 style={{ 
              fontSize: '18px',
              marginTop: '0',
              marginBottom: '12px'
            }}>
              Bio
            </h3>
            <p style={{
              margin: 0,
              lineHeight: '1.6',
              color: currentTheme.colors.textSecondary,
              fontStyle: 'italic'
            }}>
              No bio information available
            </p>
          </div>
        )}

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '24px'
        }}>
          {(['overview', 'achievements', 'activity'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 20px',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab ? currentTheme.colors.primary : 'transparent'}`,
                color: activeTab === tab ? currentTheme.colors.primary : currentTheme.colors.textSecondary,
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: activeTab === tab ? 'bold' : 'normal'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'achievements' && ` (${profile.achievements.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        padding: '0 20px 20px'
      }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            {/* Member Info */}
            <div style={{ 
              padding: '16px',
              backgroundColor: currentTheme.colors.card,
              borderRadius: '8px'
            }}>
              <h3 style={{ 
                fontSize: '18px',
                marginTop: '0',
                marginBottom: '12px'
              }}>
                Member Information
              </h3>
              <div style={{
                display: 'grid',
                gap: '8px',
                fontSize: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: currentTheme.colors.textSecondary }}>Member since</span>
                  <span>{formatDate(profile.createdAt)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: currentTheme.colors.textSecondary }}>Role</span>
                  <span style={{
                    backgroundColor: currentTheme.colors.primary,
                    color: currentTheme.colors.textLight,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {profile.role}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: currentTheme.colors.textSecondary }}>Followers</span>
                  <span>{profile.stats.followers}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: currentTheme.colors.textSecondary }}>Following</span>
                  <span>{profile.stats.following}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: currentTheme.colors.textSecondary }}>Posts</span>
                  <span>{profile.stats.posts}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: currentTheme.colors.textSecondary }}>Social Score</span>
                  {profile.stats.isMaxScore ? (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.textLight,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      <span style={{ color: '#FFD700' }}>⭐</span>
                      <span>MAX</span>
                    </span>
                  ) : (
                    <span>{profile.stats.socialScore}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div style={{
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
          }}>
            {profile.achievements.map(achievement => (
              <div 
                key={achievement.id}
                style={{
                  backgroundColor: currentTheme.colors.card,
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  height: '120px',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={achievement.imageUrl}
                    alt={achievement.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div style={{ padding: '16px' }}>
                  <h4 style={{ margin: '0 0 8px 0' }}>{achievement.name}</h4>
                  <p style={{
                    margin: '0 0 12px 0',
                    fontSize: '14px',
                    color: currentTheme.colors.textSecondary
                  }}>
                    {achievement.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.textLight
                    }}>
                      {achievement.rarity}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: currentTheme.colors.backgroundAlt,
                      color: currentTheme.colors.textSecondary
                    }}>
                      {achievement.category}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: currentTheme.colors.backgroundAlt,
                      color: currentTheme.colors.textSecondary
                    }}>
                      {formatDate(achievement.earnedDate)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'activity' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {profile.recentActivity.map(activity => (
              <div 
                key={activity.id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px',
                  backgroundColor: currentTheme.colors.card,
                  borderRadius: '12px'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: `${currentTheme.colors.primary}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {getActivityIcon(activity.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0' }}>{activity.title}</h4>
                  {activity.description && (
                    <p style={{
                      margin: '0 0 8px 0',
                      fontSize: '14px',
                      color: currentTheme.colors.textSecondary
                    }}>
                      {activity.description}
                    </p>
                  )}
                  {activity.imageUrl && (
                    <div style={{
                      marginBottom: '8px',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src={activity.imageUrl}
                        alt=""
                        style={{
                          width: '100%',
                          maxHeight: '200px',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}
                  <div style={{
                    fontSize: '12px',
                    color: currentTheme.colors.textSecondary
                  }}>
                    {formatDate(activity.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isEditModalOpen && profile && (
        <ProfileEditModal
          profile={profile}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onUpdated={handleProfileUpdated}
        />
      )}
    </div>
  );
};

export default ProfileFullView; 