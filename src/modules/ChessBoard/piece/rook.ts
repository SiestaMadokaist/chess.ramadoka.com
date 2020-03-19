import type { ChessBoard } from '../board';
import type { Position } from '../position';
import { Piece } from './base';
import type { Cell } from '../cell';

export class Rook extends Piece {

  name(): string {
    return 'rook';
  }

  movedTo(position: Position): Rook {
    return new Rook(position, this.teamColor());
  }

  protected $validMoves(board: ChessBoard): Cell[] {
    const { up, down } = this.verticals(board);
    const { left, right } = this.horizontals(board);
    return [
      ...this.straightMoveFilter(up),
      ...this.straightMoveFilter(down),
      ...this.straightMoveFilter(left),
      ...this.straightMoveFilter(right),
    ];
  }

}
