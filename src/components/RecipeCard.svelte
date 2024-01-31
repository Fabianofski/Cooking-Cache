<script lang="ts">
	import type { User } from 'firebase/auth';
	import type { Recipe } from '../models/Recipe';
	import { currentUser } from '../stores/store';

	export let recipe: Recipe | null;
	export let collectionId: string | null = null;

	let user: User | null;
	currentUser.subscribe((value) => {
		user = value;
	});
</script>

{#if recipe}
	<a class="w-full" href={collectionId ? `/recipe/${collectionId}/${recipe.id}` : ''}>
		<div class="card w-full h-64 bg-base-200 shadow-md shadow-neutral/50">
			<figure class="h-32 overflow-visible relative">
				<img
					class="absolute top-0 left-0 h-44 w-full rounded-t-2xl z-0"
					src={recipe.image === '' ? '/default-cover.jpg' : recipe.image}
					alt={`${recipe.title} Cover`}
					style="object-fit: cover;"
				/>
				<div
					class="absolute top-0 left-0 h-44 w-full rounded-t-2xl bg-gradient-to-t from-base-200 via-base-200/80 via-30% to-70%"
				/>
			</figure>
			<div class="card-body relative z-10">
				<h2 class="card-title">
					{recipe.title}
					{#if recipe.tags}
						<div class="w-full card-actions justify-end">
							{#each recipe.tags as tag}
								<div class="badge badge-outline">{tag}</div>
							{/each}
						</div>
					{/if}
				</h2>
				<p>{recipe.tagline}</p>
			</div>
		</div>
	</a>
{:else}
	<div
		class="h-96 w-full bg-base-100 shadow-xl flex flex-col gap-2 justify-center items-center rounded-xl"
	>
		<p class="font-bold text-lg">Kein Rezept gefunden!</p>
		<a class="btn" href="/recipe/create/Hauptsammlung" class:btn-disabled={user === null}>
			Erstelle dein erstes Rezept
		</a>
	</div>
{/if}
