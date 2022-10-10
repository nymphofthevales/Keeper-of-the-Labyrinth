<script></script>

<div>
    <img src="./assets/ui/overlay-frame-transparent.png" alt=""/>
    <slot></slot>
</div>

<style>
    div {
        position: absolute;
        height: 85vh;
    }

    img {
        position: absolute;
        left: 0;
        top: 0;
        width: calc(2650 / 4200) * 85vw;
        height: calc(4200 / 2650) * 85vw;
    }

</style>