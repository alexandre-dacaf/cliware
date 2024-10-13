<script lang="ts">
	let inputText: string = '';
	let terminalHistory: string[] = [];
	let isFocused = false;

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			terminalHistory = [...terminalHistory, inputText];
			inputText = '';
		} else if (event.key === 'Backspace') {
			inputText = inputText.slice(0, -1);
		} else if (event.key.length === 1) {
			inputText += event.key;
		}
	}

	function handleFocus() {
		isFocused = true;
	}

	function handleBlur() {
		isFocused = false;
	}
</script>

<div
	class="terminal"
	tabindex="0"
	on:keydown={handleKeyPress}
	on:focus={handleFocus}
	on:blur={handleBlur}
	class:focused={isFocused}
>
	{#each terminalHistory as command}
		<div class="terminal__command">{command}</div>
	{/each}
	<div class="terminal__prompt">
		> {inputText}<span class="cursor" class:active={isFocused}>_</span>
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
	}

	.terminal__command {
		color: #c9c9c9;
		font-size: 1.2rem;
		margin-bottom: 0.1rem;
	}

	.terminal__prompt {
		font-size: 1.2rem;
		color: #e0e0e0;
		transition: 200ms;
	}

	.focused {
		box-shadow: 0 0 4px #6cb6ff;
	}

	.cursor {
		display: none;
		width: 10px;
		background-color: transparent;
		animation: blink 900ms step-start infinite;
	}

	.cursor.active {
		display: inline;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
