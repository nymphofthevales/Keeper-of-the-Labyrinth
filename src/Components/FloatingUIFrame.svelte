<script>
    import CloseContextButton from "./CloseContextButton.svelte";
</script>

<CloseContextButton/>
<div>
    <img src="./assets/ui/overlay-frame-transparent.png" alt=""/>
    <slot></slot>
</div>

<style>
    div {
        position: absolute;
        height: 85vh;
        width: calc(85vh * calc(4200/2650));

        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        padding: 50px;
    }

    img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }

</style>