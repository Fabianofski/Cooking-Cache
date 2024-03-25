<script lang="ts">
	import { page } from '$app/stores';
	import { auth } from '$lib/firebase.client';
	import { getUserRecipeCollections } from '$lib/http/recipeCollection.handler';
	import { Capacitor } from '@capacitor/core';
	import { StatusBar } from '@capacitor/status-bar';
	import { NavigationBar } from '@mauricewegner/capacitor-navigation-bar';
	import '../app.css';
	import Alerts from '../components/alerts/Alerts.svelte';
	import { recipeCollectionsStore } from '../stores/recipeCollectionsStore';
	import { currentUser, loadingStateStore } from '../stores/store';
	import { navigating } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { App } from '@capacitor/app';
	import AuthPage from './login/AuthPage.svelte';
	import PullToRefresh from 'pulltorefreshjs';

	if (Capacitor.isNativePlatform()) {
		StatusBar.setBackgroundColor({ color: '#161c24' });
		NavigationBar.setColor({ color: '#161c24' });
	}

	let scrollBar: HTMLDivElement;
	navigating.subscribe((value) => {
		if (value && scrollBar) {
			scrollBar.scrollTo(0, 0);
		}
	});

	function isViewingRecipeWithAccessToken(currentPage: typeof $page) {
		return (
			currentPage.url.searchParams.has('key') && currentPage.url.pathname.startsWith('/recipe')
		);
	}

	onMount(() => {
		auth.onAuthStateChanged(async (value) => {
			loadingStateStore.set('LOADING');
			currentUser.set(value);

			if (value === null) {
				loadingStateStore.set('NOUSER');
				recipeCollectionsStore.set({});
				return;
			}

			await getUserRecipeCollections(value);
			loadingStateStore.set('FINISHED');
		});

		App.addListener('backButton', async () => {
			window.history.back();
		});

		App.addListener('appUrlOpen', async (data) => {
			let slug = data.url.split('cooking-cache.web.app/')[1];
			if (slug.includes('collection/join')) slug = slug.replace('/join', '/join/mobile');
			if (slug) goto(slug);
		});

		PullToRefresh.init({
			mainElement: '#ptr',
			onRefresh() {
				location.reload();
			},
			instructionsPullToRefresh: 'Zum Aktualisieren ziehen',
			instructionsReleaseToRefresh: 'Zum Aktualisieren loslassen',
			instructionsRefreshing: 'Aktualisiere...'
		});
	});
</script>

<svelte:head>
	<meta property="al:android:url" content={$page.url.href} />
	<meta property="al:android:package" content="com.f4b1.cookingcache" />
	<meta property="al:android:app_name" content="Cooking Cache" />
</svelte:head>
<div class="h-svh flex flex-col justify-between" id="top" data-theme="myTheme">
	<div class="w-full flex justify-center bg-base-300 fixed top-0 left-0 z-20">
		<div class="navbar max-w-3xl w-full">
			<div class="navbar-start" />
			<div class="navbar-center">
				<a href="/" class="btn btn-ghost">
					<img class="h-8" src="/cooking-cache.png" alt="cooking cache logo" />
				</a>
			</div>
			<div class="navbar-end" />
		</div>
	</div>

	<Alerts />
	<div class="h-svh py-16 flex flex-col flex-1">
		<div id="ptr" />
		<div
			bind:this={scrollBar}
			class="flex flex-col flex-1 justify-start items-center overflow-y-scroll overscroll-contain"
		>
			<div class="flex flex-col flex-1 max-w-3xl w-full relative px-2 py-4">
				{#if $loadingStateStore === 'NOUSER' && !isViewingRecipeWithAccessToken($page)}
					<AuthPage />
				{:else}
					<slot />
				{/if}
			</div>
		</div>
	</div>

	{#if $loadingStateStore !== 'NOUSER' || isViewingRecipeWithAccessToken($page)}
		<div class="btm-nav rounded-t-lg bg-base-300 max-w-3xl left-1/2 -translate-x-1/2 z-20">
			<a class:active={$page.url.pathname === '/'} href="/">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 -960 960 960"
					width="24"
					fill="currentColor"
				>
					<path
						d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"
					/>
				</svg>
				<span class="btm-nav-label">Home</span>
			</a>
			<a
				class:active={$page.url.pathname.startsWith('/recipe') ||
					$page.url.pathname.startsWith('/collection')}
				href="/recipes"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 -960 960 960"
					width="24"
					fill="currentColor"
				>
					<path
						d="M160-120q-33 0-56.5-23.5T80-200v-120h800v120q0 33-23.5 56.5T800-120H160Zm0-120v40h640v-40H160Zm320-180q-36 0-57 20t-77 20q-56 0-76-20t-56-20q-36 0-57 20t-77 20v-80q36 0 57-20t77-20q56 0 76 20t56 20q36 0 57-20t77-20q56 0 77 20t57 20q36 0 56-20t76-20q56 0 79 20t55 20v80q-56 0-75-20t-55-20q-36 0-58 20t-78 20q-56 0-77-20t-57-20ZM80-560v-40q0-115 108.5-177.5T480-840q183 0 291.5 62.5T880-600v40H80Zm400-200q-124 0-207.5 31T166-640h628q-23-58-106.5-89T480-760Zm0 520Zm0-400Z"
					/>
				</svg>
				<span class="btm-nav-label">Rezepte</span>
			</a>
			<a class:active={$page.url.pathname.startsWith('/planner')} href="/planner">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 -960 960 960"
					width="24"
					fill="currentColor"
				>
					<path
						d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"
					/>
				</svg>
				<span class="btm-nav-label">Wochenplaner</span>
			</a>
			<a class:active={$page.url.pathname.startsWith('/profile')} href={'/profile'}>
				<div class="w-6 rounded-full">
					{#if $currentUser && $currentUser.photoURL}
						<img src={$currentUser.photoURL} alt="Profile" referrerpolicy="no-referrer" />
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
				<span class="btm-nav-label">{'Profil'}</span>
			</a>
		</div>
	{/if}
</div>

<style>
	:global(.ptr--icon, .ptr--text) {
		color: var(--color-primary) !important;
	}
</style>
