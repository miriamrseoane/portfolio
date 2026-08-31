const gallery = document.querySelector(".stack-gallery");

const images = Array.from(
  document.querySelectorAll(".gallery-image")
);

const credit = document.querySelector(".gallery-credit");
const counter = document.querySelector(".gallery-counter");

let currentIndex = 0;
let interval;

const imageDuration = 4000;


/* =========================================
   FORMAT NUMBER
========================================= */

function formatNumber(number) {
  return String(number).padStart(2, "0");
}


/* =========================================
   UPDATE INFO
========================================= */

function updateInfo() {

  const currentImage = images[currentIndex];

  if (credit) {
    credit.textContent =
      currentImage.dataset.credit || "";
  }

  if (counter) {
    counter.textContent =
      `${formatNumber(currentIndex + 1)} / ${formatNumber(images.length)}`;
  }

}


/* =========================================
   INITIALIZE STACK
========================================= */

function initializeStack() {

  images.forEach((image) => {

    image.classList.remove("visible");
    image.classList.remove("entering");

    image.style.zIndex = 0;

  });


  /* Primera imagen */

  images[0].classList.add("visible");

  images[0].style.zIndex = 1;

  currentIndex = 0;

  updateInfo();

}


/* =========================================
   SHOW NEXT IMAGE
========================================= */

function showNextImage() {

  const nextIndex =
    (currentIndex + 1) % images.length;


  /* Si volvemos al principio,
     limpiamos la pila */

  if (nextIndex === 0) {

    initializeStack();

    return;

  }


  currentIndex = nextIndex;

  const nextImage = images[currentIndex];


  /* Nueva imagen encima */

  nextImage.style.zIndex =
    currentIndex + 1;

  nextImage.classList.add("visible");
  nextImage.classList.add("entering");


  /* Quitar animación de entrada
     una vez terminada */

  setTimeout(() => {

    nextImage.classList.remove("entering");

  }, 900);


  updateInfo();

}


/* =========================================
   AUTOPLAY
========================================= */

function startAutoplay() {

  clearInterval(interval);

  interval = setInterval(() => {

    showNextImage();

  }, imageDuration);

}


/* =========================================
   START
========================================= */

if (images.length > 0) {

  initializeStack();

  if (images.length > 1) {

    startAutoplay();

  }

}


/* =========================================
   CLICK TO ADVANCE
========================================= */

if (gallery && images.length > 1) {

  gallery.addEventListener("click", () => {

    showNextImage();

    startAutoplay();

  });

}
