<script>
    import FullscreenOverlay from "./FullscreenOverlay.svelte";
    import FloatingUiFrame from "./FloatingUIFrame.svelte";

    export let visible;
    export let name;

</script>

<FullscreenOverlay hidden={!visible}>
    <FloatingUiFrame>
        <h1>{name}</h1>
        <slot></slot>
    </FloatingUiFrame>
</FullscreenOverlay>