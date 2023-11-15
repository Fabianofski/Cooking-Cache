<script lang="ts">
	import type { User } from 'firebase/auth';
	import type { Recipe } from '../models/Recipe';
	import { currentUser } from '../stores/store';

	export let recipe: Recipe | null;

	let user: User | null;
	currentUser.subscribe((value) => {
		user = value;
	});
</script>

{#if recipe}
	<a class="w-full" href={`/recipe/${recipe.id}`}>
		<div class="card w-full h-96 bg-base-100 shadow-xl">
			<figure class="h-64 overflow-x-hidden">
				<img
					class="h-full w-full"
					src={recipe.image === '' ? '/default-cover.jpg' : recipe.image}
					alt={`${recipe.title} Cover`}
					style="object-fit: cover;"
				/>
			</figure>
			<div class="card-body">
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
		<a class="btn" href="/recipe/create" class:btn-disabled={user === null}>
			Erstelle dein erstes Rezept
		</a>
	</div>
{/if}
