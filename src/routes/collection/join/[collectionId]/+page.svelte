<script lang="ts">
	import type { User } from 'firebase/auth';
	import { currentUser, recipesStore } from '../../../../stores/store.js';
	import type { Participant, RecipeCollection } from '../../../../models/RecipeCollections.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { createNewAlert } from '../../../../components/alerts/alert.handler.js';

	export let data;

	let user: User | null;
	currentUser.subscribe((value) => {
		user = value;
	});

	let recipeCollection: RecipeCollection | null;
	let loading: boolean = true;
	let owner: Participant | undefined;
	onMount(() => {
		fetch(`/api/collection/join/${data.collectionId}?i=${data.inviteCode}&uid=${data.ownerId}`)
			.then((res) => {
				if (res.status === 200) {
					res.json().then((data) => {
						recipeCollection = data;
						owner = recipeCollection?.participants?.find((p) => p.uid === data.ownerId);
					});
				} else {
					res.json().then((data) => {
						console.log(data);
					});
				}
				loading = false;
			})
			.catch((err) => {
				console.log(err);
				loading = false;
			});
	});

	let loadingJoin = false;
	function joinCollection() {
		user?.getIdToken().then((token) => {
			loadingJoin = true;
			fetch(`/api/collection/join/${data.collectionId}?i=${data.inviteCode}&uid=${data.ownerId}`, {
				method: 'POST',
				headers: {
					Authorization: token
				}
			})
				.then((res) => {
					if (res.status === 200) {
						res.json().then((data) => {
							const collection: RecipeCollection = data;
							console.log(collection);
							recipesStore.update((recipes) => {
								recipes[collection.id] = collection;
								return recipes;
							});
							goto(`/recipes/${collection.id}`);
							createNewAlert({
								type: 'success',
								message: `Du bist der Rezeptsammlung erfolgreich beigetreten!`
							});
						});
					} else {
						res.json().then((data) => {
							console.log(data);
						});
					}
					loadingJoin = false;
				})
				.catch(() => {
					createNewAlert({
						type: 'error',
						message: 'Beitreten der Rezeptsammlung fehlgeschlagen!'
					});
					loadingJoin = false;
				});
		});
	}
</script>

{#if loading}
	<p>Loading...</p>
{:else if recipeCollection}
	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-2">
			<img
				class="w-full h-36 rounded object-cover"
				src={'/default-cover.jpg'}
				alt={`${recipeCollection.name} Cover`}
			/>
			<h1 class="text-2xl font-bold text-center">{recipeCollection.name}</h1>
		</div>
		<div class="w-full flex flex-col items-center">
			<img
				class="w-24 rounded-full"
				src={owner?.photoURL || '/default-profile.jpg'}
				alt={owner?.displayName || 'User Profile Picture'}
			/>
			{owner?.displayName}
			<p class="text-center">
				lädt dich zu dieser Rezeptsammlung ein: <br />
				<strong>{recipeCollection.name}</strong>
			</p>
			<p class="text-center mt-2">
				Die Rezeptsammlung beinhaltet
				<strong>{recipeCollection.recipes?.length || 0} Rezepte</strong>
			</p>
		</div>

		<hr class="rounded border-neutral" />

		<div class="w-full flex flex-col gap-4 items-center">
			<h3 class="text-md text-center font-bold">
				Teilnehmer ({recipeCollection.participants?.length || 1})
			</h3>
			<div class="flex gap-8 justify-center w-full max-w-sm overflow-x-auto">
				{#each recipeCollection.participants || [] as participant}
					<div class="flex flex-col items-center">
						<img
							class="w-12 h-12 rounded-full"
							src={participant.photoURL || '/default-profile.jpg'}
							alt={participant.displayName || 'User Profile Picture'}
						/>
						<p class="text-sm text-center">{participant.displayName}</p>
					</div>
				{/each}
			</div>
			<button class="btn btn-block btn-primary" disabled={loadingJoin} on:click={joinCollection}>
				{#if loadingJoin}
					<span class="loading-spinner" />
				{:else}
					Beitreten
				{/if}
			</button>
		</div>
	</div>
{:else}
	<p>Collection not found</p>
{/if}
