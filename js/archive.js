/* =========================================
   ABOUT TOGGLE
========================================= */

const aboutToggle =
  document.querySelector("#aboutToggle");

const aboutView =
  document.querySelector("#aboutView");

let aboutOpen = false;



/* =========================================
   ABOUT MOBILE HEIGHT
========================================= */

function updateAboutHeight() {

  if (!aboutView) return;

  const isMobile =
    window.matchMedia("(max-width: 900px)").matches;

  if (!isMobile) {
    aboutView.style.removeProperty("--archive-about-height");
    return;
  }

  const copy = aboutView.querySelector(".about-copy");
  const contact = aboutView.querySelector(".about-contact");

  if (!copy || !contact) return;

  const copyHeight = copy.getBoundingClientRect().height;
  const contactHeight = contact.getBoundingClientRect().height;

   const totalHeight =
     copyHeight +
     contactHeight +
     80 +
     24 +
     40;

  aboutView.style.setProperty(
    "--archive-about-height",
    `${Math.ceil(totalHeight)}px`
  );
}






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

       updateAboutHeight();

    }
  );
}


/* =========================================
   ARCHIVE PROJECT TOGGLE
========================================= */

const archiveProjects =
  document.querySelectorAll(
    ".archive-project"
  );

archiveProjects.forEach(
  (project) => {

    const button =
      project.querySelector(
        ".archive-project-header"
      );

    if (!button) {
      return;
    }

    button.addEventListener(
      "click",
      () => {

        const isOpen =
          project.classList.contains(
            "is-open"
          );

        project.classList.toggle(
          "is-open",
          !isOpen
        );

        button.setAttribute(
          "aria-expanded",
          String(!isOpen)
        );

      }
    );

  }
);




/* =========================================
   HORIZONTAL SCROLL — MAGIC MOUSE
   DESKTOP ONLY
========================================= */

const archiveGalleries = document.querySelectorAll(
  ".archive-gallery"
);

archiveGalleries.forEach((gallery) => {

  gallery.addEventListener("wheel", (event) => {

    // Solo desktop
    if (window.innerWidth <= 900) return;

    const maxScroll =
      gallery.scrollWidth - gallery.clientWidth;

    if (maxScroll <= 1) return;

    // Convertir diferentes unidades a píxeles
    const multiplier =
      event.deltaMode === 1 ? 16 :
      event.deltaMode === 2 ? gallery.clientHeight : 1;

    const deltaX = event.deltaX * multiplier;
    const deltaY = event.deltaY * multiplier;

    // Priorizar el gesto horizontal del Magic Mouse.
    // Si es principalmente vertical, convertirlo
    // en desplazamiento horizontal.
    const delta =
      Math.abs(deltaX) > Math.abs(deltaY)
        ? deltaX
        : deltaY;

    const current = gallery.scrollLeft;

    const next = Math.max(
      0,
      Math.min(maxScroll, current + delta)
    );

    // En los extremos, permitir el scroll
    // vertical normal de la página.
    if (Math.abs(next - current) < 0.5) {
      return;
    }

    event.preventDefault();

    gallery.scrollLeft = next;

  }, { passive: false });

});




window.addEventListener("resize", updateAboutHeight);

document.fonts.ready.then(updateAboutHeight);
