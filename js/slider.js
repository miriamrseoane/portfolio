const gallery = document.querySelector(".background-gallery");
const images = document.querySelectorAll(".background-image");

let currentImage = 0;
let interval;

const imageDuration = 4000;

function showNextImage() {
  images[currentImage].classList.remove("active");

  currentImage = (currentImage + 1) % images.length;

  images[currentImage].classList.add("active");
}

function startAutoplay() {
  clearInterval(interval);

  interval = setInterval(() => {
    showNextImage();
  }, imageDuration);
}

if (images.length > 1 && gallery) {

  startAutoplay();

  gallery.addEventListener("click", () => {
    showNextImage();
    startAutoplay();
  });

}
