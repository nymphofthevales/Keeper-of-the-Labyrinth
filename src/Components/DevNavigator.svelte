<script>
    import { currentContext, contexts, devMode } from "../GameState.js";
</script>


<nav class:hidden={!devMode === true}>
    <h3>Developer Navigator</h3>
    {#each contexts as x}
        <button on:click={()=> $currentContext = x}>{x}</button>
    {/each}
</nav>


<style>
    button {
        display: block;
        padding: 5px;
        background-color: black;
        border: none;
        color: white;
        margin: 5px;
        width: 100px;
        text-align: left;
    }
    button:hover {
        background-color: #555555;
    }
    button:active {
        background-color: #bbbbbb;
        color: black;
    }
    nav {
        position: absolute;
        left:50px;
        width: 100px;
        height: auto;
        top: 50%;
        transform: translate(0, -50%);
        border-left: 1px solid white;
    }
</style>