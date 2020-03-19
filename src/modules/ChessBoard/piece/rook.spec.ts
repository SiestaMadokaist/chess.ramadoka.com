import { ChessBoard } from '../board';
import { Cell } from '../cell';
import { Rook } from './rook';
import { $position, Position } from '../position';
import { TeamColor, Piece } from './base';
import { expect } from 'chai';
import $debug from 'debug';
const debug = $debug('spec:chessboard:pawn:rook');

describe('Rook', () => {

  context('at (0, 0) with enemy at (0, 1)', () => {
    const initBoard = () => {
      const cells = Cell.fill(8, 8);
      const zerothCell = cells[0][0];
      const rook = new Rook(zerothCell.position(), TeamColor.white);
      const enemyRook = new Rook(cells[1][0].position(), TeamColor.black);
      cells[0][0] = zerothCell.rebuild(rook);
      cells[1][0] = cells[1][0].rebuild(enemyRook);
      const board = ChessBoard.initCustom(cells);
      return board;
    };

    describe('move vertically', () => {
      const board = initBoard();
      const rook = board.cell(0, 0).$piece();
      it(`can move to (${rook.x()}, ${1})`, () => {
        const position = $position(rook.x(), 1);
        const newBoard = rook.move(position, board);
        expect(newBoard.cellAt(position).$piece()).to.eq(rook);
      });
      for (let i = 2; i < 8; i++) {
        const position = $position(rook.x(), i);
        const newBoard = rook.move(position, board);
        it(`doesnt change the board (${rook.x()}, ${i})`, () => {
          expect(newBoard).to.eq(board); // doesnt change
          expect(newBoard.cellAt(position)).to.eq(board.cellAt(position));
        });
      }
    });

    it('can move horizontally', () => {
      const board = initBoard();
      const rook = board.cell(0, 0).$piece();
      for (let i = 1; i < 8; i++) {
        const position = $position(i, rook.y());
        const newBoard = rook.move(position, board);
        expect(newBoard.cellAt(position).$piece().eq(rook)).to.eq(true);
        expect(newBoard.cell(0, 0).empty()).to.eq(true);
      }
    });

    it('cannot move diagonally', () => {
      const board = initBoard();
      const rook = board.cell(0, 0).$piece();
      for (let i = 1; i < 8; i++) {
        const position = $position(i, i);
        const newBoard = rook.move(position, board);
        expect(newBoard).to.eq(board);
      }
    });
  });

  context('at (0, 0), with friends at (0, 1)', () => {
    const initBoard = () => {
      const cells = Cell.fill(8, 8);
      const zerothCell = cells[0][0];
      const rook = new Rook(zerothCell.position(), TeamColor.white);
      const friendRook = new Rook(cells[1][0].position(), TeamColor.white);
      cells[0][0] = zerothCell.rebuild(rook);
      cells[1][0] = cells[1][0].rebuild(friendRook);
      const board = ChessBoard.initCustom(cells);
      return board;
    };

    context('cannot move vertically', () => {
      const board = initBoard();
      const rook = board.cell(0, 0).$piece();
      for (let i = 1; i < 8; i++) {
        const position = $position(rook.x(), i);
        const newBoard = rook.move(position, board);
        it(`doesnt change the board (${rook.x()}, ${i})`, () => {
          expect(newBoard).to.eq(board); // doesnt change
          expect(newBoard.cellAt(position)).to.eq(board.cellAt(position));
        });
      }
    });

    it('can move horizontally', () => {
      const board = initBoard();
      const rook = board.cell(0, 0).$piece();
      for (let i = 1; i < 8; i++) {
        const position = $position(i, rook.y());
        const newBoard = rook.move(position, board);
        expect(newBoard.cellAt(position).$piece().eq(rook)).to.eq(true);
        expect(newBoard.cell(0, 0).empty()).to.eq(true);
      }
    });

    it('cannot move diagonally', () => {
      const board = initBoard();
      const rook = board.cell(0, 0).$piece();
      for (let i = 1; i < 8; i++) {
        const position = $position(i, i);
        const newBoard = rook.move(position, board);
        expect(newBoard).to.eq(board);
      }
    });

  });

  context('at (0, 0)', () => {
    const initBoard = () => {
      const cells = Cell.fill(8, 8);
      const zerothCell = cells[0][0];
      const rook = new Rook(zerothCell.position(), TeamColor.white);
      cells[0][0] = zerothCell.rebuild(rook);
      const board = ChessBoard.initCustom(cells);
      return board;
    };

    it('check valid moves', () => {
      // initialization
      const board = initBoard();
      const rook = board.cell(0, 0).piece();
      if (typeof rook === 'undefined') { throw new Error(`expected rook, but actually empty`); }
      const valids = rook.validMoves(board);
      const validSet = new Set(valids);
      for (let i = 1; i < 8; i++) {
        const h = board.cellAt($position(rook.x(), i));
        const v = board.cellAt($position(i, rook.y()));
        expect(validSet.has(h.position()));
        validSet.delete(h.position());
        expect(validSet.has(v.position()));
        validSet.delete(v.position());
      }
      expect(validSet.size).eq(0);
    });

    it('can move vertically', () => {
      const board = initBoard();
      const rook = board.cell(0, 0).$piece();
      for (let i = 1; i < 8; i++) {
        const position = $position(rook.x(), i);
        const newBoard = rook.move(position, board);
        expect(newBoard.cellAt(position).$piece().eq(rook)).to.eq(true);
        expect(newBoard.cell(0, 0).empty()).to.eq(true);
      }
    });

    it('can move horizontally', () => {
      const board = initBoard();
      const rook = board.cell(0, 0).$piece();
      for (let i = 1; i < 8; i++) {
        const position = $position(i, rook.y());
        const newBoard = rook.move(position, board);
        expect(newBoard.cellAt(position).$piece().eq(rook)).to.eq(true);
        expect(newBoard.cell(0, 0).empty()).to.eq(true);
      }
    });

    it('cannot move diagonally', () => {
      const board = initBoard();
      const rook = board.cell(0, 0).$piece();
      for (let i = 1; i < 8; i++) {
        const position = $position(i, i);
        const newBoard = rook.move(position, board);
        expect(newBoard).to.eq(board);
        expect(newBoard.cellAt(position).empty()).to.eq(true);
        expect(newBoard.cellAt(rook.position()).$piece()).to.eq(rook);
      }
    });

  });

});
