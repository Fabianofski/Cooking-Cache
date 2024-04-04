export default interface WeeklyPlan {
	[key: string]: {
		// date
		[key: string]: {
			// meal
			recipeId: string;
			collectionId: string;
		};
	};
}
