//(explore)/index.tsx

import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
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
        title: 'Explore',
        headerBackVisible: true 
      }} />
      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/explore/${item.id}`)}
              style={{
                flexDirection: 'row',
                padding: 16,
                backgroundColor: '#fff',
                marginVertical: 8,
                borderRadius: 10,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowOffset: { width: 0, height: 1 },
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              {item.image && (
                <Image 
                  source={{ uri: item.image }}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 8,
                    marginRight: 16,
                  }}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: 'bold', 
                  marginBottom: 4,
                  color: '#333' 
                }}>
                  {item.name}
                </Text>
                <Text style={{ color: '#777', marginBottom: 8 }}>
                  {item.description}
                </Text>
                <Text style={{ color: '#555', fontSize: 14 }}>
                  {`People: ${item.people || 'Unknown'} • Drinks: ${item.drinks || 'Unknown'}`}
                </Text>
                <Text style={{ color: '#555', fontSize: 14 }}>
                  {`Ambience: ${item.lightAmbience || 'N/A'} • Intensity: ${item.intensity || 'N/A'}`}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 18, color: '#777' }}>
          No events available. Add a new event!
        </Text>
      )}
    </View>
  );
}