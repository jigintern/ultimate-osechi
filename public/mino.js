import { Cell, Mino } from "./logic.js";

const emptyCell = new Cell(-1, -1);

class IMino extends Mino {
  constructor(cell) {
    const x = cell;
    super([[x, x, x, x]], 1);
  }
}

class OMino extends Mino {
  constructor(cell) {
    const x = cell;
    super(
      [
        [x, x],
        [x, x],
      ],
      2
    );
  }
}

class LMino extends Mino {
  constructor(cell) {
    const o = emptyCell;
    const x = cell;
    super(
      [
        [x, o],
        [x, o],
        [x, x],
      ],
      3
    );
  }
}
class SMino extends Mino {
  constructor(cell) {
    const o = emptyCell;
    const x = cell;
    super(
      [
        [x, o],
        [x, x],
        [o, x],
      ],
      4
    );
  }
}

class TMino extends Mino {
  constructor(cell) {
    const o = emptyCell;
    const x = cell;
    super(
      [
        [x, x, x],
        [o, x, o],
      ],
      5
    );
  }
}

export { IMino, LMino, OMino, SMino, TMino };
