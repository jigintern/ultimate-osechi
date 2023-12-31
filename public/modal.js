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

const initHelp = (types) => {
  const body = document.querySelector("#modal-help .modal-body");
  if (body.children.length > 0) {
    return;
  }
  types.forEach((type) => {
    const row = document.createElement("div");
    row.classList.add("help-row");
    const img = document.createElement("img");
    img.src = "./assets/" + type.image;
    img.style.marginRight = "5px";
    const name = document.createElement("div");
    name.innerHTML = type.name;
    row.appendChild(img);
    row.appendChild(name);
    body.appendChild(row);
  });
};

export const showHelp = async (types) => {
  initHelp(types);
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
