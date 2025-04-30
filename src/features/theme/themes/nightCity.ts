import type { Theme } from './types'; // Import the Theme type from the types module

// Define the dark variant of the Night City theme
const nightCityDark: Theme = { // Start of dark theme definition
  id: 'nightCity-dark', // Unique identifier for the dark Night City theme
  name: 'Night City Dark', // Display name for the dark theme
  colors: { // Begin color definitions for dark theme
    primary: '#ff2d55', // Primary color for key elements
    primaryDark: '#e60033', // Darker shade of primary color for depth
    primaryLight: '#ff5c7c', // Lighter shade of primary color for highlights
    primaryHover: '#ff2d5580', // Primary color with transparency for hover state
    primaryActive: '#d10030', // Primary color for active state interactions

    secondary: '#0096ff', // Secondary color for accents and highlights
    secondaryDark: '#0077cc', // Darker shade of secondary for contrast
    secondaryLight: '#33abff', // Lighter shade of secondary for subtle emphasis
    secondaryHover: '#0096ff80', // Secondary color with transparency for hover effects
    secondaryActive: '#0066cc', // Secondary color for active state elements

    background: '#121212', // Main background color for dark theme
    backgroundAlt: '#1e1e1e', // Alternate background color for variation
    backgroundLight: '#2a2a2a', // Lighter background variant for contrast
    backgroundDark: '#0a0a0a', // Darker background variant for depth

    card: '#1e1e1e', // Background color for cards in dark theme
    cardHover: '#2a2a2a', // Card color on hover to indicate interactivity
    cardActive: '#333333', // Card color when active or pressed

    border: '#333333', // Standard border color for dark theme elements
    borderLight: '#444444', // Lighter border variant for subtle borders
    borderDark: '#222222', // Darker border variant for stronger emphasis

    text: '#e6e6e6', // Default text color for dark theme for readability
    textPrimary: '#e6e6e6', // Primary text color used across components
    textLight: '#f2f2f2', // Lighter text variant for less prominent text
    textDark: '#d9d9d9', // Slightly darker text variant for emphasis
    textMuted: '#9ca3af', // Muted text color for disabled or secondary text
    textSecondary: '#bdc3cf', // Secondary text color for additional details

    success: '#36d399', // Color representing success states
    successDark: '#2baf7c', // Darker shade of success color for contrast
    successLight: '#5ddcac', // Lighter shade of success color for highlights

    danger: '#ff2d55', // Color representing error or danger states
    dangerDark: '#e60033', // Darker shade of danger color for alerts
    dangerLight: '#ff5c7c', // Lighter shade of danger color for emphasis

    warning: '#ffb400', // Warning color for cautionary messages
    warningDark: '#cc9000', // Darker variant of warning for emphasis
    warningLight: '#ffc333', // Lighter variant of warning for highlights

    info: '#0096ff', // Informational color for tips and messages
    infoDark: '#0077cc', // Darker shade of info color for contrast
    infoLight: '#33abff', // Lighter shade of info color for emphasis

    link: '#0096ff', // Default link color to indicate interactivity
    linkHover: '#0077cc', // Link color on hover for feedback
    linkActive: '#0066cc', // Link color when active or clicked

    buttonPrimary: '#ff2d55', // Background color for primary buttons
    buttonPrimaryHover: '#e60033', // Primary button color on hover for visual feedback
    buttonPrimaryActive: '#d10030', // Primary button color when active

    buttonSecondary: '#0096ff', // Background color for secondary buttons
    buttonSecondaryHover: '#0077cc', // Secondary button color on hover
    buttonSecondaryActive: '#0066cc', // Secondary button color when active

    shadow: '#00000080', // Shadow color with transparency for depth
    highlight: '#ffffff10', // Highlight color with transparency for subtle effects

    overlay: '#121212cc', // Overlay color with transparency for modals/popups
    disabled: '#4b5563' // Color used for disabled elements to indicate inactivity
  } // End of dark theme color definitions
}; // End of dark theme definition

