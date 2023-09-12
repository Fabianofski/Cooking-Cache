<script lang="ts">
	import '../app.css';
</script>

<div class="drawer min-h-screen">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div class="w-full navbar bg-base-300">
			<div class="flex-none lg:hidden">
				<label for="my-drawer-3" class="btn btn-square btn-ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block w-6 h-6 stroke-current"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/></svg
					>
				</label>
			</div>
			<a href="/" class="btn btn-ghost"><div class="flex-1 px-2 mx-2">Cooking Cache</div></a>
			<div class="flex-none hidden lg:block">
				<ul class="menu menu-horizontal">
					<!-- Navbar menu content here -->
					<li><a href="/">Home</a></li>
					<li><a href="/random">Random Picker</a></li>
					<li><a href="/recipes">All Recipes</a></li>
				</ul>
			</div>
		</div>
		<!-- Page content here -->
		<div class="flex flex-col justify-start items-center px-2 py-2">
			<div class="max-w-3xl w-full">
				<slot />
			</div>
		</div>
	</div>
	<div class="drawer-side">
		<label for="my-drawer-3" class="drawer-overlay" />
		<ul class="menu p-4 w-80 min-h-full bg-base-200">
			<!-- Sidebar content here -->
			<li><a href="/">Home</a></li>
			<li><a href="/random">Random Picker</a></li>
			<li><a href="/recipes">All Recipes</a></li>
		</ul>
	</div>
</div>
<div class="flex justify-center w-full bg-base-300">
	<footer class="footer max-w-3xl items-center justify-center p-4 text-neutral-content">
		<aside class="items-center grid-flow-col">
			<a href="https://www.github.com/fabianofski">
				<img class="h-8 mr-2" src="/logo_transparent.png" alt="Logo of Fabian Friedrich" />
			</a>
			<p>Copyright © 2023 - All right reserved by Fabian Friedrich</p>
		</aside>
	</footer>
</div>
