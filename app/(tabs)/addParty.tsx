import React, { useState } from 'react';
import { TextInput, Button, Image, View, StyleSheet } from 'react-native';
import { usePartyStore } from '../../store/usePartyStore';
import * as ImagePicker from 'expo-image-picker';
import { router, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';

// Generate random location within Kortrijk for new parties
function getRandomLocationInKortrijk() {
  const minLat = 50.82;
  const maxLat = 50.83;
  const minLng = 3.25;
  const maxLng = 3.28;

  const latitude = Math.random() * (maxLat - minLat) + minLat;
  const longitude = Math.random() * (maxLng - minLng) + minLng;

  return { latitude, longitude };
}

export default function AddPartyScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [people, setPeople] = useState('');
  const [drinks, setDrinks] = useState('');
  const [image, setImage] = useState(null);

  const addParty = usePartyStore((state) => state.addParty);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleSubmit = () => {
    const newParty = {
      id: Date.now(),
      name,
      description,
      people: Number(people),
      drinks,
      image,
      location: getRandomLocationInKortrijk(),
    };
    addParty(newParty);
    router.push('/(tabs)/index');
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Add Party' }} />
      <TextInput placeholder="Party Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
      <TextInput placeholder="Number of People" value={people} onChangeText={setPeople} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Drinks" value={drinks} onChangeText={setDrinks} style={styles.input} />
      <Button title="Pick Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Add Party" onPress={handleSubmit} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderBottomWidth: 1,
    width: '100%',
    marginBottom: 12,
    padding: 8,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 16,
  },
});
