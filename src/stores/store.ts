import { writable } from 'svelte/store';
import type { Recipe } from '../models/Recipe';

export const recipesStore = writable<Recipe[]>([
	{
		title: 'Burger',
		tags: ['Mittag', 'Abend'],
		description: 'Saftig knaftig',
		image:
			'https://ais.kochbar.de/kbrezept/284621_878966/24-05goci/600x450/254/burger-rezept-bild-nr-1187.jpg'
	},
	{
		title: 'Pizza',
		tags: ['Mittag', 'Abend'],
		description: 'Wow Italiano',
		image:
			'https://www.eatclub.tv/wp-content/uploads/sites/4/2022/06/pizza-gamberetti.jpg?resize=768,432'
	},
	{
		title: 'Bolo',
		tags: ['Mittag', 'Abend'],
		description: 'Bolo wolo',
		image:
			'https://image.essen-und-trinken.de/11920200/t/Wo/v9/w960/r1/-/spaghetti-bolognese-2a2fc84c1def03b0f1f01e318ad1e067-fjt2014030361-jpg--7759-.jpg'
	}
]);
