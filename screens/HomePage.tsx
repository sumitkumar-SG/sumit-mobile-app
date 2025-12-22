import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HomePage = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    // Navigate to Login screen in the parent stack navigator
    const parent = navigation.getParent();
    if (parent) {
      parent.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    }
  };
  
  
  return (
    <View style={styles.container}>
      {/* Header with Logout Button */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={() => handleLogout()}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Home! 🏠</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerSpacer: {
    flex: 1,
  },
  logoutButton: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    cursor: 'pointer',
  },
});
