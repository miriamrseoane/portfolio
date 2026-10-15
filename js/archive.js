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
========================================= */

const archiveGalleries =
  document.querySelectorAll(
    ".archive-gallery"
  );

archiveGalleries.forEach(
  (gallery) => {

    gallery.addEventListener(
      "wheel",
      (event) => {

        const canScrollHorizontally =
          gallery.scrollWidth >
          gallery.clientWidth;

        if (!canScrollHorizontally) {
          return;
        }

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

  }
);


window.addEventListener("resize", updateAboutHeight);

document.fonts.ready.then(updateAboutHeight);
