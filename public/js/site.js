const tourGrid =
  document.getElementById(
    'tourGrid'
  );


const langButton =
  document.getElementById(
    'langButton'
  );


const menuButton =
  document.getElementById(
    'menuButton'
  );


const mobileMenu =
  document.getElementById(
    'mobileMenu'
  );


const DESCRIPTION_PREVIEW_LIMIT =
  170;


let language =
  localStorage.getItem(
    'est-language'
  )
  ||
  'en';


let tours =
  [];


let openTourId =
  null;


/* =========================================================
   HELPERS
========================================================= */

function escapeHtml(
  value = ''
) {

  return String(value)
    .replace(
      /[&<>"']/g,
      (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[char]
    );
}


function t(
  key
) {

  return (
    window.EST_I18N?.[language]?.[key]
    ||
    window.EST_I18N?.en?.[key]
    ||
    key
  );
}


/* =========================================================
   LANGUAGE
========================================================= */

function applyStaticTranslations() {

  document.documentElement.lang =
    language;


  document
    .querySelectorAll(
      '[data-i18n]'
    )
    .forEach(
      (element) => {

        element.textContent =
          t(
            element.dataset.i18n
          );

      }
    );


  if (langButton) {

    langButton.textContent =
      language === 'en'
        ? 'ქართული'
        : 'EN';

  }


  localStorage.setItem(
    'est-language',
    language
  );
}


function tourField(
  tour,
  enKey,
  kaKey
) {

  if (
    language === 'ka'
  ) {

    return (
      tour[kaKey]
      ||
      tour[enKey]
      ||
      ''
    );

  }


  return (
    tour[enKey]
    ||
    tour[kaKey]
    ||
    ''
  );
}


/* =========================================================
   PRICE
========================================================= */

function formatPrice(
  rawPrice
) {

  const raw =
    String(
      rawPrice || ''
    ).trim();


  if (!raw) {

    return '';

  }


  if (
    language !== 'ka'
  ) {

    return raw;

  }


  let value =
    raw.replace(
      /\bGEL\b/gi,
      '₾'
    );


  const fromMatch =
    value.match(
      /^From\s+(.+)$/i
    );


  if (fromMatch) {

    return (
      `${fromMatch[1].trim()}-დან`
    );

  }


  const startingFromMatch =
    value.match(
      /^Starting\s+from\s+(.+)$/i
    );


  if (startingFromMatch) {

    return (
      `${startingFromMatch[1].trim()}-დან`
    );

  }


  return value;
}


/* =========================================================
   IMAGE URLS
========================================================= */

function versionedImageUrl(
  url,
  version
) {

  if (!url) {

    return '';

  }


  const separator =
    url.includes('?')
      ? '&'
      : '?';


  return (
    `${url}${separator}v=${encodeURIComponent(
      version || '1'
    )}`
  );
}


function mainImageUrl(
  tour
) {

  return versionedImageUrl(
    tour.image,
    tour.mainImageId
    ||
    tour.updatedAt
    ||
    tour.id
  );
}


function galleryImageUrl(
  image
) {

  return versionedImageUrl(
    image?.url,
    image?.id ||
    '1'
  );
}


/*
 * First image = main image.
 * Then all catalog images.
 */
function tourImages(
  tour
) {

  const images =
    [];


  if (tour.image) {

    images.push({

      id:
        `main-${tour.mainImageId || tour.id}`,

      url:
        mainImageUrl(
          tour
        ),

      type:
        'main'

    });

  }


  for (
    const image
    of (
      tour.galleryImages
      ||
      []
    )
  ) {

    if (!image?.url) {

      continue;

    }


    images.push({

      id:
        `gallery-${image.id}`,

      url:
        galleryImageUrl(
          image
        ),

      type:
        'gallery'

    });

  }


  return images;
}


/* =========================================================
   RENDER TOUR CARDS
========================================================= */

function renderTours() {

  if (
    !Array.isArray(tours)
    ||
    tours.length === 0
  ) {

    tourGrid.innerHTML =
      `
        <div class="empty-state">
          ${escapeHtml(
            t('noTours')
          )}
        </div>
      `;


    return;

  }


  const sorted =
    [...tours]
      .sort(
        (a, b) =>
          Number(
            a.sortOrder || 0
          )
          -
          Number(
            b.sortOrder || 0
          )
      );


  tourGrid.innerHTML =
    sorted
      .map(
        (tour) => {

          const title =
            tourField(
              tour,
              'titleEn',
              'titleKa'
            );


          const description =
            tourField(
              tour,
              'descriptionEn',
              'descriptionKa'
            );


          const duration =
            tourField(
              tour,
              'durationEn',
              'durationKa'
            );


          const price =
            formatPrice(
              tour.price
            );


          const hasLongDescription =
            description.length >
            DESCRIPTION_PREVIEW_LIMIT;


          return `
            <article
              class="tour-card"
              data-tour-id="${escapeHtml(tour.id)}"
            >

              <div class="tour-media">

                ${
                  tour.image

                    ? `
                      <img
                        src="${escapeHtml(
                          mainImageUrl(tour)
                        )}"
                        alt="${escapeHtml(title)}"
                        loading="lazy"
                      >
                    `

                    : `
                      <div class="photo-placeholder">

                        <span class="placeholder-icon">
                          ✈
                        </span>

                        <strong>
                          ${escapeHtml(
                            t('photoPlaceholder')
                          )}
                        </strong>

                      </div>
                    `
                }


                ${
                  price

                    ? `
                      <span class="price-badge">
                        ${escapeHtml(price)}
                      </span>
                    `

                    : ''
                }

              </div>


              <div class="tour-content">


                <div class="tour-title-row">

                  <h3>
                    ${escapeHtml(title)}
                  </h3>


                  ${
                    duration

                      ? `
                        <span class="duration">
                          ${escapeHtml(duration)}
                        </span>
                      `

                      : ''
                  }

                </div>


                <div class="tour-description-wrap">

                  <p
                    class="tour-description ${
                      hasLongDescription
                        ? 'is-clamped'
                        : ''
                    }"
                  >
                    ${escapeHtml(
                      description
                      ||
                      t('noDescription')
                    )}
                  </p>


                  ${
                    hasLongDescription

                      ? `
                        <button
                          class="description-toggle"
                          type="button"
                          data-action="toggle-description"
                        >
                          ${escapeHtml(
                            t('showMore')
                          )}
                        </button>
                      `

                      : ''
                  }

                </div>


                <button
                  class="button button-primary button-full about-tour-button"
                  type="button"
                  data-action="about-tour"
                >
                  ${escapeHtml(
                    t('aboutTour')
                  )}
                </button>

              </div>

            </article>
          `;

        }
      )
      .join('');


  bindTourCardActions();
}


