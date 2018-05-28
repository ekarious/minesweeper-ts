import Board from "./Board";
import Timer from "./Timer";

const abordGameBtn = document.querySelector("#btn-game-abord");

/**
 * The main class for the game
 *
 * @export
 * @class Game
 */
export default class Game {
  /**
   * Creates an instance of Game.
   * @memberof Game
   */
  constructor() {
    this._difficulty = "easy";
    this._started = false;
    this._gameOver = false;
    this._score = 0;
    this._timer = new Timer();
    this._board = undefined;
    this.firstClick = false;
  }

  /**
   * Initialize the game
   *
   * @param {string} [level="easy"]
   * @memberof Game
   */
  init(level = "easy") {
    this._gameOver = false;
    this.firstClick = false;
    this._timer.reset();
    this._score = 0;

    this._difficulty = level;

    // Setup the game
    switch (this._difficulty) {
      case "easy":
        this._board = new Board(10, 10, this);
        break;
      case "normal":
        this._board = new Board(18, 18, this);
        break;
      case "hard":
        this._board = new Board(25, 25, this);
        break;
    }

    // Setup the board
    this._board.init();
    this._board.element.classList.add(this._difficulty);

    this._board.element.addEventListener("mousedown", event =>
      this.onBoardClick(event)
    );
  }

  get isStarted() {
    return this._started;
  }

  get isGameOver() {
    return this._gameOver;
  }

  setGameOver(value) {
    this._gameOver = value;
  }

  /**
   * Start a game
   *
   * @memberof Game
   */
  start() {
    this._started = true;
    this._timer.start();

    abordGameBtn.classList.remove("hidden");
  }

  /**
   * Stop the game
   *
   * @memberof Game
   */
  stop() {
    console.log("game stopped");
    this._started = false;
    this._timer.stop();
    abordGameBtn.classList.add("hidden");
  }

  /**
   * Reset the game
   *
   * @memberof Game
   */
  reset() {
    this._started = false;
    this._gameOver = false;
    this._score = 0;
    this._board = undefined;
  }

  // Events

  onBoardClick(event) {
    if (!this.firstClick) {
      this.firstClick = true;
      this.start();
    }
  }
}
