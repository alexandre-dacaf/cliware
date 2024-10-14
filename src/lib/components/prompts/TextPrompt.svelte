<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import TextInput from '$lib/components/inputs/TextInput.svelte';

	let textInputRef: TextInput;

	const dispatch = createEventDispatcher();

	export function handleKeyPress(event: KeyboardEvent) {
		textInputRef.handleKeyPress(event);
	}

	function handleEnterPressed(event: CustomEvent) {
		const { content } = event.detail;
		dispatch('submit', { content });
		textInputRef.clear();
	}
</script>

<div class="terminal__prompt">
	>> <TextInput bind:this={textInputRef} on:enterPressed={handleEnterPressed} />
</div>

<style>
	.terminal__prompt {
		font-size: 1rem;
		color: hsl(0, 0%, 88%);
		transition: 200ms;
		border-top: solid 1px #444c56;
		padding-top: 0.2em;
		margin-top: 0.5em;
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
