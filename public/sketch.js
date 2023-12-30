import { background, strokeWeight, stroke, rect, fill, noFill, deltaTime, image, loadImage, mouseX, mouseY, canvas, dist, textSize, textAlign, CENTER, text, main, noStroke, frameCount } from "./p5.js";
import { createMinoList } from "./createMinoList.js";
import { Cell, Coordinate, Field } from "./logic.js";
import { showTitle, showHelp, showRetry } from "./modal.js";
import osechi from "./osechi.js";

if (navigator.userAgent.match(/(iPhone|iPod|Android.*Mobile)/i)) {
  alert("パソコンからアクセスしてね");
}

const timelimit = 60;

let selectMino = null;
let drawCombo_count = 0;
let minoList = null;

const XSIZE = 10;
const YSIZE = 10;

const SCALE = 60;
const MARGIN = 1;
const MARGIN_X = SCALE;
const MARGIN_Y = SCALE / 2;

const VIEW_SCALE = 20;

class Guzai{
    constructor(num, x, y){
        this.guzai = num;
        this.x = x;
        this.y = y;
        this.life = 2000;
    }
    draw(){

        fill(255,255,0);
        textSize((1-(this.life/2000)**5)*20);
        textAlign(CENTER, CENTER);
        text(osechi[this.guzai], this.x, this.y);
        //rect(this.x, this.y, 20, 20);
        fill(255);
        this.y-=0.1;
        this.life-=50;
    }
}
let guzaiList = [];

let Images = [];
let imageBase = null;
const preload = async () => {
  for (let i = 0; i < osechi.length; i++) {
    Images[i] = await loadImage("assets/" + osechi[i] + ".png");
  }
  imageBase = await loadImage("assets/お皿.png");
};

const field = new Field(XSIZE, YSIZE);

const WIDTH = (XSIZE + MARGIN * 2) * SCALE;
//const HEIGHT = YSIZE * 2 * SCALE;

const reset = () => {
  selectMino = null;
  drawCombo_count = 0;
  minoList = createMinoList(30);
  setupMinoListPosition();
  setupCellPosition();
  starttime = performance.now();

};
const setup = () => {
  reset();
};

const S_TITLE = 0;
const S_MAIN = 1;
const S_END = 2;

let state = S_TITLE;

let starttime = null;

const HEIGHT_HEADER = 50;

const drawHeader = (width) => {
  const h = HEIGHT_HEADER;
  fill(240);
  noStroke();
  rect(0, 0, width, h);
  const ix = 80;
  image(imageBase, ix, 5, 40, 40);
  textSize(30);
  textAlign(CENTER, CENTER);
  fill(230);
  text("?", ix + 40 / 2, 5 + 40 / 2);
  fill(0);
  const time = starttime == null ? timelimit : timelimit - Math.floor((performance.now() - starttime) / 1000);
  text(time + "sec", 320, 25);
  text("SCORE: " + field.score(), 500, 25);
  return h;
};
const draw = async () => {  
  background(220);
  const width = innerWidth;
  const hh = drawHeader(width);

  drawField(0, hh);

  drawCombo(field.combo);
  drawGuzais();

  minoList.forEach((m) => drawMino(m, VIEW_SCALE));

  if (selectMino !== null) {
    selectMino.x = mouseX - SCALE / 2;
    selectMino.y = mouseY - SCALE / 2;
    drawMino(selectMino, SCALE);
  }

  if (state == S_TITLE) {
    await showTitle();
    reset();
    state = S_MAIN;
  }
  if (performance.now() > starttime + timelimit * 1000) {
    await showRetry(field.score());
    reset();
    state = S_MAIN;
  }
};
function drawGuzais(){
    for(let i = 0; i < guzaiList.length; i++){
        guzaiList[i].draw();
        guzaiList[i].life--;
        if(guzaiList[i].life < 0){
            guzaiList.splice(i,1);
        }
    }

}
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
      const cell = field.cells[combo[i][j].y * YSIZE + combo[i][j].x];
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
      );
    }
  }
}

function setupMinoListPosition() {
  const PADDING = VIEW_SCALE;
  let x = PADDING;
  let y = 650 + HEIGHT_HEADER;
  for (const mino of minoList) {
    if (x + mino.w * VIEW_SCALE <= WIDTH - PADDING) {
      mino.x = x;
      mino.y = y;
    } else {
      x = PADDING;
      y += VIEW_SCALE * 4;
      mino.y = y;
      mino.x = x;
    }
    x += (mino.w + 1) * VIEW_SCALE;
  }
}

function score_draw(field) {
  let score = field.score();
  document.getElementById("score").innerHTML = "SCORE: " + score;

  document.querySelector("#modal-retry .modal-body").innerHTML =
    "SCORE: " + score;
}

window.mouseClicked = async (e) => {
  if (e.target !== canvas) return;
  if (mouseY < HEIGHT_HEADER) await showHelp();
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
        if (!fieldCell || fieldCell.cellId !== -1) {
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

        //guzaiListに追加
        let guzai = new Guzai(minoCell.cellId, fieldCell.x, fieldCell.y);
        guzaiList.push(guzai);
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

  //score_draw(field);
}

function setMinoFrom(mx, my) {
  for (let y = 0; y < YSIZE; ++y) {
    for (let x = 0; x < XSIZE; ++x) {
      const d = dist(
        mx,
        my,
        MARGIN_X + x * SCALE + SCALE / 2,
        HEIGHT_HEADER + MARGIN_Y + y * SCALE + SCALE / 2
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

      image(imageBase, pos.x, pos.y, size, size);
      image(Images[cell.cellId], pos.x, pos.y, size, size);
    }
  }
}

function drawField(offx, offy) {
  strokeWeight(30);
  stroke(5);
  rect(offx + MARGIN * SCALE, offy + (MARGIN / 2) * SCALE, XSIZE * SCALE, YSIZE * SCALE);
  for (let y = 0; y < YSIZE; ++y) {
    for (let x = 0; x < XSIZE; ++x) {
      const cell = field.cells[y * YSIZE + x];
      const cx = offx + MARGIN_X + x * SCALE;
      const cy = offy + MARGIN_Y + y * SCALE;
      drawCell(cell, cx, cy, SCALE);
    }
  }
}

function drawCell(cell, x, y, size) {
  fill(130, 10, 0);
  strokeWeight(2);
  stroke(10);
  rect(x, y, size);
  cell.x = x;
  cell.y = y;
  strokeWeight(1);
  stroke(0);

  if (cell.cellId !== -1) {
    image(imageBase, x, y, size, size);
    image(Images[cell.cellId], x, y, size, size);
  }
  fill(255);
}

main(preload, setup, draw);