// Define the light variant of the Night City theme
const nightCityLight: Theme = { // Start of light theme definition
  id: 'nightCity-light', // Unique identifier for the light Night City theme
  name: 'Night City Light', // Display name for the light theme
  colors: { // Begin color definitions for light theme
    primary: '#ff2d55', // Primary color remains vibrant for consistency
    primaryDark: '#d10030', // Darker variant of primary for contrast in light theme
    primaryLight: '#ff5c7c', // Lighter variant of primary for highlights
    primaryHover: '#ff2d5580', // Primary color with transparency for hover state
    primaryActive: '#e60033', // Primary color for active state interactions

    secondary: '#0096ff', // Secondary color for accents remains consistent
    secondaryDark: '#0066cc', // Darker variant of secondary for contrast
    secondaryLight: '#33abff', // Lighter variant of secondary for emphasis
    secondaryHover: '#0096ff80', // Secondary color with transparency for hover effects
    secondaryActive: '#0077cc', // Secondary color for active state elements

    background: '#f7f7f7', // Main light background color for bright interfaces
    backgroundAlt: '#eeeeee', // Alternate light background for subtle variation
    backgroundLight: '#ffffff', // Pure white background for primary sections
    backgroundDark: '#e0e0e0', // Slightly darker background variant for contrast

    card: '#ffffff', // Card background color in light theme
    cardHover: '#f2f2f2', // Card color on hover to indicate interactivity
    cardActive: '#e0e0e0', // Card color when active or pressed

    border: '#dcdcdc', // Default border color for light theme elements
    borderLight: '#e0e0e0', // Lighter border variant for subtle dividers
    borderDark: '#c0c0c0', // Darker border variant for stronger outlines

    text: '#333333', // Default text color for light theme to ensure readability
    textPrimary: '#333333', // Primary text color for main content
    textLight: '#555555', // Lighter text variant for less critical information
    textDark: '#222222', // Darker text variant for emphasis where needed
    textMuted: '#777777', // Muted text color for secondary or disabled text
    textSecondary: '#555555', // Secondary text color for additional details

    success: '#36d399', // Success state color remains consistent for familiarity
    successDark: '#2baf7c', // Darker shade of success for contrast in light theme
    successLight: '#5ddcac', // Lighter shade of success for highlights

    danger: '#ff2d55', // Danger state color remains vibrant for alerting
    dangerDark: '#e60033', // Darker variant of danger for emphasis
    dangerLight: '#ff5c7c', // Lighter variant of danger for subtle highlights

    warning: '#ffb400', // Warning color remains consistent for notifications
    warningDark: '#cc9000', // Darker shade of warning for contrast
    warningLight: '#ffc333', // Lighter shade of warning for highlights

    info: '#0096ff', // Informational color remains standard for consistency
    infoDark: '#0077cc', // Darker variant of info for visual contrast
    infoLight: '#33abff', // Lighter variant of info for emphasis

    link: '#0096ff', // Default link color to indicate clickable elements
    linkHover: '#0077cc', // Link color on hover to provide feedback
    linkActive: '#0066cc', // Link color when active or clicked

    buttonPrimary: '#ff2d55', // Primary button background color remains the same
    buttonPrimaryHover: '#e60033', // Primary button color on hover for visual cues
    buttonPrimaryActive: '#d10030', // Primary button color when active

    buttonSecondary: '#0096ff', // Secondary button background color remains consistent
    buttonSecondaryHover: '#0077cc', // Secondary button color on hover for feedback
    buttonSecondaryActive: '#0066cc', // Secondary button color when active

    shadow: '#00000040', // Subtle shadow for light theme to add depth
    highlight: '#00000010', // Subtle highlight color for light theme accents

    overlay: '#ffffffcc', // Overlay color with transparency for modals/popups in light theme
    disabled: '#a1a1a1' // Color for disabled elements to indicate inactivity in light theme
  } // End of light theme color definitions
}; // End of light theme definition

export { nightCityDark, nightCityLight }; // Export both theme variants for use in the application
