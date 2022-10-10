<script>
    import { GameState } from "../GameState.js"
    let context = GameState.currentContext;
    $: visible = $context === "GameView"
</script>

<div class:hidden={!visible}>
    <h2>Game View</h2>
</div>


<style></style>