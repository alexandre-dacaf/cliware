<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Input from '$lib/components/inputs/Input.svelte';

	let input: Input;

	const dispatch = createEventDispatcher();

	function handleEnterPressed(event: CustomEvent) {
		const { content } = event.detail;
		dispatch('submitted', { content });
		input.clear();
	}

	export function handleFocus() {
		input.handleFocus();
	}

	function handleBlurred() {
		dispatch("blurred");
	}
</script>

<div class="terminal__prompt">
	<Input bind:this={input} on:enterPressed={handleEnterPressed} on:blurred={handleBlurred}/>
</div>

<style>
	.terminal__prompt {
		font-size: 1rem;
		transition: 200ms;
		border-top: solid 1px #444c56;
		padding-top: 0.2em;
		margin-top: 0.5em;
	}
</style>
