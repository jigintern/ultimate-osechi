import {Cell,Mino,Field,Coordinate} from "./logic.js";
const XSIZE = 10;
const YSIZE = 10;
const SCALE = 60;
const MARGIN = 1;

window.setup = () => {
    const canvas = createCanvas(
        (XSIZE + MARGIN * 2) * SCALE,
        YSIZE * 2 * SCALE
    );
    canvas.parent("canvas");
    document.getElementById("score").style.marginRight = MARGIN * SCALE + "px";
};

window.draw = () => {
    background(220);
    strokeWeight(1);
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            rect((i + MARGIN) * SCALE, j * SCALE + 1, SCALE, SCALE);
        }
    }
};
function score_draw(field) {
    let score = field.score();
    document.getElementById("score").innerHTML = score;
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