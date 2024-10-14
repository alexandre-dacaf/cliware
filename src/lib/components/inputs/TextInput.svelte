<script lang="ts">
	let textArray: string[] = [];
	let cursorPosition: number = 0;
	let selectionStart: number = -1;
	let textBeforeCursor: string = '';
	let cursorChar: string = '';
	let textAfterCursor: string = '';
	let selectedText: string = '';

	export function handleKeyPress(event: KeyboardEvent) {
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
					handleHome(isShiftPressed);
					break;
				case 'End':
					handleEnd(isShiftPressed);
					break;
				default:
					break;
			}
		}

		updateCursor();
	}

	function insertCharacter(char: string) {
		if (selectionStart !== -1) {
			// Remove a seleção atual e insere o caractere no lugar
			replaceSelectedText(char);
		} else {
			// Caso não haja seleção, insere o caractere na posição atual do cursor
			textArray = [...textArray.slice(0, cursorPosition), char, ...textArray.slice(cursorPosition)];
			cursorPosition++;
		}
		cancelSelection();
	}

	function replaceSelectedText(char: string) {
		const [start, end] = getSelectionRange();
		textArray = [
			...textArray.slice(0, start), // Parte antes da seleção
			char, // Novo caractere inserido
			...textArray.slice(end) // Parte após a seleção
		];
		cursorPosition = start + 1; // Posiciona o cursor após o novo caractere
	}

	// Função para obter o intervalo da seleção

	function handleBackspace() {
		if (selectionStart !== -1) {
			// Remove a seleção atual e insere o caractere no lugar
			replaceSelectedText('');
		} else {
			if (cursorPosition > 0) {
				textArray = [...textArray.slice(0, cursorPosition - 1), ...textArray.slice(cursorPosition)];
				cursorPosition--;
			}
		}
		cancelSelection();
	}

	function handleDelete() {
		if (selectionStart !== -1) {
			// Remove a seleção atual e insere o caractere no lugar
			replaceSelectedText('');
		} else {
			if (cursorPosition < textArray.length) {
				textArray = [...textArray.slice(0, cursorPosition), ...textArray.slice(cursorPosition + 1)];
			}
		}
		cancelSelection();
	}

	function handleArrowLeft(isShiftPressed: boolean, isCtrlPressed: boolean) {
		if (isCtrlPressed) {
			moveToPreviousWord(isShiftPressed); // Passa o estado do Shift para expandir ou não a seleção
		} else if (isShiftPressed) {
			handleSelectionStart();
			if (cursorPosition > 0) cursorPosition--;
		} else {
			if (cursorPosition > 0) cursorPosition--;
			cancelSelection();
		}
	}

	function handleArrowRight(isShiftPressed: boolean, isCtrlPressed: boolean) {
		if (isCtrlPressed) {
			moveToNextWord(isShiftPressed); // Passa o estado do Shift para expandir ou não a seleção
		} else if (isShiftPressed) {
			handleSelectionStart();
			if (cursorPosition < textArray.length) cursorPosition++;
		} else {
			if (cursorPosition < textArray.length) cursorPosition++;
			cancelSelection();
		}
	}

	function handleHome(isShiftPressed: boolean) {
		if (isShiftPressed) handleSelectionStart();
		cursorPosition = 0;
		selectionStart = isShiftPressed ? selectionStart : -1;
	}

	function handleEnd(isShiftPressed: boolean) {
		if (isShiftPressed) handleSelectionStart();
		cursorPosition = textArray.length;
		selectionStart = isShiftPressed ? selectionStart : -1;
	}

	function handleSelectionStart() {
		if (selectionStart === -1) selectionStart = cursorPosition;
	}

	function getSelectionRange(): [number, number] {
		// Retorna o início e o fim da seleção em ordem crescente
		return [Math.min(selectionStart, cursorPosition), Math.max(selectionStart, cursorPosition)];
	}

	function cancelSelection() {
		selectionStart = -1;
	}

	function updateCursor() {
		if (selectionStart !== -1) {
			const [start, end] = [
				Math.min(selectionStart, cursorPosition),
				Math.max(selectionStart, cursorPosition)
			];
			textBeforeCursor = textArray.slice(0, start).join('');
			selectedText = textArray.slice(start, end).join('');
			cursorChar = textArray[end] || ' ';
			textAfterCursor = textArray.slice(end + 1).join('');
		} else {
			textBeforeCursor = textArray.slice(0, cursorPosition).join('');
			selectedText = '';
			cursorChar = textArray[cursorPosition] || ' ';
			textAfterCursor = textArray.slice(cursorPosition + 1).join('');
		}
	}

	function moveToPreviousWord(isShiftPressed: boolean) {
		if (cursorPosition > 0) {
			// Ajuste para lidar com seleção quando o Shift estiver pressionado
			if (isShiftPressed) handleSelectionStart();

			while (cursorPosition > 0 && !isAlphaNumeric(textArray[cursorPosition - 1])) {
				cursorPosition--;
			}
			while (cursorPosition > 0 && isAlphaNumeric(textArray[cursorPosition - 1])) {
				cursorPosition--;
			}
		}
	}

	function moveToNextWord(isShiftPressed: boolean) {
		if (cursorPosition < textArray.length) {
			// Ajuste para lidar com seleção quando o Shift estiver pressionado
			if (isShiftPressed) handleSelectionStart();

			while (cursorPosition < textArray.length && !isAlphaNumeric(textArray[cursorPosition])) {
				cursorPosition++;
			}
			while (cursorPosition < textArray.length && isAlphaNumeric(textArray[cursorPosition])) {
				cursorPosition++;
			}
		}
	}

	function isAlphaNumeric(char: string): boolean {
		return /\p{L}|\p{N}/u.test(char);
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
		border: 1px solid #ccc;
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
		background-color: #ccc;
		color: #444;
	}
</style>
