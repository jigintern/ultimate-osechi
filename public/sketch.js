import { createMinoList } from "./createMinoList.js";
import { Cell, Coordinate, Field } from "./logic.js";
import { initModal } from "./modal.js";

let selectMino = null;
let drawCombo_count = 0;
let minoList = createMinoList(30);
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
  "お皿.png",
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

  drawCombo(field.combo);

  if (selectMino !== null) {
    selectMino.x = mouseX - SCALE / 2;
    selectMino.y = mouseY - SCALE / 2;
    drawMino(selectMino, SCALE);
  }

  minoList.forEach((m) => drawMino(m, VIEW_SCALE));
};

function drawCombo(combo) {
  /*コンボ部分を点滅させる*/
  if (drawCombo_count < 0) return;
  drawCombo_count -= deltaTime;
  for (let i = 0; i < combo.length; i++) {
    if (combo[i].length == 1) continue;
    let R = 255;
    let G = 255;
    let B = 0;
    for (let j = 0; j < combo[i].length; j++) {
      let cell = field.cells[combo[i][j].y * YSIZE + combo[i][j].x];
      draw_frame(cell, SCALE, R, G, B);
    }
  }
}
function draw_frame(cell, size, R, G, B) {
  stroke(R, G, B, Math.sin(frameCount / 6) * 100 + 100); //
  strokeWeight(3);
  noFill();
  rect(cell.x, cell.y, size);
  strokeWeight(1);
  stroke(0);
  fill(255);
}

function setupCellPosition() {
  for (let y = 0; y < YSIZE; ++y) {
    for (let x = 0; x < XSIZE; ++x) {
      field.cells[y * YSIZE + x] = new Cell(
        -1,
        -1,
        (x + MARGIN) * SCALE,
        (y + MARGIN / 2) * SCALE + 1
      );
    }
  }
}

function setupMinoListPosition() {
  const rowLength = 8;
  for (let i = 0; i < minoList.length; i++) {
    const mino = minoList[i];
    const index = i % rowLength;
    const padding = VIEW_SCALE;

    if (index == 0) {
      mino.x = padding;
    } else {
      const prevMino = minoList[index - 1];

      mino.x = prevMino.x + prevMino.cells[0].length * VIEW_SCALE + padding;
    }

    mino.y = 650 + Math.floor(i / rowLength) * (VIEW_SCALE * 4);
  }
}

function score_draw(field) {
  let score = field.score();
  document.getElementById("score").innerHTML = "SCORE: " + score;

  document.querySelector("#modal-retry .modal-body").innerHTML =
    "SCORE: " + score;
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

    // フィールドに置く
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
    //2秒間だけdrawComboを呼び出す
    drawCombo_count = 2000;
    field.combo = field.combo_check();
    // リストから消す
    minoList = minoList.filter((e) => e.id !== selectMino.id);
    // 選択を消す
    selectMino = null;
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
        (y + MARGIN / 2) * SCALE + SCALE / 2
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
          if (selectMino !== null && selectMino.id === m.id) {
            selectMino = null;
          } else {
            selectMino = { ...m };
          }
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

      const pos = new Coordinate(y * size + mino.y, x * size + mino.x);
      if (selectMino !== null && mino.id === selectMino.id) {
        const borderSize = 4;
        strokeWeight(borderSize);
        stroke(0, 200, 0);
        rect(pos.x, pos.y, size);
        stroke(0);
        strokeWeight(1);
      }

      image(Images[imageFiles.length - 1], pos.x, pos.y, size, size);
      image(Images[cell.cellId], pos.x, pos.y, size, size);
    }
  }
}

function drawField() {
  strokeWeight(30);
  stroke(5);
  rect(MARGIN * SCALE, (MARGIN / 2) * SCALE, XSIZE * SCALE, YSIZE * SCALE);
  for (let y = 0; y < YSIZE; ++y) {
    for (let x = 0; x < XSIZE; ++x) {
      const cell = field.cells[y * YSIZE + x];

      drawCell(cell, SCALE);
    }
  }
}

function drawCell(cell, size) {
  fill(130, 10, 0);
  strokeWeight(2);
  stroke(10);
  rect(cell.x, cell.y, size);
  strokeWeight(1);
  stroke(0);

  if (cell.cellId !== -1) {
    image(Images[imageFiles.length - 1], cell.x, cell.y, size, size);
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
