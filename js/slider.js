const archiveLink = document.querySelector(".archive-link");

const gallery = document.querySelector(".background-gallery");

const images = Array.from(
  document.querySelectorAll(".gallery-image")
);

const logo = document.querySelector(".logo");
const aboutToggle = document.querySelector("#aboutToggle");

const credit = document.querySelector(".gallery-credit");
const counter = document.querySelector(".gallery-counter");

const aboutView = document.querySelector("#aboutView");
const aboutCopy = document.querySelector(".about-copy");
const aboutContact = document.querySelector(".about-contact");

let currentIndex = 0;
let interval;
let aboutOpen = false;

const imageDuration = 4000;
const brightnessThreshold = 135;


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
   REGION BRIGHTNESS
========================================= */

function getRegionBrightness(image, element) {

  try {

    if (
      !image.complete ||
      !image.naturalWidth ||
      !element
    ) {
      return null;
    }

    const canvas =
      document.createElement("canvas");

    const context =
      canvas.getContext("2d", {
        willReadFrequently: true
      });

    const rect =
      element.getBoundingClientRect();

    const viewportWidth =
      window.innerWidth;

    const viewportHeight =
      window.innerHeight;

    const imageWidth =
      image.naturalWidth;

    const imageHeight =
      image.naturalHeight;


    /* object-fit: cover */

    const scale =
      Math.max(
        viewportWidth / imageWidth,
        viewportHeight / imageHeight
      );

    const renderedWidth =
      imageWidth * scale;

    const renderedHeight =
      imageHeight * scale;

    const offsetX =
      (viewportWidth - renderedWidth) / 2;

    const offsetY =
      (viewportHeight - renderedHeight) / 2;


    /* Área alrededor del texto */

    const padding = 12;

    const screenX =
      Math.max(
        0,
        rect.left - padding
      );

    const screenY =
      Math.max(
        0,
        rect.top - padding
      );

    const regionWidth =
      Math.min(
        viewportWidth - screenX,
        rect.width + padding * 2
      );

    const regionHeight =
      Math.min(
        viewportHeight - screenY,
        rect.height + padding * 2
      );


    /* Convertir a coordenadas de imagen */

    const sourceX =
      (screenX - offsetX) / scale;

    const sourceY =
      (screenY - offsetY) / scale;

    const sourceWidth =
      regionWidth / scale;

    const sourceHeight =
      regionHeight / scale;


    const sampleWidth = 50;
    const sampleHeight = 30;

    canvas.width =
      sampleWidth;

    canvas.height =
      sampleHeight;


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


    const pixels =
      context.getImageData(
        0,
        0,
        sampleWidth,
        sampleHeight
      ).data;


    let totalBrightness = 0;
    let pixelCount = 0;


    for (
      let i = 0;
      i < pixels.length;
      i += 4
    ) {

      const red =
        pixels[i];

      const green =
        pixels[i + 1];

      const blue =
        pixels[i + 2];

      const brightness =
        red * 0.299 +
        green * 0.587 +
        blue * 0.114;

      totalBrightness +=
        brightness;

      pixelCount++;
    }


    return (
      totalBrightness /
      pixelCount
    );

  } catch (error) {

    console.warn(
      "Brightness detection failed:",
      error
    );

    return null;
  }
}


/* =========================================
   UPDATE ELEMENT COLOR
========================================= */

function updateElementColor(
  element,
  brightness
) {

  if (
    !element ||
    brightness === null
  ) {
    return;
  }

  element.classList.toggle(
    "is-light",
    brightness < brightnessThreshold
  );
}


/* =========================================
   UPDATE INTERFACE COLORS
========================================= */

function updateInterfaceColors(image) {

  if (
    !image.complete ||
    !image.naturalWidth
  ) {

    image.addEventListener(
      "load",
      () =>
        updateInterfaceColors(image),
      { once: true }
    );

    return;
  }

  updateElementColor(
  archiveLink,
  getRegionBrightness(
    image,
    archiveLink
  )
);


  updateElementColor(
    logo,
    getRegionBrightness(
      image,
      logo
    )
  );


  updateElementColor(
    aboutToggle,
    getRegionBrightness(
      image,
      aboutToggle
    )
  );


  updateElementColor(
    credit,
    getRegionBrightness(
      image,
      credit
    )
  );


  updateElementColor(
    counter,
    getRegionBrightness(
      image,
      counter
    )
  );


  if (aboutCopy) {

    updateElementColor(
      aboutCopy,
      getRegionBrightness(
        image,
        aboutCopy
      )
    );
  }


  if (aboutContact) {

    updateElementColor(
      aboutContact,
      getRegionBrightness(
        image,
        aboutContact
      )
    );
  }
}


/* =========================================
   SHOW IMAGE
========================================= */

function showImage(index) {

  images.forEach(
    (image, imageIndex) => {

      image.classList.toggle(
        "active",
        imageIndex === index
      );

    }
  );


  updateInfo();


  const currentImage =
    images[index];


  updateInterfaceColors(
    currentImage
  );
}


/* =========================================
   NEXT IMAGE
========================================= */

function showNextImage() {

  currentIndex =
    (currentIndex + 1) %
    images.length;

  showImage(
    currentIndex
  );
}


/* =========================================
   AUTOPLAY
========================================= */

function startAutoplay() {

  clearInterval(interval);

  interval =
    setInterval(
      () => {

        showNextImage();

      },
      imageDuration
    );
}


/* =========================================
   ABOUT TOGGLE
========================================= */

if (
  aboutToggle &&
  aboutView
) {

  aboutToggle.addEventListener(
    "click",
    () => {

      aboutOpen =
        !aboutOpen;


      aboutView.classList.toggle(
        "is-active",
        aboutOpen
      );


      aboutView.setAttribute(
        "aria-hidden",
        String(!aboutOpen)
      );


      aboutToggle.setAttribute(
        "aria-expanded",
        String(aboutOpen)
      );


      if (
        aboutOpen &&
        images.length > 0
      ) {

        requestAnimationFrame(
          () => {

            updateInterfaceColors(
              images[currentIndex]
            );

          }
        );
      }

    }
  );
}


/* =========================================
   INITIALIZE
========================================= */

if (images.length > 0) {

  showImage(
    currentIndex
  );


  if (images.length > 1) {
    startAutoplay();
  }
}


/* =========================================
   CLICK TO ADVANCE
========================================= */

if (
  gallery &&
  images.length > 1
) {

  gallery.addEventListener(
    "click",
    () => {

      showNextImage();

      startAutoplay();

    }
  );
}


/* =========================================
   RECALCULATE ON RESIZE
========================================= */

window.addEventListener(
  "resize",
  () => {

    if (images.length > 0) {

      updateInterfaceColors(
        images[currentIndex]
      );

    }
  }
);
