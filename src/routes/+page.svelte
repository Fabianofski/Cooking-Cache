<script lang="ts">
	let counter = 0;
	function increment() {
		counter++;
	}
</script>

<button on:click={increment}>
	{counter}
</button>
