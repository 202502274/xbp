const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("nav-menu");
const overlay = document.getElementById("overlay");

function isMobile() {
  return window.innerWidth <= 768;
}

// ハンバーガー
hamburger.addEventListener("click", () => {
  if (isMobile()) {
    menu.classList.toggle("active");
    overlay.classList.toggle("active");
  }
});

// アコーディオン
document.querySelectorAll(".has-sub > span").forEach(item => {
  item.addEventListener("click", () => {
    if (isMobile()) {
      const parent = item.parentElement;
      const dropdown = item.nextElementSibling;

      // 開閉トグル
      parent.classList.toggle("active");
      dropdown.classList.toggle("active");
    }
  });
});

// 背景クリックで閉じる
overlay.addEventListener("click", () => {
  menu.classList.remove("active");
  overlay.classList.remove("active");

  // アコーディオンも全部閉じる
  document.querySelectorAll(".dropdown").forEach(d => {
    d.classList.remove("active");
  });

  document.querySelectorAll(".has-sub").forEach(item => {
    item.classList.remove("active");
  });
});

document.querySelectorAll(".has-sub > span").forEach(item => {
  item.addEventListener("click", () => {
    if (isMobile()) {
      const parent = item.parentElement;
      const dropdown = item.nextElementSibling;

      // 他閉じる
      document.querySelectorAll(".dropdown").forEach(d => {
        if (d !== dropdown) d.classList.remove("active");
      });

      document.querySelectorAll(".has-sub").forEach(el => {
        if (el !== parent) el.classList.remove("active");
      });

      // トグル
      parent.classList.toggle("active");
      dropdown.classList.toggle("active");
    }
  });
});