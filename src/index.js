// Import CSS for webpack
import "./scss/style.scss";

// // Import images for webpack
// import "./images/mine.png";
// import "./images/flag.png";

import Game from "./components/Game";

// Menu items
const gameMenu = document.querySelector("#game-menu");
const newGameBtn = document.querySelector("#btn-game-new");
const abordGameBtn = document.querySelector("#btn-game-abord");
const difficultiesSection = document.querySelector("#difficulties");
const difficultiesBtnList = document.querySelectorAll("#difficulties button");

const game = new Game();

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
      game.stop();
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
      const id = btn.getAttribute("id");
      const difficulty = id.split("-")[2];

      // Init new game
      game.init(difficulty);
    });
  });
});
