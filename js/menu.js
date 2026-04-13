const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("nav-menu");

function isMobile() {
  return window.innerWidth <= 768;
}

hamburger.addEventListener("click", () => {
  if (isMobile()) {
    menu.classList.toggle("active");
  }
});

document.querySelectorAll(".has-sub > span").forEach(item => {
  item.addEventListener("click", () => {
    if (isMobile()) {
      item.nextElementSibling.classList.toggle("active");
    }
  });
});