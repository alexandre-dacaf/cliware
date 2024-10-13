<script>
	import Terminal from '$lib/components/Terminal.svelte';

	let numColumns = 3;
</script>

<div class="terminal-list" style="grid-template-columns: repeat({numColumns}, 1fr);">
	<Terminal />
	<Terminal />
	<Terminal />
</div>

<style>
	.terminal-list {
		background-color: #1c2128;
		padding: 0.6em;
		display: grid;
		gap: 0.6em;
		grid-auto-rows: 1fr;
		height: 100vh;
		box-sizing: border-box;
	}

	.terminal {
		width: 100%;
		height: 100%;
	}
</style>
