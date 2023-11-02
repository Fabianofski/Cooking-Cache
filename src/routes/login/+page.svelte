<script lang="ts">
	import { auth } from '$lib/firebase.client';
	import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
	import { currentUser } from '../../stores/store';

	let loggingIn = true;
	let email: string;
	let password: string;
	let repeatPassword: string;

	function login() {
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				currentUser.set(userCredential.user);
			})
			.catch((error) => {
				console.log('Failed: ' + error.message);
			});
	}

	function signUp() {
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				currentUser.set(userCredential.user);
			})
			.catch((error) => {
				console.log('Failed: ' + error.message);
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
				/>
			</div>
		{/if}

		<button class="btn btn-primary w-full mt-4" on:click={loggingIn ? login : signUp}>
			{loggingIn ? 'Anmelden' : 'Registrieren'}
		</button>
	</form>
</div>
