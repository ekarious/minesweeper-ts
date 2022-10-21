import Board from "./Board";
import Timer from "./Timer";
import Score from './Score';

import { Difficulties } from "../interfaces/difficulties";

const abordGameBtn = document.querySelector("#btn-game-abord")!;
const newGameBtn = document.querySelector("#btn-game-new")!;
const difficultiesSection = document.querySelector("#difficulties")!;
const counter = document.querySelector("#counter")!;

class Game {
  difficulty: Difficulties = Difficulties.easy;
  state: "new" | "paused" | "ongoing" | "won" | "gameover" = "new";
  timer: Timer = new Timer();
  board: Board = new Board();
  score: Score = new Score();

  firstClick: boolean = false;

  constructor() {}

  new(difficulty: Difficulties): void {
    this.state = "new";
    this.firstClick = false;
    this.timer.reset();
    this.score.score = 0;

    this.difficulty = difficulty;

    // Setup the game
    switch (this.difficulty) {
      case Difficulties.easy.toLowerCase():
        this.board.setup(10, 10);
        this.score.toWin = 10 ** 2;
        break;
      case Difficulties.normal.toLowerCase():
        this.board.setup(18, 18);
        this.score.toWin = 18 ** 2;
        break;
      case Difficulties.hard.toLowerCase():
        this.board.setup(25, 25);
        this.score.toWin = 25 ** 2;
        break;
    }

    this.board.element.classList.add(this.difficulty);

    this.board.element.addEventListener("mousedown", event => {
      this.onBoardClick()
    })
  }

  start(): void {
    this.state = 'ongoing';
    this.timer.start();

    abordGameBtn.classList.remove('hidden');
  }

  win() {
    this.board.boardData.forEach(tile => {
      if (tile.isMined) {
        tile.element.classList.add("success");
      }
    });
    this.board.element.classList.add("disabled");
    this.timer.element.classList.add("success");
    this.state = 'won';
    this.timer.stop();
    abordGameBtn.classList.add("hidden");
  }

  gameover() {
    this.board.boardData.forEach(tile => {
      if (tile.isMined) {
        tile.element.classList.add("failure");
      }
    });
    this.board.element.classList.add("disabled");
    this.timer.element.classList.add("failure");
    this.state = 'gameover';
    this.timer.stop();
    abordGameBtn.classList.add("hidden");
  }

  reset(): void {
    this.state = 'new';
    this.score.reset();
    this.timer.reset();
    this.board.reset();

    counter.innerHTML = this.score.score.toString();
    counter.classList.remove("success");
    counter.classList.remove("failure");
  }

  get isStarted(): boolean {
    return this.state == 'ongoing';
  }

  get isGameOver(): boolean {
    return this.state == 'gameover';
  }

  // Events

  onBoardClick() {
    if (!this.firstClick) {
      this.firstClick = true;
      this.start();
    }
    difficultiesSection.classList.remove("active");
    newGameBtn.classList.remove("active");
  }
}

export default Game;
