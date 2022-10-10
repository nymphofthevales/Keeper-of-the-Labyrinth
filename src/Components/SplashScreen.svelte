<script>
    import { GameState}  from "../GameState.js"
    let context = GameState.currentContext;
    $: visible = $context === "SplashScreen"
</script>

<div class:hidden={!visible}>
    <h2>SplashScreen</h2>
</div>


<style></style>