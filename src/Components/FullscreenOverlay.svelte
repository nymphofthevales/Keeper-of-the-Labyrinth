<script type="ts">
    export let hidden: boolean;

</script>

<main class:hidden={hidden}>
    <slot></slot>
</main>

<style>
    main {
        width: 100vw;
        height: 100vh;
        background-color: black;
    }
</style>