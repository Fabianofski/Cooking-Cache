<script lang="ts">
	import type { User } from 'firebase/auth';
	import type { Participant, RecipeCollection } from '../models/RecipeCollections';
	import { currentUser } from '../stores/store';
	import { generateShortCollectionId } from '$lib/id.handler';
	import { recipeCollectionsStore } from '../stores/recipeCollectionsStore';

	export let recipeCollection: RecipeCollection | null;

	let user: User | null = null;
	let owner: Participant | undefined = undefined;
	currentUser.subscribe((value) => {
		user = value;
		owner = recipeCollection?.participants?.find(
			(participant) => participant.uid === recipeCollection?.ownerId
		);
	});
</script>

<a
	class="w-full"
	href={recipeCollection
		? `/recipes/${generateShortCollectionId(recipeCollection, $recipeCollectionsStore)}`
		: ''}
	data-testid="collection-link"
>
	<div class="card w-full h-64 bg-base-200 shadow-md shadow-neutral/50">
		<figure class="h-32 overflow-visible relative">
			<img
				class="absolute top-0 left-0 h-44 w-full rounded-t-2xl z-0"
				src={recipeCollection?.cover || '/default-cover.jpg'}
				alt={`${recipeCollection?.name} Cover`}
				style="object-fit: cover;"
				data-testid="collection-cover"
			/>
			<div
				class="absolute top-0 left-0 h-44 w-full rounded-t-2xl bg-gradient-to-t from-base-200 via-base-200/80 via-30% to-70%"
			/>
		</figure>
		<div class="card-body relative z-10">
			<h2 class="card-title flex justify-between">
				{recipeCollection?.name}
				<div class="flex gap-2 text-sm">
					<div
						class="flex gap-1 tooltip"
						data-tip={`${recipeCollection?.participants?.length || 1} Teilnehmer`}
						data-testid="participants-tooltip"
					>
						<p class="mt-0.5" data-testid="participants">
							{recipeCollection?.participants?.length || 1}
						</p>
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
					<a
						class="btn-ghost rounded"
						href={`/collection/edit/${
							recipeCollection
								? generateShortCollectionId(recipeCollection, $recipeCollectionsStore)
								: ''
						}`}
						data-testid="edit-collection-link"
					>
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
								d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					</a>
				</div>
			</h2>
			<div class="flex gap-2">
				<img
					class="rounded-full w-6"
					src={owner?.photoURL}
					alt={owner?.displayName}
					referrerpolicy="no-referrer"
				/>
				<p>{owner?.displayName} {owner?.uid === user?.uid ? '(Du)' : ''}</p>
			</div>
			<p>{recipeCollection?.recipes.length} Rezepte</p>
		</div>
	</div>
</a>
