import React, { useState, useEffect } from 'react';
import { TextInput, Button, Image, View, Text, StyleSheet } from 'react-native';
import { useEventStore } from '../../../store/useEventStore';
import * as ImagePicker from 'expo-image-picker';
import { Accelerometer, LightSensor } from 'expo-sensors';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

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

    // Subscribe to accelerometer
    const accelSubscription = Accelerometer.addListener((data) => {
      setAcceleration(data);
    });

    // Subscribe to light sensor
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

  // Function to calculate light ambience
  const getLightAmbience = () => {
    if (lightLevel < 100) {
      return 'Low';
    } else if (lightLevel < 500) {
      return 'Medium';
    } else {
      return 'High';
    }
  };

  // Function to calculate event intensity based on acceleration
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
      lightLevel: lightLevel ? lightLevel.toFixed(2) : null,
      acceleration: {
        x: acceleration.x.toFixed(2),
        y: acceleration.y.toFixed(2),
        z: acceleration.z.toFixed(2),
      },
      lightAmbience: getLightAmbience(), // Call the function to get light ambience
      intensity: getEventIntensity(), // Call the function to get event intensity
    };

    await addEvent(newEvent);
    router.push('/(tabs)/(index)');
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Event Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
      <TextInput placeholder="Number of People" value={people} onChangeText={setPeople} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Drinks" value={drinks} onChangeText={setDrinks} style={styles.input} />

      {/* Display the light sensor and accelerometer values */}
      <ThemedView style={styles.sensorContainer}>
        <ThemedText style={styles.sensorText}>Light Level: {lightLevel ? lightLevel.toFixed(2) : 'Loading...'}</ThemedText>
        <ThemedText>Light Ambience: {lightLevel ? getLightAmbience() : 'Loading...'}</ThemedText>
        <ThemedText style={styles.sensorText}>
          Acceleration: X: {acceleration.x.toFixed(2)}, Y: {acceleration.y.toFixed(2)}, Z: {acceleration.z.toFixed(2)}
        </ThemedText>
      </ThemedView>

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
  sensorContainer: {
    marginVertical: 12,
    padding: 10,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    width: '100%',
    textAlign: 'center',
  },
  sensorText: {
    fontSize: 16,
    marginVertical: 4,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 16,
  },
});
