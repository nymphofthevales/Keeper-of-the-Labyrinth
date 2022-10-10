<script>
    import { GameState } from "../GameState.js"
    let name = "Journal";
    let context = GameState.currentContext;
    $: visible = $context === name;
</script>

<div class:hidden={!visible}>
    <h2>{name}</h2>
</div>


<style></style>