
/* =========================================
   ELEMENTS
========================================= */

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

const mobileQuery = window.matchMedia("(max-width: 768px)");

let currentIndex = 0;
let interval = null;
let aboutOpen = false;

const imageDuration = 4000;
const brightnessThreshold = 135;


/* =========================================
   HELPERS
========================================= */

function isMobile() {
  return mobileQuery.matches;
}

function formatNumber(number) {
  return String(number).padStart(2, "0");
}

function currentImage() {
  return images[currentIndex] || null;
}

function imageReady(image) {
  return Boolean(
    image &&
    image.complete &&
    image.naturalWidth > 0
  );
}


/* =========================================
   UPDATE INFO
========================================= */

function updateInfo() {

  const image = currentImage();

  if (!image) return;

  if (credit) {
    credit.textContent = image.dataset.credit || "";
  }

  if (counter) {
    counter.textContent =
      `${formatNumber(currentIndex + 1)} / ${formatNumber(images.length)}`;
  }
}


/* =========================================
   IMAGE SAMPLING
========================================= */

function sampleImage(image, element) {

  if (!imageReady(image) || !element) {
    return null;
  }

  try {

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", {
      willReadFrequently: true
    });

    if (!context) return null;

    const imageRect = image.getBoundingClientRect();
    const rect = element.getBoundingClientRect();

    if (!imageRect.width || !imageRect.height) {
      return null;
    }

    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;

    /* Match object-fit: cover */

    const scale = Math.max(
      imageRect.width / naturalWidth,
      imageRect.height / naturalHeight
    );

    const renderedWidth = naturalWidth * scale;
    const renderedHeight = naturalHeight * scale;

    const offsetX =
      (imageRect.width - renderedWidth) / 2;

    const offsetY =
      (imageRect.height - renderedHeight) / 2;

    const padding = 12;

    const left = Math.max(
      imageRect.left,
      rect.left - padding
    );

    const top = Math.max(
      imageRect.top,
      rect.top - padding
    );

    const right = Math.min(
      imageRect.right,
      rect.right + padding
    );

    const bottom = Math.min(
      imageRect.bottom,
      rect.bottom + padding
    );

    if (right <= left || bottom <= top) {
      return null;
    }

    const sourceX =
      (left - imageRect.left - offsetX) / scale;

    const sourceY =
      (top - imageRect.top - offsetY) / scale;

    const sourceWidth = (right - left) / scale;
    const sourceHeight = (bottom - top) / scale;

    canvas.width = 32;
    canvas.height = 24;

    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const pixels = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data;

    let red = 0;
    let green = 0;
    let blue = 0;
    let count = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      red += pixels[i];
      green += pixels[i + 1];
      blue += pixels[i + 2];
      count++;
    }

    return {
      r: Math.round(red / count),
      g: Math.round(green / count),
      b: Math.round(blue / count)
    };

  } catch (error) {

    console.warn("Image sampling failed:", error);
    return null;
  }
}


/* =========================================
   BRIGHTNESS AND CONTRAST
========================================= */

function getBrightness(color) {

  if (!color) return null;

  return (
    color.r * 0.299 +
    color.g * 0.587 +
    color.b * 0.114
  );
}

function updateElementColor(element, color) {

  if (!element || !color) return;

  const brightness = getBrightness(color);

  element.classList.toggle(
    "is-light",
    brightness < brightnessThreshold
  );
}


/* =========================================
   UPDATE INTERFACE COLORS
========================================= */

function updateInterfaceColors(image) {

  if (!imageReady(image)) return;

  const elements = [
    logo,
    archiveLink,
    aboutToggle,
    credit,
    counter
  ];

  elements.forEach((element) => {
    updateElementColor(
      element,
      sampleImage(image, element)
    );
  });

  if (!isMobile()) {

    updateElementColor(
      aboutCopy,
      sampleImage(image, aboutCopy)
    );

    updateElementColor(
      aboutContact,
      sampleImage(image, aboutContact)
    );
  }
}


/* =========================================
   MOBILE BACKGROUND COLOR
========================================= */

function getRepresentativeColor(image) {

  if (!imageReady(image)) {
    return { r: 255, g: 255, b: 255 };
  }

  try {

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", {
      willReadFrequently: true
    });

    if (!context) {
      return { r: 255, g: 255, b: 255 };
    }

    canvas.width = 24;
    canvas.height = 24;

    /* Sample the image as it appears with cover */

    const width = image.naturalWidth;
    const height = image.naturalHeight;

    const rect = image.getBoundingClientRect();

    const targetRatio = rect.width / rect.height;
    const sourceRatio = width / height;

    let sx = 0;
    let sy = 0;
    let sw = width;
    let sh = height;

    if (sourceRatio > targetRatio) {
      sw = height * targetRatio;
      sx = (width - sw) / 2;
    } else {
      sh = width / targetRatio;
      sy = (height - sh) / 2;
    }

    context.drawImage(
      image,
      sx, sy, sw, sh,
      0, 0, 24, 24
    );

    const pixels = context.getImageData(
      0, 0, 24, 24
    ).data;

    let red = 0;
    let green = 0;
    let blue = 0;
    let count = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      red += pixels[i];
      green += pixels[i + 1];
      blue += pixels[i + 2];
      count++;
    }

    return {
      r: Math.round(red / count),
      g: Math.round(green / count),
      b: Math.round(blue / count)
    };

  } catch (error) {

    console.warn("Background color detection failed:", error);

    return { r: 255, g: 255, b: 255 };
  }
}


