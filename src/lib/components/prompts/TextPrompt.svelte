<script lang="ts">
	import TextInput from '$lib/components/inputs/TextInput.svelte';

	let textInputRef: TextInput;

	export function handleKeyPress(event: KeyboardEvent) {
		textInputRef.handleKeyPress(event);
	}
</script>

<div class="terminal__prompt">
	> <TextInput bind:this={textInputRef} />
</div>

<style>
	.terminal__prompt {
		font-size: 1rem;
		color: hsl(0, 0%, 88%);
		transition: 200ms;
		border-top: solid 1px #444c56;
		padding-top: 0.2em;
	}

	.input-text {
		color: #e0e0e0;
		caret-color: #999;
		caret-shape: underscore;
		border: none;
		outline: none;
	}

	::selection {
		background-color: hsl(210, 30%, 35%);
		color: #e0e0e0;
	}
</style>
