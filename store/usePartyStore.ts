import { create } from 'zustand';

type Party = {
  id: number;
  name: string;
  location: { latitude: number; longitude: number };
  description: string;
  people: number;
  drinks: string;
  image: string;
};

interface PartyState {
  parties: Party[];
  addParty: (party: Party) => void;
}

export const usePartyStore = create<PartyState>((set) => ({
  parties: [],
  addParty: (party) => set((state) => ({
    parties: [...state.parties, party]
  })),
}));
