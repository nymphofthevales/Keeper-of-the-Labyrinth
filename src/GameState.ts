
import { writable, readable } from "svelte/store"

    export const devMode = true

    export const currentContext = writable("SplashScreen")
    export const contexts = [
		"SplashScreen",
		"MainMenu",
		"Gallery",
		"MapViewer",
		"OptionsMenu",
		"CreditsPage",
		"GameView"
	]

