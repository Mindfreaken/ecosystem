import type { Theme } from './types'; // Import the Theme type from the types module

// Dark version of the Orange Sunset theme
const orangeSunsetDark: Theme = { // Define the dark theme variant for Orange Sunset
  id: 'orangeSunset-dark', // Unique identifier for the dark variant
  name: 'Orange Sunset Dark', // Display name for the dark theme
  colors: { // Begin the dark theme color definitions
    primary: '#ff7b00', // Primary color: warm, vibrant orange
    primaryDark: '#cc6200', // Darker shade of primary for depth and emphasis
    primaryLight: '#ff9633', // Lighter shade of primary for highlights and accents
    primaryHover: '#ff7b0080', // Semi-transparent primary color for hover effects
    primaryActive: '#cc6200', // Primary color when the element is active

    secondary: '#ff4757', // Secondary color: bold red-orange for accents
    secondaryDark: '#ff1429', // Darker variant of secondary for strong emphasis
    secondaryLight: '#ff7a85', // Lighter variant of secondary for subtle highlights
    secondaryHover: '#ff475780', // Semi-transparent secondary color for hover state
    secondaryActive: '#ff1429', // Secondary color when active

    background: '#1f1a17', // Dark background color for the overall interface
    backgroundAlt: '#2a241f', // Alternate background color for subtle variation
    backgroundLight: '#3b3229', // Lighter background variant for elements needing contrast
    backgroundDark: '#15110f', // Darker background variant for depth

    card: '#2a241f', // Background color for card components
    cardHover: '#3b3229', // Card background when hovered over to indicate interactivity
    cardActive: '#4c3f34', // Card background when active or pressed

    border: '#4c3f34', // Default border color for elements
    borderLight: '#67564a', // Lighter border variant for subtle outlines
    borderDark: '#3b3229', // Darker border variant for stronger definition

    text: '#f5e8d8', // Default text color (light) for readability on dark backgrounds
    textPrimary: '#f5e8d8', // Primary text color used in main content areas
    textLight: '#faf3eb', // Lighter text variant for less prominent text
    textDark: '#e6d0b5', // Slightly darker text variant for emphasis where needed
    textMuted: '#b39d85', // Muted text color for disabled or secondary text
    textSecondary: '#d4bca3', // Secondary text color for supporting details

    success: '#57c57c', // Color used to indicate successful actions or statuses
    successDark: '#45a063', // Darker shade for success states
    successLight: '#77d194', // Lighter shade for success highlights

    danger: '#ff4757', // Color used to indicate error or danger states
    dangerDark: '#ff1429', // Darker variant of danger for strong alerts
    dangerLight: '#ff7a85', // Lighter variant of danger for subtle warnings

    warning: '#ff7b00', // Warning color, echoing the primary warm tone
    warningDark: '#cc6200', // Darker variant of warning for emphasis
    warningLight: '#ff9633', // Lighter variant of warning for softer alerts

    info: '#5bc0de', // Informational color for neutral messages and tips
    infoDark: '#31b0d5', // Darker shade of info for contrast
    infoLight: '#85d0e7', // Lighter shade of info for clarity

    link: '#5bc0de', // Default link color matching the info hue for consistency
    linkHover: '#31b0d5', // Link color on hover for visual feedback
    linkActive: '#28a1c5', // Link color when active or clicked

    buttonPrimary: '#ff7b00', // Primary button background color
    buttonPrimaryHover: '#cc6200', // Primary button color on hover
    buttonPrimaryActive: '#b85700', // Primary button color when active

    buttonSecondary: '#ff4757', // Secondary button background color
    buttonSecondaryHover: '#ff1429', // Secondary button color on hover
    buttonSecondaryActive: '#fa0319', // Secondary button color when active

    shadow: '#00000080', // Shadow color with transparency for depth effects
    highlight: '#ff7b0020', // Highlight color with transparency for subtle glow effects

    overlay: '#1f1a17cc', // Overlay color with transparency for modals and popups
    disabled: '#6e665f' // Color used to indicate disabled elements
  } // End of dark theme color definitions
}; // End of the Orange Sunset Dark theme

