<script lang="ts">
	import type { Recipe } from '../models/Recipe';

	export let collectionName: string | null;
	export let recipes: Recipe[] | null = [];
</script>

<a class="w-full" href={`/recipes/${collectionName}`}>
	<div class="card w-full h-64 bg-base-100 shadow-xl">
		<figure class="h-48 overflow-x-hidden">
			<img
				class="h-full w-full"
				src={'/default-cover.jpg'}
				alt={`${collectionName} Cover`}
				style="object-fit: cover;"
			/>
		</figure>
		<div class="card-body">
			<h2 class="card-title flex justify-between">
				{collectionName}
				<div class="flex gap-2 text-sm tooltip" data-tip="2 Teilnehmer">
					<p class="mt-0.5">2</p>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
						/>
					</svg>
				</div>
			</h2>
			<p>{recipes?.length} Rezepte</p>
		</div>
	</div>
</a>
