<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let self: HTMLDivElement;
	let content: string = '';

	function handleKeyDown(event: KeyboardEvent): void {
		const key = event.key;
		const isCtrlPressed = event.ctrlKey || event.metaKey;
		const isShiftPressed = event.shiftKey;

		switch (key) {
			case 'Enter':
				event.preventDefault();
				handleEnter();
				break;
			case 'Escape':
				event.preventDefault();
				handleEsc();
				break;
			case 'Tab':
				event.preventDefault();
				break;
			default:
				break;
		}
	}

	function handleEnter(): void {
		dispatch('enterPressed', { content });
	}

	function handleEsc(): void {
		handleBlur();
	}

	function handleInput(event: Event): void {
		const selection = window.getSelection();
		const range = selection?.getRangeAt(0);
		const cursorPosition = range ? range.endOffset : 0;

		// Remove tags HTML mantendo apenas o texto
		if (self.innerHTML) {
			// Converte o conteúdo da div para texto plano
			const text = self.textContent || '';
			// Atualiza o content sem tags
			self.innerHTML = text.replace(/\n/g, '<br>'); // Ou mantenha a formatação conforme necessário
			content = text;
		}

		// Restaurar a posição do cursor
		if (self.childNodes.length > 0 && selection) {
			const newRange = document.createRange();
			newRange.setStart(
				self.childNodes[0],
				Math.min(cursorPosition, self.childNodes[0].textContent?.length || 0)
			);
			newRange.collapse(true);
			selection.removeAllRanges();
			selection.addRange(newRange);
		}
	}

	export function clear(): void {
		self.textContent = '';
		content = self.textContent;
	}

	export function handleFocus(): void {
		if (self) {
			self.focus();
			const range = document.createRange();
			const selection = window.getSelection();
			range.selectNodeContents(self);
			range.collapse(false);
			selection?.removeAllRanges();
			selection?.addRange(range);
		}
	}

	function handleBlur(): void {
		if (self) {
			self.blur();
			dispatch('blurred');
		}
	}
</script>

<div
	class="text-input"
	contenteditable="true"
	bind:this={self}
	on:keydown={handleKeyDown}
	on:input={handleInput}
	role="textbox"
	tabindex="0"
></div>

<style>
	.text-input {
		outline: none;
		color: #cdd9e5;
		caret-color: #316dca;
		caret-shape: underscore;
		border: none;
	}

	::selection {
		background-color: #6cb6ff33;
		color: #6cb6ff;
	}
</style>
