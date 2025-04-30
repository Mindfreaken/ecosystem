export const DEFAULT_AVATAR_URL = '/images/default-avatar.png';
export const DEFAULT_COVER_URL = '/images/default-cover.png';

export interface ImageOption {
  name: string;
  url: string;
}

// Base paths for local static assets
const LOCAL_AVATARS_PATH = '/avatars/default';
const LOCAL_COVERS_PATH = '/covers/default';

// Using local paths instead of URLs
export const DEFAULT_AVATARS: ImageOption[] = [
  { name: 'Default Avatar 1', url: `${LOCAL_AVATARS_PATH}/default_001.jpg` },
  { name: 'Default Avatar 2', url: `${LOCAL_AVATARS_PATH}/default_002.jpg` },
  { name: 'Default Avatar 3', url: `${LOCAL_AVATARS_PATH}/default_003.jpg` },
  { name: 'Default Avatar 4', url: `${LOCAL_AVATARS_PATH}/default_004.jpg` },
  { name: 'Default Avatar 5', url: `${LOCAL_AVATARS_PATH}/default_005.jpg` },
  { name: 'Default Avatar 6', url: `${LOCAL_AVATARS_PATH}/default_006.jpg` },
  { name: 'Default Avatar 7', url: `${LOCAL_AVATARS_PATH}/default_007.jpg` },
  { name: 'Default Avatar 8', url: `${LOCAL_AVATARS_PATH}/default_008.jpg` },
  { name: 'Default Avatar 9', url: `${LOCAL_AVATARS_PATH}/default_009.jpg` },
  { name: 'Default Avatar 10', url: `${LOCAL_AVATARS_PATH}/default_010.jpg` },
  { name: 'Default Avatar 11', url: `${LOCAL_AVATARS_PATH}/default_011.jpg` },
  { name: 'Default Avatar 12', url: `${LOCAL_AVATARS_PATH}/default_012.jpg` },
  // Additional avatars for scrolling
  { name: 'Default Avatar 13', url: `${LOCAL_AVATARS_PATH}/default_013.jpg` },
  { name: 'Default Avatar 14', url: `${LOCAL_AVATARS_PATH}/default_014.jpg` },
  { name: 'Default Avatar 15', url: `${LOCAL_AVATARS_PATH}/default_015.jpg` },
];

export const DEFAULT_COVERS: ImageOption[] = [
  { name: 'Default Cover 1', url: `${LOCAL_COVERS_PATH}/default_001.png` },
  { name: 'Default Cover 2', url: `${LOCAL_COVERS_PATH}/default_002.png` },
  { name: 'Default Cover 3', url: `${LOCAL_COVERS_PATH}/default_003.png` },
  { name: 'Default Cover 4', url: `${LOCAL_COVERS_PATH}/default_004.png` },
  { name: 'Default Cover 5', url: `${LOCAL_COVERS_PATH}/default_005.png` },
  { name: 'Default Cover 6', url: `${LOCAL_COVERS_PATH}/default_006.png` },
  { name: 'Default Cover 7', url: `${LOCAL_COVERS_PATH}/default_007.png` },
  { name: 'Default Cover 8', url: `${LOCAL_COVERS_PATH}/default_008.png` },
  // Additional covers for scrolling
  { name: 'Default Cover 9', url: `${LOCAL_COVERS_PATH}/default_009.png` },
  { name: 'Default Cover 10', url: `${LOCAL_COVERS_PATH}/default_010.png` },
  { name: 'Default Cover 11', url: `${LOCAL_COVERS_PATH}/default_011.png` },
  { name: 'Default Cover 12', url: `${LOCAL_COVERS_PATH}/default_012.png` },
  { name: 'Default Cover 13', url: `${LOCAL_COVERS_PATH}/default_013.png` },
  { name: 'Default Cover 14', url: `${LOCAL_COVERS_PATH}/default_014.png` },
  { name: 'Default Cover 15', url: `${LOCAL_COVERS_PATH}/default_015.png` },
  { name: 'Default Cover 16', url: `${LOCAL_COVERS_PATH}/default_016.png` },
  { name: 'Default Cover 17', url: `${LOCAL_COVERS_PATH}/default_017.png` },
  { name: 'Default Cover 18', url: `${LOCAL_COVERS_PATH}/default_018.png` },
];

export const preloadDefaultImages = async () => {
  const images = [DEFAULT_AVATAR_URL, DEFAULT_COVER_URL];
  
  await Promise.all(
    images.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(`Failed to load ${url}`);
        img.src = url;
      });
    })
  );
};