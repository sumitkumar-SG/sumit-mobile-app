/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginPage from './screens/LoginPage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import BottomTabs from './screens/BottomTabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
enableScreens();
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
    const checkAuth = async () => {
      const value = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(value === 'true');
    };

    checkAuth();
  }, []);

  if (isLoggedIn === null) {
    return <ActivityIndicator size="large" color="#0000ff" />; // or a loader
  }
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ headerShown: false }}
          initialRouteName={isLoggedIn ? "Main" : "Login"}
        >
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Main" component={BottomTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
