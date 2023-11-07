import { writable } from 'svelte/store';
import type { Recipe } from '../models/Recipe';
import type { User } from 'firebase/auth';

export const currentUser = writable<User | null>();

export const recipesStore = writable<Recipe[]>([]);