// Light version of the Orange Sunset theme
const orangeSunsetLight: Theme = { // Define the light theme variant for Orange Sunset
  id: 'orangeSunset-light', // Unique identifier for the light variant
  name: 'Orange Sunset Light', // Display name for the light theme
  colors: { // Begin the light theme color definitions
    primary: '#ff7b00', // Primary color remains warm orange for brand consistency
    primaryDark: '#cc6200', // Darker variant of primary for contrast in light mode
    primaryLight: '#ff9633', // Lighter variant of primary for subtle highlights
    primaryHover: '#ff7b0080', // Semi-transparent primary color for hover effects
    primaryActive: '#cc6200', // Primary color for active state interactions

    secondary: '#ff4757', // Secondary color remains bold red-orange for accents
    secondaryDark: '#ff1429', // Darker variant of secondary for strong visual cues
    secondaryLight: '#ff7a85', // Lighter variant of secondary for softer highlights
    secondaryHover: '#ff475780', // Semi-transparent secondary for hover effects
    secondaryActive: '#ff1429', // Secondary color when active

    background: '#fff7f0', // Light background color for a bright, airy interface
    backgroundAlt: '#fcefe7', // Alternate light background for subtle variation
    backgroundLight: '#ffffff', // Pure white background for main sections
    backgroundDark: '#f2e8e0', // Slightly darker background variant for contrast

    card: '#ffffff', // Card background set to white for a clean look
    cardHover: '#f9f9f9', // Card background on hover for gentle interactivity
    cardActive: '#f2f2f2', // Card background when active for subtle feedback

    border: '#e0dcd5', // Border color in light theme for soft, defined edges
    borderLight: '#ece8e3', // Lighter border variant for delicate outlines
    borderDark: '#d4d0c9', // Darker border variant for stronger definition

    text: '#3a2b27', // Default text color: dark for readability on light backgrounds
    textPrimary: '#3a2b27', // Primary text color for main content
    textLight: '#5a4a45', // Lighter text variant for less emphasized text
    textDark: '#2f251f', // Darker text variant for strong emphasis where needed
    textMuted: '#8c7b72', // Muted text color for disabled or secondary information
    textSecondary: '#75665d', // Secondary text color for supplementary details

    success: '#57c57c', // Success color remains consistent for indicating positive actions
    successDark: '#45a063', // Darker shade for success states in light mode
    successLight: '#77d194', // Lighter shade for success highlights

    danger: '#ff4757', // Danger color remains vibrant for error states
    dangerDark: '#ff1429', // Darker variant for danger to emphasize alerts
    dangerLight: '#ff7a85', // Lighter variant for danger for softer alerts

    warning: '#ff7b00', // Warning color echoes the primary tone for consistency
    warningDark: '#cc6200', // Darker variant of warning for visual emphasis
    warningLight: '#ff9633', // Lighter variant of warning for subtle notifications

    info: '#5bc0de', // Informational color remains cool blue for neutral messages
    infoDark: '#31b0d5', // Darker variant of info for contrast in light mode
    infoLight: '#85d0e7', // Lighter variant of info for clarity

    link: '#5bc0de', // Default link color to denote interactivity
    linkHover: '#31b0d5', // Link color on hover for immediate feedback
    linkActive: '#28a1c5', // Link color when active or clicked

    buttonPrimary: '#ff7b00', // Primary button color for a cohesive call-to-action
    buttonPrimaryHover: '#cc6200', // Primary button hover color for responsiveness
    buttonPrimaryActive: '#b85700', // Primary button active color for tactile feedback

    buttonSecondary: '#ff4757', // Secondary button color for alternative actions
    buttonSecondaryHover: '#ff1429', // Secondary button hover color for emphasis
    buttonSecondaryActive: '#fa0319', // Secondary button active color for interactivity

    shadow: '#0000001a', // Light shadow with transparency for subtle depth in light mode
    highlight: '#ff7b0020', // Highlight color with transparency for gentle accents

    overlay: '#ffffffcc', // Light overlay color with transparency for modals/popups
    disabled: '#b7aba5' // Disabled element color, using a lighter tone for light mode
  } // End of light theme color definitions
}; // End of the Orange Sunset Light theme

export { orangeSunsetDark, orangeSunsetLight }; // Export both dark and light variants for use in the application
