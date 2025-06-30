import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signUpStep: number;
  signUpData: any;
  setUser: (user: User | null) => void;
  setProfile: (profile: any) => void;
  setLoading: (loading: boolean) => void;
  setSignUpStep: (step: number) => void;
  setSignUpData: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetSignUp: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  signUpStep: 1,
  signUpData: {},
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setSignUpStep: (step) => set({ signUpStep: step }),
  setSignUpData: (data) => set((state) => ({ signUpData: { ...state.signUpData, ...data } })),
  nextStep: () => set((state) => ({ signUpStep: state.signUpStep + 1 })),
  prevStep: () => set((state) => ({ signUpStep: Math.max(1, state.signUpStep - 1) })),
  resetSignUp: () => set({ signUpStep: 1, signUpData: {} }),
}));