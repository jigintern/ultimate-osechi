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
