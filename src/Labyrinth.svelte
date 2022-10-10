<script lang="ts">
	import SplashScreen from "./Components/SplashScreen.svelte"
	import MainMenu from "./Components/MainMenu.svelte"
	import Gallery from "./Components/Gallery.svelte"
	import MapViewer from "./Components/MapViewer.svelte"
	import OptionsMenu from "./Components/OptionsMenu.svelte"
	import CreditsPage from "./Components/CreditsPage.svelte"
	import GameView from "./Components/GameView.svelte"
	import DevNavigator from "./Components/DevNavigator.svelte"
	export let name: string;
</script>

<main>
	<h1>Welcome to the {name} Svelte build!</h1>
	<SplashScreen/>
	<MainMenu/>
	<Gallery/>
	<MapViewer/>
	<OptionsMenu/>
	<CreditsPage/>
	<GameView/>
	<DevNavigator/>

</main>
