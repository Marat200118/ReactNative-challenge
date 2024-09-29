import React from 'react';
import { Text, Image, TouchableOpacity, ScrollView } from 'react-native';
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
      <ThemedView style={{ flex: 1, padding: 16, backgroundColor: '#f9f9f9' }}>
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

        <ThemedView style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', padding: 10, backgroundColor: '#f9f9f9' }}>
          <ThemedText style={{ fontSize: 18, color: '#555', marginBottom: 8 }}>
            <Ionicons name="information-circle-outline" size={18} color="#555" /> <Text style={{fontWeight: '600'}}>{event.description}</Text>
          </ThemedText>

          <ThemedText style={{ fontSize: 18, color: '#555', marginBottom: 8 }}>
            <Ionicons name="people-outline" size={18} color="#555" /> Number of people: <Text style={{fontWeight: '600'}}>{event.people}</Text>
          </ThemedText>

          <ThemedText style={{ fontSize: 18, color: '#555', marginBottom: 8 }}>
            <Ionicons name="beer-outline" size={18} color="#555" />Drinks: <Text style={{fontWeight: '600'}}>{event.drinks}</Text>
          </ThemedText>

          <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, backgroundColor: '#f9f9f9' }}>
            <ThemedView style={{ 
              flex: 1, 
              flexDirection: 'row', 
              alignItems: 'center', 
              padding: 12, 
              borderRadius: 8, 
              backgroundColor: event.lightAmbience === 'Dark Atmosphere' ? '#00052D' : event.lightAmbience === 'Dimly Lit' ? '#BED300' : '#32CD32',
              marginRight: 10,
            }}>
              <Ionicons name="sunny-outline" size={18} color="#fff" />
              <ThemedText style={{ fontSize: 12, color: '#fff', marginLeft: 4 }}>Ambience: {event.lightAmbience}</ThemedText>
            </ThemedView>

            <ThemedView style={{ 
              flex: 1, 
              flexDirection: 'row', 
              alignItems: 'center', 
              padding: 12, 
              borderRadius: 8,
              backgroundColor: event.intensity === 'Peaceful' ? '#475CFF' : event.intensity === 'Moderate' ? '#BED300' : '#32CD32',
            }}>
              <Ionicons name="pulse-outline" size={18} color="#fff" />
              <ThemedText style={{ fontSize: 12, color: '#fff', marginLeft: 4 }}>Intensity: {event.intensity}</ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={{ marginTop: 12 }}>
            <ThemedText style={{ fontSize: 14, color: '#555', marginBottom: 4, backgroundColor: '#f9f9f9' }}>
              The **Ambience** is determined by the light level in the area, giving you an idea of the environment’s brightness. 
            </ThemedText>
            <ThemedText style={{ fontSize: 14, color: '#555', backgroundColor: '#f9f9f9' }}>
              The **Intensity** is measured based on the movement and activity in the area. These metrics are derived from **accelerometer** sensor of the device.
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16, backgroundColor: '#f9f9f9'}}>
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
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}