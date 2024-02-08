<script lang="ts">
	import { joinRecipeCollectionWithInviteCode } from '$lib/http/recipeCollection.handler.js';
	import { onMount } from 'svelte';
	import type { Participant, RecipeCollection } from '../../../models/RecipeCollections.js';
	import { currentUser } from '../../../stores/store.js';

	export let data;

	let recipeCollection: RecipeCollection | null;
	let loading: boolean = true;
	let owner: Participant | undefined;
	onMount(() => {
		fetch(`/api/collection/join?i=${data.inviteCode}`)
			.then((res) => {
				if (res.status !== 200) return Promise.reject(res);

				res.json().then((data) => {
					recipeCollection = data;
					owner = recipeCollection?.participants?.find((p) => p.uid === data.ownerId);
				});
				loading = false;
			})
			.catch((err) => {
				console.log(err);
				loading = false;
			});
	});

	let loadingJoin = false;
	async function joinCollection() {
		if (!$currentUser || !data.inviteCode) return;

		loadingJoin = true;
		await joinRecipeCollectionWithInviteCode($currentUser, data.inviteCode);
		loadingJoin = false;
	}
</script>

{#if !loading && !recipeCollection}
	<div class="flex flex-col gap-16 items-center">
		<h2 class="text-9xl">🙁</h2>
		<p class="text-2xl text-center font-bold">Dieser Einladungslink ist leider ungültig</p>
	</div>
{:else}
	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-2">
			{#if loading}
				<div class="w-full h-36 skeleton rounded" />
				<div class="w-1/2 h-8 skeleton rounded self-center" />
			{:else}
				<img
					class="w-full h-36 rounded object-cover"
					src={recipeCollection?.cover || '/default-cover.jpg'}
					alt={`${recipeCollection?.name} Cover`}
				/>
				<h1 class="text-2xl font-bold text-center">"{recipeCollection?.name}"</h1>
			{/if}
		</div>
		<div class="w-full flex flex-col items-center">
			{#if loading}
				<div class="w-24 h-24 skeleton rounded-full" />
				<div class="w-28 h-5 skeleton rounded mt-0.5" />

				<div class="w-72 h-5 skeleton rounded mt-1" />
				<div class="w-32 h-5 skeleton rounded mt-0.5" />
				<div class="w-72 h-5 skeleton rounded mt-3" />
			{:else}
				<img
					class="w-24 rounded-full"
					src={owner?.photoURL || '/default-profile.jpg'}
					alt={owner?.displayName || 'User Profile Picture'}
					referrerpolicy="no-referrer"
				/>
				{owner?.displayName}
				<p class="text-center">
					lädt dich zu dieser Rezeptsammlung ein: <br />
					<strong>{recipeCollection?.name}</strong>
				</p>
				<p class="text-center mt-2">
					Die Rezeptsammlung beinhaltet
					<strong>{recipeCollection?.recipes?.length || 0} Rezepte</strong>
				</p>
			{/if}
		</div>

		<hr class="rounded border-neutral" />

		<div class="w-full flex flex-col gap-4 items-center">
			{#if loading}
				<div class="w-32 h-6 skeleton rounded" />
			{:else}
				<h3 class="text-md text-center font-bold">
					Teilnehmer ({recipeCollection?.participants?.length || 1})
				</h3>
			{/if}
			<div class="flex gap-8 justify-center w-full max-w-sm overflow-x-auto">
				{#if loading}
					{#each Array(4) as _}
						<div class="flex flex-col items-center">
							<div class="skeleton w-12 h-12 rounded-full" />
							<div class="skeleton w-16 h-3 rounded mt-0.5" />
						</div>
					{/each}
				{:else}
					{#each recipeCollection?.participants || [] as participant}
						<div class="flex flex-col items-center">
							<img
								class="w-12 h-12 rounded-full"
								src={participant.photoURL || '/default-profile.jpg'}
								alt={participant.displayName || 'User Profile Picture'}
								referrerpolicy="no-referrer"
							/>
							<p class="text-sm text-center">{participant.displayName}</p>
						</div>
					{/each}
				{/if}
			</div>
			<button
				class="btn btn-block btn-primary"
				disabled={loadingJoin || loading}
				on:click={joinCollection}
			>
				{#if loadingJoin || loading}
					<span class="loading loading-spinner loading-md" />
				{:else}
					Beitreten
				{/if}
			</button>
		</div>
	</div>
{/if}
