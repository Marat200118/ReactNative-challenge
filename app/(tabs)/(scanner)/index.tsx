import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Alert } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { ThemedView } from '@/components/ThemedView';
import { useEventStore } from '@/store/useEventStore';
import { Link } from 'expo-router';

const { width, height } = Dimensions.get('window');

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
  const [closeEvent, setCloseEvent] = useState<Event | null>(null);

  const events = useEventStore((state) => state.events); // Get events from store
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

    // Subscribe to the Magnetometer
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

  // Calculate angle from magnetometer data, took from ChatGPT
  const calculateAngle = (data: { x: number; y: number; z: number }) => {
    let { x, y, z } = data;
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    if (angle < 0) {
      angle = 360 + angle;
    }
    return angle;
  };

  // Calculate bearing between two coordinates (user and event) took from ChatGPT
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
      events.forEach((event) => {
        const eventDirection = calculateBearing(userLocation, event.location);
        const tolerance = 15;

        if (Math.abs(magnetometer - eventDirection) < tolerance) {
          setCloseEvent(event);
          return;
        } else {
          setCloseEvent(null);
        }
      });
    }
  }, [magnetometer, userLocation, events]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1c1c1c' }}>
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

      {closeEvent && (
        <Link href={`/${closeEvent.id}`}>
          <ThemedView style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 8,
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{`You're pointing at: ${closeEvent.name}`}</Text>
            <Text>{closeEvent.description}</Text>
          </ThemedView>
        </Link>
      )}
    </ThemedView>
  );
}

