<script>
    import OpaqueMenuOverlay from "./OpaqueMenuOverlay.svelte";
    import { currentContext }  from "../GameState.js"

    let name = "Credits"
    $: visible = $currentContext=== name;
</script>

<OpaqueMenuOverlay {name} {visible}>
    
</OpaqueMenuOverlay>


<style></style>