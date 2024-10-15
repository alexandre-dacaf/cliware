<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let self: HTMLDivElement;
    let content: string = "";

    function handleKeyPress(event: KeyboardEvent): void {
        const key = event.key;
        const isCtrlPressed = event.ctrlKey || event.metaKey;
        const isShiftPressed = event.shiftKey;

        switch (key) {
            case "Enter":
                event.preventDefault();
                handleEnter();
                break;
            case "Escape":
                event.preventDefault();
                handleEsc();
                break;
            default:
                break;
        }
    }

    function handleEnter(): void {
        dispatch("enterPressed", { content });
    }

    function handleEsc(): void {
        handleBlur();
    }

    function handleInput(event: Event): void {
        content = self.innerText;
    }

    export function clear(): void {
        console.log("[placeholder] clearing...");
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
            dispatch("blurred");
        }
    }
</script>

<div class="text-input" contenteditable="true" bind:this={self} on:keypress={handleKeyPress} on:input={handleInput} role="textbox" tabindex="0"></div>

<style>
    .text-input {
        outline: none;
        color: #CDD9E5;
		caret-color: #316dca;
		caret-shape: underscore;
		border: none;
    }

    ::selection {
        background-color: #6cb6ff33;
        color: #6cb6ff;
    }
</style>
