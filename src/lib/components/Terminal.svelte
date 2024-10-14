<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import TextPrompt from '$lib/components/prompts/TextPrompt.svelte';

	export let index: number;

	let terminalRef: HTMLDivElement;
	let promptRef: TextPrompt;
	let terminalHistory: string[] = [];
	let isFocused = false;

	const dispatch = createEventDispatcher();

	function scrollToBottom(): void {
		if (terminalRef) {
			terminalRef.scrollTop = terminalRef.scrollHeight;
		}
	}

	export function focusTerminal(): void {
		isFocused = true;
		dispatch('focusTerminal', { index });
	}

	export function blurTerminal(): void {
		isFocused = false;
	}

	export function handleKeyPress(event: KeyboardEvent) {
		promptRef.handleKeyPress(event);
	}

	function handleSubmit(event: CustomEvent) {
		const { content } = event.detail;
		terminalHistory = [...terminalHistory, content];
	}
</script>

<div class="terminal" class:focused={isFocused} bind:this={terminalRef}>
	{#each terminalHistory as command}
		<div class="terminal__command">> {command}</div>
	{/each}
	<TextPrompt bind:this={promptRef} on:submit={handleSubmit} />
</div>

<style>
	.terminal {
		border: solid 1px #444c56;
		border-radius: 0.3em;
		padding: 1rem;
		box-sizing: border-box;
		background-color: #22272e;
		color: #c9c9c9;
		font-family: 'Fira Code', 'Courier New', Courier, monospace;
		height: 100%;
		outline: none;
		transition: 120ms ease-in-out;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: #444c56 transparent;
	}

	.terminal::-webkit-scrollbar {
		width: 8px;
	}

	.terminal::-webkit-scrollbar-track {
		background: transparent;
	}

	.terminal::-webkit-scrollbar-thumb {
		background-color: #444c56;
		border-radius: 4px;
		border: 2px solid transparent;
	}

	.terminal::-webkit-scrollbar-thumb:hover {
		background-color: #555;
	}

	.terminal__command {
		color: hsl(0, 0%, 70%);
		font-size: 1rem;
		margin-bottom: 0.1rem;
		white-space: nowrap;
		white-space: pre;
	}

	.focused {
		border: solid 1px #6cb6ff;
	}
</style>
