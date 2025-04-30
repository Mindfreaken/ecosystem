import type { Theme } from './types'; // Import the Theme type from the types module

// Dark version of the Retro Wave theme
const retroWaveDark: Theme = { // Define the dark variant of the Retro Wave theme
  id: 'retroWave-dark', // Unique identifier for the dark Retro Wave theme
  name: 'Retro Wave Dark', // Display name for the dark theme
  colors: { // Begin color definitions for the dark theme
    primary: '#ff00ff', // Primary neon magenta color for main elements
    primaryDark: '#cc00cc', // Darker variant of primary for added depth
    primaryLight: '#ff33ff', // Lighter variant of primary for subtle highlights
    primaryHover: '#ff00ff80', // Semi-transparent primary color for hover effects
    primaryActive: '#b800b8', // Primary color when an element is active

    secondary: '#00ffff', // Secondary neon cyan color for accents
    secondaryDark: '#00cccc', // Darker variant of secondary for contrast
    secondaryLight: '#33ffff', // Lighter variant of secondary for highlights
    secondaryHover: '#00ffff80', // Semi-transparent secondary color for hover effects
    secondaryActive: '#00b8b8', // Secondary color for active state elements

    background: '#0b0033', // Dark background color for the overall interface
    backgroundAlt: '#16004d', // Alternate dark background for subtle variation
    backgroundLight: '#1f0066', // Lighter background variant for contrast
    backgroundDark: '#060020', // Darker background variant for additional depth

    card: '#16004d', // Card background color in dark mode
    cardHover: '#1f0066', // Card color on hover to indicate interactivity
    cardActive: '#290080', // Card color when active or pressed

    border: '#290080', // Border color for elements in the dark theme
    borderLight: '#3300a6', // Lighter border variant for delicate outlines
    borderDark: '#1f0066', // Darker border variant for emphasis

    text: '#f8e1ff', // Default text color: light for readability on dark backgrounds
    textPrimary: '#f8e1ff', // Primary text color for main content
    textLight: '#fcf0ff', // Lighter text variant for highlighted text
    textDark: '#ecc3ff', // Slightly darker text variant for emphasis
    textMuted: '#9d81cc', // Muted text color for less prominent content
    textSecondary: '#c9a3ff', // Secondary text color for supporting details

    success: '#00ff99', // Neon green color indicating success states
    successDark: '#00cc7a', // Darker variant of success for emphasis
    successLight: '#33ffad', // Lighter variant of success for subtle highlights

    danger: '#ff3366', // Vivid red-pink color indicating danger or errors
    dangerDark: '#ff0044', // Darker variant of danger for stronger alerts
    dangerLight: '#ff6688', // Lighter variant of danger for softer warnings

    warning: '#ffdd00', // Bright yellow color for warnings
    warningDark: '#ccb100', // Darker variant of warning for emphasis
    warningLight: '#ffe433', // Lighter variant of warning for highlights

    info: '#00ffff', // Informational neon cyan color for neutral messages
    infoDark: '#00cccc', // Darker variant of info for contrast
    infoLight: '#33ffff', // Lighter variant of info for clarity

    link: '#00ffff', // Default link color matching the info hue for interactivity
    linkHover: '#00cccc', // Link color on hover for visual feedback
    linkActive: '#00b8b8', // Link color when active or clicked

    buttonPrimary: '#ff00ff', // Primary button background color
    buttonPrimaryHover: '#cc00cc', // Primary button color on hover for responsiveness
    buttonPrimaryActive: '#b800b8', // Primary button color when active

    buttonSecondary: '#00ffff', // Secondary button background color
    buttonSecondaryHover: '#00cccc', // Secondary button color on hover for visual feedback
    buttonSecondaryActive: '#00b8b8', // Secondary button color when active

    shadow: '#ff00ff40', // Neon shadow effect with transparency for a retro vibe
    highlight: '#00ffff40', // Neon highlight effect with transparency for accents

    overlay: '#0b0033cc', // Overlay color with transparency for modals/popups
    disabled: '#554180' // Disabled element color, a muted purple for the dark theme
  } // End of dark theme color definitions
}; // End of the Retro Wave Dark theme

