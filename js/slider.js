console.log("Slider JS cargado");

const slider = document.querySelector(".work-slider");
const track = document.querySelector(".slider-track");

console.log(slider, track);

const slider = document.querySelector(".work-slider");
const track = document.querySelector(".slider-track");

let current = 0;
let target = 0;
let ease = 0.075;

let isDragging = false;
let startX = 0;
let startTarget = 0;

const slides = [...track.children];

slides.forEach(slide => {
  const clone = slide.cloneNode(true);
  track.appendChild(clone);
});

function getTrackWidth() {
  return track.scrollWidth / 2;
}

function animate() {
  current += (target - current) * ease;

  const width = getTrackWidth();

  if (current <= -width) {
    current += width;
    target += width;
  }

  if (current > 0) {
    current -= width;
    target -= width;
  }

  track.style.transform = `translate3d(${current}px, 0, 0)`;

  requestAnimationFrame(animate);
}

slider.addEventListener("wheel", e => {
  e.preventDefault();
  target -= e.deltaY + e.deltaX;
}, { passive: false });

slider.addEventListener("pointerdown", e => {
  isDragging = true;
  startX = e.clientX;
  startTarget = target;
  slider.setPointerCapture(e.pointerId);
});

slider.addEventListener("pointermove", e => {
  if (!isDragging) return;
  const diff = e.clientX - startX;
  target = startTarget + diff;
});

slider.addEventListener("pointerup", () => {
  isDragging = false;
});

slider.addEventListener("pointerleave", () => {
  isDragging = false;
});

animate();
