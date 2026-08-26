const gallery = document.querySelector(".background-gallery");
const images = document.querySelectorAll(".background-image");

const logo = document.querySelector(".logo");
const nav = document.querySelector(".site-header nav");
const footer = document.querySelector(".site-footer p");

let currentImage = 0;
let interval;

const imageDuration = 4000;


/* ---------------------------------
   CALCULAR LUMINOSIDAD DE UNA ZONA
---------------------------------- */

function getRegionBrightness(image, region) {

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", {
    willReadFrequently: true
  });

  const sampleWidth = 60;
  const sampleHeight = 40;

  canvas.width = sampleWidth;
  canvas.height = sampleHeight;


  /* Medidas reales de la imagen */

  const imageWidth = image.naturalWidth;
  const imageHeight = image.naturalHeight;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;


  /* Simular object-fit: cover */

  const imageRatio = imageWidth / imageHeight;
  const screenRatio = screenWidth / screenHeight;

  let renderedWidth;
  let renderedHeight;
  let offsetX;
  let offsetY;

  if (imageRatio > screenRatio) {

    renderedHeight = screenHeight;
    renderedWidth = imageWidth * (screenHeight / imageHeight);

    offsetX = (renderedWidth - screenWidth) / 2;
    offsetY = 0;

  } else {

    renderedWidth = screenWidth;
    renderedHeight = imageHeight * (screenWidth / imageWidth);

    offsetX = 0;
    offsetY = (renderedHeight - screenHeight) / 2;

  }


  /* Convertir coordenadas de pantalla
     a coordenadas de la imagen original */

  const scaleX = imageWidth / renderedWidth;
  const scaleY = imageHeight / renderedHeight;

  const sourceX =
    (region.x + offsetX) * scaleX;

  const sourceY =
    (region.y + offsetY) * scaleY;

  const sourceWidth =
    region.width * scaleX;

  const sourceHeight =
    region.height * scaleY;


  context.drawImage(
    image,

    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,

    0,
    0,
    sampleWidth,
    sampleHeight
  );


  const pixels = context.getImageData(
    0,
    0,
    sampleWidth,
    sampleHeight
  ).data;


  let totalBrightness = 0;
  let pixelCount = 0;

  for (let i = 0; i < pixels.length; i += 4) {

    const red = pixels[i];
    const green = pixels[i + 1];
    const blue = pixels[i + 2];

    const brightness =
      red * 0.299 +
      green * 0.587 +
      blue * 0.114;

    totalBrightness += brightness;

    pixelCount++;
  }


  return totalBrightness / pixelCount;
}


/* ---------------------------------
   CAMBIAR COLOR DEL TEXTO
---------------------------------- */

function updateTextColors(image) {

  if (!image.complete || !image.naturalWidth) {
    image.addEventListener(
      "load",
      () => updateTextColors(image),
      { once: true }
    );

    return;
  }


  const width = window.innerWidth;
  const height = window.innerHeight;


  /* Zona detrás del logo */

  const logoRegion = {
    x: 15,
    y: 10,
    width: 250,
    height: 70
  };


  /* Zona detrás de About */

  const navRegion = {
    x: width - 180,
    y: 10,
    width: 170,
    height: 70
  };


  /* Zona detrás del footer */

  const footerRegion = {
    x: 15,
    y: height - 80,
    width: 180,
    height: 70
  };


  const logoBrightness =
    getRegionBrightness(image, logoRegion);

  const navBrightness =
    getRegionBrightness(image, navRegion);

  const footerBrightness =
    getRegionBrightness(image, footerRegion);


  /* Umbral de luminosidad */

  const threshold = 125;


  logo.classList.toggle(
    "is-light",
    logoBrightness < threshold
  );

  nav.classList.toggle(
    "is-light",
    navBrightness < threshold
  );

  footer.classList.toggle(
    "is-light",
    footerBrightness < threshold
  );
}


/* ---------------------------------
   SIGUIENTE IMAGEN
---------------------------------- */

function showNextImage() {

  images[currentImage].classList.remove("active");

  currentImage =
    (currentImage + 1) % images.length;

  images[currentImage].classList.add("active");

  updateTextColors(images[currentImage]);
}


/* ---------------------------------
   AUTOPLAY
---------------------------------- */

function startAutoplay() {

  clearInterval(interval);

  interval = setInterval(() => {
    showNextImage();
  }, imageDuration);

}


/* ---------------------------------
   INICIO
---------------------------------- */

if (images.length > 0) {

  updateTextColors(images[currentImage]);

  if (images.length > 1) {
    startAutoplay();
  }

}


/* ---------------------------------
   CLICK PARA AVANZAR
---------------------------------- */

if (gallery && images.length > 1) {

  gallery.addEventListener("click", () => {

    showNextImage();

    startAutoplay();

  });

}


/* ---------------------------------
   RECALCULAR AL CAMBIAR VENTANA
---------------------------------- */

window.addEventListener("resize", () => {

  if (images.length > 0) {
    updateTextColors(images[currentImage]);
  }

});
