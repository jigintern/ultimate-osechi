import { Cell, Coordinate, Field } from "./logic.js";
import { IMino, LMino, OMino, SMino, TMino } from "./mino.js";
import { initModal } from "./modal.js";

let selectMino = null;
let minoList = [
  new IMino(new Cell(1, 0)),
  new OMino(new Cell(1, 1)),
  new LMino(new Cell(1, 2)),
  new SMino(new Cell(1, 1)),
  new TMino(new Cell(1, 1)),
];
initModal();
export const XSIZE = 10;
export const YSIZE = 10;
const SCALE = 60;
const MARGIN = 1;

const VIEW_SCALE = 20;
const imageFiles = [
  "えび.png",
  "かまぼこ.png",
  "ごぼう.png",
  "なます.png",
  "伊達巻.png",
  "錦玉子.png",
  "金柑.png",
  "栗きんとん.png",
  "黒豆.png",
  "昆布巻き.png",
  "酢だこ.png",
  "数の子.png",
  "田作り.png",
  "八幡巻き.png",
  "蓮根.png",
];

let Images = [];
window.preload = () => {
  for (let i = 0; i < imageFiles.length; i++) {
    Images[i] = loadImage("assets/" + imageFiles[i]);
  }
};

let field = new Field(
  new Array(YSIZE * XSIZE).fill().map((_) => new Cell(-1, -1, -1, -1))
);

window.setup = () => {
  const canvas = createCanvas((XSIZE + MARGIN * 2) * SCALE, YSIZE * 2 * SCALE);
  canvas.parent("canvas");
  document.getElementById("score").style.marginRight = MARGIN * SCALE + "px";

  setupMinoListPosition();
  setupCellPosition();
};

window.draw = () => {
  background(220);
  strokeWeight(1);

  drawField();

  if (selectMino !== null) {
    selectMino.x = mouseX - SCALE / 2;
    selectMino.y = mouseY - SCALE / 2;
    drawMino(selectMino, SCALE);
  }

  minoList.forEach((m) => drawMino(m, VIEW_SCALE));
};

function setupCellPosition() {
  console.table(field);

  console.table(field.cells);
  for (let y = 0; y < YSIZE; ++y) {
    for (let x = 0; x < XSIZE; ++x) {
      field.cells[y * YSIZE + x] = new Cell(
        -1,
        -1,
        (x + MARGIN) * SCALE,
        y * SCALE + 1
      );
    }
  }
}

function setupMinoListPosition() {
  const rowLength = 5;
  for (let i = 0; i < minoList.length; i++) {
    const mino = minoList[i];
    const index = i % rowLength;
    if (index == 0) {
      mino.x = 0;
    } else {
      const prevMino = minoList[index - 1];
      const padding = VIEW_SCALE;

      mino.x = prevMino.x + prevMino.cells[0].length * VIEW_SCALE + padding;
    }

    mino.y = 650 + Math.floor(i / rowLength) * (VIEW_SCALE * 4);
  }
}

function score_draw(field) {
  let score = field.score();
  document.getElementById("score").innerHTML = score;

  document.querySelector("#modal-retry .modal-body").innerHTML = score;
}

window.mouseClicked = () => {
  updateSelectMinoFrom(mouseX, mouseY);

  pushFieldFromSelectMino();
};

function pushFieldFromSelectMino() {
  if (selectMino === null) return;

  const tapPosition = setMinoFrom(mouseX, mouseY);
  if (tapPosition !== null) {
    for (let y = 0; y < selectMino.cells.length; y++) {
      for (let x = 0; x < selectMino.cells[0].length; x++) {
        const minoCell = selectMino.cells[y][x];
        if (minoCell.cellId === -1) continue;

        const fieldCell =
          field.cells[(tapPosition.y + y) * YSIZE + tapPosition.x + x];

        if (fieldCell.cellId !== -1) {
          // すでにフィールドに置かれている
          return;
        }
      }
    }

    for (let y = 0; y < selectMino.cells.length; y++) {
      for (let x = 0; x < selectMino.cells[0].length; x++) {
        const minoCell = selectMino.cells[y][x];
        if (minoCell.cellId === -1) continue;
        const fieldCell =
          field.cells[(tapPosition.y + y) * YSIZE + tapPosition.x + x];
        fieldCell.parentMinoId = selectMino.id;
        fieldCell.cellId = minoCell.cellId;
      }
    }
  }
  score_draw(field);
}

function setMinoFrom(mx, my) {
  for (let y = 0; y < YSIZE; ++y) {
    for (let x = 0; x < XSIZE; ++x) {
      const d = dist(
        mx,
        my,
        (x + MARGIN) * SCALE + SCALE / 2,
        y * SCALE + SCALE / 2
      );

      if (d < SCALE / 2) {
        return new Coordinate(y, x);
      }
    }
  }

  return null;
}

function updateSelectMinoFrom(mx, my) {
  minoList.forEach((m) => {
    const cells = m.cells;
    for (let y = 0; y < cells.length; ++y) {
      for (let x = 0; x < cells[y].length; ++x) {
        const cell = cells[y][x];
        if (cell.cellId === -1) continue;

        const d = dist(
          mx,
          my,
          x * VIEW_SCALE + m.x + VIEW_SCALE / 2,
          y * VIEW_SCALE + m.y + VIEW_SCALE / 2
        );

        if (d <= VIEW_SCALE) {
          selectMino = { ...m };
          return;
        }
      }
    }
  });
}

function drawMino(mino, size) {
  const cells = mino.cells;

  for (let y = 0; y < cells.length; ++y) {
    for (let x = 0; x < cells[y].length; ++x) {
      const cell = cells[y][x];
      if (cell.cellId === -1) continue;
      image(
        Images[cell.cellId],
        x * size + mino.x,
        y * size + mino.y,
        size,
        size
      );
    }
  }
}

function drawField() {
  for (let y = 0; y < YSIZE; ++y) {
    for (let x = 0; x < XSIZE; ++x) {
      const cell = field.cells[y * YSIZE + x];

      drawCell(cell, SCALE);
    }
  }
}

function drawCell(cell, size) {
  fill(200);
  rect(cell.x, cell.y, size);

  if (cell.cellId !== -1) {
    image(Images[cell.cellId], cell.x, cell.y, size, size);
  }
  fill(255);
}

let testfunc = () => {
  let cells = [
    [new Cell(0, 0), new Cell(1, 2), new Cell(2, 2)],
    [new Cell(0, 1), new Cell(1, 1), new Cell(2, 1)],
    [new Cell(0, 2), new Cell(0, 1), new Cell(-1, -1)],
  ];
  let field = new Field(cells);
  score_draw(field);
};
