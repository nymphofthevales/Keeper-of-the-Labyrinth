<script>
    import { currentContext }  from "../GameState.js"
    $: visible = $currentContext === "MainMenu"
</script>

<div class:hidden={!visible}>
    <h2>Main Menu</h2>
</div>


<style></style>