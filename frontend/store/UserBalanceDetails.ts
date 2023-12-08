import { create } from "zustand";

interface getUserBalanceDetailsProps {
  subTokenBalance: string;
  setSubTokenBalance: (subTokenBalance: string) => void;
}

export const getUserBalanceDetails = create<getUserBalanceDetailsProps>(
  (set) => ({
    subTokenBalance: "",
    setSubTokenBalance: (subTokenBalance: string) => set({ subTokenBalance }),
  })
);
