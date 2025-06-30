import { create } from 'zustand';

interface Vault {
  id: string;
  name: string;
  monthly_amount: number;
  start_date: string;
  total_invested: number;
  auto_debit: boolean;
}

interface VaultState {
  vaults: Vault[];
  loading: boolean;
  setVaults: (vaults: Vault[]) => void;
  addVault: (vault: Vault) => void;
  setLoading: (loading: boolean) => void;
}

export const useVaultStore = create<VaultState>((set) => ({
  vaults: [],
  loading: false,
  setVaults: (vaults) => set({ vaults }),
  addVault: (vault) => set((state) => ({ vaults: [...state.vaults, vault] })),
  setLoading: (loading) => set({ loading }),
}));