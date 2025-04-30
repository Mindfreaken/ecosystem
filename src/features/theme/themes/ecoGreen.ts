import type { Theme } from './types';

// Dark version of the Eco Green theme
const ecoGreenDark: Theme = {
  id: 'ecoGreen-dark', // Unique identifier for the dark theme variant
  name: 'Eco Green Dark', // Display name for the dark theme
  colors: { // Begin dark theme color definitions
    primary: '#00ff7f', // Primary color: a vibrant, energetic green
    primaryDark: '#00cc6a', // Darker shade of vibrant green
    primaryLight: '#66ff9f', // Lighter, brighter shade of vibrant green
    primaryHover: '#00ff7fcc', // Semi-transparent vibrant green for hover effects
    primaryActive: '#00cc66', // Deeper green for active state interactions

    secondary: '#00ccff', // Secondary color: bright, clear sky blue
    secondaryDark: '#0088cc', // Darker shade of bright blue
    secondaryLight: '#66ddff', // Lighter shade of bright blue
    secondaryHover: '#00ccffcc', // Semi-transparent bright blue for hover effects
    secondaryActive: '#0099cc', // Deeper blue for active state elements

    background: '#011f11', // Dark, rich green background to make primaries pop
    backgroundAlt: '#02321e', // Slightly lighter deep green background
    backgroundLight: '#045336', // Lighter background variant for panels or contrast
    backgroundDark: '#00110b', // Very dark, near-black green

    card: '#02321e', // Card background using the alternate dark background
    cardHover: '#045336', // Card color on hover, using the lighter background variant
    cardActive: '#06764f', // Card color when active or pressed

    border: '#045336', // Border color matching the lighter background variant
    borderLight: '#06764f', // Lighter border variant
    borderDark: '#02321e', // Darker border variant

    text: '#f0fff0', // Bright, clean off-white text for high contrast
    textPrimary: '#e0ffe0', // Pure white primary text color
    textLight: '#ffffff', // Lighter text (pure white)
    textDark: '#b0f0b0', // Slightly dimmer green text
    textMuted: '#80a080', // Muted grey-green text
    textSecondary: '#a0c0a0', // Secondary text, slightly muted green-grey

    success: '#00ff7f', // Success color using the primary vibrant green
    successDark: '#00cc6a', // Darker variant of success
    successLight: '#66ff9f', // Lighter variant of success

    danger: '#ff4455', // A vibrant, strong pink/red for errors
    dangerDark: '#cc3344', // Darker shade of danger red
    dangerLight: '#ff6677', // Lighter shade of danger red

    warning: '#ffd700', // A bright, saturated yellow for warnings
    warningDark: '#ccaf00', // Darker variant of warning yellow
    warningLight: '#ffee33', // Lighter variant of warning yellow

    info: '#1e90ff', // Info color using the secondary vibrant blue
    infoDark: '#1873cc', // Darker variant of info blue
    infoLight: '#5aaeff', // Lighter variant of info blue

    link: '#66ff9f', // Link color using the light primary green for good visibility
    linkHover: '#99ffb3', // Even lighter green on hover
    linkActive: '#00ff7f', // Base primary green when active/clicked

    buttonPrimary: '#00ff7f', // Primary button uses vibrant green (ensure text is dark for contrast)
    buttonPrimaryHover: '#00cc6a', // Darker green on hover
    buttonPrimaryActive: '#009955', // Deepest green on active

    buttonSecondary: '#00ccff', // Secondary button uses vibrant blue (ensure text is dark for contrast)
    buttonSecondaryHover: '#0088cc', // Darker blue on hover
    buttonSecondaryActive: '#005599', // Deepest blue on active

    shadow: '#00110bbe', // More pronounced shadow using the darkest background color
    highlight: '#00ff7f40', // Slightly stronger highlight using primary green

    overlay: '#011f11e0', // Darker overlay using background color with high opacity
    disabled: '#557755' // Muted green-grey for disabled elements
  } // End dark theme color definitions
}; // End of Vibrant Eco Green Dark theme

