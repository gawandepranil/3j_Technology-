import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/theme/tokens';
import { Platform, View, StyleSheet } from 'react-native';

export default function ClientLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#070b13',
          borderTopColor: '#1e293b',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      {/* Services */}
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'construct' : 'construct-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Mission */}
      <Tabs.Screen
        name="mission"
        options={{
          title: 'Mission',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'rocket' : 'rocket-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Vision */}
      <Tabs.Screen
        name="vision"
        options={{
          title: 'Vision',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'eye' : 'eye-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Why Us */}
      <Tabs.Screen
        name="whyus"
        options={{
          title: 'Why Us',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'star' : 'star-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Contact */}
      <Tabs.Screen
        name="contact"
        options={{
          title: 'Contact',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'mail' : 'mail-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Hidden screens (still accessible via navigation but not in tab bar) */}
      <Tabs.Screen
        name="dashboard"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="meetings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="submit-requirement"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
