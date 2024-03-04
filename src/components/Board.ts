import Tile from "./Tile";

const counter = document.querySelector("#counter")!;
const timer = document.querySelector("#timer")!;

class Board {
  element: Element = document.querySelector("#board")!;

  size: [number, number] = [0, 0];
  boardData: Tile[] = [];
  mineCount: number = 0;


  constructor() {}

  setup(x: number, y: number) {
    this.element.classList.remove("disabled");
    this.size = [x, y];
    this.boardData = [];
    this.mineCount = 0;

    this.init();
  }

  init() {
    // We need to remove the HTML tiles !
    this.removeTiles();

    // Set up the board
    this._drawBoard();
    this._nbMines();
    this._plantMines();

    // let each tiles calculate their own perimeter
    this.boardData.map(tile => tile._setPerimeterTilesCoordinates());

    // Calculate the neighborMineCount
    this.empties.map(tile => {
      const count = tile.perimeterTiles.filter(item => item.isMined).length;
      tile.neighborMineCount = count;

      if (count > 0) {
        tile.elementChild.innerHTML = count.toString();
      } else {
        tile.element.removeChild(tile.elementChild);
      }
    });

    // Activate relative data
    timer.classList.add("active");
    counter.classList.add("active");
  }

  reset() {
    this.size = [0, 0];
    this.boardData = [];
    this.mineCount = 0;

    this.removeTiles();
  }

  removeTiles() {
    // Seems to be faster this way.
    while (this.element.lastChild) {
      this.element.removeChild(this.element.lastChild);
    }
    this.element.classList.remove("easy", "normal", "hard");
  }

  /**
   * Get all the tiles with a flag
   *
   * @readonly
   * @memberof Board
   */
  get flags() {
    return this.boardData.filter(tile => tile.isFlagged);
  }

  /**
   * Get all the tiles with a mine
   *
   * @readonly
   * @memberof Board
   */
  get mines() {
    return this.boardData.filter(tile => tile.isMined);
  }

  /**
   * Get all the tiles which are empty
   *
   * @readonly
   * @memberof Board
   */
  get empties() {
    return this.boardData.filter(tile => !tile.isMined);
  }

  /**
   * Draw the board on screen based on the size selected
   *
   * @memberof Board
   */
  _drawBoard() {
    const [maxX, maxY] = this.size;

    for (let x = 0; x < maxX; x++) {
      for (let y = 0; y < maxY; y++) {
        const tile = new Tile(x, y);
        tile.init();

        // Attach to HTML
        this.element.appendChild(tile.element);

        // Keep in array
        this.boardData.push(tile);
      }
    }
  }

  _nbMines() {
    const [x, y] = this.size;
    const totalTiles = x * y;

    this.mineCount =
      Math.floor(Math.random() * (totalTiles * 0.3 - totalTiles * 0.1 + 1)) + totalTiles * 0.1;
  }

  /**
   * Add mines into the tiles
   *
   * @memberof Board
   */
  _plantMines() {
    let offset = 0;

    for (let i = 0; i < this.mineCount; i++) {
      const index =
        Math.floor(Math.random() * 1000 + 1) % (this.size[0] * this.size[1]);

      if (!this.boardData[index].isMined) {
        this.boardData[index].isMined = true;
      } else {
        offset++;
      }
    }

    // Fix the offset
    this.mineCount -= offset;
  }

  /**
   * Reveal the whole board
   * - This means GAME OVER!
   *
   * @memberof Board
   */
  revealBoardMines() {
    this.boardData.forEach(tile => {
      if (tile.isMined) {
        tile.element.classList.add("failure");
      }
    });
    window.game.gameover();
    this.element.classList.add("disabled");
    counter.classList.add("failure");
  }
}

export default Board;
