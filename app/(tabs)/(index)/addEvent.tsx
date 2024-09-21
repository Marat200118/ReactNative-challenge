//(index)/addEvent.tsx

import React, { useState, useEffect } from 'react';
import { TextInput, Button, Image, View, StyleSheet } from 'react-native';
import { useEventStore } from '../../../store/useEventStore';
import * as ImagePicker from 'expo-image-picker';
import { Accelerometer, LightSensor } from 'expo-sensors';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export default function AddEventScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [people, setPeople] = useState('');
  const [drinks, setDrinks] = useState('');
  const [image, setImage] = useState(null);
  const [lightLevel, setLightLevel] = useState(null);
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [location, setLocation] = useState(null);

  const addEvent = useEventStore((state) => state.addEvent);
  const router = useRouter();

  useEffect(() => {
    // Get current location
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }
    })();

    const accelSubscription = Accelerometer.addListener((data) => {
      setAcceleration(data);
    });

    const lightSubscription = LightSensor.addListener((data) => {
      setLightLevel(data.illuminance);
    });

    // Clean up sensors on unmount
    return () => {
      accelSubscription?.remove();
      lightSubscription?.remove();
    };
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleSubmit = async () => {
    if (!location) {
      alert('Location is required');
      return;
    }

    const newEvent = {
      id: Date.now(),
      name,
      description,
      people: Number(people),
      drinks,
      image,
      location,
      lightLevel,
      acceleration,
    };

    await addEvent(newEvent);
    router.push('/(tabs)/(index)/');
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Event Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
      <TextInput placeholder="Number of People" value={people} onChangeText={setPeople} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Drinks" value={drinks} onChangeText={setDrinks} style={styles.input} />
      <Button title="Pick Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Add Event" onPress={handleSubmit} />
    </View>
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