/* =========================================================
   CARD ACTIONS
========================================================= */

function bindTourCardActions() {

  tourGrid
    .querySelectorAll(
      '.tour-card'
    )
    .forEach(
      (card) => {

        const tourId =
          card.dataset.tourId;


        const toggle =
          card.querySelector(
            '[data-action="toggle-description"]'
          );


        if (toggle) {

          toggle.addEventListener(
            'click',
            () => {

              const description =
                card.querySelector(
                  '.tour-description'
                );


              const expanded =
                description
                  .classList
                  .toggle(
                    'is-expanded'
                  );


              description
                .classList
                .toggle(
                  'is-clamped',
                  !expanded
                );


              toggle.textContent =
                expanded
                  ? t('showLess')
                  : t('showMore');

            }
          );

        }


        const aboutButton =
          card.querySelector(
            '[data-action="about-tour"]'
          );


        if (aboutButton) {

          aboutButton.addEventListener(
            'click',
            () => {

              openTourModal(
                tourId
              );

            }
          );

        }

      }
    );
}


/* =========================================================
   CREATE MODAL
========================================================= */

function ensureTourModal() {

  let modal =
    document.getElementById(
      'tourDetailModal'
    );


  if (modal) {

    return modal;

  }


  modal =
    document.createElement(
      'div'
    );


  modal.id =
    'tourDetailModal';


  modal.className =
    'tour-modal hidden';


  modal.setAttribute(
    'aria-hidden',
    'true'
  );


  modal.innerHTML =
    `
      <div
        class="tour-modal-backdrop"
        data-close-modal
      ></div>


      <section
        class="tour-modal-dialog"
        role="dialog"
        aria-modal="true"
      >

        <button
          class="tour-modal-close"
          type="button"
          data-close-modal
          aria-label="Close"
        >
          ×
        </button>


        <div
          id="tourModalContent"
        ></div>

      </section>
    `;


  document.body
    .appendChild(
      modal
    );


  modal
    .querySelectorAll(
      '[data-close-modal]'
    )
    .forEach(
      (element) => {

        element.addEventListener(
          'click',
          closeTourModal
        );

      }
    );


  return modal;
}


