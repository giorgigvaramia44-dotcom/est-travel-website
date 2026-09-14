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


let language =
  localStorage.getItem(
    'est-language'
  ) || 'en';


let tours =
  [];


const SAMPLE_TOURS = [

  {

    id:
      'sample-istanbul',

    titleEn:
      'Istanbul City Break',

    titleKa:
      'სტამბოლი — City Break',

    descriptionEn:
      'Flights, hotel and free time to explore the city.',

    descriptionKa:
      'ფრენა, სასტუმრო და თავისუფალი დრო ქალაქის დასათვალიერებლად.',

    price:
      'From 699 GEL',

    durationEn:
      '4 days',

    durationKa:
      '4 დღე',

    image:
      '',

    sortOrder:
      1

  },


  {

    id:
      'sample-dubai',

    titleEn:
      'Dubai Getaway',

    titleKa:
      'დუბაი',

    descriptionEn:
      'Sun, shopping and modern city experiences.',

    descriptionKa:
      'მზე, შოპინგი და თანამედროვე ქალაქის გამოცდილება.',

    price:
      'From 1199 GEL',

    durationEn:
      '5 days',

    durationKa:
      '5 დღე',

    image:
      '',

    sortOrder:
      2

  }

];



function escapeHtml(
  value = ''
) {

  return String(value)
    .replace(
      /[&<>"']/g,
      (char) => ({

        '&':
          '&amp;',

        '<':
          '&lt;',

        '>':
          '&gt;',

        '"':
          '&quot;',

        "'":
          '&#39;'

      })[char]
    );

}



function t(
  key
) {

  return (
    window
      .EST_I18N[
        language
      ]?.[key]

    ||

    window
      .EST_I18N
      .en[key]

    ||

    key
  );

}



function applyStaticTranslations() {

  document
    .documentElement
    .lang =
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



/*
 * PRICE TRANSLATION
 *
 * English:
 * From 999 GEL
 *
 * Georgian:
 * 999 ₾-დან
 */
function formatPrice(
  rawPrice
) {

  const raw =
    String(
      rawPrice || ''
    )
      .trim();


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


  if (
    fromMatch
  ) {

    return (
      `${fromMatch[1].trim()}-დან`
    );

  }


  value =
    value.replace(
      /^Starting\s+from\s+(.+)$/i,
      '$1-დან'
    );


  return value;

}



/*
 * IMAGE CACHE BUSTER
 *
 * updatedAt changes every time
 * owner changes photo.
 */
function imageUrl(
  tour
) {

  if (
    !tour.image
  ) {

    return '';

  }


  const version =
    encodeURIComponent(
      tour.updatedAt
      ||
      tour.id
      ||
      '1'
    );


  return (
    `${tour.image}?v=${version}`
  );

}



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
                        src="${escapeHtml(
                          imageUrl(
                            tour
                          )
                        )}"
                        alt="${escapeHtml(
                          title
                        )}"
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
                            t(
                              'photoPlaceholder'
                            )
                          )}
                        </strong>

                      </div>
                    `
                }


                ${
                  price

                    ? `
                      <span class="price-badge">
                        ${escapeHtml(
                          price
                        )}
                      </span>
                    `

                    : ''
                }

              </div>


              <div class="tour-content">

                <div class="tour-title-row">

                  <h3>
                    ${escapeHtml(
                      title
                    )}
                  </h3>


                  ${
                    duration

                      ? `
                        <span class="duration">
                          ${escapeHtml(
                            duration
                          )}
                        </span>
                      `

                      : ''
                  }

                </div>


                <p>
                  ${escapeHtml(
                    description
                  )}
                </p>


                <a
                  class="button button-primary button-full"
                  href="mailto:info.est.official@gmail.com?subject=${subject}"
                >
                  ${escapeHtml(
                    t('askTour')
                  )}
                </a>

              </div>

            </article>
          `;

        }
      )
      .join('');

}



async function loadTours(
  silent = false
) {

  if (!silent) {

    tourGrid.innerHTML =
      `
        <div class="empty-state">
          ${escapeHtml(
            t(
              'loadingTours'
            )
          )}
        </div>
      `;

  }


  try {

    const apiUrl =
      location.protocol ===
        'file:'

        ? '/api/tours'

        : `/api/tours?t=${Date.now()}`;


    const response =
      await fetch(
        apiUrl,
        {
          cache:
            'no-store'
        }
      );


    if (
      !response.ok
    ) {

      throw new Error(
        'Could not load tours.'
      );

    }


    tours =
      await response.json();


    renderTours();

  }

  catch (error) {

    console.error(
      error
    );


    if (
      location.protocol ===
      'file:'
    ) {

      tours =
        SAMPLE_TOURS;


      renderTours();


      return;

    }


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



langButton
  .addEventListener(
    'click',
    () => {

      language =
        language === 'en'
          ? 'ka'
          : 'en';


      applyStaticTranslations();


      renderTours();

    }
  );



menuButton
  .addEventListener(
    'click',
    () => {

      const open =
        mobileMenu
          .classList
          .toggle(
            'open'
          );


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

      link
        .addEventListener(
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



/*
 * IF ADMIN CHANGES PHOTO/PRICE:
 *
 * Public website reloads data
 * when visitor returns to tab.
 */
document
  .addEventListener(
    'visibilitychange',
    () => {

      if (
        !document.hidden
        &&
        location.protocol !==
          'file:'
      ) {

        loadTours(
          true
        );

      }

    }
  );



/*
 * Also refresh when window
 * receives focus.
 */
window
  .addEventListener(
    'focus',
    () => {

      if (
        location.protocol !==
        'file:'
      ) {

        loadTours(
          true
        );

      }

    }
  );



/*
 * Also refresh every
 * 15 seconds.
 */
if (
  location.protocol !==
  'file:'
) {

  setInterval(
    () =>
      loadTours(
        true
      ),

    15000
  );

}



applyStaticTranslations();


loadTours();
