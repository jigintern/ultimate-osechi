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
}

function hideTitle() {
  const blackDom = document.getElementById("modal-black");
  blackDom.classList.add("hide");
  const titleDom = document.getElementById("modal-title");
  titleDom.classList.add("hide");
}

export function showRetry() {
  const blackDom = document.getElementById("modal-black");
  blackDom.classList.remove("hide");
  const titleDom = document.getElementById("modal-retry");
  titleDom.classList.remove("hide");
}
