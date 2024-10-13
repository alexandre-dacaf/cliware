<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let index: number;

	let terminalRef: HTMLDivElement;
	let inputTextRef: HTMLSpanElement;
	let inputText: string = '';
	let terminalHistory: string[] = [];
	let isFocused = false;

	const dispatch = createEventDispatcher();

	function scrollToBottom() {
		if (terminalRef) {
			terminalRef.scrollTop = terminalRef.scrollHeight;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();

			if (inputText.trim() !== '') {
				terminalHistory = [...terminalHistory, inputText];
				inputText = '';

				if (inputTextRef) {
					inputTextRef.textContent = '';
				}

				scrollToBottom();
			}
		}
	}

	function handleInput() {
		inputText = inputTextRef.textContent || '';
	}

	function handleFocus() {
		isFocused = true;
		dispatch('focusTerminal', { index });

		setTimeout(() => {
			focusEditableText();
		}, 0); // Timeout to ensure focus is applied after rendering
	}

	function focusEditableText() {
		if (inputTextRef) {
			const range = document.createRange();
			const selection = window.getSelection();

			if (selection) {
				range.selectNodeContents(inputTextRef);
				range.collapse(false);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		}
	}

	export function focusTerminal() {
		terminalRef.focus();
	}

	export function blurTerminal() {
		isFocused = false;
	}
</script>

<div
	class="terminal"
	tabindex="0"
	on:focus={handleFocus}
	class:focused={isFocused}
	bind:this={terminalRef}
>
	{#each terminalHistory as command}
		<div class="terminal__command">{command}</div>
	{/each}
	<div class="terminal__prompt">
		> <span
			class="input-text"
			contenteditable="true"
			bind:this={inputTextRef}
			on:keydown={handleKeyPress}
			on:input={handleInput}>{inputText}</span
		>
	</div>
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
		transition: 180ms ease-in-out;
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
	}

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

	.focused {
		box-shadow: 0 0 4px #6cb6ff;
	}

	::selection {
		background-color: hsl(210, 30%, 35%);
		color: #e0e0e0;
	}
</style>
