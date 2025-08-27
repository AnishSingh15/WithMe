import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import workoutSlice from './slices/workoutSlice';
import exerciseSlice from './slices/exerciseSlice';
import timerSlice from './slices/timerSlice';
import calorieSlice from './slices/calorieSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    workouts: workoutSlice,
    exercises: exerciseSlice,
    timer: timerSlice,
    calories: calorieSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
