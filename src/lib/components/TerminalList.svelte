<script lang="ts">
	import { onMount } from 'svelte';
	import Terminal from '$lib/components/Terminal.svelte';

	let numColumns: number = 3;

	let terminals = [0, 1, 2, 3, 4, 5, 6];
	let terminalRefs: any[] = [];

	let currentTerminalIndex: number = 0;

	onMount(async () => {
		focusTerminalAt(currentTerminalIndex);
	});

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Tab') {
			event.preventDefault();
			if (event.shiftKey) {
				focusPrevious();
			} else {
				focusNext();
			}
		}
	}

	function focusTerminalAt(index: number) {
		if (terminalRefs[index]) {
			terminalRefs[index].focusTerminal();
		}
	}

	function blurTerminalAt(index: number) {
		if (terminalRefs[index]) {
			terminalRefs[index].blurTerminal();
		}
	}

	function focusNext() {
		blurTerminalAt(currentTerminalIndex);
		currentTerminalIndex = (currentTerminalIndex + 1) % terminals.length;
		focusTerminalAt(currentTerminalIndex);
	}

	function focusPrevious() {
		blurTerminalAt(currentTerminalIndex);
		currentTerminalIndex = (currentTerminalIndex - 1 + terminals.length) % terminals.length;
		focusTerminalAt(currentTerminalIndex);
	}

	function handleTerminalFocus(event) {
		const { index } = event.detail;

		terminals.forEach((_, i) => {
			if (i !== index) {
				blurTerminalAt(i);
			}
		});
		currentTerminalIndex = index;
	}
</script>

<div
	class="terminal-list"
	style="grid-template-columns: repeat({numColumns}, 1fr);"
	on:keydown={handleKeyPress}
>
	{#each terminals as terminalIndex}
		<Terminal
			index={terminalIndex}
			bind:this={terminalRefs[terminalIndex]}
			on:focusTerminal={handleTerminalFocus}
		/>
	{/each}
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
