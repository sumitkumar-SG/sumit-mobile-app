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

  // Firebase Initialization Verification (v22+ API)
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('🔔 [Notifications] Permission status:', authStatus);
          const token = await messaging().getToken();
          console.log('\n🚀 ========================================');
          console.log('🚀 FCM TOKEN:', token);
          console.log('🚀 ========================================\n');
        } else {
          console.log('❌ [Notifications] Permission denied');
        }
      } catch (error) {
        console.error('❌ [Notifications] Setup error:', error);
      }
    };

    setupNotifications();

    // 1. Foreground Message Handler
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('✨ [Notifications] Received in Foreground:', JSON.stringify(remoteMessage, null, 2));
      // You can add an alert or Notifee here if you want a visible popup while in foreground
    });

    // 2. Background Interaction Handler (App was open in background)
    const unsubscribeBackgroundInteraction = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('📂 [Notifications] App opened from background state:', remoteMessage.notification);
    });

    // 3. Quit State Interaction Handler (App was closed)
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('🎬 [Notifications] App opened from quit state:', remoteMessage.notification);
        }
      });

    // Listen for token refresh
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(token => {
      console.log('🔄 [Notifications] Token Refreshed:', token);
    });

    return () => {
      unsubscribeForeground();
      unsubscribeBackgroundInteraction();
      unsubscribeTokenRefresh();
    };
  }, []);

  useEffect(() => {
    const verifyFirebase = () => {
      // Make logs more visible
      console.log('\n🔥 ========================================');
      console.log('🔥 FIREBASE VERIFICATION STARTING...');
      console.log('🔥 ========================================\n');
      
      try {
        // Use getApp() from @react-native-firebase/app (v22+ modern API)
        const app = getApp();
        
        // Success: Firebase native module is initialized and accessible
        console.log('\n✅ ========================================');
        console.log('✅ [Firebase Verification] SUCCESS');
        console.log('✅ ========================================');
        console.log('   App Name:', app.name);
        console.log('   App Options:', JSON.stringify(app.options, null, 2));
        console.log('   Firebase is ready for messaging/push notifications');
        console.log('✅ ========================================\n');
      } catch (error: any) {
        // Enhanced error diagnostics
        const errorMessage = error?.message || String(error);
        const errorCode = error?.code || 'UNKNOWN';
        
        console.error('\n❌ ========================================');
        console.error('❌ [Firebase Verification] FAILED');
        console.error('❌ ========================================');
        console.error('   Error Code:', errorCode);
        console.error('   Error Message:', errorMessage);
        
        // Specific error handling
        if (errorMessage.includes("No Firebase App '[DEFAULT]' has been created")) {
          console.error('');
          console.error('🔍 DIAGNOSIS: Native module is linked, but Firebase did not auto-initialize.');
          console.error('');
          console.error('   This means:');
          console.error('   ✅ Native Firebase module IS available');
          console.error('   ❌ GoogleService-Info.plist is NOT being read by native code');
          console.error('');
          console.error('   Common causes:');
          console.error('   1. GoogleService-Info.plist not added to Xcode target');
          console.error('   2. File not included in "Copy Bundle Resources" build phase');
          console.error('   3. Build configuration issue (Debug vs Release)');
          console.error('   4. Need to rebuild native app (not just JS bundle)');
          console.error('');
          console.error('   Action required:');
          console.error('   → Open Xcode → Check GoogleService-Info.plist is in project');
          console.error('   → Verify it appears in "Copy Bundle Resources"');
          console.error('   → Clean build folder (Cmd+Shift+K)');
          console.error('   → Rebuild native app (not just Metro reload)');
        } else if (errorMessage.includes('Native module') || errorMessage.includes('not found')) {
          console.error('');
          console.error('🔍 DIAGNOSIS: Native Firebase module is not linked.');
          console.error('');
          console.error('   Action required:');
          console.error('   → Run: cd ios && pod install');
          console.error('   → Rebuild native app');
        } else {
          console.error('');
          console.error('🔍 DIAGNOSIS: Unknown Firebase initialization error.');
          console.error('   Check: 1) Native build completed, 2) Pods installed, 3) GoogleService-Info.plist added');
        }
        console.error('❌ ========================================\n');
      }
    };

    verifyFirebase();
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
