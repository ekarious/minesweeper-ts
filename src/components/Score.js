/**
 * The score
 *
 * @export
 * @class Score
 */
export default class Score {
  constructor() {
    this.score = 0;
    this.message = "";
  }

  setMessage(value) {
    this.message = value;
  }
}

// Reveler une case de facon juste donne 1pt
