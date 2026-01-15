import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

const SettingsTab = () => {
  const insets = useSafeAreaInsets();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: 'user', label: 'Edit Profile', action: () => {} },
        { icon: 'lock', label: 'Privacy & Security', action: () => {} },
        { icon: 'key', label: 'Change Password', action: () => {} },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'bell',
          label: 'Notifications',
          action: null,
          toggle: true,
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: 'moon-o',
          label: 'Dark Mode',
          action: null,
          toggle: true,
          value: darkMode,
          onToggle: setDarkMode,
        },
        { icon: 'language', label: 'Language', action: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'question-circle', label: 'Help Center', action: () => {} },
        { icon: 'file-text', label: 'Terms of Service', action: () => {} },
        { icon: 'shield', label: 'Privacy Policy', action: () => {} },
      ],
    },
    {
      title: 'About',
      items: [
        { icon: 'info-circle', label: 'App Version', value: '1.0.0', action: null },
        { icon: 'code', label: 'About Us', action: () => {} },
      ],
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={styles.settingItem}
                  onPress={item.action || undefined}
                  disabled={!item.action && !item.toggle}
                >
                  <View style={styles.settingLeft}>
                    <Icon name={item.icon} size={20} color="#666" style={styles.settingIcon} />
                    <Text style={styles.settingLabel}>{item.label}</Text>
                  </View>
                  <View style={styles.settingRight}>
                    {item.toggle ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
                        thumbColor="#FFFFFF"
                      />
                    ) : item.value ? (
                      <Text style={styles.settingValue}>{item.value}</Text>
                    ) : (
                      <Icon name="chevron-right" size={16} color="#CCC" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#000',
  },
  settingRight: {
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#999',
  },
});

export default SettingsTab;
