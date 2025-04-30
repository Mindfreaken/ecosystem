import type { Theme } from './types'; // Import the Theme type from the types module

// --- Void Dark Theme (Enhanced Darkness) ---
// An intensely dark theme using near-black and black backgrounds with high-contrast white text.
const voidDarkTheme: Theme = {
  id: 'voidDark', // Unique identifier for the enhanced dark Void theme
  name: 'Void Dark', // Display name for the enhanced dark theme
  colors: { // Begin enhanced dark theme color definitions

    // --- Primary Accent Colors ---
    primary: '#6366f1',       // Main primary color (indigo): Used for key interactive elements, branding.
    primaryDark: '#4f46e5',    // Darker shade of primary: For gradients, pressed states, or depth.
    primaryLight: '#818cf8',   // Lighter shade of primary: For hover states (subtle), highlights.
    primaryHover: '#6366f199', // Semi-transparent primary: Often used for button/element hover backgrounds. (Increased transparency slightly)
    primaryActive: '#4338ca',  // Active state primary color: For pressed buttons or active navigation.

    // --- Secondary Accent Colors ---
    secondary: '#10b981',      // Main secondary color (emerald): Used for secondary actions, accents.
    secondaryDark: '#059669',   // Darker shade of secondary: For depth or pressed states.
    secondaryLight: '#34d399',  // Lighter shade of secondary: For hover states or highlights.
    secondaryHover: '#10b98199', // Semi-transparent secondary: Often used for hover effects. (Increased transparency slightly)
    secondaryActive: '#047857', // Active state secondary color: For pressed secondary buttons.

    // --- Background Colors (Even Darker) ---
    background: '#000000',     // Main background color: Pure black.
    backgroundAlt: '#080808',   // Alternate background: Extremely dark gray, just off black.
    backgroundLight: '#101010', // Lighter background variant: Very dark gray.
    backgroundDark: '#030303',  // Darker background variant: Almost imperceptibly off black.

    // --- Card Colors (Even Darker) ---
    card: '#080808',           // Card background: Matches new alternate background.
    cardHover: '#101010',      // Card background on hover: Matches new lighter background.
    cardActive: '#181818',     // Card background when active/pressed: Slightly darker than hover.

    // --- Border Colors (Even Darker) ---
    border: '#1f1f1f',         // Default border color: Very dark gray, subtle.
    borderLight: '#282828',    // Lighter border variant: Dark gray.
    borderDark: '#101010',     // Darker border variant: Matches backgroundLight.

    // --- Text Colors (Maintain High Contrast) ---
    text: '#FFFFFF',           // Default text color: Pure white.
    textPrimary: '#FFFFFF',    // Primary text color: Pure white.
    textLight: '#FFFFFF',      // Lighter text variant: Pure white.
    textDark: '#E0E0E0',       // Slightly darker text variant: Off-white.
    textMuted: '#888888',      // Muted text color: Darker gray.
    textSecondary: '#aaaaaa',  // Secondary text color: Darker light gray.

    // --- Semantic Colors (Status Indicators - Keep for clarity) ---
    success: '#10b981',      
    successDark: '#059669',   
    successLight: '#34d399',  

    danger: '#ef4444',       
    dangerDark: '#dc2626',    
    dangerLight: '#f87171',   

    warning: '#f59e0b',      
    warningDark: '#d97706',   
    warningLight: '#fbbf24',  

    info: '#6366f1',         
    infoDark: '#4f46e5',      
    infoLight: '#818cf8',     

    // --- Interactive Element Colors (Keep for clarity) ---
    link: '#818cf8',         
    linkHover: '#6366f1',    
    linkActive: '#4f46e5',   

    buttonPrimary: '#6366f1',       
    buttonPrimaryHover: '#4f46e5',    
    buttonPrimaryActive: '#4338ca',  

    buttonSecondary: '#10b981',      
    buttonSecondaryHover: '#059669',   
    buttonSecondaryActive: '#047857', 

    // --- Miscellaneous Colors (Adjust disabled) ---
    shadow: '#00000099',      // Shadow color: Keep as is.
    highlight: '#ffffff1a',   // Highlight color: Keep as is.
    overlay: '#000000cc',      // Overlay color: Keep as is.
    disabled: '#333333'       // Disabled element color: Even darker gray.
  } // End of enhanced dark theme color definitions
}; // End of the Void Dark (Enhanced) theme

// --- Void Light Theme (Enhanced Brightness) ---
// An intensely light theme using pure white backgrounds with high-contrast black text.


