<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase.client';
	import {
		AuthCredential,
		EmailAuthProvider,
		OAuthProvider,
		deleteUser,
		reauthenticateWithCredential,
		reauthenticateWithPopup,
		signOut,
		updatePassword,
		type User
	} from 'firebase/auth';
	import { onMount } from 'svelte';
	import { createNewAlert } from '../../components/alerts/alert.handler';
	import { currentUser, loadingStateStore, type LoadingState } from '../../stores/store';

	let oldPassword: string = '';
	let password: string = '';
	let repeatPassword: string = '';

	let user: User | null = null;
	currentUser.subscribe((value) => {
		user = value;
	});

	let loadingState: LoadingState;
	onMount(async () => {
		loadingStateStore.subscribe((value) => {
			loadingState = value;
			if (loadingState === 'NOUSER') goto('/login');
		});
	});

	let loadingPasswordChange = false;
	function formIsInvalid(oldPassword: string, password: string, repeatPassword: string): boolean {
		return oldPassword === '' || password === '' || repeatPassword === '';
	}

	function reauthenticate(password: string) {
		return new Promise<void>((resolve, reject) => {
			if (!user) {
				reject('User is null');
				return;
			}
			let providerId = user.providerData[0].providerId;

			if (providerId === 'password') {
				if (!user.email) {
					reject('E-Mail is null');
					return;
				}
				let credential: AuthCredential = EmailAuthProvider.credential(user.email, password);
				reauthenticateWithCredential(user, credential)
					.then(() => {
						resolve();
					})
					.catch((err) => {
						reject(err);
					});
			} else {
				const provider = new OAuthProvider(providerId);
				reauthenticateWithPopup(user, provider)
					.then(() => {
						resolve();
					})
					.catch((err) => {
						reject(err);
					});
			}
		});
	}

	function changePassword() {
		loadingPasswordChange = true;

		if (password !== repeatPassword) {
			createNewAlert({
				message: 'Das neue Passwort und die Bestätigung stimmen nicht überein!',
				type: 'error'
			});
			loadingPasswordChange = false;
			return;
		}

		reauthenticate(oldPassword)
			.then(() => {
				if (!user) return;
				updatePassword(user, password)
					.then(() => {
						loadingPasswordChange = false;
						oldPassword = '';
						password = '';
						repeatPassword = '';
						createNewAlert({
							message: 'Dein Passwort wurde erfolgreich aktualisiert!',
							type: 'success'
						});
					})
					.catch((err) => {
						loadingPasswordChange = false;
						createNewAlert({
							message: err.message,
							type: 'error'
						});
					});
			})
			.catch((err) => {
				createNewAlert({
					message: err.message,
					type: 'error'
				});
				loadingPasswordChange = false;
			});
	}

	let loadingDeletion = false;
	let confirmation = '';
	let dialog: HTMLDialogElement;
	function deleteAccount() {
		loadingDeletion = true;
		reauthenticate(confirmation)
			.then(() => {
				if (!user) return;
				deleteUser(user)
					.then(() => {
						loadingDeletion = false;
						createNewAlert({
							message: 'Dein Konto wurde erfolgreich gelöscht!',
							type: 'success'
						});
						goto('login');
					})
					.catch((err) => {
						loadingDeletion = false;
						createNewAlert({
							message: err.message,
							type: 'error'
						});
					});
			})
			.catch((err) => {
				createNewAlert({
					message: err.message,
					type: 'error'
				});
				loadingDeletion = false;
			});
	}
</script>

