//(explore)/index.tsx

import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useEventStore } from '@/store/useEventStore';
import { useRouter, Stack } from 'expo-router';

export default function ExploreScreen() {
  const events = useEventStore((state) => state.events);
  const loadEvents = useEventStore((state) => state.loadEvents);
  const router = useRouter();

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <View style={{ 
      flex: 1, 
      padding: 16 
    }}>
      <Stack.Screen options={{ 
        headerBackVisible: true 
      }} />
      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/${item.id}`)}
              style={{ 
                padding: 16, 
                backgroundColor: '#f0f0f0', 
                marginVertical: 8, 
                borderRadius: 8 
              }}
            >
              <Text style={{ 
                fontSize: 18, 
                fontWeight: 'bold' 
              }}>
                {item.name}
              </Text>
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>No events available. Add a new event!</Text>
      )}
    </View>
  );
}