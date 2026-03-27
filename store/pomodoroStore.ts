import { create } from 'zustand';

export type AppStatus = 'Idle' | 'Focusing' | 'Paused' | 'Break';
export type IntervalMode = 'Quiet Time' | 'Peak Hours';
export type TaskCategory = 'Clinical Work' | 'Inventory Management' | 'Administrative Tasks' | 'Academic/RPA Monitoring';

export interface InterruptionLog {
  id: string;
  type: string;
  timestamp: number;
}

interface PomodoroState {
  status: AppStatus;
  intervalMode: IntervalMode;
  timeLeft: number;
  currentCategory: TaskCategory;
  pomodorosCompleted: number;
  categoryLogs: Record<TaskCategory, number>;
  serveLogs: InterruptionLog[];
  userName: string;
  
  // Actions
  setIntervalMode: (mode: IntervalMode) => void;
  setCategory: (category: TaskCategory) => void;
  setUserName: (name: string) => void;
  startFocus: () => void;
  pauseForCustomer: (interruptionType?: string) => void;
  resumeFocus: () => void;
  skipToBreak: () => void;
  finishPomodoro: () => void;
  tick: () => void;
  resetTimer: () => void;
}

const GET_DURATION = (mode: IntervalMode, status: AppStatus) => {
  if (mode === 'Quiet Time') {
    return status === 'Break' ? 5 * 60 : 25 * 60;
  }
  return status === 'Break' ? 3 * 60 : 15 * 60;
};

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  status: 'Idle',
  intervalMode: 'Quiet Time',
  timeLeft: 25 * 60,
  currentCategory: 'Clinical Work',
  pomodorosCompleted: 0,
  categoryLogs: {
    'Clinical Work': 0,
    'Inventory Management': 0,
    'Administrative Tasks': 0,
    'Academic/RPA Monitoring': 0,
  },
  serveLogs: [],
  userName: 'วิรุณ',

  setUserName: (name) => set({ userName: name }),

  setIntervalMode: (mode) => {
    const { status } = get();
    if (status === 'Idle') {
      set({ intervalMode: mode, timeLeft: GET_DURATION(mode, 'Focusing') });
    } else {
      set({ intervalMode: mode });
    }
  },

  setCategory: (category) => set({ currentCategory: category }),

  startFocus: () => {
    const { status, intervalMode } = get();
    if (status === 'Idle' || status === 'Break') {
      set({ status: 'Focusing', timeLeft: GET_DURATION(intervalMode, 'Focusing') });
    } else if (status === 'Paused') {
      set({ status: 'Focusing' }); // Resume
    }
  },

  pauseForCustomer: (interruptionType = 'General') => {
    const { status, serveLogs } = get();
    if (status === 'Focusing') {
      set({
        status: 'Paused',
        serveLogs: [
          ...serveLogs,
          { id: Math.random().toString(), type: interruptionType, timestamp: Date.now() },
        ],
      });
    }
  },

  resumeFocus: () => set({ status: 'Focusing' }),

  skipToBreak: () => {
    const { intervalMode } = get();
    set({ status: 'Break', timeLeft: GET_DURATION(intervalMode, 'Break') });
  },

  finishPomodoro: () => {
    const { currentCategory, categoryLogs, pomodorosCompleted, intervalMode } = get();
    set({
      status: 'Break',
      timeLeft: GET_DURATION(intervalMode, 'Break'),
      pomodorosCompleted: pomodorosCompleted + 1,
      categoryLogs: {
        ...categoryLogs,
        [currentCategory]: categoryLogs[currentCategory] + 1,
      },
    });
  },

  tick: () => {
    const { status, timeLeft, finishPomodoro, resetTimer } = get();
    if (status === 'Focusing' || status === 'Break') {
      if (timeLeft > 0) {
        set({ timeLeft: timeLeft - 1 });
      } else {
        if (status === 'Focusing') {
          finishPomodoro();
        } else if (status === 'Break') {
          resetTimer();
        }
      }
    }
  },

  resetTimer: () => {
    const { intervalMode } = get();
    set({ status: 'Idle', timeLeft: GET_DURATION(intervalMode, 'Focusing') });
  },
}));
