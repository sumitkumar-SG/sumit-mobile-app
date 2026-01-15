import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

const NotificationsTab = () => {
  const insets = useSafeAreaInsets();
  
  const notifications = [
    {
      id: 1,
      title: 'Welcome!',
      message: 'Thanks for joining our app',
      time: '2 hours ago',
      unread: true,
      icon: 'bell',
    },
    {
      id: 2,
      title: 'New Feature',
      message: 'Check out our latest update',
      time: '5 hours ago',
      unread: true,
      icon: 'star',
    },
    {
      id: 3,
      title: 'Reminder',
      message: 'Don\'t forget to complete your profile',
      time: '1 day ago',
      unread: false,
      icon: 'info-circle',
    },
    {
      id: 4,
      title: 'Update Available',
      message: 'A new version is ready to download',
      time: '2 days ago',
      unread: false,
      icon: 'download',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markAllRead}>Mark all as read</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="bell-slash" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                notification.unread && styles.unreadItem,
              ]}
            >
              <View style={styles.iconContainer}>
                <Icon
                  name={notification.icon}
                  size={24}
                  color={notification.unread ? '#007AFF' : '#999'}
                />
              </View>
              <View style={styles.notificationContent}>
                <Text
                  style={[
                    styles.notificationTitle,
                    notification.unread && styles.unreadTitle,
                  ]}
                >
                  {notification.title}
                </Text>
                <Text style={styles.notificationMessage}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
              {notification.unread && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  markAllRead: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  unreadItem: {
    backgroundColor: '#F8F9FF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  unreadTitle: {
    color: '#000',
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    alignSelf: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});

export default NotificationsTab;
