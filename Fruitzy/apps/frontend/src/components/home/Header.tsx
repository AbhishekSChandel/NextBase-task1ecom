import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { CartIcon } from '../common/Icon';
import { getComponentSizes, getFontSizes, getSpacing } from '../../utils/responsive';
import { UserProfileModal } from './UserProfileModal';

interface HeaderProps {
  user: any;
  cartItemCount?: number;
  onCartPress?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  cartItemCount = 0,
  onCartPress,
  onLogout,
}) => {
  const { theme } = useTheme();
  const sizes = getComponentSizes();
  const fontSizes = getFontSizes();
  const spacing = getSpacing();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Get first letter of user's name for avatar
  const getInitial = () => {
    const firstName = user?.firstName;
    const lastName = user?.lastName;
    const fullName = user?.fullName;
    const email = user?.primaryEmailAddress?.emailAddress || user?.email;
    
    const name = firstName || lastName || fullName || email || 'U';
    return name.charAt(0).toUpperCase();
  };

  // Get username (first name or email prefix)
  const getUsername = () => {
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.fullName) {
      return user.fullName.split(' ')[0];
    }
    const email = user?.primaryEmailAddress?.emailAddress || user?.email;
    if (email) {
      return email.split('@')[0];
    }
    return 'User';
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
    },
    avatar: {
      borderRadius: sizes.avatarSize / 2,
      alignItems: 'center',
      justifyContent: 'center',
      width: sizes.avatarSize,
      height: sizes.avatarSize,
      backgroundColor: theme.primary,
    },
    avatarText: {
      color: '#FFFFFF',
      fontFamily: 'Poppins_700Bold',
      fontSize: fontSizes.h4,
    },
    usernameButton: {
      flex: 1,
      alignItems: 'center',
      marginHorizontal: 16,
    },
    usernameContainer: {
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      backgroundColor: theme.backgroundCard,
    },
    usernameText: {
      fontFamily: 'Poppins_500Medium',
      fontSize: fontSizes.body,
      color: theme.text,
    },
    dropdownIcon: {
      marginLeft: 8,
      fontSize: fontSizes.bodySmall,
      color: theme.textSecondary,
    },
    cartButton: {
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      width: sizes.avatarSize,
      height: sizes.avatarSize,
      backgroundColor: theme.backgroundCard,
    },
    badge: {
      position: 'absolute',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      top: 8,
      right: 8,
      width: 20,
      height: 20,
      backgroundColor: theme.accentRed,
    },
    badgeText: {
      color: '#FFFFFF',
      fontFamily: 'Poppins_700Bold',
      fontSize: fontSizes.caption,
    },
  });

  return (
    <>
      <View style={styles.container}>
        {/* Left: Avatar with initial - Static (non-clickable) */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitial()}</Text>
        </View>

        {/* Center: Username with dropdown indicator - Clickable */}
        <TouchableOpacity
          style={styles.usernameButton}
          onPress={() => setShowProfileModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.usernameContainer}>
            <Text style={styles.usernameText}>{getUsername()}'s Home</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </View>
        </TouchableOpacity>

        {/* Right: Cart icon with badge */}
        <TouchableOpacity
          style={styles.cartButton}
          onPress={onCartPress}
        >
          <CartIcon size={sizes.iconLarge} color={theme.textSecondary} />
          {cartItemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* User Profile Modal */}
      {onLogout && (
        <UserProfileModal
          visible={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
          onLogout={onLogout}
        />
      )}
    </>
  );
};
