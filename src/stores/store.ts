import { writable } from 'svelte/store';
import type { RecipeCollections } from '../models/RecipeCollections';
import type { User } from 'firebase/auth';

export const currentUser = writable<User | null>();

export const recipesStore = writable<RecipeCollections>({});
