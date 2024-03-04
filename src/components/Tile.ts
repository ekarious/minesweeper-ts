import Board from "./Board";

class Tile {
  x: number;
  y: number;
  // @ts-ignore
  parent: Board = window.game.board;

  element: HTMLDivElement = document.createElement("div");
  elementChild: HTMLParagraphElement = document.createElement("p");

  perimeterTilesCoordinates: {x: number, y: number }[] = [];
  neighborMineCount: number = 0;

  isRevealed: boolean = false;
  isFlagged: boolean = false;
  isMined: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.element.classList.add("tile");
    this.element.appendChild(this.elementChild);
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

  get perimeterTiles(): Tile[] {
    return this.perimeterTilesCoordinates.map(coordinates =>
      this.parent.boardData.find((tile: Tile) => tile.x === coordinates.x && tile.y === coordinates.y)
    );

  }

  _setPerimeterTilesCoordinates() {
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
    this.perimeterTilesCoordinates = tiles.filter(
      tile =>
        tile.x >= 0 &&
        tile.x < this.parent.size[0] &&
        tile.y >= 0 &&
        tile.y < this.parent.size[1]
    );
  }

  /**
   * Reveal adjacent tiles
   * ---
   * Only reveal tiles in these cases:
   * 1. The tile has no adjacent tiles with mines.
   * --> In this case, continue in recursive.
   * 2. The tile have adjacent tiles with mines.
   * --> Reveal the current tile and stop.
   *
   * @memberof Tile
   */
  _revealAdjacentTiles(tile: Tile, recursive = true) {
    const adjacentTiles = tile.perimeterTiles;

    adjacentTiles.forEach(elt => {
      if (elt.isMined || elt.isRevealed || elt.isFlagged) {
        return;
      }

      elt.isRevealed = true;
      elt.element.classList.add("revealed");
      window.game.score.increment();

      if (elt.neighborMineCount === 0 && recursive) {
        this._revealAdjacentTiles(elt);
      }
    });
  }

  _checkAdjacentTilesMinesOK() {
    // If there is no mines in adjacent tiles, do nothing.
    if (this.neighborMineCount === 0) {
      return;
    }

    const adjacentTiles = this.perimeterTiles;
    const flaggedTiles = adjacentTiles.filter(tile => tile.isFlagged);

    // If not enough adjacent tiles have been flagged, do nothing.
    if (this.neighborMineCount === flaggedTiles.length) {
      adjacentTiles.forEach(elt => {
        if (elt.isFlagged && !elt.isMined) {
          return this.parent.revealBoardMines();
        }

        this._revealAdjacentTiles(this); // TODO: test this
      });
    }
  }

  // Events

  onClick(event: MouseEvent) {
    event.preventDefault();

    if (this.isRevealed) {
      return;
    }

    // Left click
    if (event.which === 1) {
      this.isRevealed = true;
      this.isFlagged = false;
      window.game.score.increment();

      if (this.isMined) {
        return this.parent.revealBoardMines();
      }

      if (this.neighborMineCount === 0) {
        this._revealAdjacentTiles(this);
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

  onDoubleClick(_: MouseEvent) {
    this._checkAdjacentTilesMinesOK();
  }
}

export default Tile;
