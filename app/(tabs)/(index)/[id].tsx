import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useEventStore } from '../../../store/useEventStore';
import { useRouter } from 'expo-router';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const event = useEventStore((state) =>
    state.events.find((p) => p.id === Number(id))
  );
  const deleteEvent = useEventStore((state) => state.deleteEvent);
  const router = useRouter();

  const handleDelete = async () => {
    await deleteEvent(Number(id));
    router.push('/(tabs)/(explore)/(index)'); // Redirect to Explore page after deleting
  };

  if (!event) {
    return <Text>Event not found!</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: event.name, 
        headerBackVisible: true 
      }} />
      <Text style={styles.eventName}>{event.name}</Text>
      <Image source={{ uri: event.image }} style={styles.eventImage} />
      <Text style={styles.eventDescription}>{event.description}</Text>
      <Text>Number of people: {event.people}</Text>
      <Text>Drinks: {event.drinks}</Text>
      <Text>Ambience: {event.lightLevel}</Text>
      <Text>Intensity: X: {event.acceleration.x}, Y: {event.acceleration.y}, Z: {event.acceleration.z}</Text>
      <Button title="Delete Event" onPress={handleDelete} />
    </View>
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
