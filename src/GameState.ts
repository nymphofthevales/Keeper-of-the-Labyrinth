
import { writable, readable, derived } from "svelte/store"

    export const devMode = true

    export const currentContext = writable("SplashScreen")
	let _lastMajorContext = "MainMenu";
	export const lastMajorContext = derived(currentContext, $currentContext => {
		if (majorContexts.includes($currentContext)) {
			_lastMajorContext = $currentContext;
		}
		return _lastMajorContext;
	})
    export const contexts = [
		"SplashScreen",
		"MainMenu",
		"Gallery",
		"Map",
		"Options",
		"Credits",
		"GameView"
	]
	export const majorContexts = [
		"MainMenu",
		"GameView"
	]

