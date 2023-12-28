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
      parentId
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
      parentId
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
      parentId
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
      parentId
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
      parentId
    );
  }
}

export { IMino, LMino, OMino, SMino, TMino };
