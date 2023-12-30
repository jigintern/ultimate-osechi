import types from "./osechi.js";

export const showTitle = async () => {
  return new Promise(resolve => {
    const btn = document.querySelector("#modal-title button");
    btn.addEventListener("click", () => {
      const blackDom = document.getElementById("modal-black");
      blackDom.classList.add("hide");
      const titleDom = document.getElementById("modal-title");
      titleDom.classList.add("hide");
      resolve()
    });
  });
};

export const showRetry = async (score) => {
  return new Promise(resolve => {
    const blackDom = document.getElementById("modal-black");
    blackDom.classList.remove("hide");
    const titleDom = document.getElementById("modal-retry");
    titleDom.classList.remove("hide");

    const body = document.querySelector("#modal-retry .modal-body");
    body.textContent = "SCORE: " + score;

    const btn = document.querySelector("#modal-retry button");
    btn.addEventListener("click", () => {
      const blackDom = document.getElementById("modal-black");
      blackDom.classList.add("hide");
      const titleDom = document.getElementById("modal-retry");
      titleDom.classList.add("hide");
      resolve();
    });
  });
};

const initHelp = () => {
  const body = document.querySelector("#modal-help .modal-body");
  types.forEach((type) => {
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
initHelp();

export const showHelp = async () => {
  return new Promise(resolve => {
    const blackDom = document.getElementById("modal-black");
    blackDom.classList.remove("hide");
    const titleDom = document.getElementById("modal-help");
    titleDom.classList.remove("hide");

    const btn = document.querySelector("#modal-help button");
    btn.addEventListener("click", () => {
      const blackDom = document.getElementById("modal-black");
      blackDom.classList.add("hide");
      const titleDom = document.getElementById("modal-help");
      titleDom.classList.add("hide");
      resolve()
    });
  });
};
