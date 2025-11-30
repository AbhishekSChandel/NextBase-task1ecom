import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { getFontSizes, getSpacing } from '../../utils/responsive';

interface UserProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: any;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  visible,
  onClose,
  user,
  onLogout,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const fontSizes = getFontSizes();
  const spacing = getSpacing();

  const getInitial = () => {
    const firstName = user?.firstName;
    const lastName = user?.lastName;
    const fullName = user?.fullName;
    const email = user?.primaryEmailAddress?.emailAddress || user?.email;
    const name = firstName || lastName || fullName || email || 'U';
    return name.charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    if (user?.fullName) return user.fullName;
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) return user.firstName;
    const email = user?.primaryEmailAddress?.emailAddress || user?.email;
    return email?.split('@')[0] || 'User';
  };

  const getEmail = () => {
    return user?.primaryEmailAddress?.emailAddress || user?.email || 'No email';
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-start',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      backgroundColor: theme.background,
      marginTop: 0,
      paddingTop: spacing.xl * 2,
      paddingBottom: spacing.xl,
      paddingHorizontal: spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    userInfo: {
      alignItems: 'center',
      marginBottom: 24,
    },
    avatar: {
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      width: 80,
      height: 80,
      backgroundColor: theme.primary,
    },
    avatarText: {
      color: '#FFFFFF',
      fontFamily: 'Poppins_700Bold',
      fontSize: fontSizes.h1,
    },
    displayName: {
      fontFamily: 'Poppins_700Bold',
      textAlign: 'center',
      fontSize: fontSizes.h3,
      color: theme.heading,
    },
    email: {
      fontFamily: 'Inter_400Regular',
      textAlign: 'center',
      marginTop: 4,
      fontSize: fontSizes.body,
      color: theme.textSecondary,
    },
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 16,
      marginBottom: 12,
      backgroundColor: theme.backgroundCard,
    },
    themeToggleLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    themeIcon: {
      fontSize: fontSizes.h3,
      marginRight: spacing.md,
    },
    themeText: {
      fontFamily: 'Poppins_500Medium',
      fontSize: fontSizes.body,
      color: theme.text,
    },
    themeSwitch: {
      width: 48,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 4,
      backgroundColor: isDark ? theme.primary : theme.border,
    },
    themeSwitchCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: isDark ? '#FFFFFF' : theme.primary,
      transform: [{ translateX: isDark ? 20 : 0 }],
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 16,
      backgroundColor: theme.accentRed,
    },
    logoutIcon: {
      fontSize: fontSizes.h4,
      marginRight: spacing.sm,
    },
    logoutText: {
      color: '#FFFFFF',
      fontFamily: 'Poppins_600SemiBold',
      fontSize: fontSizes.body,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* User Avatar and Info */}
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitial()}</Text>
              </View>
              
              <Text style={styles.displayName}>{getDisplayName()}</Text>
              
              <Text style={styles.email}>{getEmail()}</Text>
            </View>

            {/* Theme Toggle */}
            <TouchableOpacity
              onPress={toggleTheme}
              style={styles.themeToggle}
              activeOpacity={0.7}
            >
              <View style={styles.themeToggleLeft}>
                <Text style={styles.themeIcon}>{isDark ? '🌙' : '☀️'}</Text>
                <Text style={styles.themeText}>
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </Text>
              </View>
              
              <View style={styles.themeSwitch}>
                <View style={styles.themeSwitchCircle} />
              </View>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={() => {
                onClose();
                onLogout();
              }}
              style={styles.logoutButton}
              activeOpacity={0.7}
            >
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
