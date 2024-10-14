<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let textArray: string[] = [];
	let cursorPosition: number = 0;
	let selectionStart: number = -1;
	let textBeforeCursor: string = '';
	let cursorChar: string = '';
	let textAfterCursor: string = '';
	let selectedText: string = '';

	const dispatch = createEventDispatcher();

	export function handleKeyPress(event: KeyboardEvent): void {
		const key = event.key;
		const isCtrlPressed = event.ctrlKey || event.metaKey;
		const isShiftPressed = event.shiftKey;

		if (isShiftPressed) {
			event.preventDefault();
		}

		if (key.length === 1) {
			insertCharacter(key);
		} else {
			switch (key) {
				case 'Backspace':
					handleBackspace();
					break;
				case 'Delete':
					handleDelete();
					break;
				case 'ArrowLeft':
					handleArrowLeft(isShiftPressed, isCtrlPressed);
					break;
				case 'ArrowRight':
					handleArrowRight(isShiftPressed, isCtrlPressed);
					break;
				case 'Home':
					handleHome(isShiftPressed, isCtrlPressed);
					break;
				case 'End':
					handleEnd(isShiftPressed, isCtrlPressed);
					break;
				case 'Enter':
					handleEnter(isShiftPressed);
					break;
				default:
					break;
			}
		}

		updateCursor();
	}

	function insertCharacter(char: string): void {
		if (hasActiveSelection()) {
			replaceSelectedText(char);
		} else {
			const [arrayBefore, arrayAfter] = sliceTextArray(cursorPosition, cursorPosition);
			textArray = [...arrayBefore, char, ...arrayAfter];
			cursorPosition++;
		}
		cancelSelection();
	}

	function handleBackspace(): void {
		if (hasActiveSelection()) {
			replaceSelectedText('');
		} else {
			if (cursorPosition > 0) {
				const [arrayBefore, arrayAfter] = sliceTextArray(cursorPosition - 1, cursorPosition);
				textArray = [...arrayBefore, ...arrayAfter];
				cursorPosition--;
			}
		}
		cancelSelection();
	}

	function handleDelete(): void {
		if (hasActiveSelection()) {
			replaceSelectedText('');
		} else {
			if (cursorPosition < textArray.length) {
				const [arrayBefore, arrayAfter] = sliceTextArray(cursorPosition, cursorPosition + 1);
				textArray = [...arrayBefore, ...arrayAfter];
			}
		}
		cancelSelection();
	}

	function handleArrowLeft(isShiftPressed: boolean, isCtrlPressed: boolean): void {
		if (isCtrlPressed) {
			moveToPreviousWord(isShiftPressed);
		} else if (isShiftPressed) {
			handleSelectionStart();
			if (cursorPosition > 0) cursorPosition--;
		} else {
			if (cursorPosition > 0) cursorPosition--;
			cancelSelection();
		}
	}

	function handleArrowRight(isShiftPressed: boolean, isCtrlPressed: boolean): void {
		if (isCtrlPressed) {
			moveToNextWord(isShiftPressed);
		} else if (isShiftPressed) {
			handleSelectionStart();
			if (cursorPosition < textArray.length) cursorPosition++;
		} else {
			if (cursorPosition < textArray.length) cursorPosition++;
			cancelSelection();
		}
	}

	function handleHome(isShiftPressed: boolean, isCtrlPressed: boolean): void {
		if (isCtrlPressed) {
			if (isShiftPressed) handleSelectionStart();
			cursorPosition = 0;
		} else {
			if (isShiftPressed) handleSelectionStart();
			moveToLineStart(isShiftPressed);
		}
		selectionStart = isShiftPressed ? selectionStart : -1;
	}

	function handleEnd(isShiftPressed: boolean, isCtrlPressed: boolean): void {
		if (isCtrlPressed) {
			if (isShiftPressed) handleSelectionStart();
			cursorPosition = textArray.length;
		} else {
			if (isShiftPressed) handleSelectionStart();
			moveToLineEnd(isShiftPressed);
		}
		selectionStart = isShiftPressed ? selectionStart : -1;
	}

	function handleEnter(isShiftPressed: boolean): void {
		cancelSelection();
		if (isShiftPressed) {
			insertCharacter('\n');
		} else {
			const content = textArray.join('');
			dispatch('enterPressed', { content });
		}
	}

	function replaceSelectedText(char: string): void {
		const [start, end] = getSelectionRange();
		const [arrayBefore, arrayAfter] = sliceTextArray(start, end);
		textArray = [...arrayBefore, char, ...arrayAfter];
		cursorPosition = start + 1;
	}

	function sliceTextArray(start: number, end: number): [string[], string[]] {
		return [textArray.slice(0, start), textArray.slice(end)];
	}

	function hasActiveSelection(): boolean {
		return selectionStart !== -1;
	}

	function handleSelectionStart(): void {
		if (selectionStart === -1) selectionStart = cursorPosition;
	}

	function getSelectionRange(): [number, number] {
		return [Math.min(selectionStart, cursorPosition), Math.max(selectionStart, cursorPosition)];
	}

	function cancelSelection(): void {
		selectionStart = -1;
	}

	function updateCursor(): void {
		if (hasActiveSelection()) {
			updateCursorWithSelection();
		} else {
			updateCursorWithoutSelection();
		}
	}

	function updateCursorWithSelection(): void {
		const [start, end] = getSelectionRange();
		textBeforeCursor = textArray.slice(0, start).join('');
		selectedText = textArray.slice(start, end).join('');
		updateCursorCharAndTextAfter(end);
	}

	function updateCursorWithoutSelection(): void {
		textBeforeCursor = textArray.slice(0, cursorPosition).join('');
		selectedText = '';
		updateCursorCharAndTextAfter(cursorPosition);
	}

	function updateCursorCharAndTextAfter(position: number): void {
		if (textArray[position] === '\n') {
			cursorChar = ' ';
			textAfterCursor = '\n' + textArray.slice(position + 1).join('');
		} else {
			cursorChar = textArray[position] || ' ';
			textAfterCursor = textArray.slice(position + 1).join('');
		}
	}

	function moveToPreviousWord(isShiftPressed: boolean): void {
		if (cursorPosition > 0) {
			if (isShiftPressed) handleSelectionStart();

			while (cursorPosition > 0 && !isAlphaNumeric(textArray[cursorPosition - 1])) {
				cursorPosition--;
			}
			while (cursorPosition > 0 && isAlphaNumeric(textArray[cursorPosition - 1])) {
				cursorPosition--;
			}
		}
	}

	function moveToNextWord(isShiftPressed: boolean): void {
		if (cursorPosition < textArray.length) {
			if (isShiftPressed) handleSelectionStart();

			while (cursorPosition < textArray.length && !isAlphaNumeric(textArray[cursorPosition])) {
				cursorPosition++;
			}
			while (cursorPosition < textArray.length && isAlphaNumeric(textArray[cursorPosition])) {
				cursorPosition++;
			}
		}
	}

	function moveToLineStart(isShiftPressed: boolean): void {
		if (cursorPosition > 0) {
			if (isShiftPressed) handleSelectionStart();

			while (cursorPosition > 0 && !isNewLine(textArray[cursorPosition - 1])) {
				cursorPosition--;
			}
		}
	}

	function moveToLineEnd(isShiftPressed: boolean): void {
		if (cursorPosition < textArray.length) {
			if (isShiftPressed) handleSelectionStart();

			while (cursorPosition < textArray.length && !isNewLine(textArray[cursorPosition])) {
				cursorPosition++;
			}
		}
	}

	function isAlphaNumeric(char: string): boolean {
		return /\p{L}|\p{N}/u.test(char);
	}

	function isNewLine(char: string): boolean {
		return /\n/.test(char);
	}

	export function clear(): void {
		textArray = [];
	}
</script>

<span class="editable-span">
	{textBeforeCursor}<span class="selected">{selectedText}</span><span class="cursor"
		>{cursorChar}</span
	>{textAfterCursor}
</span>

<style>
	.editable-span {
		display: inline-block;
		padding: 4px;
		min-width: 200px;
		font-family: monospace;
		white-space: nowrap;
		white-space: pre;
	}

	.cursor {
		text-decoration: underline;
		font-weight: bold;
	}

	.selected {
		background-color: #6cb6ff33;
		color: #6cb6ff;
	}
</style>