/* =========================================================
   OPEN TOUR MODAL
========================================================= */

function openTourModal(
  tourId
) {

  const tour =
    tours.find(
      (item) =>
        item.id === tourId
    );


  if (!tour) {

    return;

  }


  openTourId =
    tourId;


  const modal =
    ensureTourModal();


  const content =
    modal.querySelector(
      '#tourModalContent'
    );


  const title =
    tourField(
      tour,
      'titleEn',
      'titleKa'
    );


  const description =
    tourField(
      tour,
      'descriptionEn',
      'descriptionKa'
    )
    ||
    t('noDescription');


  const duration =
    tourField(
      tour,
      'durationEn',
      'durationKa'
    );


  const price =
    formatPrice(
      tour.price
    );


  const images =
    tourImages(
      tour
    );


  const initialImage =
    images[0]?.url
    ||
    '';


  const emailSubject =
    encodeURIComponent(
      `${
        language === 'ka'
          ? 'ტურის მოთხოვნა'
          : 'Tour inquiry'
      } — ${title}`
    );


  content.innerHTML =
    `
      <div class="tour-modal-layout">


        <!-- LEFT SIDE -->

        <div class="tour-modal-info">

          <p class="tour-modal-eyebrow">
            ${escapeHtml(
              t('tourDetails')
            )}
          </p>


          <h2>
            ${escapeHtml(title)}
          </h2>


          <div class="tour-modal-meta">

            ${
              price

                ? `
                  <span>
                    ${escapeHtml(price)}
                  </span>
                `

                : ''
            }


            ${
              duration

                ? `
                  <span>
                    ${escapeHtml(duration)}
                  </span>
                `

                : ''
            }

          </div>


          <div class="tour-modal-description">
            ${escapeHtml(description)}
          </div>


          <a
            class="button button-primary button-full"
            href="mailto:info.est.official@gmail.com?subject=${emailSubject}"
          >
            ${escapeHtml(
              t('askTour')
            )}
          </a>

        </div>



        <!-- RIGHT SIDE -->

        <div class="tour-modal-gallery">


          ${
            initialImage

              ? `
                <div
                  class="tour-modal-main-image-wrap"
                  id="tourModalMainImageWrap"
                >

                  <img
                    id="tourModalMainImage"
                    class="tour-modal-main-image"
                    src="${escapeHtml(initialImage)}"
                    alt="${escapeHtml(title)}"
                    draggable="false"
                  >

                </div>
              `

              : `
                <div class="tour-modal-main-image-wrap">

                  <div class="photo-placeholder">

                    <span class="placeholder-icon">
                      ✈
                    </span>

                    <strong>
                      ${escapeHtml(
                        t('photoPlaceholder')
                      )}
                    </strong>

                  </div>

                </div>
              `
          }


          ${
            images.length > 1

              ? `
                <div class="tour-modal-gallery-title">
                  ${escapeHtml(
                    t('catalog')
                  )}
                </div>


                <div class="catalog-carousel">


                  <button
                    class="catalog-arrow catalog-arrow-left"
                    id="catalogPrevious"
                    type="button"
                    aria-label="Previous catalog photos"
                    hidden
                  >
                    ‹
                  </button>


                  <div
                    class="tour-modal-thumb-viewport"
                    id="catalogViewport"
                  >

                    <div
                      class="tour-modal-thumbnails"
                      id="tourModalThumbnails"
                    >

                      ${
                        images
                          .map(
                            (
                              image,
                              index
                            ) => `
                              <button
                                class="tour-modal-thumb ${
                                  index === 0
                                    ? 'active'
                                    : ''
                                }"
                                type="button"
                                data-gallery-index="${index}"
                              >

                                <img
                                  src="${escapeHtml(image.url)}"
                                  alt="${escapeHtml(title)}"
                                  draggable="false"
                                >

                              </button>
                            `
                          )
                          .join('')
                      }

                    </div>

                  </div>


                  <button
                    class="catalog-arrow catalog-arrow-right"
                    id="catalogNext"
                    type="button"
                    aria-label="Next catalog photos"
                  >
                    ›
                  </button>


                </div>
              `

              : ''
          }

        </div>

      </div>
    `;


  /* =======================================================
     GALLERY LOGIC
  ======================================================= */

  if (
    images.length > 0
  ) {

    let currentImageIndex =
      0;


    const mainImage =
      content.querySelector(
        '#tourModalMainImage'
      );


    const mainImageWrap =
      content.querySelector(
        '#tourModalMainImageWrap'
      );


    const viewport =
      content.querySelector(
        '#catalogViewport'
      );


    const thumbnailStrip =
      content.querySelector(
        '#tourModalThumbnails'
      );


    const previousButton =
      content.querySelector(
        '#catalogPrevious'
      );


    const nextButton =
      content.querySelector(
        '#catalogNext'
      );


    const thumbnails =
      [
        ...content.querySelectorAll(
          '.tour-modal-thumb'
        )
      ];


    /* -------------------------------------------------------
       SELECT LARGE IMAGE
    ------------------------------------------------------- */

    function selectGalleryImage(
      index,
      keepThumbnailVisible = true
    ) {

      if (
        index < 0 ||
        index >= images.length
      ) {

        return;

      }


      currentImageIndex =
        index;


      if (mainImage) {

        mainImage.src =
          images[
            currentImageIndex
          ].url;

      }


      thumbnails.forEach(
        (
          thumbnail,
          thumbnailIndex
        ) => {

          thumbnail
            .classList
            .toggle(
              'active',
              thumbnailIndex ===
              currentImageIndex
            );

        }
      );


      /*
       * If mobile swipe changes the big image,
       * keep its thumbnail visible too.
       */
      if (
        keepThumbnailVisible &&
        thumbnails[
          currentImageIndex
        ]
      ) {

        thumbnails[
          currentImageIndex
        ].scrollIntoView({

          behavior:
            'smooth',

          block:
            'nearest',

          inline:
            'nearest'

        });

      }

    }


    /* -------------------------------------------------------
       UPDATE BOTTOM ARROWS
    ------------------------------------------------------- */

    function updateCatalogArrows() {

      if (
        !viewport ||
        !previousButton ||
        !nextButton
      ) {

        return;

      }


      const maxScroll =
        Math.max(
          0,
          viewport.scrollWidth
          -
          viewport.clientWidth
        );


      /*
       * No previous content.
       */
      previousButton.hidden =
        viewport.scrollLeft <= 3;


      /*
       * No next content.
       */
      nextButton.hidden =
        (
          maxScroll <= 3
          ||
          viewport.scrollLeft >=
          maxScroll - 3
        );

    }


    /* -------------------------------------------------------
       GET ONE THUMBNAIL STEP
    ------------------------------------------------------- */

    function catalogStepSize() {

      if (
        thumbnails.length === 0
      ) {

        return 0;

      }


      const firstThumbnail =
        thumbnails[0];


      const style =
        window.getComputedStyle(
          thumbnailStrip
        );


      const gap =
        parseFloat(
          style.columnGap
          ||
          style.gap
          ||
          0
        );


      return (
        firstThumbnail
          .getBoundingClientRect()
          .width
        +
        gap
      );
    }


    /* -------------------------------------------------------
       SCROLL CATALOG
    ------------------------------------------------------- */

    function scrollCatalog(
      direction
    ) {

      if (!viewport) {

        return;

      }


      const step =
        catalogStepSize();


      viewport.scrollBy({

        left:
          direction * step,

        behavior:
          'smooth'

      });

    }


    /* -------------------------------------------------------
       THUMBNAIL CLICK
    ------------------------------------------------------- */

    thumbnails.forEach(
      (
        thumbnail,
        index
      ) => {

        thumbnail.addEventListener(
          'click',
          () => {

            selectGalleryImage(
              index,
              false
            );

          }
        );

      }
    );


    /* -------------------------------------------------------
       LEFT CATALOG ARROW
    ------------------------------------------------------- */

    if (previousButton) {

      previousButton.addEventListener(
        'click',
        (event) => {

          event.preventDefault();

          event.stopPropagation();


          scrollCatalog(
            -1
          );

        }
      );

    }


    /* -------------------------------------------------------
       RIGHT CATALOG ARROW
    ------------------------------------------------------- */

    if (nextButton) {

      nextButton.addEventListener(
        'click',
        (event) => {

          event.preventDefault();

          event.stopPropagation();


          scrollCatalog(
            1
          );

        }
      );

    }


    /* -------------------------------------------------------
       UPDATE ARROWS WHILE CATALOG MOVES
    ------------------------------------------------------- */

    if (viewport) {

      viewport.addEventListener(
        'scroll',
        () => {

          updateCatalogArrows();

        },
        {
          passive: true
        }
      );

    }


    /* =====================================================
       MOBILE SWIPE ON LARGE IMAGE
    ===================================================== */

    if (mainImageWrap) {

      let touchStartX =
        0;


      let touchStartY =
        0;


      mainImageWrap.addEventListener(
        'touchstart',
        (event) => {

          const touch =
            event.touches[0];


          if (!touch) {

            return;

          }


          touchStartX =
            touch.clientX;


          touchStartY =
            touch.clientY;

        },
        {
          passive: true
        }
      );


      mainImageWrap.addEventListener(
        'touchend',
        (event) => {

          const touch =
            event.changedTouches[0];


          if (!touch) {

            return;

          }


          const differenceX =
            touch.clientX
            -
            touchStartX;


          const differenceY =
            touch.clientY
            -
            touchStartY;


          /*
           * Ignore very small movement.
           */
          if (
            Math.abs(
              differenceX
            ) < 45
          ) {

            return;

          }


          /*
           * Ignore vertical scrolling.
           */
          if (
            Math.abs(
              differenceY
            )
            >
            Math.abs(
              differenceX
            )
          ) {

            return;

          }


          /*
           * Swipe LEFT = next photo.
           */
          if (
            differenceX < 0
          ) {

            if (
              currentImageIndex <
              images.length - 1
            ) {

              selectGalleryImage(
                currentImageIndex + 1
              );

            }

          }


          /*
           * Swipe RIGHT = previous photo.
           */
          else {

            if (
              currentImageIndex > 0
            ) {

              selectGalleryImage(
                currentImageIndex - 1
              );

            }

          }

        },
        {
          passive: true
        }
      );

    }


    /*
     * Initial state.
     */
    selectGalleryImage(
      0,
      false
    );


    requestAnimationFrame(
      () => {

        updateCatalogArrows();

      }
    );


    /*
     * Recalculate if browser/window changes size.
     */
    setTimeout(
      updateCatalogArrows,
      100
    );

  }


  modal
    .classList
    .remove(
      'hidden'
    );


  modal.setAttribute(
    'aria-hidden',
    'false'
  );


  document.body
    .classList
    .add(
      'modal-open'
    );
}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeTourModal() {

  const modal =
    document.getElementById(
      'tourDetailModal'
    );


  if (!modal) {

    return;

  }


  modal
    .classList
    .add(
      'hidden'
    );


  modal.setAttribute(
    'aria-hidden',
    'true'
  );


  document.body
    .classList
    .remove(
      'modal-open'
    );


  openTourId =
    null;
}


