import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { usePartyStore } from '../../store/usePartyStore';

export default function PartyDetailScreen() {
  const { id } = useLocalSearchParams();
  const party = usePartyStore((state) =>
    state.parties.find((p) => p.id === Number(id))
  );

  if (!party) {
    return <Text>Party not found!</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.partyName}>{party.name}</Text>
      <Image source={{ uri: party.image }} style={styles.partyImage} />
      <Text style={styles.partyDescription}>{party.description}</Text>
      <Text>Number of people: {party.people}</Text>
      <Text>Drinks: {party.drinks}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  partyName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  partyImage: {
    width: '100%',
    height: 200,
    marginVertical: 16,
  },
  partyDescription: {
    fontSize: 16,
    marginVertical: 8,
  },
});
