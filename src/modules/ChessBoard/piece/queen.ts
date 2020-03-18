import { Piece } from './base';
import { ChessBoard } from '../board';
import { Position } from '../position';
import { Cell } from '../cell';

export class Queen extends Piece {

  name(): string {
    return 'rook';
  }

  protected $validMoves(board: ChessBoard): Cell[] {
    const { up, down } = this.verticals(board);
    const { left, right } = this.horizontals(board);
    const { upLeft, upRight, downLeft, downRight } = this.diagonals(board);
    return [
      ...this.straightMoveFilter(up),
      ...this.straightMoveFilter(down),
      ...this.straightMoveFilter(left),
      ...this.straightMoveFilter(right),
      ...this.straightMoveFilter(upLeft),
      ...this.straightMoveFilter(upRight),
      ...this.straightMoveFilter(downLeft),
      ...this.straightMoveFilter(downRight),
    ];
  }

}
