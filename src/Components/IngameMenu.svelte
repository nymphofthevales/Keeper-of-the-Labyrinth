<script>
    import { currentContext }  from "../GameState.js"
    $: visible = $currentContext === "IngameMenu"
</script>

<div class:hidden={!visible}>
    <h2>Ingame Menu</h2>
</div>


<style></style>