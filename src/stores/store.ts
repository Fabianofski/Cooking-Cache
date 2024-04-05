import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';
import type WeeklyPlan from '../models/WeeklyPlan';

export const currentUser = writable<User | null>();

export type LoadingState = 'LOADING' | 'NOUSER' | 'FINISHED';
export const loadingStateStore = writable<LoadingState>('LOADING');

export const weeklyPlanStore = writable<WeeklyPlan | null>();
export const weeklyPlanLoadingStore = writable<LoadingState>('LOADING');
