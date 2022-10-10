<script>
    import { currentContext, lastMajorContext } from "../GameState.js"
    $: isHovered = false;
    $: isActive = false;

    function renderHover() {
        isHovered = true;
    }
    function renderActive() {
        isActive = true;
    }
    function action() {
        console.log("going to" + $lastMajorContext)
        currentContext.update(c=>$lastMajorContext);
        clear()
    }
    function clear() {
        isActive = false;
        isHovered = false;
    }
</script>

<button id="context-exit" 
    on:mouseover={renderHover} 
    on:mousedown={renderActive} 
    on:mouseup={action} 
    on:mouseleave={clear}
    on:focus={renderHover} 
    on:keydown={e=>{e.key=="Enter" ? renderActive() : null}}
    on:keyup={e=>{e.key=="Enter" ? action() : null}}
    on:focusout={clear}>
    <p>Close menu.</p>
    {#if isHovered}
        <img src="./assets/ui/close-button-hover.png" alt="Close current menu.">
    {:else if isActive}
        <img src="./assets/ui/close-button-active.png" alt="Close current menu.">
    {:else}
        <img src="./assets/ui/close-button.png" alt="Close current menu.">
    {/if}
</button>

<style>
    button {
        width: 60px;
        height: 60px;
        position: relative;
        z-index: 1;
    }

    img {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }
</style>