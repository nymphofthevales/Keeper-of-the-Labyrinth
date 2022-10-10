<script>
    import { currentContext } from "../GameState.js"
    import FloatingUiFrame from "./FloatingUIFrame.svelte";
    import FullscreenOverlay from "./FullscreenOverlay.svelte"

    let name = "Gallery";
    $: visible = $currentContext === name;
</script>

<FullscreenOverlay hidden={!visible}>
    <FloatingUiFrame>
        <h2>{name}</h2>
    </FloatingUiFrame>
</FullscreenOverlay>



<style></style>