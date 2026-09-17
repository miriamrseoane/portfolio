/* =========================================
   ARCHIVE PROJECT TOGGLE
========================================= */

const archiveProjects = document.querySelectorAll(
  ".archive-project"
);

archiveProjects.forEach((project) => {

  const button = project.querySelector(
    ".archive-project-header"
  );

  if (!button) {
    return;
  }

  button.addEventListener("click", () => {

    const isOpen =
      project.classList.contains("is-open");

    project.classList.toggle(
      "is-open",
      !isOpen
    );

    button.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );

  });

});


/* =========================================
   HORIZONTAL SCROLL WITH MOUSE WHEEL
========================================= */

const archiveGalleries = document.querySelectorAll(
  ".archive-gallery"
);

archiveGalleries.forEach((gallery) => {

  gallery.addEventListener(
    "wheel",
    (event) => {

      const canScrollHorizontally =
        gallery.scrollWidth >
        gallery.clientWidth;

      if (!canScrollHorizontally) {
        return;
      }


      /*
         Si el gesto ya es principalmente
         horizontal, dejamos que el navegador
         lo gestione de forma natural.
      */

      if (
        Math.abs(event.deltaX) >
        Math.abs(event.deltaY)
      ) {
        return;
      }


      event.preventDefault();

      gallery.scrollLeft +=
        event.deltaY;

    },
    {
      passive: false
    }
  );

});
