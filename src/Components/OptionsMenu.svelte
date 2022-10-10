<script>
    import OpaqueMenuOverlay from "./OpaqueMenuOverlay.svelte";
    import { currentContext }  from "../GameState.js"

    let name = "Options"
    $: visible = $currentContext === name;
</script>

<OpaqueMenuOverlay {name} {visible}>
    
</OpaqueMenuOverlay>


<style></style>