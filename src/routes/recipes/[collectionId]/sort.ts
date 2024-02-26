import type { Recipe } from '../../../models/Recipe';

export const sorters: {
	[key: string]: (a: Recipe, b: Recipe) => number;
} = {
	createdAt: createdAtSorter,
	alphabetical: alphabeticalSorter
};

function createdAtSorter(a: Recipe, b: Recipe): number {
	const aDate = new Date(a.createdTime);
	const bDate = new Date(b.createdTime);
	if (aDate < bDate) {
		return 1;
	} else if (aDate > bDate) {
		return -1;
	} else {
		return 0;
	}
}

function alphabeticalSorter(a: Recipe, b: Recipe): number {
	return a.title.localeCompare(b.title);
}
