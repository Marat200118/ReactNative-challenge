// (index)/[id].tsx

import React from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity } from 'react-native';
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
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f9f9f9' }}>
      <Stack.Screen options={{ 
        title: event.name, 
        headerBackVisible: true 
      }} />

      <Text style={{ 
        fontSize: 28, 
        fontWeight: 'bold', 
        marginBottom: 16, 
        color: '#333' 
      }}>
        {event.name}
      </Text>

      {event.image ? (
        <Image source={{ uri: event.image }} style={{ 
          width: '100%', 
          height: 220, 
          borderRadius: 12, 
          marginBottom: 16 
        }} />
      ) : (
        <Text style={{ 
          color: '#777', 
          fontStyle: 'italic', 
          marginBottom: 16 
        }}>
          No Image Available
        </Text>
      )}

      <Text style={{ 
        fontSize: 18, 
        color: '#555', 
        marginBottom: 8 
      }}>
        <Ionicons name="information-circle-outline" size={18} color="#555" /> {event.description}
      </Text>

      <Text style={{ 
        fontSize: 18, 
        color: '#555', 
        marginBottom: 8 
      }}>
        <Ionicons name="people-outline" size={18} color="#555" /> Number of people: {event.people}
      </Text>

      <Text style={{ 
        fontSize: 18, 
        color: '#555', 
        marginBottom: 8 
      }}>
        <Ionicons name="beer-outline" size={18} color="#555" /> Drinks: {event.drinks}
      </Text>

      <Text style={{ 
        fontSize: 18, 
        color: event.lightAmbience === 'Low' ? '#FF6F61' : event.lightAmbience === 'Medium' ? '#FFD700' : '#32CD32', 
        marginBottom: 8 
      }}>
        <Ionicons name="sunny-outline" size={18} color="#555" /> Ambience: {event.lightAmbience ? event.lightAmbience : "No information"}
      </Text>

      <Text style={{ 
        fontSize: 18, 
        color: event.intensity === 'Low' ? '#FF6F61' : event.intensity === 'Medium' ? '#FFD700' : '#32CD32', 
        marginBottom: 16 
      }}>
        <Ionicons name="pulse-outline" size={18} color="#555" /> Intensity: {event.intensity ? event.intensity : "No information"}
      </Text>

      <TouchableOpacity
        style={{ 
          backgroundColor: '#FF5252', 
          paddingVertical: 12, 
          borderRadius: 8, 
          alignItems: 'center' 
        }}
        onPress={handleDelete}
      >
        <Ionicons name="trash-outline" size={22} color="#fff" />
        <Text style={{ color: '#fff', fontSize: 16, marginTop: 4 }}>Delete Event</Text>
      </TouchableOpacity>
    </View>
  );
}