// Light version of the Eco Green theme
const ecoGreenLight: Theme = {
  id: 'ecoGreen-light', // Unique identifier for the light theme variant
  name: 'Eco Green Light', // Display name for the light theme
  colors: { // Begin light theme color definitions
    primary: '#00ff7f', // Primary vibrant green remains consistent
    primaryDark: '#00cc6a', // Darker variant of the primary color
    primaryLight: '#66ff9f', // Lighter variant of the primary color
    primaryHover: '#00ff7fcc', // Semi-transparent hover effect for primary color
    primaryActive: '#00cc66', // Deeper active state color for primary

    secondary: '#00ccff', // Secondary vibrant blue remains consistent
    secondaryDark: '#0088cc', // Darker shade for secondary color
    secondaryLight: '#66ddff', // Lighter shade for secondary color
    secondaryHover: '#00ccffcc', // Semi-transparent hover for secondary
    secondaryActive: '#0099cc', // Deeper active state for secondary

    background: '#f0fff0', // Clean, pure light background for maximum brightness
    backgroundAlt: '#dfffe1', // Very light grey, almost white with a slight green hint
    backgroundLight: '#ffffff', // Pure white background
    backgroundDark: '#c0edd0', // Light grey with a hint of green

    card: '#ffffff', // White card background
    cardHover: '#f0fff0', // Very subtle grey-green on hover
    cardActive: '#dfffe1', // Active card matching the light background variant

    border: '#c0edd0', // Light grey-green border color
    borderLight: '#dfffe1', // Lighter border variant
    borderDark: '#a0d0c0', // Darker border variant

    text: '#002200', // Dark green-tinged text for readability
    textPrimary: '#003300', // Darker primary text color
    textLight: '#004400', // Lighter dark text
    textDark: '#000000', // Pure black text for high emphasis
    textMuted: '#607060', // Muted grey-green text
    textSecondary: '#506050', // Secondary text color

    success: '#00ff7f', // Success color using vibrant green
    successDark: '#00cc6a', // Darker variant for success
    successLight: '#66ff9f', // Lighter variant for success

    danger: '#ff4455', // A vibrant, strong pink/red for errors
    dangerDark: '#cc3344', // Darker shade of danger red
    dangerLight: '#ff6677', // Lighter shade of danger red

    warning: '#ffd700', // A bright, saturated yellow for warnings
    warningDark: '#ccaf00', // Darker variant of warning yellow
    warningLight: '#ffee33', // Lighter variant of warning yellow

    info: '#1e90ff', // Info color using the vibrant blue
    infoDark: '#1873cc', // Darker variant of info blue
    infoLight: '#5aaeff', // Lighter variant of info blue

    link: '#66ff9f', // Link color using the lighter primary green for contrast
    linkHover: '#99ffb3', // Darker green on hover
    linkActive: '#00ff7f', // Base primary green when active/clicked

    buttonPrimary: '#00ff7f', // Primary button uses vibrant green
    buttonPrimaryHover: '#00cc6a', // Darker green on hover
    buttonPrimaryActive: '#009955', // Deepest green on active

    buttonSecondary: '#00ccff', // Secondary button uses vibrant blue
    buttonSecondaryHover: '#0088cc', // Darker blue on hover
    buttonSecondaryActive: '#005599', // Deepest blue on active

    shadow: '#0000001a', // Subtle shadow using light theme's depth
    highlight: '#00ff7f25', // Subtle highlight using primary color with transparency

    overlay: '#ffffffe0', // Light overlay using white with transparency
    disabled: '#d0d0d0' // Muted light grey-green indicating disabled state
  } // End light theme color definitions
}; // End of the Vibrant Eco Green Light theme

export { ecoGreenDark, ecoGreenLight };
