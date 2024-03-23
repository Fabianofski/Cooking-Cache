export default interface SchemaRecipe {
	name: string;
	description: string;
	image: string;
	author: {
		'@type': 'Person';
		name: string;
	};
	datePublished: string;
	prepTime: string;
	cookTime: string;
	totalTime: string;
	keywords: string[];
	recipeYield: string;
	recipeCategory: string[];
	recipeIngredient: string[];
	recipeInstructions: string[];
	nutrition: {
		calories: string;
		proteinContent: string;
		fatContent: string;
		carbohydrateContent: string;
	};
}
