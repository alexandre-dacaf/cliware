<script lang="ts">
	import { onMount } from 'svelte';
	import Terminal from '$lib/components/Terminal.svelte';

	let terminalContainerRef: HTMLDivElement;

	let numColumns: number = 2;
	let terminals: number[] = [0, 1];
	let terminalRefs: Terminal[] = [];
	let currentTerminalIndex: number = 0;

	onMount(async () => {
		terminalContainerRef.focus();
		focusTerminalAt(currentTerminalIndex);
	});

	function handleKeyPress(event: KeyboardEvent): void {
		if (event.ctrlKey && event.key === ']') {
			event.preventDefault();
			focusNext();
			return;
		}

		if (event.ctrlKey && event.key === '[') {
			event.preventDefault();
			focusPrevious();
			return;
		}

		if (event.key === 'Tab') {
			event.preventDefault();
			terminalContainerRef.focus();
		}

		terminalRefs[currentTerminalIndex].handleKeyPress(event);
	}

	function focusTerminalAt(index: number): void {
		if (terminalRefs[index]) {
			terminalRefs[index].focusTerminal();
		}
	}

	function blurTerminalAt(index: number): void {
		if (terminalRefs[index]) {
			terminalRefs[index].blurTerminal();
		}
	}

	function focusNext(): void {
		currentTerminalIndex = (currentTerminalIndex + 1) % terminals.length;
		focusTerminalAt(currentTerminalIndex);
	}

	function focusPrevious(): void {
		currentTerminalIndex = (currentTerminalIndex - 1 + terminals.length) % terminals.length;
		focusTerminalAt(currentTerminalIndex);
	}

	function handleTerminalFocus(event: CustomEvent): void {
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
	class="terminal-container"
	tabindex="0"
	bind:this={terminalContainerRef}
	on:keydown={handleKeyPress}
	style="grid-template-columns: repeat({numColumns}, 1fr);"
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
	.terminal-container {
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
