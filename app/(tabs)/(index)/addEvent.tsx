import React, { useState, useEffect } from 'react';
import { TextInput, Button, Image, View, Text, StyleSheet } from 'react-native';
import { useEventStore } from '../../../store/useEventStore';
import * as ImagePicker from 'expo-image-picker';
import { Accelerometer, LightSensor } from 'expo-sensors';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
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
  };
}

export default function AddEventScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [people, setPeople] = useState('');
  const [drinks, setDrinks] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [lightLevel, setLightLevel] = useState(0);
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });

  const addEvent = useEventStore((state) => state.addEvent);
  const router = useRouter();

  useEffect(() => {

    const accelSubscription = Accelerometer.addListener((data) => {
      setAcceleration(data);
    });

    const lightSubscription = LightSensor.addListener((data) => {
      setLightLevel(data.illuminance);
    });

    return () => {
      accelSubscription?.remove();
      lightSubscription?.remove();
    };
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getLightAmbience = () => {
    if (lightLevel < 100) {
      return 'Low';
    } else if (lightLevel < 500) {
      return 'Medium';
    } else {
      return 'High';
    }
  };

  const getEventIntensity = () => {
    if (acceleration.x < 1 && acceleration.y < 1 && acceleration.z < 1) {
      return 'Low';
    } else if (acceleration.x < 2 && acceleration.y < 2 && acceleration.z < 2) {
      return 'Medium';
    } else {
      return 'High';
    }
  };

  const handleSubmit = async () => {
    const randomLocation = getRandomLocationInKortrijk();

    const newEvent = {
      id: Date.now(),
      name,
      description,
      people: Number(people),
      drinks,
      image: image || '',
      location: randomLocation, // Use random location within Kortrijk
      lightLevel: lightLevel ? lightLevel.toFixed(2) : null,
      acceleration: {
        x: acceleration.x.toFixed(2),
        y: acceleration.y.toFixed(2),
        z: acceleration.z.toFixed(2),
      },
      lightAmbience: getLightAmbience(),
      intensity: getEventIntensity(),
    };

    await addEvent(newEvent);
    router.push('/(tabs)/(index)');
  };

  return (
    <View style={{ 
        flex: 1, 
        padding: 16, 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
      <TextInput placeholder="Event Name" value={name} onChangeText={setName} style={{ 
          borderBottomWidth: 1, 
          width: '100%', 
          marginBottom: 12, 
          padding: 8 
        }} 
      />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={{ 
          borderBottomWidth: 1, 
          width: '100%', 
          marginBottom: 12, 
          padding: 8 
        }} 
      />
      <TextInput placeholder="Number of People" value={people} onChangeText={setPeople} keyboardType="numeric" style={{ 
          borderBottomWidth: 1, 
          width: '100%', 
          marginBottom: 12, 
          padding: 8 
        }} 
      />
      <TextInput placeholder="Drinks" value={drinks} onChangeText={setDrinks} style={{ 
          borderBottomWidth: 1, 
          width: '100%', 
          marginBottom: 12, 
          padding: 8 
        }} 
      />
      <ThemedView style={{
        marginVertical: 12, 
        padding: 10, 
        borderColor: 'grey', 
        borderWidth: 1, 
        borderRadius: 8, 
        backgroundColor: '#f9f9f9', 
        width: '100%'
      }}>
        <ThemedText style={{ fontSize: 16, marginVertical: 4 }}>
          Light Level: {lightLevel ? lightLevel.toFixed(2) : 'Loading...'}
        </ThemedText>
        <ThemedText>
          Light Ambience: {lightLevel ? getLightAmbience() : 'Loading...'}
        </ThemedText>
        <ThemedText style={{ 
          fontSize: 16, 
          marginVertical: 4 
        }}>
          Acceleration: X: {acceleration.x.toFixed(2)}, Y: {acceleration.y.toFixed(2)}, Z: {acceleration.z.toFixed(2)}
        </ThemedText>
      </ThemedView>

      <Button title="Pick Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ 
        width: 200, 
        height: 200, 
        marginVertical: 16 
      }} />}
      <Button title="Add Event" onPress={handleSubmit} />
    </View>
  );
}