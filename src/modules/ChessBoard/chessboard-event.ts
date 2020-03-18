import type { EventEmitter } from 'events';
import type { Position } from './position';
import type { ChessBoard } from './board';
interface Event<M extends string, T extends unknown[]> {
  message: M;
  args: T;
}

type On<E extends Event<string, unknown[]>, That> = (message: E['message'], callback: (...args: E['args']) => void) => That;
type Emit<E extends Event<string, unknown[]>> = (message: E['message'], ...args: E['args']) => boolean;

interface InvalidMove {
  message: 'invalid-move';
  args: [{
    board: ChessBoard;
    prev: Position;
    next: Position;
  }];
}

interface Moved {
  message: 'moved';
  args: [{
    board: ChessBoard;
    prev: Position;
    next: Position;
  }];
}

type BoardEvent = InvalidMove | Moved;

export interface ChessBoardListener extends EventEmitter {
  on: On<BoardEvent, this>;
  emit: Emit<BoardEvent>;
}

