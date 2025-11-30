import { TextStyle } from 'react-native';
import { ColorScheme } from './colors';

// Color constants matching Figma (for light mode defaults)
export const colors = {
  // Text colors
  textPrimary: '#1F2937',      // Dark gray for main text
  textSecondary: '#9CA3AF',    // Light gray for secondary text
  textHeading: '#1E5128',      // Dark green for headings
  textPrice: '#2ECC71',        // Green for prices
  textWhite: '#FFFFFF',
  textBlack: '#000000',
  
  // UI colors
  primary: '#2ECC71',
  background: '#FFFFFF',
  backgroundCard: '#F3F4F6',
  border: '#E5E7EB',
  accentRed: '#EF4444',
};

// Typography styles matching Figma (base styles without colors - colors should be overridden with theme)
export const typography = {
  // Headings
  h1: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 32,
    lineHeight: 40,
    // Color will be overridden with theme.heading
  } as TextStyle,
  
  h2: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    lineHeight: 32,
    // Color will be overridden with theme.heading
  } as TextStyle,
  
  h3: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    lineHeight: 28,
    // Color will be overridden with theme.text
  } as TextStyle,
  
  h4: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    lineHeight: 24,
    // Color will be overridden with theme.text
  } as TextStyle,
  
  // Body text
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    // Color will be overridden with theme.text
  } as TextStyle,
  
  bodyMedium: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    lineHeight: 24,
    // Color will be overridden with theme.text
  } as TextStyle,
  
  bodySecondary: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    // Color will be overridden with theme.textSecondary
  } as TextStyle,
  
  bodySmall: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    // Color will be overridden with theme.textSecondary
  } as TextStyle,
  
  // Special text
  price: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    lineHeight: 32,
    color: colors.textPrice, // Price stays green in both modes
  } as TextStyle,
  
  priceUnit: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    // Color will be overridden with theme.textSecondary
  } as TextStyle,
  
  button: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: colors.textWhite,
  } as TextStyle,
  
  buttonSmall: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    lineHeight: 20,
    color: colors.textWhite,
  } as TextStyle,
  
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
    // Color will be overridden with theme.textSecondary
  } as TextStyle,
  
  placeholder: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#D1D5DB',
  } as TextStyle,
};

/**
 * Get typography styles with theme colors applied
 * Use this function to get typography that respects dark/light mode
 */
export const getTypography = (theme: ColorScheme) => ({
  h1: { ...typography.h1, color: theme.heading },
  h2: { ...typography.h2, color: theme.heading },
  h3: { ...typography.h3, color: theme.text },
  h4: { ...typography.h4, color: theme.text },
  body: { ...typography.body, color: theme.text },
  bodyMedium: { ...typography.bodyMedium, color: theme.text },
  bodySecondary: { ...typography.bodySecondary, color: theme.textSecondary },
  bodySmall: { ...typography.bodySmall, color: theme.textSecondary },
  price: typography.price, // Price stays green
  priceUnit: { ...typography.priceUnit, color: theme.textSecondary },
  button: typography.button,
  buttonSmall: typography.buttonSmall,
  caption: { ...typography.caption, color: theme.textSecondary },
  placeholder: typography.placeholder,
});

