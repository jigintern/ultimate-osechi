import { Cell, Field, Mino } from "./logic.js";
import { IMino, LMino, OMino, SMino, TMino } from "./mino.js";

let selectMino = new Mino(new Cell(1, 2));
let minoList = [
  new IMino(new Cell(1, 1)),
  new OMino(new Cell(1, 1)),
  new LMino(new Cell(1, 1)),
  new SMino(new Cell(1, 1)),
  new TMino(new Cell(1, 1)),
];

const XSIZE = 10;
const YSIZE = 10;
const SCALE = 60;
const MARGIN = 1;

const VIEW_SCALE = 20;

window.setup = () => {
  const canvas = createCanvas((XSIZE + MARGIN * 2) * SCALE, YSIZE * 2 * SCALE);
  canvas.parent("canvas");
  document.getElementById("score").style.marginRight = MARGIN * SCALE + "px";

  setupMinoListPosition();
};

window.draw = () => {
  background(220);
  strokeWeight(1);
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      rect((i + MARGIN) * SCALE, j * SCALE + 1, SCALE, SCALE);
    }
  }

  selectMino.x = mouseX;
  selectMino.y = mouseY;
  drawMino(selectMino, SCALE);

  minoList.forEach((m) => drawMino(m, VIEW_SCALE));
};

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
}

window.mouseClicked = () => {
  updateSelectMinoFrom(mouseX, mouseY);
};

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

      fill(100);
      rect(x * size + mino.x, y * size + mino.y, size);
      fill(255);
    }
  }
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
