<script lang="ts">
	import { signOut, type User } from 'firebase/auth';
	import '../app.css';
	import { currentUser } from '../stores/store';
	import { auth } from '$lib/firebase.client';
	import { goto } from '$app/navigation';
	import Alerts from '../components/alerts/Alerts.svelte';

	let user: User | null;

	currentUser.subscribe((value) => {
		user = value;
	});

	auth.onAuthStateChanged((value) => {
		currentUser.set(value);
	});

	function logout() {
		signOut(auth).then(() => {
			currentUser.set(null);
			goto('/login');
		});
	}
</script>

<div class="min-h-screen flex flex-col justify-between">
	<div class="w-full flex justify-center bg-base-200">
		<div class="navbar max-w-3xl w-full">
			<div class="navbar-start">
				<div class="dropdown">
					<label for="" tabindex="-1" class="btn btn-ghost btn-circle">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/></svg
						>
					</label>
					<ul
						tabindex="-1"
						class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52"
					>
						<li><a href="/">Home</a></li>
						<li><a href="/random">Random Picker</a></li>
						<li><a href="/recipes">All Recipes</a></li>
						<li><a href="/recipe/create">Create Recipe</a></li>
					</ul>
				</div>
			</div>
			<div class="navbar-center">
				<a href="/" class="btn btn-ghost">
					<img class="h-8" src="/cooking-cache.png" alt="cooking cache logo" />
				</a>
			</div>
			<div class="navbar-end">
				{#if user !== null}
					<div class="dropdown dropdown-end">
						<label tabindex="-2" for="" class="btn btn-ghost btn-circle avatar">
							<div class="w-6 rounded-full">
								{#if user && user.photoURL}
									<img src={user.photoURL} alt="Profile" />
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
								{/if}
							</div>
						</label>
						<ul
							tabindex="-2"
							class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52"
						>
							<li><a href="/profile">Profil</a></li>
							<li><a href="#logout" on:click={logout}>Abmelden</a></li>
						</ul>
					</div>
				{:else}
					<a href="/login">Anmelden</a>
				{/if}
			</div>
		</div>
	</div>

	<div class="flex flex-col justify-start items-center px-2 py-2 flex-1">
		<div class="max-w-3xl w-full relative">
			<Alerts />
			<slot />
		</div>
	</div>

	<div class="flex justify-center w-full bg-base-300">
		<footer class="footer max-w-3xl items-center justify-center p-4 text-neutral-content">
			<aside class="items-center grid-flow-col">
				<a href="https://www.github.com/fabianofski">
					<img class="h-8 mr-2" src="/logo_transparent.png" alt="Logo of Fabian Friedrich" />
				</a>
				<p>Copyright © 2023 - All rights reserved by Fabian Friedrich</p>
			</aside>
		</footer>
	</div>
</div>
