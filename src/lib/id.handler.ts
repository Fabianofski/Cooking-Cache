import type { Recipe } from '../models/Recipe';
import type { RecipeCollection, RecipeCollections } from '../models/RecipeCollections';

function generateShortRecipeId(recipe: Recipe | undefined, recipes: Recipe[]) {
	if (!recipe) return '';
	try {
		return generateShortId(recipe, recipes, 'title');
	} catch (error) {
		console.error(error);
		return '';
	}
}

function generateShortCollectionId(
	recipeCollection: RecipeCollection | undefined,
	recipeCollections: RecipeCollections
) {
	if (!recipeCollection) return '';
	try {
		return generateShortId(recipeCollection, Object.values(recipeCollections), 'name');
	} catch (error) {
		console.error(error);
		return '';
	}
}

function generateShortId(value: any, values: any[], column: string) {
	const valuesWithSameName = values.filter((collection) => collection.name === value[column]);
	const name = value[column].replaceAll(' ', '').replaceAll('-', '').toLowerCase();
	if (valuesWithSameName.length === 1) {
		return name;
	} else {
		let idLength = 3;
		let uniqueId = value.id.slice(0, idLength);
		while (
			values.filter((collection) => collection.id.slice(0, idLength) === uniqueId).length > 1
		) {
			idLength++;
			uniqueId = value.id.slice(0, idLength);
		}
		return `${name}-${uniqueId}`;
	}
}

function getRecipeFromShortId(shortId: string, recipes: Recipe[]) {
	try {
		return getValueFromShortId(shortId, recipes, 'title');
	} catch (error) {
		console.error(error);
		return undefined;
	}
}

function getCollectionFromShortId(shortId: string, recipeCollections: RecipeCollections) {
	try {
		return getValueFromShortId(shortId, Object.values(recipeCollections), 'name');
	} catch (error) {
		console.error(error);
		return undefined;
	}
}

function getValueFromShortId(shortId: string, values: any[], column: string) {
	const name = shortId.split('-')[0];
	const id = shortId.replaceAll(name + '-', '');
	const value = values.find((x) => {
		const idIsEqual = id !== '' || x.id.slice(0, id.length) === id;
		const valueName = x[column].replaceAll(' ', '').replaceAll('-', '').toLowerCase();
		return valueName === name && idIsEqual;
	});
	return value;
}

export {
	generateShortCollectionId,
	getCollectionFromShortId,
	generateShortRecipeId,
	getRecipeFromShortId
};
