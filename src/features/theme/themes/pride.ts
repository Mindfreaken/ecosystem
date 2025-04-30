import type { Theme } from './types'; // Import the Theme type from the types module

// Dark version of the Pride theme
const prideDark: Theme = { // Define the dark variant of the Pride theme
  id: 'pride-dark', // Unique identifier for the dark Pride theme
  name: 'Pride Dark', // Display name for the dark theme
  colors: { // Begin dark theme color definitions
    primary: '#ff218c', // Primary color: vibrant magenta for standout elements
    primaryDark: '#d10063', // Darker variant of the primary color for added depth
    primaryLight: '#ff4ba8', // Lighter variant of the primary color for highlights
    primaryHover: '#ff218c80', // Semi-transparent primary color for hover effects
    primaryActive: '#a8004e', // Primary color used when elements are active

    secondary: '#ffb400', // Secondary color: bright yellow-orange for accents
    secondaryDark: '#cc9000', // Darker variant of secondary for stronger emphasis
    secondaryLight: '#ffc740', // Lighter variant of secondary for subtle highlights
    secondaryHover: '#ffb40080', // Semi-transparent secondary color for hover state
    secondaryActive: '#a87800', // Secondary color when elements are active

    background: '#0f172a', // Dark background color for the overall interface
    backgroundAlt: '#1e293b', // Alternate dark background for subtle variation
    backgroundLight: '#273444', // Slightly lighter background variant for contrast
    backgroundDark: '#0a0f1a', // Darker background variant to add depth

    card: '#1e293b', // Card background color in dark theme
    cardHover: '#273444', // Card color on hover to indicate interactivity
    cardActive: '#334155', // Card color when active for visual feedback

    border: '#334155', // Default border color for elements in dark mode
    borderLight: '#475569', // Lighter border variant for delicate outlines
    borderDark: '#1e293b', // Darker border variant for stronger definition

    text: '#f1f5f9', // Default text color: light for readability on dark backgrounds
    textPrimary: '#f1f5f9', // Primary text color for key content
    textLight: '#ffffff', // Lighter text variant for emphasized text
    textDark: '#d1d5db', // Slightly darker text variant for less contrast where needed
    textMuted: '#9ca3af', // Muted text color for disabled or secondary text
    textSecondary: '#cbd5e1', // Secondary text color for supporting details

    success: '#10b981', // Color representing success states
    successDark: '#059669', // Darker shade of success for emphasis
    successLight: '#34d399', // Lighter shade of success for subtle highlights

    danger: '#ef4444', // Color indicating errors or danger states
    dangerDark: '#dc2626', // Darker variant of danger for stronger alerts
    dangerLight: '#f87171', // Lighter variant of danger for softer warnings

    warning: '#f59e0b', // Warning color for cautionary messages
    warningDark: '#d97706', // Darker variant of warning for emphasis
    warningLight: '#fbbf24', // Lighter variant of warning for highlights

    info: '#3b82f6', // Informational color for neutral messages
    infoDark: '#2563eb', // Darker shade of info for contrast
    infoLight: '#60a5fa', // Lighter shade of info for clarity

    link: '#2563eb', // Default link color to denote interactivity
    linkHover: '#1d4ed8', // Link color on hover for immediate feedback
    linkActive: '#1e40af', // Link color when active or clicked

    buttonPrimary: '#ff218c', // Background color for primary buttons
    buttonPrimaryHover: '#d10063', // Primary button color on hover for visual cues
    buttonPrimaryActive: '#a8004e', // Primary button color when active

    buttonSecondary: '#7c3aed', // Background color for secondary buttons
    buttonSecondaryHover: '#6d28d9', // Secondary button hover color for feedback
    buttonSecondaryActive: '#5b21b6', // Secondary button active color for interactivity

    shadow: '#00000080', // Shadow color with transparency for depth effects
    highlight: '#ffffff', // Highlight color for accenting UI elements

    overlay: '#0f172a99', // Overlay color with transparency for modals and popups
    disabled: '#9ca3af' // Color used to indicate disabled elements
  } // End of dark theme color definitions
}; // End of the Pride Dark theme

