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
import SplashScreen from 'react-native-splash-screen';
import { getApp } from '@react-native-firebase/app';
import messaging, { AuthorizationStatus } from '@react-native-firebase/messaging';
import { Platform } from 'react-native';



const Stack = createNativeStackNavigator();
enableScreens();
function App() {
  const [authToken, setAuthToken] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
    const checkAuth = async () => {
      const value = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(value === 'true');
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setAuthToken(token);
    };
  
    checkAuth();
  }, []);
  
  // useEffect(() => {
  //   const initializeFirebase = async () => {
  //     try {
  //       // Use getApp() from @react-native-firebase/app (v22+ API)
  //       const app = getApp();
  //       console.log('✅ Firebase initialized:', app.name);
        
  //       // On iOS, register device for remote messages FIRST (before requesting permissions)
  //       if (Platform.OS === 'ios') {
  //         try {
  //           await messaging().registerDeviceForRemoteMessages();
  //           console.log('✅ Device registered for remote messages');
  //         } catch (regError) {
  //           console.log('⚠️ Device registration warning:', regError);
  //           // Continue even if registration fails (might already be registered)
  //         }
  //       }
        
  //       // Request notification permissions using v22+ API
  //       const authStatus = await messaging().requestPermission();
  //       const enabled =
  //         authStatus === AuthorizationStatus.AUTHORIZED ||
  //         authStatus === AuthorizationStatus.PROVISIONAL;

  //       if (enabled) {
  //         // Get FCM token using v22+ API
  //         // Add a small delay to ensure registration is complete
  //         await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  //         const token = await messaging().getToken();
  //         console.log('🔥 Firebase FCM Token:', token);
  //       } else {
  //         console.log('⚠️ Notification permissions not granted');
  //       }
  //     } catch (error) {
  //       console.error('❌ Firebase initialization error:', error);
  //     }
  //   };
  
  //   initializeFirebase();
  // }, []);
  
  

  if (isLoggedIn === null) {
    return <ActivityIndicator size="large" color="#0000ff" />; // or a loader
  }
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ headerShown: false }}
          initialRouteName={authToken ? "Main" : "Login"}
        >
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Main" component={BottomTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
