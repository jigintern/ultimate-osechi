import { background, strokeWeight, stroke, rect, fill, noFill, deltaTime, image, loadImage, mouseX, mouseY, canvas, dist, textSize, textAlign, CENTER, text, main, noStroke, frameCount } from "https://code4fukui.github.io/p5.es/p5.js";
import { createMinoList } from "./createMinoList.js";
import { Cell, Coordinate, Field } from "./logic.js";
import { showTitle, showHelp, showRetry } from "./modal.js";
import osechi from "./osechi.js";

const XSIZE = 10;
const YSIZE = 10;

const timelimit = 60;

let selectMino = null;
let drawCombo_count = 0;
let minoList = null;

class Guzai{
    constructor(num, x, y){
        this.guzai = num;
        this.x = x;
        this.y = y;
        this.life = 2000;
    }
    draw(){

        fill(255,255,0);
        textSize((1-(this.life/2000)**5)*20 * 2);
        textAlign(CENTER, CENTER);
        text(osechi[this.guzai].name, this.x, this.y);
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
    Images[i] = await loadImage("assets/" + osechi[i].image);
  }
  imageBase = await loadImage("assets/plate.png");
};

const field = new Field(XSIZE, YSIZE);

const reset = (marginx, marginySelect, width, viewScale) => {
  selectMino = null;
  drawCombo_count = 0;
  minoList = createMinoList(30);
  setupMinoListPosition(marginx, marginySelect, width, viewScale);
  setupCellPosition();
  starttime = performance.now();
};
const setup = () => {
};

const S_TITLE = 0;
const S_MAIN = 1;
const S_END = 2;

let state = S_TITLE;

let starttime = null;

const drawHeader = (offx, offy, width, height) => {
  const h = height;
  const ih = h * (40 / 50);
  const iy = (h - ih) / 2;
  const fonth = h * (30 / 50);
  fill(240);
  noStroke();
  rect(0, 0, canvas.width, h);
  const ix = offx + ih * 2;
  image(imageBase, ix, iy, ih, ih);
  textSize(fonth);
  textAlign(CENTER, CENTER);
  fill(230);
  text("?", ix + ih / 2, offy + (h - ih) / 2 + ih / 2);
  fill(0);
  const time = starttime == null ? timelimit : timelimit - Math.floor((performance.now() - starttime) / 1000);
  text(time + "sec", offx + width / 2, h / 2);
  text("SCORE: " + field.score(), offx + width * .8, h / 2);
  return h;
};
const HEIGHT_RATIO_FIELD = 0.7;

const draw = async (flgresize) => {
  background(220);
  const scale = Math.min(canvas.height / (YSIZE + 5 + 1), canvas.width / (XSIZE + 2));
  const heightHeader = scale;
  const heightField = scale * (YSIZE + 1);
  const width = scale * (XSIZE + 2);
  const marginx = (canvas.width - width) / 2;
  const heightSelect = canvas.height - heightField;
  const r = heightSelect / width;
  const viewScale = r < .7 ? width / 40 : r < 1.2 ? width / 30 : width / 25;
  const marginySelect = heightHeader + heightField;

  if (state == S_TITLE) {
    reset(marginx, marginySelect, width, viewScale);
  }
  const hh = drawHeader(marginx, 0, width, heightHeader);

  drawField(marginx, hh, scale);

  drawCombo(field.combo, scale);
  drawGuzais();

  if (flgresize) {
    setupMinoListPosition(marginx, marginySelect, width, viewScale);
  }
  minoList.forEach((m) => drawMino(m, viewScale));
  
  if (selectMino !== null) {
    selectMino.x = mouseX - scale / 2;
    selectMino.y = mouseY - scale / 2;
    drawMino(selectMino, scale);
  }

  if (state == S_TITLE) {
    await showTitle();
    starttime = performance.now();
    state = S_MAIN;
  }
  if (performance.now() > starttime + timelimit * 1000) {
    await showRetry(field.score());
    reset(marginx, heightHeader + heightField, width, viewScale);
    state = S_MAIN;
  }

  window.mouseClicked = async (e) => {
    if (e.target !== canvas) return;
    if (mouseY < heightHeader) await showHelp(osechi);
    updateSelectMinoFrom(mouseX, mouseY, viewScale);

    pushFieldFromSelectMino(scale, marginx, heightHeader);
  };
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
function drawCombo(combo, scale) {
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
      draw_frame(cell, scale, R, G, B);
    }
 
  }
}
function draw_frame(cell, size, R, G, B) {
  stroke(R, G, B, Math.sin(frameCount / 6) * 100 + 100); //
  strokeWeight(6);
  noFill();
  rect(cell.x, cell.y, size);
  strokeWeight(2);
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

function setupMinoListPosition(marginx, marginy, width, viewScale) {
  const PADDING = viewScale;
  const offx = PADDING + marginx;
  let x = offx;
  let y = marginy;
  for (const mino of minoList) {
    if (x + mino.w * viewScale <= marginx + width - PADDING) {
      mino.x = x;
      mino.y = y;
    } else {
      x = offx;
      y += viewScale * 4;
      mino.y = y;
      mino.x = x;
    }
    x += (mino.w + 1) * viewScale;
  }
}

function pushFieldFromSelectMino(scale, marginx, marginy) {
  if (selectMino === null) return;

  const tapPosition = setMinoFrom(mouseX, mouseY, scale, marginx, marginy);
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

function setMinoFrom(mx, my, scale, marginx, marginy) {
  for (let y = 0; y < YSIZE; ++y) {
    for (let x = 0; x < XSIZE; ++x) {
      const d = dist(
        mx - scale / 2,
        my - scale / 2,
        marginx + x * scale + scale,
        marginy + y * scale + scale / 2
      );

      if (d < scale / 2) {
        return new Coordinate(y, x);
      }
    }
  }

  return null;
}

function updateSelectMinoFrom(mx, my, viewScale) {
  minoList.forEach((m) => {
    const cells = m.cells;
    for (let y = 0; y < cells.length; ++y) {
      for (let x = 0; x < cells[y].length; ++x) {
        const cell = cells[y][x];
        if (cell.cellId === -1) continue;

        const d = dist(
          mx,
          my,
          x * viewScale + m.x + viewScale / 2,
          y * viewScale + m.y + viewScale / 2
        );

        if (d <= viewScale) {
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

function drawField(offx, offy, scale) {
  strokeWeight(scale * .5);
  stroke(5);
  rect(offx + scale, offy + scale / 2, XSIZE * scale, YSIZE * scale);
  for (let y = 0; y < YSIZE; ++y) {
    for (let x = 0; x < XSIZE; ++x) {
      const cell = field.cells[y * YSIZE + x];
      const cx = offx + scale + x * scale;
      const cy = offy + scale / 2 + y * scale;
      drawCell(cell, cx, cy, scale);
    }
  }
}

function drawCell(cell, x, y, size) {
  fill(130, 10, 0);
  strokeWeight(4);
  stroke(10);
  rect(x, y, size);
  cell.x = x;
  cell.y = y;
  strokeWeight(2);
  stroke(0);

  if (cell.cellId !== -1) {
    image(imageBase, x, y, size, size);
    image(Images[cell.cellId], x, y, size, size);
  }
  fill(255);
}

await preload();
setup();
main(draw);