<div class="flex flex-col gap-8">
	<div class="flex px-4 justify-evenly gap-4 items-center">
		<div class="avatar">
			<div class="w-36 rounded-full">
				{#if loadingState !== 'FINISHED'}
					<div class="skeleton w-full h-full" />
				{:else if user && user.photoURL}
					<img src={user.photoURL} alt="Profile" />
				{:else}
					<img src={'/default-cover.jpg'} alt="Default Profile" />
				{/if}
			</div>
		</div>

		<h1 class="align-middle text-center text-2xl font-bold">
			{#if loadingState !== 'FINISHED'}
				<div class="skeleton w-48 h-6" />
			{:else}
				{user?.displayName}
			{/if}
		</h1>
	</div>

	<hr class="rounded border-neutral" />

	<div class="overflow-x-auto">
		<h3 class="font-bold text-md text-center">Kontoinformationen</h3>

		<table class="table">
			<tbody>
				<tr>
					<th>E-Mail</th>
					{#if loadingState !== 'FINISHED'}
						<td>
							<div class="skeleton w-48 h-4" />
						</td>
					{:else}
						<td>{user?.email}</td>
					{/if}
				</tr>
				<tr>
					<th>Anzeigename</th>
					{#if loadingState !== 'FINISHED'}
						<td>
							<div class="skeleton w-48 h-4" />
						</td>
					{:else}
						<td>{user?.displayName}</td>
					{/if}
				</tr>
				<tr>
					<th>Telefonnummer</th>
					{#if loadingState !== 'FINISHED'}
						<td>
							<div class="skeleton w-48 h-4" />
						</td>
					{:else}
						<td>{user?.phoneNumber ? user?.phoneNumber : '-'}</td>
					{/if}
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
					disabled={loadingState !== 'FINISHED'}
					placeholder="Altes Passwort"
					bind:value={oldPassword}
					class="input input-bordered w-full max-w-s"
					required
				/>
			</div>

			<div class="form-control w-full max-w-s">
				<input
					type="password"
					disabled={loadingState !== 'FINISHED'}
					placeholder="Neues Passwort"
					bind:value={password}
					class="input input-bordered w-full max-w-s"
					required
				/>
			</div>

			<div class="form-control w-full max-w-s">
				<input
					type="password"
					disabled={loadingState !== 'FINISHED'}
					placeholder="Neues Passwort bestätigen"
					bind:value={repeatPassword}
					class="input input-bordered w-full max-w-s"
					required
				/>
			</div>
			<button
				class="btn btn-primary w-full"
				on:click={changePassword}
				disabled={loadingPasswordChange ||
					loadingState !== 'FINISHED' ||
					formIsInvalid(oldPassword, password, repeatPassword)}
			>
				{#if !loadingPasswordChange}
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
				disabled={loadingState !== 'FINISHED'}
				on:click={() => {
					signOut(auth);
					goto('/login');
				}}
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
						d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
					/>
				</svg>
				Abmelden
			</button>

			<button
				class="btn btn-outline btn-error"
				disabled={loadingDeletion || loadingState !== 'FINISHED'}
				on:click={() => {
					dialog.showModal();
				}}
			>
				{#if !loadingDeletion}
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
					Konto löschen
				{:else}
					<span class="loading loading-spinner loading-md" />
				{/if}
			</button>
			<a href="privacy-policy" class="link text-center">Datenschutzerklärung</a>

			<dialog bind:this={dialog} class="modal">
				<div class="modal-box">
					<h3 class="font-bold text-lg text-center">Willst du deinen Account wirklich löschen?</h3>
					{#if user?.providerData[0].providerId === 'password'}
						<p class="py-4 text-center">Tippe zum Bestätigen dein Passwort ein</p>
					{:else}
						<p class="py-4 text-center">Tippe zum Bestätigen LÖSCHEN ein</p>
					{/if}
					<div class="form-control w-full max-w-s">
						{#if user?.providerData[0].providerId === 'password'}
							<input
								type="password"
								placeholder="Passwort"
								bind:value={confirmation}
								class="input input-bordered input-error w-full max-w-s"
								required
							/>
						{:else}
							<input
								type="text"
								placeholder="LÖSCHEN"
								bind:value={confirmation}
								class="input input-bordered input-error w-full max-w-s"
								required
							/>
						{/if}
					</div>
					<div class="modal-action">
						<form method="dialog" class="w-full flex flex-col gap-4">
							<button
								class="btn btn-block"
								on:click={() => {
									confirmation = '';
								}}
							>
								Abbrechen
							</button>
							<button
								class="btn btn-error btn-block"
								disabled={loadingDeletion ||
									(user?.providerData[0].providerId === 'password' && confirmation === '') ||
									confirmation.toLowerCase() !== 'löschen'}
								on:click={deleteAccount}
							>
								{#if !loadingDeletion}
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
									Konto löschen
								{:else}
									<span class="loading loading-spinner loading-md" />
								{/if}
							</button>
						</form>
					</div>
				</div>
			</dialog>
		</div>
	</div>
</div>
