import { writable, readable } from "svelte/store";
export const GameState = {
    devMode: readable(true),
    currentContext: writable("SplashScreen"),
    contexts: [
        "SplashScreen",
        "MainMenu",
        "Gallery",
        "MapViewer",
        "OptionsMenu",
        "CreditsPage",
        "GameView"
    ]
};
//# sourceMappingURL=GameState.js.map