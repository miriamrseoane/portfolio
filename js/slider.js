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
   SHOW IMAGE
========================================= */

function showImage(index) {

  images.forEach((image, imageIndex) => {

    image.classList.remove("active");

    /*
      La imagen actual queda siempre
      por encima de las anteriores.
    */

    if (imageIndex === index) {
      image.style.zIndex = images.length + 1;
    } else {
      image.style.zIndex = imageIndex + 1;
    }

  });


  images[index].classList.add("active");

  updateInfo();
}


/* =========================================
   NEXT IMAGE
========================================= */

function showNextImage() {

  currentIndex =
    (currentIndex + 1) % images.length;

  showImage(currentIndex);
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
   INITIALIZE
========================================= */

if (images.length > 0) {

  showImage(currentIndex);

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

    /*
      Reiniciamos el temporizador
      después del clic.
    */

    startAutoplay();

  });

}
