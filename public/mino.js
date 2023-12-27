import { Cell, Mino } from "./logic.js";

const emptyCell = new Cell(-1, -1);

class IMino extends Mino {
  constructor(cell) {
    const x = cell;
    super([[x, x, x, x]]);
  }
}

class OMino extends Mino {
  constructor(cell) {
    const x = cell;
    super([
      [x, x],
      [x, x],
    ]);
  }
}

class LMino extends Mino {
  constructor(cell) {
    const o = emptyCell;
    const x = cell;
    super([
      [x, o],
      [x, o],
      [x, x],
    ]);
  }
}
class SMino extends Mino {
  constructor(cell) {
    const o = emptyCell;
    const x = cell;
    super([
      [x, o],
      [x, x],
      [o, x],
    ]);
  }
}

class TMino extends Mino {
  constructor(cell) {
    const o = emptyCell;
    const x = cell;
    super([
      [x, x, x],
      [o, x, o],
    ]);
  }
}

export { IMino, LMino, OMino, SMino, TMino };
