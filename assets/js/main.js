// navbar blur on scroll
window.addEventListener("scroll", () => {
  document.querySelector(".nav")
    .classList.toggle("scrolled", window.scrollY > 40);
});
