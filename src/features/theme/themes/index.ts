// Import theme variants using appropriate import syntax for each theme
import { valorantDark, valorantLight } from './valorant'; // Will update when converted to light/dark
import { futuristicBlueDark, futuristicBlueLight } from './futuristicBlue';
import { themenamedark as cyberpunkPurpleDark, themenamelight as cyberpunkPurpleLight } from './cyberpunkPurple';
import { ecoGreenDark, ecoGreenLight } from './ecoGreen';
import { hauntedGroveDark, hauntedGroveLight } from './hauntedGrove';
import { miamiViceDark, miamiViceLight } from './miamiVice';
import { prideDark, prideLight } from './pride'; // Will update when converted to light/dark
import { themenamedark as cyberpunk77Dark, themenamelight as cyberpunk77Light } from './cyberpunk77';
import { nightCityDark, nightCityLight } from './nightCity';
import { orangeSunsetDark, orangeSunsetLight } from './orangeSunset'; // Will update when converted to light/dark
import { retroWaveDark, retroWaveLight } from './retroWave'; // Will update when converted to light/dark
import { tealOceanDark, tealOceanLight } from './tealOcean'; // Will update when converted to light/dark
import { voidDarkTheme, voidLightTheme } from './voidDark'; // Will update when converted to light/dark
import { synthwaveDark, synthwaveLight } from './synthwave'; // Will update when converted to light/dark
import type { Theme } from './types';

// Define all available themes
export const availableThemes: Record<string, Theme> = {
  // Default theme first (using Night City as default until converted)
  [nightCityDark.id]: nightCityDark,
  [nightCityLight.id]: nightCityLight,
  
  // All themes with their appropriate format
  [valorantDark.id]: valorantDark,
  [valorantLight.id]: valorantLight,
  
  // Themes with light and dark variants
  [futuristicBlueDark.id]: futuristicBlueDark,
  [futuristicBlueLight.id]: futuristicBlueLight,
  
  [cyberpunkPurpleDark.id]: cyberpunkPurpleDark,
  [cyberpunkPurpleLight.id]: cyberpunkPurpleLight,
  
  [ecoGreenDark.id]: ecoGreenDark,
  [ecoGreenLight.id]: ecoGreenLight,
  
  [hauntedGroveDark.id]: hauntedGroveDark,
  [hauntedGroveLight.id]: hauntedGroveLight,
  
  [miamiViceDark.id]: miamiViceDark,
  [miamiViceLight.id]: miamiViceLight,
  
  [prideDark.id]: prideDark,
  [prideLight.id]: prideLight,
  
  [cyberpunk77Dark.id]: cyberpunk77Dark,
  [cyberpunk77Light.id]: cyberpunk77Light,
  
  [orangeSunsetDark.id]: orangeSunsetDark,
  [orangeSunsetLight.id]: orangeSunsetLight,
  
  [retroWaveDark.id]: retroWaveDark,
  [retroWaveLight.id]: retroWaveLight,
  
  [tealOceanDark.id]: tealOceanDark,
  [tealOceanLight.id]: tealOceanLight,
  
  [voidDarkTheme.id]: voidDarkTheme,
  [voidLightTheme.id]: voidLightTheme,
  
  [synthwaveDark.id]: synthwaveDark,
  [synthwaveLight.id]: synthwaveLight,
};

// Set the default theme to Night City (will update to dark version when converted)
export const defaultTheme: Theme = nightCityDark;

// Helper function to get a theme by ID
export const getThemeById = (themeId: string): Theme => {
  return availableThemes[themeId] || defaultTheme;
};

// Apply theme to document root
export const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  
  // Apply theme colors as CSS variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
};

// No longer auto-apply theme on import - we'll do this through the theme store
// The store will handle system preferences and authenticated user preferences

// Re-export types
export type { Theme, ThemeColors } from './types'; 