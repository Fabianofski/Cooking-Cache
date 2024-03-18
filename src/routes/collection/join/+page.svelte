<script lang="ts">
	import JoinPage from "./JoinPage.svelte";

	export let data;
</script>

<JoinPage recipeCollection={data.recipeCollection} inviteCode={data.inviteCode} />
