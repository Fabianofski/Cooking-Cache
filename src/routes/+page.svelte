<script lang="ts">
	let counter = 0;

	function increment() {
		counter++;
	}
</script>

<button class="btn btn-primary" on:click={increment}>
	{counter}
</button>
