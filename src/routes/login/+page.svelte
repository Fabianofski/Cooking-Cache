<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase.client';
	import {
		FacebookAuthProvider,
		GoogleAuthProvider,
		OAuthProvider,
		createUserWithEmailAndPassword,
		signInWithEmailAndPassword,
		updateProfile,
		type AuthProvider,
		type UserCredential,
		signInWithCredential,
		browserPopupRedirectResolver,
		getRedirectResult,
		signInWithPopup
	} from 'firebase/auth';
	import { createNewAlert } from '../../components/alerts/alert.handler';
	import { currentUser } from '../../stores/store';
	import { Capacitor } from '@capacitor/core';
	import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

	let loggingIn = true;
	let optIn = false;
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
		optIn: boolean,
		loggingIn: boolean
	): boolean {
		if (loggingIn) return email === '' || password === '';
		else
			return (
				email === '' || password === '' || repeatPassword === '' || displayName === '' || !optIn
			);
	}

	function errorHandling(error: any) {
		createNewAlert({
			message: error.message,
			type: 'error'
		});
		loading = false;
	}

	function loggedInHandler(userCredential: UserCredential) {
		currentUser.set(userCredential.user);
		createNewAlert({
			message: 'Du wurdest erfolgreich eingeloggt!',
			type: 'success'
		});
		goto('/');
	}

	function loginWithEmailAndPassword() {
		loading = true;
		signInWithEmailAndPassword(auth, email, password).then(loggedInHandler).catch(errorHandling);
	}

	const googleProvider = new GoogleAuthProvider();
	const facebookProvider = new FacebookAuthProvider();
	const appleProvider = new OAuthProvider('apple.com');

	function loginWithOAuth(provider: AuthProvider) {
		loading = true;
		if (Capacitor.isNativePlatform()) {
			loginWithCapacitorOAuth();
		} else {
			signInWithPopup(auth, provider, browserPopupRedirectResolver)
				.then(loggedInHandler)
				.catch(errorHandling);
		}
	}

	function loginWithCapacitorOAuth() {
		FirebaseAuthentication.signInWithGoogle()
			.then((result) => {
				if (!result.credential) return;
				const credential = GoogleAuthProvider.credential(
					result.credential.idToken,
					result.credential.nonce
				);
				signInWithCredential(auth, credential).then(loggedInHandler).catch(errorHandling);
			})
			.catch(errorHandling);
	}

	function signUpWithEmailAndPassword() {
		loading = true;
		createUserWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				await updateProfile(userCredential.user, {
					displayName: displayName
				})
					.then(() => {
						loggedInHandler(userCredential);
					})
					.catch(errorHandling);
			})
			.catch(errorHandling);
	}
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-2xl font-extrabold text-center mb-2">
		{loggingIn ? 'Willkomen zurück!🙌' : 'Werde Mitglied!🥂'}
	</h1>

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
			<div class="form-control">
				<label class="label cursor-pointer justify-start">
					<input type="checkbox" bind:checked={optIn} class="checkbox mr-2" />
					<span class="label-text">
						Ich stimme der Datenverarbeitung gemäß der <a
							class="font-bold underline text-white hover:text-primary"
							href="/privacy-policy"
						>
							Datenschutzerklärung
						</a>
						zu.
					</span>
				</label>
			</div>
		{/if}

		<button
			class="btn btn-primary w-full mt-4"
			on:click={loggingIn ? loginWithEmailAndPassword : signUpWithEmailAndPassword}
			disabled={loading ||
				formIsInvalid(email, password, repeatPassword, displayName, optIn, loggingIn)}
		>
			{#if !loading}
				{loggingIn ? 'Anmelden' : 'Registrieren'}
			{:else}
				<span class="loading loading-spinner loading-md" />
			{/if}
		</button>
	</form>

	<div class="grid grid-cols-fluid-narrow gap-2">
		<button
			class="px-4 py-2 border flex gap-2 bg-white border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
			on:click={() => loginWithOAuth(googleProvider)}
		>
			<img
				class="w-6 h-6"
				src="https://www.svgrepo.com/show/475656/google-color.svg"
				loading="lazy"
				alt="google logo"
			/>
			<span>Mit Google anmelden</span>
		</button>
		<button
			disabled
			class="cursor-not-allowed px-4 py-2 border flex gap-2 bg-gray-800 border-slate-700 rounded-lg text-slate-200 hover:border-slate-500 hover:text-slate-300 hover:shadow transition duration-150"
			on:click={() => loginWithOAuth(facebookProvider)}
		>
			<img
				class="w-6 h-6"
				src="https://www.svgrepo.com/show/475647/facebook-color.svg"
				loading="lazy"
				alt="facebook logo"
			/>
			<span>Mit Facebook anmelden</span>
		</button>
		<button
			disabled
			class="cursor-not-allowed px-4 py-2 border flex gap-2 bg-black border-slate-700 rounded-lg text-slate-200 hover:border-slate-500 hover:text-slate-300 hover:shadow transition duration-150"
			on:click={() => loginWithOAuth(appleProvider)}
		>
			<svg
				class="w-6 h-6"
				fill="#ffffff"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				viewBox="0 0 512 512"
				xml:space="preserve"
			>
				<g id="SVGRepo_bgCarrier" stroke-width="0" />
				<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
				<g id="SVGRepo_iconCarrier">
					<g id="7935ec95c421cee6d86eb22ecd114eed">
						<path
							style="display: inline;"
							d="M248.644,123.476c-5.45-29.71,8.598-60.285,25.516-80.89 c18.645-22.735,50.642-40.17,77.986-42.086c4.619,31.149-8.093,61.498-24.826,82.965 C309.37,106.527,278.508,124.411,248.644,123.476z M409.034,231.131c8.461-23.606,25.223-44.845,51.227-59.175 c-26.278-32.792-63.173-51.83-97.99-51.83c-46.065,0-65.542,21.947-97.538,21.947c-32.96,0-57.965-21.947-97.866-21.947 c-39.127,0-80.776,23.848-107.19,64.577c-9.712,15.055-16.291,33.758-19.879,54.59c-9.956,58.439,4.916,134.557,49.279,202.144 c21.57,32.796,50.321,69.737,87.881,70.059c33.459,0.327,42.951-21.392,88.246-21.616c45.362-0.258,53.959,21.841,87.372,21.522 c37.571-0.317,67.906-41.199,89.476-73.991c15.359-23.532,21.167-35.418,33.11-62.023 C414.435,352.487,389.459,285.571,409.034,231.131z"
						/>
					</g>
				</g>
			</svg>

			<span>Mit Apple anmelden</span>
		</button>
	</div>
</div>
