<script>
    import { currentContext }  from "../GameState.js"
    let name = "SplashScreen"
    $: visible = $currentContext === name;
</script>

<div class:hidden={!visible}>
    <h2>SplashScreen</h2>
</div>


<style></style>