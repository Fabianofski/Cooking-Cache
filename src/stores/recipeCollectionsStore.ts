import { writable } from 'svelte/store';
import type { RecipeCollections } from '../models/RecipeCollections';

export const recipeCollectionsStore = writable<RecipeCollections>({});
