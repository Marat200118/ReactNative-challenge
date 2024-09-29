import React, { useState, useEffect } from 'react';
import { TextInput, Image, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useEventStore } from '../../../store/useEventStore';
import * as ImagePicker from 'expo-image-picker';
import { Accelerometer, LightSensor } from 'expo-sensors';
import { useRouter, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

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

  const [errors, setErrors] = useState({
    name: false,
    description: false,
    people: false,
    drinks: false,
    image: false,
  });

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
      return 'Dark Atmosphere';
    } else if (lightLevel < 500) {
      return 'Dimly Lit';
    } else {
      return 'Bright Environment';
    } 
  };

  const getEventIntensity = () => {
    if (acceleration.x < 1 && acceleration.y < 1 && acceleration.z < 1) {
      return 'Peaceful';
    } else if (acceleration.x < 2 && acceleration.y < 2 && acceleration.z < 2) {
      return 'Moderate';
    } else {
      return 'Highly Active';
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      name: !name,
      description: !description,
      people: !people,
      drinks: !drinks,
      image: !image,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    const randomLocation = getRandomLocationInKortrijk();

    const newEvent = {
      id: Date.now(),
      name,
      description,
      people: Number(people),
      drinks,
      image,
      location: randomLocation,
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
    <ScrollView>
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Add Event' }} />
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16, color: '#333' }}>
          Add Your Event!
        </Text>
        
        <TextInput
          placeholder="Event Name"
          value={name}
          onChangeText={setName}
          style={[styles.input, errors.name && styles.errorInput]}
        />
        {errors.name && <Text style={styles.errorText}>Name is required</Text>}
        
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, errors.description && styles.errorInput]}
        />
        {errors.description && <Text style={styles.errorText}>Description is required</Text>}
        
        <TextInput
          placeholder="Number of People"
          value={people}
          onChangeText={setPeople}
          keyboardType="numeric"
          style={[styles.input, errors.people && styles.errorInput]}
        />
        {errors.people && <Text style={styles.errorText}>People count is required</Text>}
        
        <TextInput
          placeholder="Drinks"
          value={drinks}
          onChangeText={setDrinks}
          style={[styles.input, errors.drinks && styles.errorInput]}
        />
        {errors.drinks && <Text style={styles.errorText}>Drinks are required</Text>}

        <ThemedView style={styles.sensorContainer}>
          <ThemedText style={styles.sensorText}>
            Light Ambience: {lightLevel ? getLightAmbience() : 'Loading...'}
          </ThemedText>
          <ThemedText style={styles.sensorText}>
            Intensity: {acceleration.x ? getEventIntensity() : 'Loading...'}
          </ThemedText>
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
              The **Ambience** is determined by the light level in the area, giving you an idea of the environment’s brightness. 
            </Text>
            <Text style={{ fontSize: 14, color: '#555' }}>
              The **Intensity** is measured based on the movement and activity in the area. These metrics are derived from **accelerometer** sensor of the device.
            </Text>
          </View>
        </ThemedView>

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>Pick Image</Text>
        </TouchableOpacity>
        {errors.image && <Text style={styles.errorText}>Image is required</Text>}
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  errorInput: {
    borderBottomColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  sensorContainer: {
    marginVertical: 12,
    padding: 10,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#BCFFB2',
    width: '100%',
  },
  sensorText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginVertical: 4,
  },
  imageButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginVertical: 16,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
