import { create } from 'zustand';
import type { GTMStrategy } from "@/types/gtm";

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  base64: string;
  mimeType: string;
}

type Phase = "input" | "loading" | "result" | "error";

interface LaunchEngineState {
  productFiles: UploadedFile[];
  setProductFiles: (files: UploadedFile[]) => void;
  buyers: any[];
  setBuyers: (buyers: any[]) => void;
  selectedStartupId: string;
  setSelectedStartupId: (id: string) => void;
  
  // GTM Engine State
  gtmPhase: Phase;
  setGtmPhase: (phase: Phase) => void;
  gtmStrategy: GTMStrategy | null;
  setGtmStrategy: (strategy: GTMStrategy | null) => void;
}

export const useLaunchEngineStore = create<LaunchEngineState>((set) => ({
  productFiles: [],
  setProductFiles: (files) => set({ productFiles: files }),
  buyers: [],
  setBuyers: (buyers) => set({ buyers }),
  selectedStartupId: "",
  setSelectedStartupId: (id) => set({ selectedStartupId: id }),
  
  gtmPhase: "input",
  setGtmPhase: (phase) => set({ gtmPhase: phase }),
  gtmStrategy: null,
  setGtmStrategy: (strategy) => set({ gtmStrategy: strategy }),
}));
