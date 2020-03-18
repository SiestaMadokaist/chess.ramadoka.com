import type { ChessBoard } from '../board';
import { Position, $position } from '../position';
import { Cell } from '../cell';
export enum TeamColor {
  white,
  black,
}

export interface Diagonals {
  upRight: Cell[];
  upLeft: Cell[];
  downRight: Cell[];
  downLeft: Cell[];
}

export interface Horizontals {
  left: Cell[];
  right: Cell[];
}

export interface Verticals {
  up: Cell[];
  down: Cell[];
}

export abstract class Piece {

  #cell: Cell;
  #color: TeamColor;
  constructor(cell: Cell, color: TeamColor) {
    this.#cell = cell;
    this.#color = color;
  }

  abstract name(): string;

  eq(pawn: Piece): boolean {
    if (this.name() !== pawn.name()) { return false; }
    if (!this.isTeam(pawn.teamColor())) { return false; }
    return true;
  }

  isTeam(color: TeamColor): boolean {
    return this.#color === color;
  }

  enemyColor(): TeamColor {
    if (this.teamColor() === TeamColor.white) { return TeamColor.black; }
    return TeamColor.white;
  }

  teamColor(): TeamColor {
    return this.#color;
  }

  position(): Position {
    return this.#cell.position();
  }

  x(): Position['x'] {
    return this.position().x;
  }

  y(): Position['y'] {
    return this.position().y;
  }

  isAt(x: Position['x'], y: Position['y']): boolean {
    return this.position().eq($position(x, y));
  }

  validMoves(board: ChessBoard): Position[] {
    return this.$validMoves(board).map((x) => x.position());
  }

  protected abstract $validMoves(board: ChessBoard): Cell[];

  validMove(position: Position, board: ChessBoard): boolean {
    return this.validMoves(board).filter((p) => {
      return p.eq(position);
    }).length > 0;
  }

  move(position: Position, board: ChessBoard): ChessBoard {
    return board.move(this, position);
  }

  protected verticals(board: ChessBoard): Verticals {
    const up = board.ys().filter((y) => y > this.y()).map((y) => board.cell(this.x(), y));
    const down = board.ys().reverse().filter((y) => y < this.y()).map((y) => board.cell(this.x(), y));
    return { up, down };
  }

  protected horizontals(board: ChessBoard): Horizontals {
    const right = board.xs().filter((x) => x > this.x()).map((x) => board.cell(x, this.y()));
    const left = board.xs().reverse().filter((x) => x < this.x()).map((x) => board.cell(x, this.y()));
    return { left, right };
  }

  protected straightMoveFilter(cells: Cell[]): Cell[] {
    const accumulator: Cell[] = [];
    for (const cell of cells) {
      if (cell.empty()) {
        accumulator.push(cell);
      } else if (cell.filledBy(this.teamColor())) {
        break;
      } else if (cell.filledBy(this.enemyColor())) {
        accumulator.push(cell);
        break;
      }
    }
    return accumulator;
  }

  protected diagonals(board: ChessBoard): Diagonals {
    const upLeft = board.ys()
      .map((_, i) => board.cell(this.x() - i as Position['x'], this.y() + i as Position['y']))
      .filter((cell) => cell)
      .filter((cell) => cell.y() > this.y());
    const upRight = board.ys()
      .map((_, i) => board.cell(this.x() + i as Position['x'], this.y() + i as Position['y']))
      .filter((cell) => cell)
      .filter((cell) => cell.y() > this.y());
    const downRight = board.ys().reverse()
      .map((_, i) => board.cell(this.x() + i as Position['x'], this.y() - i as Position['y']))
      .filter((cell) => cell)
      .filter((cell) => cell.y() < this.y());
    const downLeft = board.ys().reverse()
      .map((_, i) => board.cell(this.x() - i as Position['x'], this.y() - i as Position['y']))
      .filter((cell) => cell)
      .filter((cell) => cell.y() < this.y());
    return {
      upLeft,
      upRight,
      downLeft,
      downRight,
    };
  }

}
