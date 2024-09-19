import React, { useState } from 'react';
import { TextInput, Button, Image } from 'react-native';
import { usePartyStore } from '../../store/usePartyStore';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';

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
      location: { latitude: 50.8261, longitude: 3.265 },
    };
    addParty(newParty);
    router.push('/(tabs)/index');
  };

  return (
    <ThemedView>
      <TextInput placeholder="Party Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} />
      <TextInput placeholder="Number of People" value={people} onChangeText={setPeople} keyboardType="numeric" />
      <TextInput placeholder="Drinks" value={drinks} onChangeText={setDrinks} />
      <Button title="Pick Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Button title="Add Party" onPress={handleSubmit} />
    </ThemedView>
  );
}
