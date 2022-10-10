<script>
    import { currentContext }  from "../GameState.js"
    $: visible = $currentContext === "GameView"
</script>

<div class:hidden={!visible}>
    <h2>Game View</h2>
</div>


<style></style>