const voidLightTheme: Theme = {
  id: 'voidLight', // Unique identifier for the enhanced light Void theme
  name: 'Void Light', // Display name for the enhanced light theme
  colors: { // Begin enhanced light theme color definitions

    // --- Primary Accent Colors ---
    primary: '#6366f1',       // Main primary color (indigo): Consistent with dark theme.
    primaryDark: '#4f46e5',    // Darker shade of primary.
    primaryLight: '#818cf8',   // Lighter shade of primary.
    primaryHover: '#6366f180', // Semi-transparent primary for hover (opacity adjusted if needed for light bg).
    primaryActive: '#4338ca',  // Active state primary color.

    // --- Secondary Accent Colors ---
    secondary: '#10b981',      // Main secondary color (emerald): Consistent with dark theme.
    secondaryDark: '#059669',   // Darker shade of secondary.
    secondaryLight: '#34d399',  // Lighter shade of secondary.
    secondaryHover: '#10b98180', // Semi-transparent secondary for hover.
    secondaryActive: '#047857', // Active state secondary color.

    // --- Background Colors (Enhanced Light) ---
    background: '#FFFFFF',     // Main background color: Pure white for maximum brightness.
    backgroundAlt: '#F9F9F9',   // Alternate background: Extremely light gray, barely off-white.
    backgroundLight: '#FFFFFF',  // Lighter background variant: Pure white.
    backgroundDark: '#F0F0F0',  // Darker background variant: Very light gray for subtle contrast/borders. (Made lighter)

    // --- Card Colors (Enhanced Light) ---
    card: '#FFFFFF',           // Card background: Pure white.
    cardHover: '#FAFAFA',      // Card background on hover: Extremely subtle off-white shift.
    cardActive: '#F5F5F5',     // Card background when active/pressed: Very light gray feedback.

    // --- Border Colors (Enhanced Light) ---
    border: '#EEEEEE',         // Default border color: Very light gray, subtle definition.
    borderLight: '#F5F5F5',    // Lighter border variant: Almost invisible, for minimal separation.
    borderDark: '#DCDCDC',     // Darker border variant: Light gray, provides clearer definition when needed.

    // --- Text Colors (Enhanced Contrast) ---
    text: '#000000',           // Default text color: Pure black for maximum contrast on white.
    textPrimary: '#000000',    // Primary text color: Pure black.
    textLight: '#222222',      // Lighter text variant: Very dark gray, for slight de-emphasis.
    textDark: '#000000',       // Darker text variant: Pure black.
    textMuted: '#666666',      // Muted text color: Medium gray, clearly distinct but not primary.
    textSecondary: '#444444',  // Secondary text color: Dark gray for supporting details.

    // --- Semantic Colors (Status Indicators) ---
    success: '#10b981',      // Success state color (emerald): Consistent.
    successDark: '#059669',   // Darker success shade.
    successLight: '#34d399',  // Lighter success shade.

    danger: '#ef4444',       // Danger state color (red): Consistent.
    dangerDark: '#dc2626',    // Darker danger shade.
    dangerLight: '#f87171',   // Lighter danger shade.

    warning: '#f59e0b',      // Warning state color (amber): Consistent.
    warningDark: '#d97706',   // Darker warning shade.
    warningLight: '#fbbf24',  // Lighter warning shade.

    info: '#6366f1',         // Info state color (primary): Consistent.
    infoDark: '#4f46e5',      // Darker info shade.
    infoLight: '#818cf8',     // Lighter info shade.

    // --- Interactive Element Colors ---
    link: '#4f46e5',         // Link color: Using primaryDark for better contrast on pure white.
    linkHover: '#6366f1',    // Link color on hover: Shifts to main primary.
    linkActive: '#4338ca',   // Link color when active/clicked: Shifts to deepest primary.

    buttonPrimary: '#6366f1',       // Primary button background: Uses main primary color.
    buttonPrimaryHover: '#4f46e5',    // Primary button hover background: Darker shade.
    buttonPrimaryActive: '#4338ca',  // Primary button active background: Deepest shade.

    buttonSecondary: '#10b981',      // Secondary button background: Uses main secondary color.
    buttonSecondaryHover: '#059669',   // Secondary button hover background: Darker shade.
    buttonSecondaryActive: '#047857', // Secondary button active background: Deepest shade.

    // --- Miscellaneous Colors ---
    shadow: '#00000014',      // Shadow color: Very subtle semi-transparent black for light mode depth. (Made even subtler)
    highlight: '#00000008',   // Highlight color: Extremely subtle dark overlay for focus indication on white.
    overlay: '#FFFFFFcc',      // Overlay color: Semi-transparent white for modals/dialogs in light mode.
    disabled: '#BBBBBB'       // Disabled element color: Light gray, clearly inactive on white background. (Made lighter)
  } // End of enhanced light theme color definitions
}; // End of the Void Light (Enhanced) theme

export { voidDarkTheme, voidLightTheme }; // Export both enhanced dark and light theme variants