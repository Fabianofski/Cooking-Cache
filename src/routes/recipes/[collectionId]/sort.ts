import type { Recipe } from '../../../models/Recipe';

export const sorters: {
	[key: string]: (a: Recipe, b: Recipe) => number;
} = {
	created_at: createdAtSorter,
	alphabetical: alphabeticalSorter
};

function createdAtSorter(a: Recipe, b: Recipe): number {
	const aDate = new Date(a.createdTime);
	const bDate = new Date(b.createdTime);
	return aDate.getTime() - bDate.getTime();
}

function alphabeticalSorter(a: Recipe, b: Recipe): number {
	return a.title.localeCompare(b.title);
}
