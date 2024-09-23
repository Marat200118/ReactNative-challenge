// (index)/[id].tsx

import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useEventStore } from '../../../store/useEventStore';
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
    router.push('/(tabs)/(index)'); // Redirect to Explore page after deleting
  };

  if (!event) {
    return <Text>Event not found!</Text>;
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ 
        title: event.name, 
        headerBackVisible: true 
      }} />
      <ThemedText style={styles.eventName}>{event.name}</ThemedText>
      {event.image ? (
        <Image source={{ uri: event.image }} style={styles.eventImage} />
      ) : (
        <ThemedText>No Image Available</ThemedText>
      )}
      <ThemedText style={styles.eventDescription}>{event.description}</ThemedText>
      <ThemedText>Number of people: {event.people}</ThemedText>
      <ThemedText>Drinks: {event.drinks}</ThemedText>
      <ThemedText>Ambience: {event.lightAmbience ? event.lightAmbience : "No information"}</ThemedText>
      {/* <ThemedText>Ambience: {event.lightLevel}</ThemedText> */}
      <ThemedText>Intensity: {event.intensity ? event.intensity : "No information"}</ThemedText>
      {/* <ThemedText>Intensity: X: {event.acceleration.x}, Y: {event.acceleration.y}, Z: {event.acceleration.z}</ThemedText> */}
      <Button title="Delete Event" onPress={handleDelete} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  eventImage: {
    width: '100%',
    height: 200,
    marginVertical: 16,
  },
  eventDescription: {
    fontSize: 16,
    marginVertical: 8,
  },
});
