<script lang="ts">
    import type { SvelteComponent } from "svelte";

    export let component: typeof SvelteComponent;

    export let props: Record<string, any> = {};
</script>

<svelte:component this={component} {...props} />
