import React from 'react';
import { Platform, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider, useApp } from './src/context/AppContext';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { CustomerSignupScreen } from './src/screens/CustomerSignupScreen';
import { ChefSignupScreen } from './src/screens/ChefSignupScreen';
import { BrowseScreen } from './src/screens/BrowseScreen';
import { ChefDetailsScreen } from './src/screens/ChefDetailsScreen';
import { CartScreen } from './src/screens/CartScreen';
import { PreOrderScreen } from './src/screens/PreOrderScreen';
import { ChefModeScreen } from './src/screens/ChefModeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { OrderHistoryScreen } from './src/screens/OrderHistoryScreen';
import { colors } from './src/theme';

const RootStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabBarStyle = {
  backgroundColor: '#FFFFFF',
  borderTopWidth: 1,
  borderTopColor: 'rgba(0,0,0,0.1)',
  elevation: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  ...(Platform.OS === 'web' ? { height: 56, paddingBottom: 4, paddingTop: 4, flexShrink: 0, flexGrow: 0 } : {}),
};

const tabBarLabelStyle = {
  fontSize: 12,
  fontWeight: '600' as const,
};

function OrderFoodStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="Browse" component={BrowseScreen} />
      <Stack.Screen name="ChefDetails" component={ChefDetailsScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
}

function CustomerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle,
        tabBarLabelStyle,
      }}
    >
      <Tab.Screen
        name="Home"
        component={OrderFoodStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🍽</Text>
          ),
        }}
      />
      <Tab.Screen
        name="PreOrder"
        component={PreOrderScreen}
        options={{
          tabBarLabel: 'Pre-Order',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📅</Text>
          ),
        }}
      />
      <Tab.Screen
        name="MyOrders"
        component={OrderHistoryScreen}
        options={{
          tabBarLabel: 'My Orders',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🧾</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function ChefTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle,
        tabBarLabelStyle,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={ChefModeScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🔥</Text>
          ),
        }}
      />
      <Tab.Screen
        name="ChefProfile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { state } = useApp();
  const userProfile = state.userProfile;

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!userProfile ? (
        <>
          <RootStack.Screen name="Welcome" component={WelcomeScreen} />
          <RootStack.Screen name="CustomerSignup" component={CustomerSignupScreen} />
          <RootStack.Screen name="ChefSignup" component={ChefSignupScreen} />
        </>
      ) : userProfile.role === 'customer' ? (
        <RootStack.Screen name="CustomerTabs" component={CustomerTabs} />
      ) : (
        <RootStack.Screen name="ChefTabs" component={ChefTabs} />
      )}
    </RootStack.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}
