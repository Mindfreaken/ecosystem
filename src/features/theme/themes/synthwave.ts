import type { Theme } from './types'; // Import the Theme type from the types module

// Dark version of the Synthwave theme
const synthwaveDark: Theme = { // Define the dark variant of the Synthwave theme
  id: 'synthwave-dark', // Unique identifier for the dark Synthwave theme
  name: 'Synthwave Dark', // Display name for the dark theme
  colors: { // Begin dark theme color definitions
    primary: '#f72585', // Primary color: vibrant pink for main elements
    primaryDark: '#d31071', // Darker shade of primary for added depth
    primaryLight: '#f94d9d', // Lighter shade of primary for subtle highlights
    primaryHover: '#f7258580', // Semi-transparent primary color for hover effects
    primaryActive: '#bf0f66', // Primary color used when elements are active

    secondary: '#7209b7', // Secondary color: bold purple for accents
    secondaryDark: '#5a0792', // Darker variant of secondary for emphasis
    secondaryLight: '#8a3cc6', // Lighter variant of secondary for visual highlights
    secondaryHover: '#7209b780', // Semi-transparent secondary color for hover effects
    secondaryActive: '#510684', // Secondary color for active state elements

    background: '#10002b', // Main background color for the dark theme
    backgroundAlt: '#240046', // Alternate background color for subtle variation
    backgroundLight: '#3c096c', // Lighter background variant for contrast
    backgroundDark: '#09001c', // Darker background variant for added depth

    card: '#240046', // Card background color in dark mode
    cardHover: '#3c096c', // Card color when hovered to indicate interactivity
    cardActive: '#5a189a', // Card color when active or pressed

    border: '#5a189a', // Default border color for elements
    borderLight: '#7b2cbf', // Lighter border variant for subtle outlines
    borderDark: '#3c096c', // Darker border variant for stronger emphasis

    text: '#e0aaff', // Default text color: light for readability on dark backgrounds
    textPrimary: '#e0aaff', // Primary text color for main content
    textLight: '#f3d9ff', // Lighter text variant for highlighted text
    textDark: '#c77dff', // Darker text variant for emphasis
    textMuted: '#9d4edd', // Muted text color for less prominent content
    textSecondary: '#b56dfa', // Secondary text color for supporting details

    success: '#4cc9f0', // Color representing success states
    successDark: '#1dbde6', // Darker variant of success for emphasis
    successLight: '#79d7f4', // Lighter variant of success for subtle highlights

    danger: '#f72585', // Color indicating danger or errors
    dangerDark: '#d31071', // Darker variant of danger for stronger alerts
    dangerLight: '#f94d9d', // Lighter variant of danger for softer warnings

    warning: '#ffd60a', // Warning color for cautionary messages
    warningDark: '#d6b300', // Darker variant of warning for emphasis
    warningLight: '#ffdf3d', // Lighter variant of warning for highlights

    info: '#4361ee', // Informational color for neutral messages
    infoDark: '#1c46ea', // Darker shade of info for contrast
    infoLight: '#6c84f2', // Lighter shade of info for clarity

    link: '#7209b7', // Default link color for interactive elements
    linkHover: '#5a0792', // Link color on hover for immediate feedback
    linkActive: '#510684', // Link color when active or clicked

    buttonPrimary: '#f72585', // Background color for primary buttons
    buttonPrimaryHover: '#d31071', // Primary button color on hover for responsiveness
    buttonPrimaryActive: '#bf0f66', // Primary button color when active

    buttonSecondary: '#7209b7', // Background color for secondary buttons
    buttonSecondaryHover: '#5a0792', // Secondary button hover color for interactivity
    buttonSecondaryActive: '#510684', // Secondary button color when active

    shadow: '#f7258540', // Shadow color with transparency for depth effect
    highlight: '#7209b730', // Highlight color with transparency for subtle accents

    overlay: '#10002bcc', // Overlay color with transparency for modals/popups
    disabled: '#560bad' // Color used to indicate disabled elements
  } // End of dark theme color definitions
}; // End of the Synthwave Dark theme

