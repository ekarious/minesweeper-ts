import Game from "./components/Game";

declare global {
    interface Window {
        game: Game;
    }
}