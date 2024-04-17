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

function removeUnwantedCharacters(value: string) {
    value = value.replaceAll(" ", "-").replaceAll("_", "").toLowerCase();
    return value.replace(/[^a-zA-Z0-9-]/g, '');
}

function generateShortId(value: any, values: any[], column: string) {
	const valuesWithSameName = values.filter((x) => x[column] === value[column]);
	const name = removeUnwantedCharacters(value[column]); 
	if (valuesWithSameName.length === 1) {
		return name;
	} else {
		let idLength = 3;
		let uniqueId = value.id.slice(0, idLength);
		while (
			values.filter((collection) => collection.id.slice(0, idLength) === uniqueId).length > 1 &&
			value.id.length > idLength
		) {
			idLength++;
			uniqueId = value.id.slice(0, idLength);
		}
		return `${name}_${uniqueId}`;
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
	const name = shortId.split('_')[0];
	const id = shortId.replaceAll(name + '_', '');
	const value = values.find((x) => {
		const idIsEqual = id !== '' || x.id.slice(0, id.length) === id;
		const valueName = removeUnwantedCharacters(x[column]); 
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
