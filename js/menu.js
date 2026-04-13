const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("nav-menu");

function isMobile() {
  return window.innerWidth <= 768;
}

// ハンバーガー
hamburger.addEventListener("click", () => {
  if (isMobile()) {
    menu.classList.toggle("active");
  }
});

// サブメニュー
document.querySelectorAll(".has-sub > span").forEach(item => {
  item.addEventListener("click", () => {
    if (isMobile()) {
      item.nextElementSibling.classList.toggle("active");
    }
  });
});

// PCに戻ったときリセット
window.addEventListener("resize", () => {
  if (!isMobile()) {
    menu.classList.remove("active");
    document.querySelectorAll(".dropdown").forEach(d => {
      d.classList.remove("active");
    });
  }
});