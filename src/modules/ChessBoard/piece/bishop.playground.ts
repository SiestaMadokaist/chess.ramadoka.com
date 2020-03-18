import { ChessBoard } from '../board';
import { Bishop } from './bishop';
import { Cell } from '../cell';
import { $position } from '../position';
import { TeamColor, Piece } from './base';
import { expect } from 'chai';
import $debug from 'debug';
import { Rook } from './rook';
const debug = $debug('chess:bishop:playground');

function main(): void {
  const cells = Cell.fill(8, 8);
  const zerothCell = cells[0][0];
  const bishop = new Rook(zerothCell, TeamColor.white);
  const enemyRook = new Rook(cells[0][1], TeamColor.black);
  cells[0][0] = zerothCell.rebuild(bishop);
  cells[0][1] = cells[0][1].rebuild(enemyRook);
  const board = ChessBoard.initCustom(cells);
  board.visualize();
}

if (process.argv[1] === __filename) {
  main();
}
