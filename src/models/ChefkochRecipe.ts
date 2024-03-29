export default interface ChefkochRecipe {
	previewImageUrlTemplate: string;

	title: string;
	siteUrl: string;

	tags: string[];
	createdAt: string;
	servings: number;
	cookingTime: number;
	restingTime: number;
	totalTime: number;
	difficulty: number | undefined;

	instructions: string;
	ingredientGroups: {
		header: string;
		ingredients: {
			name: string;
			amount: number;
			unit: string;
		}[];
	}[];

	nutrition?: {
		kCalories: number;
		proteinContent: number;
		fatContent: number;
		carbohydrateContent: number;
	};
}
