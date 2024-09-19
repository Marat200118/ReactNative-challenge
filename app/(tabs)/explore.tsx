import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { usePartyStore } from '../../store/usePartyStore';
import { router } from 'expo-router';

export default function ExploreScreen() {
  const parties = usePartyStore((state) => state.parties);

  return (
    <View style={styles.container}>
      <FlatList
        data={parties}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/details/${item.id}`)}
            style={styles.partyItem}
          >
            <Text style={styles.partyName}>{item.name}</Text>
            <Text>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  partyItem: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
    borderRadius: 8,
  },
  partyName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