// Light version of the Retro Wave theme
const retroWaveLight: Theme = { // Define the light variant of the Retro Wave theme
  id: 'retroWave-light', // Unique identifier for the light Retro Wave theme
  name: 'Retro Wave Light', // Display name for the light theme
  colors: { // Begin color definitions for the light theme
    primary: '#ff00ff', // Primary neon magenta remains for brand consistency
    primaryDark: '#cc00cc', // Darker variant of primary for depth
    primaryLight: '#ff33ff', // Lighter variant of primary for highlights
    primaryHover: '#ff00ff80', // Semi-transparent primary color for hover effects
    primaryActive: '#b800b8', // Primary color when an element is active

    secondary: '#00ffff', // Secondary neon cyan remains unchanged for accents
    secondaryDark: '#00cccc', // Darker variant of secondary for contrast
    secondaryLight: '#33ffff', // Lighter variant of secondary for highlights
    secondaryHover: '#00ffff80', // Semi-transparent secondary for hover effects
    secondaryActive: '#00b8b8', // Secondary color for active state elements

    background: '#f0f0f5', // Light background color for the overall interface
    backgroundAlt: '#e8e8ee', // Alternate light background for subtle variation
    backgroundLight: '#ffffff', // Pure white background for primary sections
    backgroundDark: '#dcdce4', // Slightly darker background variant for contrast

    card: '#ffffff', // Card background set to white for a clean look
    cardHover: '#f8f8fc', // Card background on hover for gentle interactivity
    cardActive: '#f0f0f5', // Card background when active for a pressed effect

    border: '#dcdce4', // Border color for light theme elements
    borderLight: '#eaeaf2', // Lighter border variant for delicate outlines
    borderDark: '#c8c8d0', // Darker border variant for emphasis

    text: '#1a1a1a', // Default text color: dark for readability on light backgrounds
    textPrimary: '#1a1a1a', // Primary text color for main content
    textLight: '#333333', // Lighter text variant for less emphasized text
    textDark: '#000000', // Darker text variant for strong emphasis
    textMuted: '#666666', // Muted text color for secondary or disabled content
    textSecondary: '#4d4d4d', // Secondary text color for supporting details

    success: '#00ff99', // Neon green color indicating success states
    successDark: '#00cc7a', // Darker variant of success for emphasis
    successLight: '#33ffad', // Lighter variant of success for subtle highlights

    danger: '#ff3366', // Vivid red-pink color indicating danger or errors
    dangerDark: '#ff0044', // Darker variant of danger for stronger alerts
    dangerLight: '#ff6688', // Lighter variant of danger for softer warnings

    warning: '#ffdd00', // Bright yellow color for warnings
    warningDark: '#ccb100', // Darker variant of warning for emphasis
    warningLight: '#ffe433', // Lighter variant of warning for highlights

    info: '#00ffff', // Informational neon cyan color for neutral messages
    infoDark: '#00cccc', // Darker variant of info for contrast
    infoLight: '#33ffff', // Lighter variant of info for clarity

    link: '#00ffff', // Default link color matching the info hue for interactivity
    linkHover: '#00cccc', // Link color on hover for visual feedback
    linkActive: '#00b8b8', // Link color when active or clicked

    buttonPrimary: '#ff00ff', // Primary button background color for actions
    buttonPrimaryHover: '#cc00cc', // Primary button hover color for responsiveness
    buttonPrimaryActive: '#b800b8', // Primary button active color for tactile feedback

    buttonSecondary: '#00ffff', // Secondary button background color for alternative actions
    buttonSecondaryHover: '#00cccc', // Secondary button hover color for visual feedback
    buttonSecondaryActive: '#00b8b8', // Secondary button active color for interactivity

    shadow: '#ff00ff40', // Neon shadow effect with transparency for a retro vibe
    highlight: '#00ffff40', // Neon highlight effect with transparency for accents

    overlay: '#ffffffcc', // Light overlay color with transparency for modals/popups
    disabled: '#8e7ba1' // Disabled element color, a muted purple suitable for light themes
  } // End of light theme color definitions
}; // End of the Retro Wave Light theme

export { retroWaveDark, retroWaveLight }; // Export both dark and light theme variants for use in the application
