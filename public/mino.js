import { Cell, Mino } from "./logic.js";

const emptyCell = new Cell(-1, -1);

class IMino extends Mino {
  constructor(parentId) {
    super(
      [
        [
          new Cell(parentId, -2),
          new Cell(parentId, -2),
          new Cell(parentId, -2),
          new Cell(parentId, -2),
        ],
      ],
      1
    );
  }
}

class OMino extends Mino {
  constructor(parentId) {
    super(
      [
        [new Cell(parentId, -2), new Cell(parentId, -2)],
        [new Cell(parentId, -2), new Cell(parentId, -2)],
      ],
      2
    );
  }
}

class LMino extends Mino {
  constructor(parentId) {
    const o = emptyCell;
    super(
      [
        [new Cell(parentId, -2), o],
        [new Cell(parentId, -2), o],
        [new Cell(parentId, -2), new Cell(parentId, -2)],
      ],
      3
    );
  }
}
class SMino extends Mino {
  constructor(parentId) {
    const o = emptyCell;
    super(
      [
        [new Cell(parentId, -2), o],
        [new Cell(parentId, -2), new Cell(parentId, -2)],
        [o, new Cell(parentId, -2)],
      ],
      4
    );
  }
}

class TMino extends Mino {
  constructor(parentId) {
    const o = emptyCell;
    super(
      [
        [
          new Cell(parentId, -2),
          new Cell(parentId, -2),
          new Cell(parentId, -2),
        ],
        [o, new Cell(parentId, -2), o],
      ],
      5
    );
  }
}

export { IMino, LMino, OMino, SMino, TMino };
