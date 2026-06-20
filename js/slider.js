console.log("Slider JS cargado");

const slider = document.querySelector(".work-slider");
const track = document.querySelector(".slider-track");

if (slider && track) {
  let current = 0;
  let target = 0;

  const ease = 0.04;
  const autoplaySpeed = 1;

  let isDragging = false;
  let startX = 0;
  let startTarget = 0;

  const slides = Array.from(track.children);

  slides.forEach(slide => {
    const clone = slide.cloneNode(true);
    track.appendChild(clone);
  });

  function getTrackWidth() {
    return track.scrollWidth / 2;
  }

  function animate() {
    if (!isDragging) {
      target -= autoplaySpeed;
    }

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

  slider.addEventListener(
    "wheel",
    event => {
      event.preventDefault();
      target -= event.deltaY + event.deltaX;
    },
    { passive: false }
  );

  slider.addEventListener("pointerdown", event => {
    isDragging = true;
    startX = event.clientX;
    startTarget = target;
    slider.setPointerCapture(event.pointerId);
  });

  slider.addEventListener("pointermove", event => {
    if (!isDragging) return;

    const difference = event.clientX - startX;
    target = startTarget + difference;
  });

  slider.addEventListener("pointerup", event => {
    isDragging = false;
    slider.releasePointerCapture(event.pointerId);
  });

  slider.addEventListener("pointercancel", () => {
    isDragging = false;
  });

  slider.addEventListener("pointerleave", () => {
    isDragging = false;
  });

  animate();
}
