import Game from "./components/Game";
import { Difficulty } from "./types";

// Menu items
const gameMenu = document.querySelector("#game-menu")!;
const newGameBtn = document.querySelector("#btn-game-new")!;
const abordGameBtn = document.querySelector("#btn-game-abord")!;
const difficultiesSection = document.querySelector("#difficulties")!;
const difficultiesBtnList = document.querySelectorAll("#difficulties button")!;
const counter = document.querySelector("#counter")!;

// Use var to make it global
const game: Game = new Game();
window.game = game;

// Events
window.addEventListener("load", () => {
  // Position the menu

  // Open/Close menu
  newGameBtn.addEventListener("click", () => {
    newGameBtn.classList.toggle("active");
    difficultiesSection.classList.toggle("active");
  });

  // Disable context menu
  window.addEventListener("contextmenu", event => {
    event.preventDefault();
  });

  // Stop the game if wanted
  abordGameBtn.addEventListener("click", () => {
    if (game.isStarted) {
      game.gameover();
      game.board.element.classList.add("disabled");
      counter.classList.add("failure");
    }
  });

  // New game starter
  difficultiesBtnList.forEach(btn => {
    btn.addEventListener("click", () => {
      if (game) game.reset();

      // Remove active state on menu buttons
      gameMenu.classList.remove("no-current-game");
      newGameBtn.classList.toggle("active");
      difficultiesSection.classList.toggle("active");

      // Get difficulty attribute
      const id = btn.getAttribute("id")!;
      const difficulty = id.split("-")[2];

      // Init new game
      game.new(difficulty as Difficulty);
    });
  });
});
