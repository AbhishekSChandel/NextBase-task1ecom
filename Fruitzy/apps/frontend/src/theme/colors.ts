export const lightColors = {
  // Primary green shades
  primary: '#2ECC71',
  primaryDark: '#27AE60',
  primaryLight: '#58D68D',

  // Dark green/teal for headings
  heading: '#1B4332',
  headingLight: '#2D6A4F',

  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  backgroundCard: '#F0F4F3',
  backgroundMint: '#E8F5E9',
  cardHighlight: '#F4F8F2', // Matches Figma mango card background

  // Text colors
  text: '#1B4332',
  textSecondary: '#9E9E9E',
  textLight: '#B0B0B0',

  // Accent colors
  accentRed: '#EF5350',
  accentOrange: '#FF6B6B',

  // Border
  border: '#E0E0E0',
};

export const darkColors = {
  // Primary green shades (same as light)
  primary: '#2ECC71',
  primaryDark: '#27AE60',
  primaryLight: '#58D68D',

  // Dark green/teal for headings (lighter in dark mode)
  heading: '#FFFFFF',
  headingLight: '#E0E0E0',

  // Background colors (dark)
  background: '#121212',
  backgroundSecondary: '#1E1E1E',
  backgroundCard: '#2C2C2C',
  backgroundMint: '#1E3A2C',
  cardHighlight: '#1F2A24', // Deeper green tint for dark mode

  // Text colors (inverted)
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textLight: '#808080',

  // Accent colors (same as light)
  accentRed: '#EF5350',
  accentOrange: '#FF6B6B',

  // Border
  border: '#3A3A3A',
};

export type ColorScheme = typeof lightColors;
