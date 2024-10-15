<script lang="ts">
    import TextPrompt from "$lib/components/prompts/TextPrompt.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let terminalIndex: number;

    let self: HTMLDivElement;
    let textPrompt: TextPrompt;
    let terminalHistory: string[] = [];
    let isActive: boolean = false;
    let isHovered: boolean = false;

    function scrollToBottom(): void {
        if (self) {
            self.scrollTop = self.scrollHeight;
        }
    }

    export function activate(): void {
        isActive = true;
        textPrompt.handleFocus();
    }

    export function deactivate(): void {
        isActive = false;
    }

    export function hover() {
        isHovered = true;
    }

    export function unhover() {
        isHovered = false;
    }

    function handleSubmitted(event: CustomEvent) {
        const { content } = event.detail;
        terminalHistory = [...terminalHistory, content];
    }

    function handleBlurred() {
        dispatch("blurred", { terminalIndex });
    }
</script>

<div class="terminal" class:active={isActive} class:hovered={isHovered} bind:this={self}>
    {#each terminalHistory as command}
        <div class="terminal__command">{command}</div>
    {/each}
    <TextPrompt bind:this={textPrompt} on:submitted={handleSubmitted} on:blurred={handleBlurred} />
</div>

<style>
    .terminal {
        border: solid 1px #444c56;
        border-radius: 0.3em;
        padding: 1rem;
        box-sizing: border-box;
        background-color: #22272e;
        font-family: "Fira Code", "Courier New", Courier, monospace;
        height: 100%;
        outline: none;
        transition: 120ms ease-in-out;
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
        background-color: #768390;
    }

    .terminal__command {
        color: #adbac7;
        font-size: 1rem;
        margin-bottom: 0.1rem;
        white-space: nowrap;
        white-space: pre;
    }

    .active {
        border: solid 1px #6cb6ff;
    }

    .hovered {
        border: solid 1px #89d185;
    }
</style>