// Light version of the Synthwave theme
const synthwaveLight: Theme = { // Define the light variant of the Synthwave theme
  id: 'synthwave-light', // Unique identifier for the light Synthwave theme
  name: 'Synthwave Light', // Display name for the light theme
  colors: { // Begin light theme color definitions
    primary: '#f72585', // Primary color remains for brand consistency
    primaryDark: '#d31071', // Darker variant of primary for contrast
    primaryLight: '#f94d9d', // Lighter variant of primary for highlights
    primaryHover: '#f7258580', // Semi-transparent primary color for hover effects
    primaryActive: '#bf0f66', // Primary color used when elements are active

    secondary: '#7209b7', // Secondary color remains unchanged for consistency
    secondaryDark: '#5a0792', // Darker variant of secondary for emphasis
    secondaryLight: '#8a3cc6', // Lighter variant of secondary for visual appeal
    secondaryHover: '#7209b780', // Semi-transparent secondary color for hover effects
    secondaryActive: '#510684', // Secondary color for active state

    background: '#f8f8fc', // Main background color for light theme (soft, light tone)
    backgroundAlt: '#f0f0f5', // Alternate light background for subtle variation
    backgroundLight: '#ffffff', // Pure white background for primary sections
    backgroundDark: '#dcdce4', // Slightly darker background variant for contrast

    card: '#ffffff', // Card background color set to white for clarity
    cardHover: '#f8f8fc', // Card color on hover for gentle interactivity
    cardActive: '#f0f0f5', // Card color when active to indicate selection

    border: '#dcdce4', // Border color for light theme elements
    borderLight: '#eaeaf2', // Lighter border variant for delicate outlines
    borderDark: '#c8c8d0', // Darker border variant for stronger definition

    text: '#1a1a1a', // Default text color: dark for readability on light backgrounds
    textPrimary: '#1a1a1a', // Primary text color for main content
    textLight: '#333333', // Lighter text variant for less prominent text
    textDark: '#000000', // Darker text variant for emphasis
    textMuted: '#666666', // Muted text color for secondary or disabled content
    textSecondary: '#4d4d4d', // Secondary text color for supporting details

    success: '#4cc9f0', // Success color remains for consistency
    successDark: '#1dbde6', // Darker variant of success for emphasis
    successLight: '#79d7f4', // Lighter variant of success for highlights

    danger: '#f72585', // Danger color remains for consistency
    dangerDark: '#d31071', // Darker variant of danger for stronger alerts
    dangerLight: '#f94d9d', // Lighter variant of danger for softer warnings

    warning: '#ffd60a', // Warning color for cautionary messages
    warningDark: '#d6b300', // Darker variant of warning for emphasis
    warningLight: '#ffdf3d', // Lighter variant of warning for highlights

    info: '#4361ee', // Informational color for neutral messages
    infoDark: '#1c46ea', // Darker shade of info for contrast
    infoLight: '#6c84f2', // Lighter shade of info for clarity

    link: '#7209b7', // Default link color for interactive elements
    linkHover: '#5a0792', // Link color on hover for immediate feedback
    linkActive: '#510684', // Link color when active or clicked

    buttonPrimary: '#f72585', // Background color for primary buttons
    buttonPrimaryHover: '#d31071', // Primary button hover color for responsiveness
    buttonPrimaryActive: '#bf0f66', // Primary button active color for tactile feedback

    buttonSecondary: '#7209b7', // Background color for secondary buttons
    buttonSecondaryHover: '#5a0792', // Secondary button hover color for visual feedback
    buttonSecondaryActive: '#510684', // Secondary button active color for interactivity

    shadow: '#0000001a', // Light shadow color with transparency for subtle depth
    highlight: '#7209b730', // Highlight color with transparency for gentle accents

    overlay: '#ffffffcc', // Light overlay color with transparency for modals/popups
    disabled: '#a890a0' // Disabled element color adjusted for the light theme
  } // End of light theme color definitions
}; // End of the Synthwave Light theme

export { synthwaveDark, synthwaveLight }; // Export both dark and light theme variants for use in the application
