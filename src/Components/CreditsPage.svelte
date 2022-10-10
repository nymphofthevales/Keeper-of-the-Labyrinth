<script>
    import { GameState } from "../GameState.js"
    let context = GameState.currentContext;
    $: visible = $context === "CreditsPage"
</script>

<div class:hidden={!visible}>
    <h2>Credits</h2>
</div>


<style></style>