
/**
 * The Tile class
 *
 * @export
 * @class Tile
 */
export default class Tile {
  /**
   * Creates an instance of Tile.
   * @param {string} element
   * @param {number} x
   * @param {number} y
   * @memberof Tile
   */
  constructor(x, y, parent = undefined) {
    this.x = x;
    this.y = y;
    this.parent = parent;

    this.element = document.createElement("div");
    this.element.classList.add("tile");
    this.elementChild = document.createElement("p");
    this.element.appendChild(this.elementChild);

    this.perimeterTilesCoord = [];
    this.neighborMineCount = 0;

    this.isRevealed = false;
    this.isFlagged = false;
    this.isMined = false;
  }

  init() {
    // Set colors
    if (this.x % 2 === 0) {
      if (this.y % 2 === 0) {
        this.element.classList.add("color1");
      } else {
        this.element.classList.add("color2");
      }
    } else {
      if (this.y % 2 === 0) {
        this.element.classList.add("color2");
      } else {
        this.element.classList.add("color1");
      }
    }

    // Setup Events
    this.element.addEventListener("mouseup", event => this.onClick(event));
    this.element.addEventListener("dblclick", event =>
      this.onDoubleClick(event)
    );
  }

  /**
   * Dynamiclly get all adjacent tiles
   *
   * @readonly
   * @memberof Tile
   */
  get perimeterTiles() {
    return this.perimeterTilesCoord.map(tile =>
      this.parent.boardData.find(item => item.x === tile.x && item.y === tile.y)
    );
  }

  /**
   * Create a table of adjacent tiles coordonates
   *
   * @memberof Tile
   */
  _setPerimeterTilesCoord() {
    const tiles = [];

    // In clock order

    tiles.push({ x: this.x - 1, y: this.y });
    tiles.push({ x: this.x - 1, y: this.y + 1 });
    tiles.push({ x: this.x, y: this.y + 1 });
    tiles.push({ x: this.x + 1, y: this.y + 1 });
    tiles.push({ x: this.x + 1, y: this.y });
    tiles.push({ x: this.x + 1, y: this.y - 1 });
    tiles.push({ x: this.x, y: this.y - 1 });
    tiles.push({ x: this.x - 1, y: this.y - 1 });

    // Check
    this.perimeterTilesCoord = tiles.filter(
      tile =>
        tile.x >= 0 &&
        tile.x < this.parent.size[0] &&
        tile.y >= 0 &&
        tile.y < this.parent.size[1]
    );
  }

  /**
   * Reveal adjacents tiles
   * ---
   * Only reveal tiles in this cases:
   * 1. The tile has no adjacents tiles with mines.
   * --> In this case, continue in recursive.
   * 2. The tile have adjacents tiles with mines.
   * --> Reveal the current tile and stop.
   *
   * @memberof Tile
   */
  _revealAdjacents(tile, recursive = true) {
    const adjacentTiles = tile.perimeterTiles;

    adjacentTiles.forEach(elt => {
      if (elt.isMined || elt.isRevealed || elt.isFlagged) {
        return;
      }

      elt.isRevealed = true;
      elt.element.classList.add("revealed");
      this.parent.parent.scoreIncrement();

      if (elt.neighborMineCount === 0 && recursive) {
        this._revealAdjacents(elt);
      }
    });
  }

  /**
   * Test adjacents tiles of the current tile only
   * ---
   * Test if the user assumption of flagged mines is true.
   *
   * @memberof Tile
   */
  _checkAdjacentsTilesMinesOK() {
    // If there is no nimes in adjacent tiles, do nothing.
    if (this.neighborMineCount === 0) {
      return;
    }

    const adjacentTiles = this.perimeterTiles;
    const flaggedTiles = adjacentTiles.filter(tile => tile.isFlagged);

    // If not enougth adjacent tiles have been flagged, do nothing.
    if (this.neighborMineCount === flaggedTiles.length) {
      adjacentTiles.forEach(elt => {
        if (elt.isFlagged && !elt.isMined) {
          return this.parent.revealBoardMines();
        }

        this._revealAdjacents(this); // TODO: test this
      });
    }
  }

  // Events

  /**
   * Handle onClick event
   *
   * @memberof Tile
   */
  onClick(event) {
    event.preventDefault();

    if (this.isRevealed) {
      return;
    }

    // Left click
    if (event.which === 1) {
      this.isRevealed = true;
      this.isFlagged = false;
      this.parent.parent.scoreIncrement();

      if (this.isMined) {
        return this.parent.revealBoardMines();
      }

      if (this.neighborMineCount === 0) {
        this._revealAdjacents(this);
      }

      this.element.classList.add("revealed");
      this.element.classList.remove("flagged");
    }

    // Right click
    if (event.which === 3) {
      this.isFlagged = !this.isFlagged;
      this.element.classList.toggle("flagged");
    }
  }

  onDoubleClick(event) {
    this._checkAdjacentsTilesMinesOK();
  }
}
