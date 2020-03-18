import { Memoize } from '@cryptoket/ts-memoize';
type Index = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type X = Index & { readonly tag?: unique symbol };
type Y = Index & { readonly tag?: unique symbol };
export interface Position {
  readonly sym: unique symbol;
  x: X;
  y: Y;
  eq(p: Position): boolean;
  isAt(p: Pick<Position, 'x' | 'y'>): boolean;
}

const state: {
  __memo__: {
    [xy: string]: Position;
  }
} = {  __memo__: {} };

export function $position(x: number, y: number): Position {
  return Memoize(state, `${x}:${y}`, () => {
    const sym: unique symbol = Symbol(`${x}:${y}`);
    const A = 65;
    return {
      x,
      y,
      sym,
      toString(): string { return `(${String.fromCharCode(x + A)}, ${y})`; },
      eq(p: Position): boolean {
        return this === p;
      },
      isAt(p: Pick<Position, 'x' | 'y'>): boolean {
        return x === p.x && y === p.y;
      },
    } as unknown as Position;
  });
}
