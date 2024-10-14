<script>
    let textArray = ['H', 'e', 'l', 'l', 'o']; // Array representando o texto
    let cursorPosition = 0; // Posição inicial do cursor
    let selectionStart = null; // Posição de início da seleção
    let selectionEnd = null; // Posição de fim da seleção

    function handleKeyDown(event) {
        const key = event.key;

        if (event.shiftKey) {
            // Se shift está pressionado, ajustamos o range de seleção
            if (key === 'ArrowLeft' && cursorPosition > 0) {
                cursorPosition--;
                updateSelection();
            } else if (key === 'ArrowRight' && cursorPosition < textArray.length) {
                cursorPosition++;
                updateSelection();
            }
        } else {
            // Se não está selecionando, move o cursor sem alterar a seleção
            resetSelection();

            if (key.length === 1) { // Inserir caractere
                textArray = [
                    ...textArray.slice(0, cursorPosition),
                    key,
                    ...textArray.slice(cursorPosition)
                ];
                cursorPosition++; // Move o cursor após inserir o caractere
            } else if (key === 'Backspace' && cursorPosition > 0) {
                textArray = [
                    ...textArray.slice(0, cursorPosition - 1),
                    ...textArray.slice(cursorPosition)
                ];
                cursorPosition--; // Move o cursor para a esquerda
            } else if (key === 'Delete' && cursorPosition < textArray.length) {
                textArray = [
                    ...textArray.slice(0, cursorPosition),
                    ...textArray.slice(cursorPosition + 1)
                ];
            } else if (key === 'ArrowLeft' && cursorPosition > 0) {
                cursorPosition--; // Move o cursor para a esquerda
            } else if (key === 'ArrowRight' && cursorPosition < textArray.length) {
                cursorPosition++; // Move o cursor para a direita
            }
        }

        event.preventDefault();
    }

    function updateSelection() {
        if (selectionStart === null) {
            selectionStart = cursorPosition;
        }
        selectionEnd = cursorPosition;
    }

    function resetSelection() {
        selectionStart = null;
        selectionEnd = null;
    }

    function renderTextWithCursor() {
        let beforeCursor = '';
        let cursorChar = '';
        let afterCursor = '';
        
        if (selectionStart !== null && selectionEnd !== null) {
            const start = Math.min(selectionStart, selectionEnd);
            const end = Math.max(selectionStart, selectionEnd);
            
            beforeCursor = textArray.slice(0, start).join('');
            const selectedText = textArray.slice(start, end).join('');
            afterCursor = textArray.slice(end).join('');

            return (
                beforeCursor +
                `<span class="selected">${selectedText}</span>` +
                afterCursor
            );
        } else {
            beforeCursor = textArray.slice(0, cursorPosition).join('');
            cursorChar = textArray[cursorPosition] || ' ';
            afterCursor = textArray.slice(cursorPosition + 1).join('');

            return beforeCursor + `<span class="cursor">${cursorChar}</span>` + afterCursor;
        }
    }
</script>

<div
    tabindex="0"
    class="editable-span"
    on:keydown={handleKeyDown}
    on:blur={() => (cursorVisible = false)}
    on:focus={() => (cursorVisible = true)}
    bind:this={spanElement}
    role="textbox"
    aria-multiline="false"
    contenteditable="false"
>
    {@html renderTextWithCursor()}
</div>

<style>
    .editable-span {
        display: inline-block;
        border: 1px solid #ccc;
        padding: 4px;
        min-width: 200px;
        font-family: monospace;
        white-space: nowrap;
    }

    .cursor {
        text-decoration: underline;
    }

    .selected {
        background-color: lightblue;
    }
</style>
