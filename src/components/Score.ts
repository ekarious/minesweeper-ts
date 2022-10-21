const counter = document.querySelector("#counter")!;

class Score {
  _score: number = 0;
  get score(): number {
    return this._score;
  }
  set score(value: number) {
    this._score = value;
  }

  _message: string = "";
  get message(): string {
    return this._message;
  }
  set message(value: string) {
    this._message = value;
  }

  toWin: number = 0;

  constructor() {}

  reset(): void {
    this.score = 0;
    this.message = "";
  }

  increment() {
    this.score += 1;
    counter.innerHTML = this.score.toString()

    if (this.score + globalThis.game.board.mineCount === this.toWin) {
      this.score = this.toWin;
      counter.innerHTML = this.score.toString();
      counter.classList.add("success");
      globalThis.game.win();
    }
  }
}

export default Score;
