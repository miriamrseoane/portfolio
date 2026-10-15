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
   HORIZONTAL SCROLL WITH MOUSE WHEEL
   DESKTOP ONLY
========================================= */

const archiveGalleries = document.querySelectorAll(
  ".archive-gallery"
);

archiveGalleries.forEach((gallery) => {

  gallery.addEventListener(
    "wheel",
    (event) => {

      // Solo en desktop
      if (window.innerWidth <= 900) {
        return;
      }

      // Respetar el scroll horizontal del trackpad
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        return;
      }

      // Comprobar si existe desplazamiento horizontal
      const maxScroll =
        gallery.scrollWidth - gallery.clientWidth;

      if (maxScroll <= 0) {
        return;
      }

      // Normalizar la rueda (píxeles, líneas o páginas)
      const multiplier =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? gallery.clientHeight
            : 1;

      const delta = event.deltaY * multiplier;

      const atStart = gallery.scrollLeft <= 1;
      const atEnd = gallery.scrollLeft >= maxScroll - 1;

      // Permitir scroll vertical al llegar a los extremos
      if (
        (delta < 0 && atStart) ||
        (delta > 0 && atEnd)
      ) {
        return;
      }

      // Convertir scroll vertical en horizontal
      event.preventDefault();

      gallery.scrollLeft = Math.max(
        0,
        Math.min(
          maxScroll,
          gallery.scrollLeft + delta
        )
      );

    },
    {
      passive: false
    }
  );

});



window.addEventListener("resize", updateAboutHeight);

document.fonts.ready.then(updateAboutHeight);
