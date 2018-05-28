import Board from "./Board";
import Timer from "./Timer";

const abordGameBtn = document.querySelector("#btn-game-abord");
const newGameBtn = document.querySelector("#btn-game-new");
const difficultiesSection = document.querySelector("#difficulties");
const counter = document.querySelector("#counter");

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
    this._perfectScore = 0;
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
        this._perfectScore = 10 ** 2;
        break;
      case "normal":
        this._board = new Board(18, 18, this);
        this._perfectScore = 18 ** 2;
        break;
      case "hard":
        this._board = new Board(25, 25, this);
        this._perfectScore = 25 ** 2;
        break;
    }

    // Setup the board
    this._board.init();
    this._board.element.classList.add(this._difficulty);

    this._board.element.addEventListener("mousedown", event =>
      this.onBoardClick(event)
    );
    console.log(this);
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

  scoreIncrement() {
    this._score += 1;
    counter.innerHTML = this._score;
    if (this._score + this._board.mineCount === this._perfectScore) {
      this._score = this._perfectScore;
      counter.innerHTML = this._score;
      counter.classList.add("success");
      this.win();
    }
  }

  win() {
    this._board.boardData.forEach(tile => {
      if (tile.isMined) {
        tile.element.classList.add("success");
      }
    });
    this.stop();
    this._board.element.classList.add("disabled");
    this._timer.element.classList.add("success");
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
    counter.innerHTML = this._score;
    counter.classList.remove("success");
    counter.classList.remove("failure");
  }

  // Events

  onBoardClick(event) {
    if (!this.firstClick) {
      this.firstClick = true;
      this.start();
    }
    difficultiesSection.classList.remove("active");
    newGameBtn.classList.remove("active");
  }
}
