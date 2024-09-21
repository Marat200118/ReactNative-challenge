//(index)/index.tsx

import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Button } from 'react-native';
import { useEventStore } from '@/store/useEventStore';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Generate random location within Kortrijk
function getRandomLocationInKortrijk() {
  const minLat = 50.82;
  const maxLat = 50.83;
  const minLng = 3.25;
  const maxLng = 3.28;

  const latitude = Math.random() * (maxLat - minLat) + minLat;
  const longitude = Math.random() * (maxLng - minLng) + minLng;

  return {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01, 
  };
}

export default function HomeScreen() {
  const randomLocation = getRandomLocationInKortrijk();
  const [region, setRegion] = useState({
    latitude: 50.8261,
    longitude: 3.265,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [storedEvents, setStoredEvents] = useState([]);
  const events = useEventStore((state) => state.events);

  useEffect(() => {

    (async () => {
      const stored = await AsyncStorage.getItem('events');
      if (stored) {
        setStoredEvents(JSON.parse(stored));
      }
    })();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        scrollEnabled={true}
        zoomEnabled={true}
        showsUserLocation={true}
        initialRegion={randomLocation}
      >
        {(events.length ? events : storedEvents).map((event) => (
          <Marker
            key={event.id}
            coordinate={event.location}
            title={event.name}
            description={event.description}
            onPress={() => router.push(`/${event.id}`)}
          />
        ))}
      </MapView>
      <ThemedView style={styles.addButtonContainer}>
        <Button
          title="Add Event"
          onPress={() => router.push('/addEvent')}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  addButtonContainer: {
    backgroundColor: 'yellow',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'black',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});
