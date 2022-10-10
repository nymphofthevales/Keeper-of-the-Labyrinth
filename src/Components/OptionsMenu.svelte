<script>
    import { GameState } from "../GameState.js"
    let context = GameState.currentContext;
    $: visible = $context === "OptionsMenu"
</script>

<div class:hidden={!visible}>
    <h2>Options Menu</h2>
</div>


<style></style>