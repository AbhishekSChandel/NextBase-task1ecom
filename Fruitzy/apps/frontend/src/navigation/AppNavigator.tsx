import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { CartScreen } from '../screens/CartScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrderConfirmedScreen } from '../screens/OrderConfirmedScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  user: any;
  onSignOut: () => void;
  isGuestMode?: boolean;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({
  user,
  onSignOut,
  isGuestMode = false,
}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home">
        {({ navigation, route }) => (
          <HomeScreen
            navigation={navigation}
            route={route}
            user={user}
            onSignOut={onSignOut}
            isGuestMode={isGuestMode}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />

      <Stack.Screen name="Search" component={SearchScreen} />

      <Stack.Screen name="Cart" component={CartScreen} />

      <Stack.Screen name="Checkout" component={CheckoutScreen} />

      <Stack.Screen
        name="OrderConfirmed"
        component={OrderConfirmedScreen}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};
