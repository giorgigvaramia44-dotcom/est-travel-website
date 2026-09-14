const tourGrid =
  document.getElementById('tourGrid');

const langButton =
  document.getElementById('langButton');

const menuButton =
  document.getElementById('menuButton');

const mobileMenu =
  document.getElementById('mobileMenu');


let language =
  localStorage.getItem('est-language') || 'en';

let tours = [];


/* =========================================================
   HELPERS
========================================================= */

function escapeHtml(value = '') {

  return String(value).replace(
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


function t(key) {

  return (
    window.EST_I18N?.[language]?.[key] ||
    window.EST_I18N?.en?.[key] ||
    key
  );

}


function applyStaticTranslations() {

  document.documentElement.lang =
    language;


  document
    .querySelectorAll('[data-i18n]')
    .forEach((element) => {

      element.textContent =
        t(element.dataset.i18n);

    });


  langButton.textContent =
    language === 'en'
      ? 'ქართული'
      : 'EN';


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

  if (language === 'ka') {

    return (
      tour[kaKey] ||
      tour[enKey] ||
      ''
    );

  }


  return (
    tour[enKey] ||
    tour[kaKey] ||
    ''
  );

}


/* =========================================================
   PRICE TRANSLATION
========================================================= */

function formatPrice(rawPrice) {

  const raw =
    String(rawPrice || '').trim();


  if (!raw) {

    return '';

  }


  /*
   * English:
   * From 999 GEL
   */
  if (language !== 'ka') {

    return raw;

  }


  /*
   * Georgian:
   * From 999 GEL
   *
   * becomes:
   *
   * 999 ₾-დან
   */
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

    return `${fromMatch[1].trim()}-დან`;

  }


  const startingFromMatch =
    value.match(
      /^Starting\s+from\s+(.+)$/i
    );


  if (startingFromMatch) {

    return `${startingFromMatch[1].trim()}-დან`;

  }


  return value;

}


/* =========================================================
   IMAGE URL
========================================================= */

function imageUrl(tour) {

  if (!tour.image) {

    return '';

  }


  /*
   * updatedAt changes when:
   * - text changes
   * - price changes
   * - image changes
   *
   * The query parameter forces the
   * browser to use the newest image.
   */
  const version =
    encodeURIComponent(
      tour.updatedAt ||
      Date.now()
    );


  return `${tour.image}?v=${version}`;

}


/* =========================================================
   RENDER TOURS
========================================================= */

function renderTours() {

  if (
    !Array.isArray(tours) ||
    tours.length === 0
  ) {

    tourGrid.innerHTML =
      `
        <div class="empty-state">
          ${escapeHtml(t('noTours'))}
        </div>
      `;

    return;

  }


  const sorted =
    [...tours].sort(
      (a, b) =>
        Number(a.sortOrder || 0) -
        Number(b.sortOrder || 0)
    );


  tourGrid.innerHTML =
    sorted
      .map((tour) => {

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


        const subject =
          encodeURIComponent(
            `${
              language === 'ka'
                ? 'ტურის მოთხოვნა'
                : 'Tour inquiry'
            } — ${title}`
          );


        return `
          <article class="tour-card">

            <div class="tour-media">

              ${
                tour.image

                  ? `
                    <img
                      src="${escapeHtml(imageUrl(tour))}"
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


              <p>
                ${escapeHtml(description)}
              </p>


              <a
                class="button button-primary button-full"
                href="mailto:info.est.official@gmail.com?subject=${subject}"
              >
                ${escapeHtml(t('askTour'))}
              </a>

            </div>

          </article>
        `;

      })
      .join('');

}


/* =========================================================
   CHECK WHETHER DATA CHANGED
========================================================= */

function toursChanged(newTours) {

  try {

    return (
      JSON.stringify(newTours) !==
      JSON.stringify(tours)
    );

  }

  catch (_) {

    return true;

  }

}


/* =========================================================
   LOAD TOURS FROM BACKEND
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

    /*
     * Timestamp prevents browser,
     * Railway or proxy caching.
     */
    const url =
      `/api/tours?refresh=${Date.now()}`;


    const response =
      await fetch(
        url,
        {
          method: 'GET',

          cache: 'no-store',

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


    /*
     * Only redraw the cards if
     * something actually changed.
     */
    if (
      toursChanged(freshTours)
    ) {

      tours =
        freshTours;


      renderTours();

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

langButton
  .addEventListener(
    'click',
    () => {

      language =
        language === 'en'
          ? 'ka'
          : 'en';


      applyStaticTranslations();


      /*
       * Tour data does not need
       * fetching again just because
       * language changed.
       */
      renderTours();

    }
  );


/* =========================================================
   MOBILE MENU
========================================================= */

menuButton
  .addEventListener(
    'click',
    () => {

      const open =
        mobileMenu
          .classList
          .toggle('open');


      menuButton
        .setAttribute(
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
            .remove('open');


          menuButton
            .setAttribute(
              'aria-expanded',
              'false'
            );

        }
      );

    }
  );


/* =========================================================
   LIVE UPDATE
========================================================= */

/*
 * Check backend every 3 seconds.
 *
 * The page itself does NOT reload.
 * Only tour cards update.
 */
setInterval(
  () => {

    loadTours(true);

  },

  3000
);


/*
 * Immediately check when visitor
 * returns to the browser tab.
 */
document
  .addEventListener(
    'visibilitychange',
    () => {

      if (!document.hidden) {

        loadTours(true);

      }

    }
  );


/*
 * Also check when browser window
 * receives focus.
 */
window
  .addEventListener(
    'focus',
    () => {

      loadTours(true);

    }
  );


/*
 * The browser back-forward cache
 * can restore an old page.
 *
 * Refresh tour data after restore.
 */
window
  .addEventListener(
    'pageshow',
    () => {

      loadTours(true);

    }
  );


/* =========================================================
   START
========================================================= */

applyStaticTranslations();


loadTours();
