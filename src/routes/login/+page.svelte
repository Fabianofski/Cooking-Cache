<script lang="ts">
	import { auth } from '$lib/firebase.client';
	import {
		createUserWithEmailAndPassword,
		signInWithEmailAndPassword,
		updateProfile
	} from 'firebase/auth';
	import { currentUser } from '../../stores/store';
	import { goto } from '$app/navigation';

	let loggingIn = true;
	let email: string = '';
	let password: string = '';
	let repeatPassword: string = '';
	let displayName: string = '';

	let loading = false;

	function formIsInvalid(
		email: string,
		password: string,
		repeatPassword: string,
		displayName: string,
		loggingIn: boolean
	): boolean {
		if (loggingIn) return email === '' || password === '';
		else return email === '' || password === '' || repeatPassword === '' || displayName === '';
	}

	function login() {
		loading = true;

		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				currentUser.set(userCredential.user);
				goto('/');
			})
			.catch((error) => {
				console.log('Failed: ' + error.message);
			})
			.finally(() => {
				loading = false;
			});
	}

	function signUp() {
		loading = true;
		createUserWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				currentUser.set(userCredential.user);
				await updateProfile(userCredential.user, {
					displayName: displayName
				}).then(() => {
					goto('/');
				});
			})
			.catch((error) => {
				console.log('Failed: ' + error.message);
			})
			.finally(() => {
				loading = false;
			});
	}
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-2xl font-extrabold text-center mb-2">Werde Mitglied!🥂</h1>

	<div class="join w-full">
		<input
			class="btn flex-1 join-item"
			type="radio"
			name="options"
			aria-label="Anmelden"
			value={true}
			bind:group={loggingIn}
		/>
		<input
			class="btn flex-1 join-item"
			type="radio"
			name="options"
			aria-label="Registrieren"
			value={false}
			bind:group={loggingIn}
		/>
	</div>

	{#if !loggingIn}
		<div class="form-control w-full max-w-s">
			<label class="label" for="">
				<span class="label-text">Name</span>
			</label>
			<input
				type="text"
				placeholder="Name"
				bind:value={displayName}
				class="input input-bordered w-full max-w-s"
				required
			/>
		</div>
	{/if}

	<form class="flex flex-col gap-2">
		<div class="form-control w-full max-w-s">
			<label class="label" for="">
				<span class="label-text">E-Mail</span>
			</label>
			<input
				type="text"
				placeholder="E-Mail"
				bind:value={email}
				class="input input-bordered w-full max-w-s"
				required
			/>
		</div>
		<div class="form-control w-full max-w-s">
			<label class="label" for="">
				<span class="label-text">Passwort</span>
			</label>
			<input
				type="password"
				placeholder="Passwort"
				bind:value={password}
				class="input input-bordered w-full max-w-s"
				required
			/>
		</div>

		{#if !loggingIn}
			<div class="form-control w-full max-w-s">
				<label class="label" for="">
					<span class="label-text">Passwort bestätigen</span>
				</label>
				<input
					type="password"
					placeholder="*****"
					bind:value={repeatPassword}
					class="input input-bordered w-full max-w-s"
					required
				/>
			</div>
		{/if}

		<button
			class="btn btn-primary w-full mt-4"
			on:click={loggingIn ? login : signUp}
			disabled={loading || formIsInvalid(email, password, repeatPassword, displayName, loggingIn)}
		>
			{#if !loading}
				{loggingIn ? 'Anmelden' : 'Registrieren'}
			{:else}
				<img class="h-2" src="/loading.svg" alt="loading" />
			{/if}
		</button>
	</form>
</div>
