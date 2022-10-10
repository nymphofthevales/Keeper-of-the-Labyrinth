<script>
    import { GameState } from "../GameState.js"
    let context = GameState.currentContext;
    $: visible = $context === "IngameMenu"
</script>

<div class:hidden={!visible}>
    <h2>Ingame Menu</h2>
</div>


<style></style>