/* =========================================================
   CHECK DATA CHANGES
========================================================= */

function toursChanged(
  newTours
) {

  try {

    return (
      JSON.stringify(
        newTours
      )
      !==
      JSON.stringify(
        tours
      )
    );

  }

  catch (_) {

    return true;

  }
}


/* =========================================================
   LOAD TOURS
========================================================= */

async function loadTours(
  silent = false
) {

  if (!silent) {

    tourGrid.innerHTML =
      `
        <div class="empty-state">
          ${escapeHtml(
            t('loadingTours')
          )}
        </div>
      `;

  }


  try {

    const response =
      await fetch(
        `/api/tours?refresh=${Date.now()}`,
        {

          method:
            'GET',

          cache:
            'no-store',

          headers: {

            'Cache-Control':
              'no-cache, no-store, must-revalidate',

            'Pragma':
              'no-cache'

          }

        }
      );


    if (!response.ok) {

      throw new Error(
        'Could not load tours.'
      );

    }


    const freshTours =
      await response.json();


    if (
      toursChanged(
        freshTours
      )
    ) {

      tours =
        freshTours;


      renderTours();


      if (openTourId) {

        const stillExists =
          tours.some(
            (tour) =>
              tour.id ===
              openTourId
          );


        if (!stillExists) {

          closeTourModal();

        }

      }

    }

  }

  catch (error) {

    console.error(
      'Tour refresh failed:',
      error
    );


    if (!silent) {

      tourGrid.innerHTML =
        `
          <div class="empty-state">
            ${escapeHtml(
              t('noTours')
            )}
          </div>
        `;

    }

  }
}


