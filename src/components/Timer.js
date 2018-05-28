import moment from "moment";

/**
 * The Timer class
 * In charge of starting/stoping a timer and formating it for the game.
 *
 * @export
 * @class Timer
 */
export default class Timer {
  constructor() {
    this.element = document.querySelector("#timer");
    this.time = 0;
    this.timerID = 0;
    this._stopped = true;
  }

  get isStopped() {
    return this._stopped;
  }

  get formatted() {
    return moment(this.time * 1000).format("mm:ss");
  }

  /**
   * Start the timer
   *
   * @memberof Game
   */
  start() {
    this.reset();
    this.timerID = setInterval(() => {
      this.time++;
      this.element.innerHTML = this.formatted;
    }, 1000);
    this._stopped = false;
    this.element.classList.remove("stopped");
  }

  /**
   * Stop a timer
   *
   * @memberof Game
   */
  stop() {
    if (this.timerID > 0) {
      clearInterval(this.timerID);
    }
    this._stopped = true;
    this.element.classList.add("stopped");
  }

  /**
   * Reset the timer
   *
   * @memberof Game
   */
  reset() {
    if (this.timerID > 0) {
      clearInterval(this.timerID);
    }
    this.time = 0;
    this._stopped = true;
    this.element.classList.remove("stopped");
    this.element.innerHTML = this.formatted;
  }
}