/* =========================================
   APPLY MOBILE ABOUT COLOR
========================================= */

function updateMobileAboutColor() {

  if (!isMobile() || !aboutOpen) return;

  const image = currentImage();

  if (!imageReady(image)) return;

  const color = getRepresentativeColor(image);

  const background =
    `rgb(${color.r}, ${color.g}, ${color.b})`;

  const foreground =
    getBrightness(color) < brightnessThreshold
      ? "#fff"
      : "#111";

  document.body.style.setProperty(
    "--home-about-bg",
    background
  );

  document.body.style.setProperty(
    "--home-about-fg",
    foreground
  );

  aboutCopy?.classList.remove("is-light");
  aboutContact?.classList.remove("is-light");
}


/* =========================================
   MOBILE ABOUT HEIGHT
========================================= */

function updateMobileAboutHeight() {

  if (!aboutView || !isMobile()) return;

  const copy = aboutCopy;
  const contact = aboutContact;

  if (!copy || !contact) return;

  const copyHeight = copy.getBoundingClientRect().height;
  const contactHeight = contact.getBoundingClientRect().height;

  /* Header + bio + gap + contact + bottom space */

  const totalHeight =
    80 +
    copyHeight +
    24 +
    contactHeight +
    40;

  aboutView.style.setProperty(
    "--home-about-height",
    `${Math.ceil(totalHeight + 2)}px`
  );
}


/* =========================================
   SHOW IMAGE
========================================= */

function showImage(index) {

  if (!images.length) return;

  currentIndex = index;

  images.forEach((image, imageIndex) => {
    image.classList.toggle(
      "active",
      imageIndex === currentIndex
    );
  });

  updateInfo();

  const image = currentImage();

  if (imageReady(image)) {
    updateInterfaceColors(image);
    updateMobileAboutColor();
  }
}


/* =========================================
   NEXT IMAGE
========================================= */

function showNextImage() {

  if (images.length < 2) return;

  currentIndex =
    (currentIndex + 1) % images.length;

  showImage(currentIndex);
}


/* =========================================
   AUTOPLAY
========================================= */

function stopAutoplay() {
  clearInterval(interval);
  interval = null;
}

function startAutoplay() {

  stopAutoplay();

  if (images.length < 2) return;

  if (isMobile() && aboutOpen) return;

  interval = setInterval(() => {
    showNextImage();
  }, imageDuration);
}


/* =========================================
   ABOUT TOGGLE
========================================= */

function toggleAbout() {

  if (!aboutView) return;

  aboutOpen = !aboutOpen;

  if (aboutOpen && isMobile()) {

    /* Freeze the active image */

    stopAutoplay();

    /* Prepare color and height before opening */

    updateMobileAboutHeight();
    updateMobileAboutColor();
  }

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

  document.body.classList.toggle(
    "home-about-open",
    aboutOpen
  );

  if (!aboutOpen) {
    startAutoplay();
  }

  requestAnimationFrame(() => {

    const image = currentImage();

    if (imageReady(image)) {
      updateInterfaceColors(image);
    }
  });
}

if (aboutToggle && aboutView) {
  aboutToggle.addEventListener("click", toggleAbout);
}


/* =========================================
   CLICK TO ADVANCE
========================================= */

if (gallery && images.length > 1) {

  gallery.addEventListener("click", () => {

    if (isMobile() && aboutOpen) return;

    showNextImage();
    startAutoplay();
  });
}


/* =========================================
   IMAGE LOAD EVENTS
========================================= */

images.forEach((image) => {

  image.addEventListener("load", () => {

    if (image !== currentImage()) return;

    updateInterfaceColors(image);
    updateMobileAboutColor();
  });
});


/* =========================================
   RESIZE AND RESPONSIVE
========================================= */

function handleResize() {

  if (isMobile()) {
    updateMobileAboutHeight();
    updateMobileAboutColor();
  } else {
    document.body.style.removeProperty("--home-about-bg");
    document.body.style.removeProperty("--home-about-fg");
  }

  const image = currentImage();

  if (imageReady(image)) {
    updateInterfaceColors(image);
  }

  startAutoplay();
}

window.addEventListener("resize", handleResize);

if (document.fonts) {
  document.fonts.ready.then(() => {
    updateMobileAboutHeight();
    updateMobileAboutColor();
  });
}


/* =========================================
   INITIALIZE
========================================= */

if (images.length > 0) {
  showImage(0);
  startAutoplay();
}
