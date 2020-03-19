// tslint:disable:no-string-literal
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
  const board = ChessBoard.initEmpty();
  const newBoard = board['putPiece'](Rook.create(TeamColor.white), $position(0, 0))
    ['putPiece'](Rook.create(TeamColor.black), $position(0, 1));
  newBoard.visualize();
}

if (process.argv[1] === __filename) {
  main();
}