/* =========================================================
   LANGUAGE SWITCH
========================================================= */

if (langButton) {

  langButton.addEventListener(
    'click',
    () => {

      language =
        language === 'en'
          ? 'ka'
          : 'en';


      applyStaticTranslations();


      renderTours();


      if (openTourId) {

        openTourModal(
          openTourId
        );

      }

    }
  );

}


/* =========================================================
   MOBILE MENU
========================================================= */

if (
  menuButton &&
  mobileMenu
) {

  menuButton.addEventListener(
    'click',
    () => {

      const open =
        mobileMenu
          .classList
          .toggle(
            'open'
          );


      menuButton.setAttribute(
        'aria-expanded',
        String(open)
      );

    }
  );


  mobileMenu
    .querySelectorAll('a')
    .forEach(
      (link) => {

        link.addEventListener(
          'click',
          () => {

            mobileMenu
              .classList
              .remove(
                'open'
              );


            menuButton
              .setAttribute(
                'aria-expanded',
                'false'
              );

          }
        );

      }
    );

}


/* =========================================================
   ESC CLOSE
========================================================= */

document.addEventListener(
  'keydown',
  (event) => {

    if (
      event.key === 'Escape'
    ) {

      closeTourModal();

    }

  }
);


/* =========================================================
   LIVE UPDATE
========================================================= */

setInterval(
  () => {

    loadTours(
      true
    );

  },
  3000
);


window.addEventListener(
  'focus',
  () => {

    loadTours(
      true
    );

  }
);


window.addEventListener(
  'pageshow',
  () => {

    loadTours(
      true
    );

  }
);


document.addEventListener(
  'visibilitychange',
  () => {

    if (!document.hidden) {

      loadTours(
        true
      );

    }

  }
);


/* =========================================================
   START
========================================================= */

applyStaticTranslations();


loadTours(
  false
);
