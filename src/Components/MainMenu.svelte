<script>
    import { GameState } from "../GameState.js"
    let context = GameState.currentContext;
    $: visible = $context === "MainMenu"
</script>

<div class:hidden={!visible}>
    <h2>Main Menu</h2>
</div>


<style></style>