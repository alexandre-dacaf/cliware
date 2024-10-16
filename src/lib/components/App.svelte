<script lang="ts">
	import { onMount } from 'svelte';
	import Terminal from '$lib/components/Terminal.svelte';

	let self: HTMLDivElement;

	let numColumns: number = 2;
	let terminalIndexes: number[] = [0, 1, 2];
	let terminals: Terminal[] = [];
	let activeTerminalIndex: number = NaN;
	let hoveredTerminalIndex: number = 0;

	type AppState = 'hovering' | 'active';
	let appState: AppState = 'active';

	onMount(async () => {
		self.focus();
		activateTerminal(hoveredTerminalIndex);
	});

	function handleKeyPress(event: KeyboardEvent): void {
		const key = event.key;
		const isShiftPressed = event.shiftKey;

		if (appState !== 'hovering') {
			return;
		}

		if (key === 'ArrowRight' || (key === 'Tab' && !isShiftPressed)) {
			event.preventDefault();
			hoverNext();
			return;
		}

		if (key === 'ArrowLeft' || (key === 'Tab' && isShiftPressed)) {
			event.preventDefault();
			hoverPrevious();
			return;
		}

		if (key === 'Enter' || key === 'Space') {
			activateTerminal(hoveredTerminalIndex);
		}
	}

	function hoverNext(): void {
		hoveredTerminalIndex = (hoveredTerminalIndex + 1) % terminalIndexes.length;
		hoverTerminalAt(hoveredTerminalIndex);
	}

	function hoverPrevious(): void {
		hoveredTerminalIndex =
			(hoveredTerminalIndex - 1 + terminalIndexes.length) % terminalIndexes.length;
		hoverTerminalAt(hoveredTerminalIndex);
	}

	function hoverTerminalAt(index: number) {
		if (!terminals[hoveredTerminalIndex]) {
			return;
		}

		terminals.forEach((_, i) => {
			if (i !== index) {
				terminals[i].unhover();
			}
		});

		terminals[hoveredTerminalIndex].hover();
	}

	function activateTerminal(index: number): void {
		if (terminals[index]) {
			terminals[index].unhover();
			terminals[index].activate();
			activeTerminalIndex = index;
			setAppState('active');
		}
	}

	function handleBlurred(event: CustomEvent): void {
		const { terminalIndex } = event.detail;
		self.focus();

		if (terminals[terminalIndex]) {
			terminals[terminalIndex].deactivate();
			terminals[terminalIndex].hover();
			hoveredTerminalIndex = terminalIndex;
			setAppState('hovering');
		}
	}

	function setAppState(state: AppState): void {
		if (state === 'hovering') activeTerminalIndex = NaN;
		if (state === 'active') hoveredTerminalIndex = NaN;
		appState = state;
	}
</script>

<div
	class="terminal-container"
	tabindex="0"
	bind:this={self}
	on:keydown={handleKeyPress}
	style="grid-template-columns: repeat({numColumns}, 1fr);"
>
	{#each terminalIndexes as terminalIndex}
		<Terminal {terminalIndex} bind:this={terminals[terminalIndex]} on:blurred={handleBlurred} />
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
</style>
