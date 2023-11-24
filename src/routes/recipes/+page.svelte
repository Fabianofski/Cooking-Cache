<script>
	import RecipeCollectionCard from '../../components/RecipeCollectionCard.svelte';
</script>

<div class="flex gap-4 flex-col items-center">
	<div class="w-full">
		<div class="w-full">
			<h2 class="text-lg font-bold text-center">Rezeptsammlungen</h2>
		</div>
		<div class="divider my-0" />
	</div>
</div>

<div class="grid grid-cols-fluid gap-4">
	{#each ['Hauptsammlung', '2. Sammlung'] as collectionName}
		<RecipeCollectionCard {collectionName} />
	{/each}
</div>
