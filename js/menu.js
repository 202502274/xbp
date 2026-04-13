const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("nav-menu");
const overlay = document.getElementById("overlay");

function isMobile() {
  return window.innerWidth <= 768;
}

hamburger.addEventListener("click", () => {
  if (isMobile()) {
    menu.classList.toggle("active");
    overlay.classList.toggle("active");
  }
});

// アコーディオン
document.querySelectorAll(".has-sub > span").forEach(item => {
  item.addEventListener("click", (e) => {
    if (isMobile()) {
      e.stopPropagation();

      const dropdown = item.nextElementSibling;
      const parent = item.parentElement;

      parent.classList.toggle("active");
      dropdown.classList.toggle("active");
    }
  });
});

// ★ここが重要
menu.addEventListener("click", (e) => {
  e.stopPropagation();
});

// 外側クリックで閉じる
overlay.addEventListener("click", () => {
  menu.classList.remove("active");
  overlay.classList.remove("active");

  document.querySelectorAll(".dropdown").forEach(d => {
    d.classList.remove("active");
  });

  document.querySelectorAll(".has-sub").forEach(el => {
    el.classList.remove("active");
  });
});