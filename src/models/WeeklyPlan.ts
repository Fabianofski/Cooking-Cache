export default interface WeeklyPlan {
	[key: string]: {
		// date
		recipes: {
			// meal
			recipeId: string;
			collectionId: string;
		}[];
	};
}
