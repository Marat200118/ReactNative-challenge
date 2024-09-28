import React, { useState, useEffect } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Image, Button } from 'react-native';
import { useEventStore } from '@/store/useEventStore';
import { router, Stack, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';

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
  const loadEvents = useEventStore((state) => state.loadEvents);
  const router = useRouter();
  // console.log('events', events);

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: 'Home page' }} />
      <MapView
        style={{ width: '100%', height: '100%' }}
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
          >
            <Callout
              tooltip={true}
              onPress={() => router.push(`/${event.id}`)}
            >
              <View style={styles.markerContainer}>
                {(event.image) && (
                  <Image
                    source={{uri: event.image}} 
                    style={styles.markerImage}
                  />
                )}
                {/* <Image
                  source={{uri: event.image}} 
                  style={styles.markerImage}
                /> */}
                <View style={styles.markerTextContainer}>
                  <ThemedText style={styles.markerText}>
                    {event.name}
                  </ThemedText>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <ThemedView style={styles.addButtonContainer}>
        <Button title="Add Event" onPress={() => router.push('/addEvent')} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    elevation: 5,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    transform: [{ scale: 0.8 }],
  },
  markerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  markerTextContainer: {
    backgroundColor: '#ff6347', // Tomato color
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
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
