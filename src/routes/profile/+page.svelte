<script lang="ts">
	import { signOut, type User } from 'firebase/auth';
	import { currentUser } from '../../stores/store';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase.client';

	let oldPassword: string;
	let password: string;
	let repeatPassword: string;

	let user: User | null = null;
	currentUser.subscribe((value) => {
		user = value;
	});

	let loading = false;
	function formIsInvalid(oldPassword: string, password: string, repeatPassword: string): boolean {
		return oldPassword === '' || password === '' || repeatPassword === '';
	}

	function changePassword() {
		loading = true;
	}

	// if (!user) goto('/login');
</script>

<div class="flex flex-col gap-4">
	<div class="flex px-4 justify-evenly items-center">
		<div class="avatar">
			<div class="w-36 rounded-full">
				<img src={user?.photoURL} alt="Profile" />
			</div>
		</div>

		<h1 class="align-middle text-2xl font-bold">
			{user?.displayName}
		</h1>
	</div>

	<hr class="rounded border-neutral" />

	<div class="overflow-x-auto">
		<h3 class="font-bold text-md text-center">Kontoinformationen</h3>

		<table class="table">
			<tbody>
				<tr>
					<th>E-Mail</th>
					<td>{user?.email}</td>
				</tr>
				<tr>
					<th>Anzeigename</th>
					<td>{user?.displayName}</td>
				</tr>
				<tr>
					<th>Telefonnummer</th>
					<td>{user?.phoneNumber}</td>
				</tr>
			</tbody>
		</table>
	</div>

	<hr class="rounded border-neutral" />

	<div class="grid grid-cols-fluid gap-4">
		<div class="flex flex-col gap-2">
			<h3 class="font-bold text-md text-center">Passwort ändern</h3>
			<div class="form-control w-full max-w-s">
				<input
					type="password"
					placeholder="Altes Passwort"
					bind:value={oldPassword}
					class="input input-bordered w-full max-w-s"
					required
				/>
			</div>

			<div class="form-control w-full max-w-s">
				<input
					type="password"
					placeholder="Neues Passwort"
					bind:value={password}
					class="input input-bordered w-full max-w-s"
					required
				/>
			</div>

			<div class="form-control w-full max-w-s">
				<input
					type="password"
					placeholder="Neues Passwort bestätigen"
					bind:value={repeatPassword}
					class="input input-bordered w-full max-w-s"
					required
				/>
			</div>
			<button
				class="btn btn-primary w-full"
				on:click={changePassword}
				disabled={loading || formIsInvalid(oldPassword, password, repeatPassword)}
			>
				{#if !loading}
					Passwort ändern
				{:else}
					<span class="loading loading-spinner loading-md" />
				{/if}
			</button>
		</div>
		<div class="flex flex-col gap-2">
			<h3 class="font-bold text-md text-center">Konto verwalten</h3>

			<button
				class="btn"
				on:click={() => {
					signOut(auth);
					goto('/login');
				}}
				><svg
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
						d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
					/>
				</svg>
				Abmelden</button
			>

			<button class="btn btn-outline btn-error">
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
						d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
					/>
				</svg>
				Konto löschen</button
			>
		</div>
	</div>
</div>
