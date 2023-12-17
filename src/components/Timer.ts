class Timer {
  element: Element = document.querySelector("#timer")!;
  time: number = 0;
  timerID: number = 0;
  
  _stopped: boolean = true;

  constructor() {}

  get isStopped(): boolean {
    return this._stopped;
  }

  get formatted(): string {
    return new Date(1000 * this.time).toISOString().slice(14, 19);
  }

  start(): void {
    this.reset();
    this.timerID = setInterval(() => {
      this.time++;
      this.element.innerHTML = this.formatted;
    }, 1000);
    this._stopped = false;
    this.element.classList.remove("stopped");
  }

  stop(): void {
    if (this.timerID > 0) {
      clearInterval(this.timerID);
    }
    this._stopped = true;
    this.element.classList.add("stopped");
  }

  reset(): void {
    if (this.timerID > 0) {
      clearInterval(this.timerID);
    }
    this.time = 0;
    this._stopped = true;
    this.element.classList.remove("stopped");
    this.element.classList.remove("success");
    this.element.innerHTML = this.formatted;
  }
}

export default Timer;
