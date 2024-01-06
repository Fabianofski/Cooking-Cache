import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';

export const currentUser = writable<User | null>();

export type LoadingState = 'LOADING' | 'NOUSER' | 'FINISHED';
export const loadingStateStore = writable<LoadingState>('LOADING');
