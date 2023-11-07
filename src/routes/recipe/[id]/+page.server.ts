import { error } from '@sveltejs/kit';
import { recipesStore } from '../../../stores/store.js';
import type { Recipe } from '../../../models/Recipe.js';

export function load({ params }) {
	return {
		id: params.id
	};
}
