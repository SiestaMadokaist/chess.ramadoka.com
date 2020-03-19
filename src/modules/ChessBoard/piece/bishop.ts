import type { ChessBoard } from '../board';
import type { Position } from '../position';
import { Piece } from './base';
import type { Cell } from '../cell';

export class Bishop extends Piece {

  name(): string {
    return 'bishop';
  }

  movedTo(position: Position): Bishop {
    return new Bishop(position, this.teamColor());
  }

  $validMoves(board: ChessBoard): Cell[] {
    const { upLeft, upRight , downLeft, downRight} = this.diagonals(board);
    return [
      ...this.straightMoveFilter(upLeft),
      ...this.straightMoveFilter(upRight),
      ...this.straightMoveFilter(downLeft),
      ...this.straightMoveFilter(downRight),
    ];
  }

}
