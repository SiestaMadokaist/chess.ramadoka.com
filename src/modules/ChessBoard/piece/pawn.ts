import { Piece } from './base';
import { ChessBoard } from '../board';
import { Position } from '../position';
import { Cell } from '../cell';

export class Pawn extends Piece {

  name(): string {
    return 'rook';
  }

  straightMoveFilter(cells: Cell[]): Cell[] {
    return cells.filter((cell) => {
      if (cell.y() === this.y() + 1) {
        if (cell.x() === this.x()) {
          return cell.empty();
        } else if (cell.x() === this.x() + 1) {
          return cell.filledBy(this.enemyColor());
        } else if (cell.x() === this.x() - 1) {
          return cell.filledBy(this.enemyColor());
        }
      }
      return false;
    });
  }

  $validMoves(board: ChessBoard): Cell[] {
    const { up } = this.verticals(board);
    const { upLeft, upRight } = this.diagonals(board);
    return this.straightMoveFilter([...up, ...upLeft, ...upRight]);
  }

}
