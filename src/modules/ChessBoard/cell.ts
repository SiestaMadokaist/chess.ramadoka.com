import { Piece, TeamColor } from './piece/base';
import { Position, $position } from './position';

interface CellProps {
  pawn?: Piece;
  position: Position;
}

type Rows = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];
export type BoardCells = [Rows, Rows, Rows, Rows, Rows, Rows, Rows, Rows];

type CellView = string;
/** a string, but you should not modify that */
export interface CellColor { readonly color: unique symbol; }

export const COLOR = {
  TEAM_BLACK: '\x1b[34m' as unknown as CellColor,
  TEAM_WHITE: '\x1b[37m' as unknown as CellColor,
  BLANK: '\x1b[36m' as unknown as CellColor,
  GREEN: '\x1b[32m' as unknown as CellColor,
};

export class Cell {

  static fill(width: number, height: number): BoardCells {
    const columns = [...new Array(height)].map((_, y) => {
      return [ ...new Array(width)].map((__, x) => {
        return this.empty($position(x, y));
      });
    });
    return columns as BoardCells;
  }

  static empty(position: Position): EmptyCell {
    return new Cell({ position }) as EmptyCell;
  }

  readonly #props: CellProps;
  private constructor(props: CellProps) {
    this.#props = props;
  }

  empty(): boolean {
    return this.piece() === undefined;
  }

  filledBy(teamColor: TeamColor): boolean {
    const pawn = this.piece();
    if (pawn === undefined) { return false; }
    return pawn.isTeam(teamColor);
  }

  rebuild(pawn: Piece): Cell {
    return new Cell({ pawn, position: this.position() });
  }

  // private cellColor(): CellColor {
  //   const pawn = this.piece();
  //   if (typeof pawn === 'undefined') { return COLOR.BLANK; }
  //   if (pawn.isTeam(TeamColor.white)) { return COLOR.TEAM_WHITE; }
  //   if (pawn.isTeam(TeamColor.black)) { return COLOR.TEAM_BLACK; }
  //   throw new Error(`de fuck`);
  // }

  private cellView(): string {
    const pawn = this.piece();
    const l = 8;
    if (typeof pawn === 'undefined') { return ''.padStart(l, ' ') as any; }
    const text = pawn.name();
    const ps = (l / 2) + (text.length / 2);
    return `${text.padStart(ps, ' ').padEnd(l, ' ')}`;
  }

  view(): CellView {
    const pawn = this.piece();
    const l = 8;
    if (typeof pawn === 'undefined') { return ''.padStart(l, ' ') as any; }
    const text = pawn.name();
    const ps = (l / 2) + (text.length / 2);
    return `${text.padStart(ps, ' ').padEnd(l, ' ')}`;
  }

  $piece(): Piece {
    const pawn = this.piece();
    if (pawn === undefined) { throw new Error(`expected a pawn but actually undefined`); }
    return pawn;
  }

  piece(): undefined | Piece {
    return this.#props.pawn;
  }

  position(): Position {
    return this.#props.position;
  }

  y(): Position['y'] {
    return this.position().y;
  }

  x(): Position['x'] {
    return this.position().x;
  }

  isAt(position: Position): boolean {
    return this.position().x === position.x;
  }
}

interface EmptyCell extends Cell {
  piece(): undefined;
}
