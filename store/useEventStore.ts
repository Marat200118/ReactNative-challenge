import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Event = {
  id: number;
  name: string;
  description: string;
  people: number;
  drinks: string;
  image: string;
  location: { latitude: number, longitude: number };
  lightLevel: number;
  lightAmbience: string;
  intensity: string;
  acceleration: { x: number, y: number, z: number };
};

interface EventState {
  events: Event[];
  addEvent: (event: Event) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
  loadEvents: () => Promise<void>;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],

  addEvent: async (event) => {
    const storedEvents = await AsyncStorage.getItem('events');
    const events = storedEvents ? JSON.parse(storedEvents) : [];
    const newEvents = [...events, event];

    await AsyncStorage.setItem('events', JSON.stringify(newEvents));
    set({ events: newEvents });
  },

  deleteEvent: async (id) => {
    const storedEvents = await AsyncStorage.getItem('events');
    const events = storedEvents ? JSON.parse(storedEvents) : [];
    const updatedEvents = events.filter((event: Event) => event.id !== id);

    await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
    set({ events: updatedEvents });
  },

  loadEvents: async () => {
    const storedEvents = await AsyncStorage.getItem('events');
    set({ events: storedEvents ? JSON.parse(storedEvents) : [] });
  }
}));
