<script>
    import { currentContext, lastMajorContext } from "../GameState.js"
    import FloatingUiFrame from "./FloatingUIFrame.svelte";
    import FullscreenOverlay from "./FullscreenOverlay.svelte"
    import OpaqueMenuOverlay from "./OpaqueMenuOverlay.svelte";

    let name = "Gallery";
    $: visible = $currentContext === name;
</script>

<OpaqueMenuOverlay {name} {visible}>
    
</OpaqueMenuOverlay>



<style></style>