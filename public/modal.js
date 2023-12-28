import { timer_start } from "./game.js";
//モーダルのボタンにイベントリスナーつける
export function initModal() {
  //title
  document
    .querySelector("#modal-title button")
    .addEventListener("click", hideTitle);

  document
    .querySelector("#modal-retry button")
    .addEventListener("click", () => {
      location.reload();
    });
  //help
  initHelp();
  document.getElementById("help").addEventListener("click", showHelp);
  document
    .querySelector("#modal-help button")
    .addEventListener("click", hideHelp);
}

function hideTitle() {
  const blackDom = document.getElementById("modal-black");
  blackDom.classList.add("hide");
  const titleDom = document.getElementById("modal-title");
  titleDom.classList.add("hide");

  timer_start();
}

export function showRetry() {
  const blackDom = document.getElementById("modal-black");
  blackDom.classList.remove("hide");
  const titleDom = document.getElementById("modal-retry");
  titleDom.classList.remove("hide");
}

function initHelp() {
  const type = [
    "えび",
    "かまぼこ",
    "ごぼう",
    "なます",
    "伊達巻",
    "錦玉子",
    "金柑",
    "栗きんとん",
    "黒豆",
    "昆布巻き",
    "酢だこ",
    "数の子",
    "田作り",
    "八幡巻き",
    "蓮根",
  ];
  const body = document.querySelector("#modal-help .modal-body");
  type.forEach((type) => {
    const row = document.createElement("div");
    row.classList.add("help-row");
    const img = document.createElement("img");
    img.src = "./assets/" + type + ".png";
    img.style.marginRight = "5px";
    const name = document.createElement("div");
    name.innerHTML = type;
    row.appendChild(img);
    row.appendChild(name);
    body.appendChild(row);
  });
}
function showHelp() {
  const blackDom = document.getElementById("modal-black");
  blackDom.classList.remove("hide");
  const titleDom = document.getElementById("modal-help");
  titleDom.classList.remove("hide");
}
function hideHelp() {
  const blackDom = document.getElementById("modal-black");
  blackDom.classList.add("hide");
  const titleDom = document.getElementById("modal-help");
  titleDom.classList.add("hide");
}
