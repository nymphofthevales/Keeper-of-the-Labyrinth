<script>
    import { GameState } from "../GameState.js"
    let context = GameState.currentContext;
    $: visible = $context === "MapViewer"
</script>

<div class:hidden={!visible}>
    <h2>Map Viewer</h2>
</div>


<style></style>