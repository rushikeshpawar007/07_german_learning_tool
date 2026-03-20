import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export type LearningMode = 'practice' | 'explore' | 'review';

interface LearningModeContextValue {
  mode: LearningMode;
  setMode: (mode: LearningMode) => void;
}

const LearningModeContext = createContext<LearningModeContextValue | null>(null);

export function LearningModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<LearningMode>('explore');

  const setMode = useCallback((newMode: LearningMode) => {
    setModeState(newMode);
  }, []);

  return (
    <LearningModeContext.Provider value={{ mode, setMode }}>
      {children}
    </LearningModeContext.Provider>
  );
}

export function useLearningMode(): LearningModeContextValue {
  const context = useContext(LearningModeContext);
  if (!context) {
    throw new Error('useLearningMode must be used within a LearningModeProvider');
  }
  return context;
}
