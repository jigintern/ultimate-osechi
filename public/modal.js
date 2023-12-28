//モーダルのボタンにイベントリスナーつける
export function initModal() {
  //title
  document
    .querySelector("#modal-title button")
    .addEventListener("click", hideTitle);
}

function hideTitle() {
  const blackDom = document.getElementById("modal-black");
  blackDom.classList.add("hide");
  const titleDom = document.getElementById("modal-title");
  titleDom.classList.add("hide");
}
