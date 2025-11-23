/*ソースコードのコピーボタン*/
function copyCode(btn) {
  const codeBlock = btn.parentElement;
  const code = codeBlock.querySelector("code").innerText;
  const popup = codeBlock.querySelector(".copied-popup");

  navigator.clipboard.writeText(code).then(() => {
    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
    }, 1200);
  });
}