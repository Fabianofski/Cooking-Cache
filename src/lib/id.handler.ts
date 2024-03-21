import type { RecipeCollection, RecipeCollections } from '../models/RecipeCollections';

function generateShortCollectionId(
	recipeCollection: RecipeCollection,
	recipeCollections: RecipeCollections
) {
	const collectionsWithSameName = Object.values(recipeCollections).filter(
		(collection) => collection.name === recipeCollection.name
	);
	const name = recipeCollection.name.replaceAll(' ', '').replaceAll('-', '').toLowerCase();
	if (collectionsWithSameName.length === 1) {
		return name;
	} else {
		let idLength = 3;
		let uniqueId = recipeCollection.id.slice(0, idLength);
		while (
			Object.values(recipeCollections).filter(
				(collection) => collection.id.slice(0, idLength) === uniqueId
			).length > 1
		) {
			idLength++;
			uniqueId = recipeCollection.id.slice(0, idLength);
		}
		return `${name}-${uniqueId}`;
	}
}

function getCollectionFromShortId(shortId: string, recipeCollections: RecipeCollections) {
	shortId = shortId.toLowerCase();
	const name = shortId.split('-')[0];
	const id = shortId.replaceAll(name + '-', '');
	const collection: RecipeCollection | undefined = Object.values(recipeCollections).find((x) => {
		const idIsEqual = id !== '' || x.id.slice(0, id.length) === id;
		const collectionName = x.name.replaceAll(' ', '').replaceAll('-', '').toLowerCase();
		return collectionName === name && idIsEqual;
	});
	return collection;
}

export { generateShortCollectionId, getCollectionFromShortId };
