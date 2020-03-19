import { Piece, TeamColor } from './piece/base';
import { Maybe } from '@cryptoket/ts-maybe';
import { EventEmitter } from 'events';
import { Position, $position } from './position';
import type { ChessBoardListener } from './chessboard-event';
import { Cell, BoardCells, CellColor } from './cell';
import colors from 'colors';
import { Memoize } from '@cryptoket/ts-memoize';
import util from 'util';
class Threats  {
  __memo__: { calculate?: boolean } = {};
  #map: Map<Position, Record<TeamColor, number>> = new Map();

  constructor(private readonly board: ChessBoard) {}
  private pieceCells(): Cell[] {
    return this.board.pieceCells();
  }

  private calculate(): boolean {
    return Memoize(this, 'calculate', () => {
      for (const cell of this.pieceCells()) {
        const piece = cell.$piece();
        const positions = piece.validMoves(this.board);
        for (const position of positions) {
          this.add(position, piece.teamColor());
        }
      }
      return true;
    });
  }

  visualized(): Record<Position['y'], Record<Position['x'], Record<TeamColor, number>>> {
    const board = this.board;
    const ys = board.ys().map((y) => {
      return board.xs().map((x) => {
        const position = $position(x, y);
        const dangerCount = this.get(position) ?? { [TeamColor.black]: 0, [TeamColor.white]: 0 };
        return dangerCount;
      });
    });
    return ys;
  }

  private add(position: Position, color: TeamColor): void {
    const prev = this.#map.get(position);
    if (prev === undefined) {
      const _initials = { [TeamColor.black]: 0, [TeamColor.white]: 0 };
      const initials = { ..._initials, [color]: 1, };
      this.set(position, initials);
    } else {
      this.set(position, { ...prev, [color]: prev[color] + 1 });
    }
  }

  private set(position: Position, state: Record<TeamColor, number>): void {
    this.#map.set(position, state);
  }

  get(position: Position): Record<TeamColor, number> {
    this.calculate();
    const record = this.#map.get(position);
    if (record) { return record; }
    return { [TeamColor.white]: 0, [TeamColor.black]: 0 };
  }
}

export class ChessBoard {
  #cells: BoardCells;
  #listener: ChessBoardListener;

  static initEmpty(): ChessBoard {
    const cells = Cell.fill(8, 8);
    const listener = new EventEmitter() as ChessBoardListener;
    return new this(cells, listener);
  }

  static initCustom(cells: BoardCells): ChessBoard {
    const listener = new EventEmitter() as ChessBoardListener;
    return new this(cells, listener);
  }

  private constructor(cells: BoardCells, listener: ChessBoardListener) {
    this.#cells = Object.freeze(cells) as BoardCells;
    this.#listener = listener;
  }

  __memo__: {
    pieceCells?: Cell[];
    threats?: Threats;
  } = {};

  pieceCells(): Cell[] {
    return Memoize(this, 'pieceCells', () => {
      const accumulator: Cell[] = [];
      for (const y of this.ys()) {
        for (const x of this.xs()) {
          const cell = this.cell(x, y);
          if (cell.empty()) { continue; }
          accumulator.push(cell);
        }
      }
      return accumulator;
    });
  }

  threats(): Threats {
    return Memoize(this, 'threats', () => {
      return new Threats(this);
    });
  }

  private columns(): readonly Cell[][] {
    return this.#cells;
  }

  static ys(): Position['y'][] {
    return [ ...new Array(8)].map((x, i) => i as Position['y']);
  }

  static xs(): Position['x'][] {
    return [ ...new Array(8)].map((x, i) => i as Position['x']);
  }

  ys(): Position['y'][] {
    return ChessBoard.ys();
  }

  xs(): Position['x'][] {
    return ChessBoard.xs();
  }

  cellAt(position: Position): Cell {
    return this.cell(position.x, position.y);
  }

  cell(x: Position['x'], y: Position['y']): Cell {
    return Maybe.of(this.#cells)
      .map((cells) => cells[y])
      .map((column) => column[x])
      .value();
  }

  move(pawn: Piece, next: Position): ChessBoard {
    const isValid = pawn.validMove(next, this);
    const event = { board: this, prev: pawn.position(), next };
    if (!isValid) {
      this.#listener.emit('invalid-move', event);
      return this;
    }
    this.#listener.emit('moved', event);
    return this.putPiece(pawn, next);
  }

  cellMap(callback: (cell: Cell) => Cell): BoardCells {
    const cells = this.columns().map((column, y) => {
      return column.map((cell, x) => callback(cell));
    });
    return cells as BoardCells;
  }

  visualize(): void {
    const threats = this.threats();
    for (const y of this.ys().reverse()) {
      const cells = this.xs().map((x) => {
        const cell = this.cell(x, y);
        const piece = cell.piece();
        const threat = threats.get(cell.position());
        const whiteThreat = threat[TeamColor.white];
        const blackThreat = threat[TeamColor.black];
        const threatString = `(${threat[TeamColor.white]}, ${threat[TeamColor.black]})`;
        const color = (() => {
          if (piece) {
            const protection = threat[piece.teamColor()];
            const danger = threat[piece.enemyColor()];
            const teamColor = piece.isTeam(TeamColor.white) ? 'green' : 'blue';
            if (danger >= 1 && danger >= protection) { return colors.bgRed[teamColor]; }
            if (danger >= 1 && danger < protection) { return colors.bgYellow[teamColor]; }
            if (piece.isTeam(TeamColor.white)) {return colors.green; }
            if (piece.isTeam(TeamColor.black)) { return colors.blue; }
          } else {
            if (whiteThreat > blackThreat) { return colors.white; }
            if (whiteThreat < blackThreat) { return colors.black; }
            if (whiteThreat === blackThreat && whiteThreat >= 1) { return colors.yellow; }
          }
          return colors.gray;
        })();
        return color(`${cell.view()} ${threatString}`);
      });
      const args: string[] = (cells as any).flat();
      const chr = `${y + 1}`;
      // tslint:disable-next-line:no-console
      console.log(chr, ...args);
      // console.log(metaColor, chr, ...args);
    }
    const meta = this.xs().map((x) => {
      const l = 12;
      const text = String.fromCharCode(x + 65);
      const ps = (l / 2) + (text.length / 2);
      return [`${text.padStart(ps, ' ').padEnd(l, ' ')}`];
    });
    const coloredMeta: string[] = (meta as any).flat();
    // tslint:disable-next-line:no-console
    console.log(''.padEnd(2), ...coloredMeta);
  }

  private putPiece(piece: Piece, at: Position): ChessBoard {
    const updatedCell = this.cellMap((cell) => {
      if (piece.position().eq(cell.position())) { return Cell.empty(cell.position()); }
      if (cell.position().eq(at)) { return cell.rebuild(piece); }
      return cell;
    });
    return new ChessBoard(updatedCell, this.#listener);
  }

}
