export let canvas = null
let g = null;

export let mouseX = 0;
export let mouseY = 0;

export const createCanvas = (w, h) => {
  if (canvas) {
    throw new Exception("already created canvas");
  }
  canvas = document.createElement("canvas");
  const c = canvas;
  g = c.getContext("2d");
  c.width = w;
  c.height = h;
  c.style.width = w + "px";
  c.style.height = h + "px";
  c.parent = (parentid) => {
    const parent = document.getElementById(parentid);
    parent.appendChild(c);
  };
  c.onmousedown = (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    window.mouseClicked(e);
  };
  c.onmousemove = (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  };
  return c;
};

export const strokeWeight = (n) => {
  g.lineWidth = n;
};
export const rect = (x, y, w, h) => {
  if (h === undefined) {
    h = w;
  }
  g.fillRect(x, y, w, h);
  g.strokeRect(x, y, w, h);
};
const color = (cr, cg, cb, ca = 1) => {
  if  (cg === undefined) {
    cg = cb = cr;
  }
  return `rgba(${cr},${cg},${cb},${ca})`;
};
export const background = (cr, cg, cb, ca) => {
  g.fillStyle = color(cr, cg, cb, ca);
  g.fillRect(0, 0, canvas.width, canvas.height);
};
export const stroke = (cr, cg, cb, ca = 1) => {
  g.strokeStyle = color(cr, cg, cb, ca);
};
export const fill = (cr, cg, cb, ca = 1) => {
  g.fillStyle = color(cr, cg, cb, ca);
};
export const noFill = () => {
  g.fillStyle = color(0, 0, 0, 0);
};

export const image = (img, x, y, w, h) => {
  g.drawImage(img, x, y, w, h);
};
export const loadImage = async (fn) => {
  return new Promise(resolve => {
    const img = new Image();
    img.src = fn;
    img.onload = () => resolve(img);
  });
};
export const dist = (x1, y1, x2, y2) => {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
};
export const textSize = (n) => {
  g.font = `${n}px sans-serif`;
};
export const CENTER = 0;
let textalign = 0;
export const textAlign = (align) => {
  textalign = align;
};
export const text = (s, x, y) => {
  if (textalign == CENTER) {
    const m = g.measureText(s);
    x -= m.width / 2;
    const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    y += h / 2;
  }
  g.fillText(s, x, y);
};
export let deltaTime = 0;
export let frameCount = 0;

const fps = 60;

export const main = async (preload, setup, draw) => {
  await preload();
  setup();
  const draw2 = () => {
    draw();
    frameCount++;
    deltaTime = frameCount * 1000 / fps;
    //requestAnimationFrame(draw2);
    setTimeout(draw2, 1000 / fps);
  };
  draw2();
};
