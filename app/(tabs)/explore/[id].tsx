// (index)/[id].tsx

import React from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useEventStore } from '../../../store/useEventStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function EventDetailScreen() {

  const { id } = useLocalSearchParams();
  const event = useEventStore((state) =>
    state.events.find((p) => p.id === Number(id))
  );
  const deleteEvent = useEventStore((state) => state.deleteEvent);
  const router = useRouter();

  const handleDelete = async () => {
    await deleteEvent(Number(id));
    router.push('/(tabs)/(index)');
  };

  if (!event) {
    return <Text>Event not found!</Text>;
  }

    return (
    <ScrollView>
      <View style={{ flex: 1, padding: 16, backgroundColor: '#f9f9f9' }}>
        <Stack.Screen options={{ title: event.name, headerBackVisible: true }} />

        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16, color: '#333' }}>
          {event.name}
        </Text>

        {event.image ? (
          <Image 
            source={{ uri: event.image }} 
            style={{ width: '100%', height: 220, borderRadius: 12, marginBottom: 16 }} 
          />
        ) : (
          <Text style={{ color: '#777', fontStyle: 'italic', marginBottom: 16 }}>
            No Image Available
          </Text>
        )}

        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
          <Text style={{ fontSize: 18, color: '#555', marginBottom: 8 }}>
            <Ionicons name="information-circle-outline" size={18} color="#555" /> <Text style={{fontWeight: '600'}}>{event.description}</Text>
          </Text>

          <Text style={{ fontSize: 18, color: '#555', marginBottom: 8 }}>
            <Ionicons name="people-outline" size={18} color="#555" /> Number of people: <Text style={{fontWeight: '600'}}>{event.people}</Text>
          </Text>

          <Text style={{ fontSize: 18, color: '#555', marginBottom: 8 }}>
            <Ionicons name="beer-outline" size={18} color="#555" />Drinks: <Text style={{fontWeight: '600'}}>{event.drinks}</Text>
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <View style={{ 
              flex: 1, 
              flexDirection: 'row', 
              alignItems: 'center', 
              padding: 12, 
              borderRadius: 8, 
              backgroundColor: event.lightAmbience === 'Low' ? '#FF6F61' : event.lightAmbience === 'Medium' ? '#BED300' : '#32CD32',
              marginRight: 10,
            }}>
              <Ionicons name="sunny-outline" size={24} color="#fff" />
              <Text style={{ fontSize: 16, color: '#fff', marginLeft: 8 }}>Ambience: {event.lightAmbience}</Text>
            </View>

            <View style={{ 
              flex: 1, 
              flexDirection: 'row', 
              alignItems: 'center', 
              padding: 12, 
              borderRadius: 8,
              backgroundColor: event.intensity === 'Low' ? '#FF6F61' : event.intensity === 'Medium' ? '#BED300' : '#32CD32',
            }}>
              <Ionicons name="pulse-outline" size={24} color="#fff" />
              <Text style={{ fontSize: 16, color: '#fff', marginLeft: 8 }}>Intensity: {event.intensity}</Text>
            </View>
          </View>

          <View style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
              The **Ambience** is determined by the light level in the area, giving you an idea of the environment’s brightness. 
            </Text>
            <Text style={{ fontSize: 14, color: '#555' }}>
              The **Intensity** is measured based on the movement and activity in the area. These metrics are derived from **accelerometer** sensor of the device.
            </Text>
          </View>

        </View>

        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16 }}>
          <TouchableOpacity
            style={{ 
              backgroundColor: '#D30004', 
              paddingVertical: 12, 
              borderRadius: 8,
              marginTop: 16, 
              width: 100,
              alignItems: 'center',
            }}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}