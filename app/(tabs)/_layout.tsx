import { Tabs } from 'expo-router';
import { Home, Search, Calendar, Heart, User } from '@tamagui/lucide-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#B9A2E1',
        tabBarInactiveTintColor: '#8B8B8B',
        tabBarStyle: {
          backgroundColor: '#1A0E2E',
          borderTopColor: '#3D2657',
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <Home size={focused ? 26 : 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => <Search size={focused ? 26 : 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, focused }) => <Calendar size={focused ? 26 : 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, focused }) => <Heart size={focused ? 26 : 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => <User size={focused ? 26 : 22} color={color} />,
        }}
      />
    </Tabs>
  );
}