// Light version of the Pride theme
const prideLight: Theme = { // Define the light variant of the Pride theme
  id: 'pride-light', // Unique identifier for the light Pride theme
  name: 'Pride Light', // Display name for the light theme
  colors: { // Begin light theme color definitions
    primary: '#ff218c', // Primary color: vibrant magenta for standout elements
    primaryDark: '#d10063', // Darker variant of the primary color for depth
    primaryLight: '#ff4ba8', // Lighter variant of the primary color for highlights
    primaryHover: '#ff218c80', // Semi-transparent primary color for hover effects
    primaryActive: '#a8004e', // Primary color used when elements are active

    secondary: '#ffb400', // Secondary color: bright yellow-orange for accents
    secondaryDark: '#cc9000', // Darker variant of secondary for stronger emphasis
    secondaryLight: '#ffc740', // Lighter variant of secondary for subtle highlights
    secondaryHover: '#ffb40080', // Semi-transparent secondary color for hover state
    secondaryActive: '#a87800', // Secondary color when elements are active

    background: '#ffffff', // Light background color for a bright interface
    backgroundAlt: '#f8fafc', // Alternate background for subtle variation
    backgroundLight: '#ffffff', // Pure white background for main sections
    backgroundDark: '#f1f5f9', // Slightly darker background variant for contrast

    card: '#ffffff', // Card background set to white for a clean look
    cardHover: '#f9fafb', // Card background on hover to indicate interactivity
    cardActive: '#f3f4f6', // Card background when active for subtle feedback

    border: '#e2e8f0', // Default border color for elements in the light theme
    borderLight: '#f1f5f9', // Lighter border variant for delicate outlines
    borderDark: '#cbd5e1', // Darker border variant for stronger definition

    text: '#0f172a', // Default text color: dark for readability on light backgrounds
    textPrimary: '#0f172a', // Primary text color for main content
    textLight: '#334155', // Lighter text variant for less emphasized text
    textDark: '#020617', // Darker text variant for strong emphasis where needed
    textMuted: '#64748b', // Muted text color for disabled or secondary text
    textSecondary: '#475569', // Secondary text color for supporting details

    success: '#10b981', // Color representing successful actions or statuses
    successDark: '#059669', // Darker shade of success for emphasis
    successLight: '#34d399', // Lighter shade of success for highlights

    danger: '#ef4444', // Color indicating errors or danger states
    dangerDark: '#dc2626', // Darker variant of danger for stronger alerts
    dangerLight: '#f87171', // Lighter variant of danger for softer warnings

    warning: '#f59e0b', // Warning color for cautionary messages
    warningDark: '#d97706', // Darker variant of warning for emphasis
    warningLight: '#fbbf24', // Lighter variant of warning for highlights

    info: '#3b82f6', // Informational color for neutral messages
    infoDark: '#2563eb', // Darker shade of info for contrast
    infoLight: '#60a5fa', // Lighter shade of info for clarity

    link: '#2563eb', // Default link color to denote interactivity
    linkHover: '#1d4ed8', // Link color on hover for immediate feedback
    linkActive: '#1e40af', // Link color when active or clicked

    buttonPrimary: '#ff218c', // Primary button background color for actions
    buttonPrimaryHover: '#d10063', // Primary button hover color for responsiveness
    buttonPrimaryActive: '#a8004e', // Primary button active color for tactile feedback

    buttonSecondary: '#7c3aed', // Secondary button background color for alternative actions
    buttonSecondaryHover: '#6d28d9', // Secondary button hover color for visual feedback
    buttonSecondaryActive: '#5b21b6', // Secondary button active color for interactivity

    shadow: '#0000001a', // Light shadow color with transparency for subtle depth
    highlight: '#ffffff', // Highlight color for accenting elements

    overlay: '#0f172a99', // Overlay color with transparency for modals and popups
    disabled: '#9ca3af' // Color used to indicate disabled elements
  } // End of light theme color definitions
}; // End of the Pride Light theme

export { prideDark, prideLight }; // Export both dark and light theme variants for use in the application
