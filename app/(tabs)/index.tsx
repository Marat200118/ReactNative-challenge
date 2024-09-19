import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Button } from 'react-native';
import { usePartyStore } from '../../store/usePartyStore';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';


// Generate random location within Kortrijk
function getRandomLocationInKortrijk() {
  const minLat = 50.82;
  const maxLat = 50.83;
  const minLng = 3.25;
  const maxLng = 3.28;

  const latitude = Math.random() * (maxLat - minLat) + minLat;
  const longitude = Math.random() * (maxLng - minLng) + minLng;

  return { latitude, longitude };
}

export default function HomeScreen() {
  const randomLocation = getRandomLocationInKortrijk();
  const [region, setRegion] = useState({
    latitude: 50.8261,
    longitude: 3.265,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const parties = usePartyStore((state) => state.parties);

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
        {parties.map((party) => (
          <Marker
            key={party.id}
            coordinate={party.location}
            title={party.name}
            description={party.description}
            onPress={() => router.push(`/${party.id}`)}
          />
        ))}
      </MapView>
      <ThemedView style={styles.addButtonContainer}>
        <Button
          title="Add Party"
          onPress={() => router.push('/addParty')}
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
