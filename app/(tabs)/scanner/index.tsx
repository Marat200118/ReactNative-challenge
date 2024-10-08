import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { ThemedView } from '@/components/ThemedView';
import { useEventStore } from '@/store/useEventStore';
import { Link, Stack } from 'expo-router';

const { width } = Dimensions.get('window');

interface Event {
  id: string;
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export default function ScannerScreen() {
  const [magnetometer, setMagnetometer] = useState(0);
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [closeEvents, setCloseEvents] = useState<Event[]>([]); // Track multiple close events
  const events = useEventStore((state) => state.events); 
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    // Get user location
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation(loc.coords); // Store user coordinates
      }
    })();

    const subscription = Magnetometer.addListener((data) => {
      const angle = calculateAngle(data);
      setMagnetometer(angle);

      Animated.timing(rotateAnim, {
        toValue: angle,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Calculate angle from magnetometer data - took from ChatGPT
  const calculateAngle = (data: { x: number; y: number }) => {
    let { x, y } = data;
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    if (angle < 0) {
      angle = 360 + angle;
    }
    return angle;
  };

  // Calculate bearing between two coordinates (user and event) took from https://gist.github.com/brjann/57b5f56dc2973b8d6e5a
  const calculateBearing = (userCoords: Location.LocationObjectCoords, eventCoords: { latitude: number; longitude: number }) => {
    const { latitude: lat1, longitude: lon1 } = userCoords;
    const { latitude: lat2, longitude: lon2 } = eventCoords;

    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const y = Math.sin(dLon) * Math.cos(lat2 * (Math.PI / 180));
    const x = Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
      Math.sin(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.cos(dLon);

    let bearing = Math.atan2(y, x) * (180 / Math.PI);
    bearing = (bearing + 360) % 360;
    return bearing;
  };

  useEffect(() => {
    if (userLocation) {
      const nearbyEvents: Event[] = [];
      events.forEach((event) => {
        const eventDirection = calculateBearing(userLocation, event.location);
        const tolerance = 15; // Allow a 15-degree margin

        if (Math.abs(magnetometer - eventDirection) < tolerance) {
          nearbyEvents.push(event);
        }
      });

      setCloseEvents(nearbyEvents);
    }
  }, [magnetometer, userLocation, events]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ThemedView style={{ display: 'flex', flex: 1, justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#1c1c1c' }}>
      <Stack.Screen options={{ 
        title: 'Scanner',
      }} />
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: width * 0.4,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}>
        <Animated.View
          style={{
            width: width * 0.3,
            height: width * 0.3,
            borderRadius: width * 0.2,
            backgroundColor: '#fff',
            transform: [{ rotate: rotateInterpolate }],
          }}
        />
      </View>
      <Text style={{ marginTop: 20, color: '#fff', fontSize: 20 }}>{`Angle: ${Math.round(magnetometer)}°`}</Text>
      <Text style={{ marginTop: 10, color: '#fff', fontSize: 16 }}>Turn around to find the direction of the events!</Text>
      {closeEvents.length > 0 ? (

        closeEvents.map((event) => (
          <Link key={event.id} href={`/${event.id}`}>
            <ThemedView style={styles.eventCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.eventName}>{event.name}</Text>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.descriptionLabel}>Description:</Text>
                <Text style={styles.eventDescription}>{event.description}</Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.eventInfo}>Tap for more details</Text>
              </View>
            </ThemedView>
          </Link>
        ))
      ) : (
        <Text style={styles.noEventsText}>No events in this direction</Text>
      )}
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  eventCard: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#BCCB3B',
    borderRadius: 12,
    alignItems: 'center',
    width: width * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    transition: 'all 0.3s ease',
  },
  cardHeader: {
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContent: {
    marginBottom: 15,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  cardFooter: {
    marginTop: 10,
    alignItems: 'center',
  },
  eventInfo: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: '600',
  },
  noEventsText: {
    marginTop: 20,
    color: '#F39C18',
    fontSize: 16,
  },
});
