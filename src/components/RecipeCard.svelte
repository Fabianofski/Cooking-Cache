<script lang="ts">
	import type { User } from 'firebase/auth';
	import { difficultyLabels, type Recipe } from '../models/Recipe';
	import { currentUser } from '../stores/store';
	import { recipeCollectionsStore } from '../stores/recipeCollectionsStore';
	import type { Participant } from '../models/RecipeCollections';

	export let recipe: Recipe;

	let user: User | null = null;
	let owner: Participant | undefined;
	currentUser.subscribe((value) => {
		user = value;
		const recipeCollection = $recipeCollectionsStore[recipe.collectionId];
		const ownerId = recipeCollection?.ownerId;
		owner = recipeCollection?.participants?.find((participant) => participant.uid === ownerId);
	});

	function truncateString(str: string, length: number) {
		if (str.length > length) {
			return str.slice(0, length) + '...';
		}
		return str;
	}
</script>

<a class="w-full" href={`/recipe/${recipe.collectionId}/${recipe.id}`} data-testid="recipe-link">
	<div class="card w-full h-64 bg-base-200 shadow-md shadow-neutral/50">
		<figure class="h-32 overflow-visible relative">
			<img
				class="absolute top-0 left-0 h-44 w-full rounded-t-2xl z-0"
				src={recipe.image === '' ? '/default-cover.jpg' : recipe.image}
				alt={`${recipe.title} Cover`}
				style="object-fit: cover;"
				data-testid="recipe-cover"
			/>
			<div
				class="absolute top-0 left-0 h-44 w-full rounded-t-2xl bg-gradient-to-t from-base-200 via-base-200/80 via-30% to-70%"
			/>
		</figure>
		<div class="card-body relative z-10">
			<h2 class="card-title">
				{recipe.title === '' ? 'Titel' : truncateString(recipe.title, 30)}
			</h2>
			{#if owner}
				<div class="flex gap-2">
					<img
						class="rounded-full w-6"
						src={owner.photoURL}
						alt={owner.displayName}
						referrerpolicy="no-referrer"
					/>
					<p>
						{truncateString(owner.displayName || '', 25)}
						{owner.uid === user?.uid ? '(Du)' : ''}
					</p>
				</div>
			{/if}

			<div class="flex gap-2 w-full">
				<div class="flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-4 h-4 mr-1"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
						/>
					</svg>
					{difficultyLabels[recipe.difficulty]}
				</div>
				<div class="flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-4 h-4 mr-1"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
					{recipe.cookingTime || 60} Minuten
				</div>
			</div>
		</div>
	</div>
</a>
