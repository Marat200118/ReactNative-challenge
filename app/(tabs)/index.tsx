import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Button } from 'react-native';
import { usePartyStore } from '../../store/usePartyStore';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [region, setRegion] = useState({
    latitude: 50.8261, // Kortrijk's latitude
    longitude: 3.265,  // Kortrijk's longitude
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const parties = usePartyStore((state) => state.parties);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        {parties.map((party) => (
          <Marker
            key={party.id}
            coordinate={party.location}
            title={party.name}
            description={party.description}
            onPress={() => router.push(`/details/${party.id}`)}
          />
        ))}
      </MapView>
      <View style={styles.addButtonContainer}>
        <Button
          title="Add Party"
          onPress={() => router.push('/addParty')}
        />
      </View>
    </View>
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
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});
