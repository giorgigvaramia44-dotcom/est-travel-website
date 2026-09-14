const loginView =
  document.getElementById('loginView');

const dashboardView =
  document.getElementById('dashboardView');

const loginForm =
  document.getElementById('loginForm');

const adminTours =
  document.getElementById('adminTours');

const toast =
  document.getElementById('toast');

const loginError =
  document.getElementById('loginError');

const adminLangButton =
  document.getElementById('adminLangButton');

const dashboardLangButton =
  document.getElementById('dashboardLangButton');

const addTourButton =
  document.getElementById('addTourButton');


const I18N = {

  en: {

    ownerPortal:
      'OWNER PORTAL',

    loginHeroTitle:
      'Manage tours in one place.',

    loginHeroText:
      'Update prices, descriptions, visibility and tour photos. Changes appear on the public website.',

    feature1:
      'English & Georgian content',

    feature2:
      'Owner-only editing',

    feature3:
      'Photo upload & publishing controls',

    ownerDashboard:
      'Owner Dashboard',

    secureAccess:
      'SECURE ACCESS',

    ownerLogin:
      'Owner login',

    loginText:
      'Sign in to manage the content shown on the EST Travel website.',

    username:
      'Username',

    usernamePlaceholder:
      'Enter username',

    password:
      'Password',

    passwordPlaceholder:
      'Enter password',

    loginButton:
      'Log in',

    securityNote:
      '🔒 Only authorized EST Travel staff can access this dashboard.',

    publicWebsite:
      '↗ Public website',

    refresh:
      '↻ Refresh',

    logout:
      'Log out',

    contentManagement:
      'CONTENT MANAGEMENT',

    tourManagement:
      'Tour management',

    tourManagementText:
      'Manage public tour content from this private dashboard. Visitors cannot edit these fields.',

    ownerAccess:
      'Owner access',

    changesUpdate:
      'Changes update the public website',

    changesUpdateText:
      'Edit a tour and press Save changes. Photos and prices update on the public website.',

    newPackage:
      'NEW PACKAGE',

    addNewTour:
      'Add new tour',

    addNewTourText:
      'Enter the tour information and photo, then create the complete package in one step.',

    englishTitle:
      'English title *',

    georgianTitle:
      'Georgian title',

    price:
      'Price',

    durationEn:
      'Duration EN',

    durationKa:
      'Duration KA',

    tourPhoto:
      'Tour photo *',

    addTourButton:
      '+ Add tour',

    creatingTour:
      'Creating tour...',

    yourContent:
      'YOUR CONTENT',

    manageTours:
      'Manage tours',

    imageLimit:
      'Images: JPG / PNG / WEBP · Max 6 MB',

    noTours:
      'No tours yet. Add the first one above.',

    noPhoto:
      'No photo uploaded',

    noPhotoText:
      'The public website shows a placeholder until a photo is uploaded.',

    uploadReplace:
      'Upload / replace photo',

    removePhoto:
      'Remove photo',

    englishTitleLabel:
      'English title',

    georgianTitleLabel:
      'Georgian title',

    order:
      'Order',

    englishDescription:
      'English description',

    georgianDescription:
      'Georgian description',

    published:
      'Published on public website',

    saveChanges:
      'Save changes',

    saving:
      'Saving...',

    deleteTour:
      'Delete tour',

    invalidLogin:
      'Invalid username or password.',

    sessionExpired:
      'Your login session expired. Please log in again.',

    choosePhoto:
      'Please choose a tour photo.',

    invalidPhoto:
      'Photo must be JPG, PNG or WEBP.',

    photoTooLarge:
      'Photo must be 6 MB or smaller.',

    tourAdded:
      'Tour created successfully.',

    changesSaved:
      'Changes saved.',

    chooseImageFirst:
      'Choose an image first.',

    photoUploaded:
      'Photo updated. The public website will refresh automatically.',

    photoRemoved:
      'Photo removed.',

    tourDeleted:
      'Tour deleted.',

    confirmRemovePhoto:
      'Remove this tour photo?',

    confirmDelete:
      'Delete this tour permanently?',

    requestFailed:
      'Request failed.'

  },


  ka: {

    ownerPortal:
      'მფლობელის პორტალი',

    loginHeroTitle:
      'მართე ტურები ერთ სივრცეში.',

    loginHeroText:
      'შეცვალე ფასები, აღწერები, გამოქვეყნების სტატუსი და ტურის ფოტოები. ცვლილებები აისახება საჯარო ვებსაიტზე.',

    feature1:
      'ინგლისური და ქართული კონტენტი',

    feature2:
      'რედაქტირება მხოლოდ მფლობელისთვის',

    feature3:
      'ფოტოების ატვირთვა და გამოქვეყნების კონტროლი',

    ownerDashboard:
      'მფლობელის პანელი',

    secureAccess:
      'დაცული წვდომა',

    ownerLogin:
      'მფლობელის ავტორიზაცია',

    loginText:
      'შედი სისტემაში EST Travel-ის ვებსაიტის კონტენტის სამართავად.',

    username:
      'მომხმარებელი',

    usernamePlaceholder:
      'შეიყვანე მომხმარებელი',

    password:
      'პაროლი',

    passwordPlaceholder:
      'შეიყვანე პაროლი',

    loginButton:
      'შესვლა',

    securityNote:
      '🔒 ამ პანელზე წვდომა მხოლოდ ავტორიზებულ EST Travel-ის თანამშრომელს აქვს.',

    publicWebsite:
      '↗ საჯარო ვებსაიტი',

    refresh:
      '↻ განახლება',

    logout:
      'გასვლა',

    contentManagement:
      'კონტენტის მართვა',

    tourManagement:
      'ტურების მართვა',

    tourManagementText:
      'მართე საჯარო ტურების კონტენტი ამ დახურული პანელიდან. ვიზიტორებს რედაქტირება არ შეუძლიათ.',

    ownerAccess:
      'მფლობელის წვდომა',

    changesUpdate:
      'ცვლილებები საჯარო ვებსაიტზე აისახება',

    changesUpdateText:
      'შეცვალე ტური და დააჭირე „ცვლილებების შენახვას“. ფოტოები და ფასები საჯარო ვებსაიტზე განახლდება.',

    newPackage:
      'ახალი პაკეტი',

    addNewTour:
      'ახალი ტურის დამატება',

    addNewTourText:
      'შეავსე ტურის ინფორმაცია, აირჩიე ფოტო და შექმენი სრული პაკეტი ერთ ნაბიჯში.',

    englishTitle:
      'ინგლისური სათაური *',

    georgianTitle:
      'ქართული სათაური',

    price:
      'ფასი',

    durationEn:
      'ხანგრძლივობა EN',

    durationKa:
      'ხანგრძლივობა KA',

    tourPhoto:
      'ტურის ფოტო *',

    addTourButton:
      '+ ტურის დამატება',

    creatingTour:
      'ტური იქმნება...',

    yourContent:
      'შენი კონტენტი',

    manageTours:
      'ტურების მართვა',

    imageLimit:
      'ფოტოები: JPG / PNG / WEBP · მაქს. 6 MB',

    noTours:
      'ტურები ჯერ არ არის. დაამატე პირველი ტური ზემოთ.',

    noPhoto:
      'ფოტო არ არის ატვირთული',

    noPhotoText:
      'საჯარო ვებსაიტზე placeholder გამოჩნდება მანამ, სანამ ფოტო არ აიტვირთება.',

    uploadReplace:
      'ფოტოს ატვირთვა / შეცვლა',

    removePhoto:
      'ფოტოს წაშლა',

    englishTitleLabel:
      'ინგლისური სათაური',

    georgianTitleLabel:
      'ქართული სათაური',

    order:
      'რიგითობა',

    englishDescription:
      'ინგლისური აღწერა',

    georgianDescription:
      'ქართული აღწერა',

    published:
      'გამოქვეყნებულია საჯარო ვებსაიტზე',

    saveChanges:
      'ცვლილებების შენახვა',

    saving:
      'ინახება...',

    deleteTour:
      'ტურის წაშლა',

    invalidLogin:
      'მომხმარებელი ან პაროლი არასწორია.',

    sessionExpired:
      'ავტორიზაციის სესია დასრულდა. გთხოვ, თავიდან შეხვიდე.',

    choosePhoto:
      'გთხოვ, აირჩიე ტურის ფოტო.',

    invalidPhoto:
      'ფოტო უნდა იყოს JPG, PNG ან WEBP.',

    photoTooLarge:
      'ფოტო უნდა იყოს მაქსიმუმ 6 MB.',

    tourAdded:
      'ტური წარმატებით შეიქმნა.',

    changesSaved:
      'ცვლილებები შენახულია.',

    chooseImageFirst:
      'ჯერ აირჩიე ფოტო.',

    photoUploaded:
      'ფოტო განახლებულია. საჯარო ვებსაიტიც ავტომატურად განახლდება.',

    photoRemoved:
      'ფოტო წაშლილია.',

    tourDeleted:
      'ტური წაშლილია.',

    confirmRemovePhoto:
      'წავშალოთ ტურის ფოტო?',

    confirmDelete:
      'ნამდვილად წავშალოთ ეს ტური?',

    requestFailed:
      'მოთხოვნა ვერ შესრულდა.'

  }

};


let language =
  localStorage.getItem(
    'est-admin-language'
  ) || 'en';


function t(key) {

  return (
    I18N[language]?.[key] ||
    I18N.en[key] ||
    key
  );

}


function escapeHtml(value = '') {

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


function applyTranslations() {

  document.documentElement.lang =
    language;


  document
    .querySelectorAll('[data-i18n]')
    .forEach((element) => {

      element.textContent =
        t(element.dataset.i18n);

    });


  document
    .querySelectorAll(
      '[data-i18n-placeholder]'
    )
    .forEach((element) => {

      element.placeholder =
        t(
          element.dataset.i18nPlaceholder
        );

    });


  const switchText =
    language === 'en'
      ? 'ქართული'
      : 'EN';


  adminLangButton.textContent =
    switchText;


  dashboardLangButton.textContent =
    switchText;


  localStorage.setItem(
    'est-admin-language',
    language
  );

}


async function switchLanguage() {

  language =
    language === 'en'
      ? 'ka'
      : 'en';


  applyTranslations();


  if (
    !dashboardView
      .classList
      .contains('hidden')
  ) {

    await loadTours();

  }

}


adminLangButton
  .addEventListener(
    'click',
    switchLanguage
  );


dashboardLangButton
  .addEventListener(
    'click',
    switchLanguage
  );



function showToast(message) {

  toast.textContent =
    message;


  toast.classList.add(
    'show'
  );


  clearTimeout(
    window.__toastTimer
  );


  window.__toastTimer =
    setTimeout(
      () =>
        toast
          .classList
          .remove('show'),

      2300
    );

}


function showLoginForExpiredSession() {

  dashboardView
    .classList
    .add('hidden');


  loginView
    .classList
    .remove('hidden');


  loginError.textContent =
    t('sessionExpired');


  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

}



function validatePhoto(file) {

  if (!file) {

    return {
      valid: false,
      message: t('choosePhoto')
    };

  }


  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];


  if (
    !allowedTypes.includes(
      file.type
    )
  ) {

    return {
      valid: false,
      message: t('invalidPhoto')
    };

  }


  if (
    file.size >
    6 * 1024 * 1024
  ) {

    return {
      valid: false,
      message: t('photoTooLarge')
    };

  }


  return {
    valid: true
  };

}



async function api(
  url,
  options = {}
) {

  const response =
    await fetch(
      url,
      {
        credentials: 'include',
        cache: 'no-store',
        ...options
      }
    );


  let payload = {};


  try {

    payload =
      await response.json();

  }

  catch (_) {}


  if (
    response.status === 401
  ) {

    showLoginForExpiredSession();

    throw new Error(
      'Unauthorized'
    );

  }


  if (
    !response.ok
  ) {

    throw new Error(
      payload.error ||
      t('requestFailed')
    );

  }


  return payload;

}



async function refreshSession() {

  const response =
    await fetch(
      '/api/admin/status',
      {
        credentials: 'include',
        cache: 'no-store'
      }
    );


  const status =
    await response.json();


  const authenticated =
    status.authenticated === true;


  loginView
    .classList
    .toggle(
      'hidden',
      authenticated
    );


  dashboardView
    .classList
    .toggle(
      'hidden',
      !authenticated
    );


  if (authenticated) {

    loginError.textContent = '';

    await loadTours();

  }

}



loginForm
  .addEventListener(
    'submit',
    async (event) => {

      event.preventDefault();


      loginError.textContent =
        '';


      try {

        const response =
          await fetch(
            '/api/admin/login',
            {
              method: 'POST',

              credentials: 'include',

              cache: 'no-store',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body:
                JSON.stringify({

                  username:
                    document
                      .getElementById(
                        'username'
                      )
                      .value
                      .trim(),

                  password:
                    document
                      .getElementById(
                        'password'
                      )
                      .value

                })

            }
          );


        let payload = {};


        try {

          payload =
            await response.json();

        }

        catch (_) {}


        if (
          !response.ok
        ) {

          loginError.textContent =
            response.status === 401
              ? t('invalidLogin')
              : (
                  payload.error ||
                  t('requestFailed')
                );


          return;

        }


        document
          .getElementById(
            'password'
          )
          .value = '';


        await refreshSession();

      }

      catch (error) {

        loginError.textContent =
          error.message;

      }

    }
  );



document
  .getElementById(
    'logoutButton'
  )
  .addEventListener(
    'click',
    async () => {

      try {

        await fetch(
          '/api/admin/logout',
          {
            method: 'POST',
            credentials: 'include',
            cache: 'no-store'
          }
        );

      }

      finally {

        loginView
          .classList
          .remove('hidden');


        dashboardView
          .classList
          .add('hidden');

      }

    }
  );



document
  .getElementById(
    'refreshButton'
  )
  .addEventListener(
    'click',
    loadTours
  );



/*
 * CREATE TOUR + PHOTO
 * IN ONE REQUEST
 */
document
  .getElementById(
    'addTourForm'
  )
  .addEventListener(
    'submit',
    async (event) => {

      event.preventDefault();


      const form =
        event.currentTarget;


      const photo =
        document
          .getElementById(
            'newTourPhoto'
          )
          .files[0];


      const validation =
        validatePhoto(photo);


      if (
        !validation.valid
      ) {

        showToast(
          validation.message
        );

        return;

      }


      const formData =
        new FormData();


      formData.append(
        'titleEn',
        document
          .getElementById(
            'newTitleEn'
          )
          .value
          .trim()
      );


      formData.append(
        'titleKa',
        document
          .getElementById(
            'newTitleKa'
          )
          .value
          .trim()
      );


      formData.append(
        'price',
        document
          .getElementById(
            'newPrice'
          )
          .value
          .trim()
      );


      formData.append(
        'durationEn',
        document
          .getElementById(
            'newDurationEn'
          )
          .value
          .trim()
      );


      formData.append(
        'durationKa',
        document
          .getElementById(
            'newDurationKa'
          )
          .value
          .trim()
      );


      formData.append(
        'active',
        'true'
      );


      formData.append(
        'image',
        photo
      );


      try {

        addTourButton.disabled =
          true;


        addTourButton.textContent =
          t('creatingTour');


        await api(
          '/api/admin/tours',
          {
            method: 'POST',
            body: formData
          }
        );


        form.reset();


        showToast(
          t('tourAdded')
        );


        await loadTours();

      }

      catch (error) {

        if (
          error.message !==
          'Unauthorized'
        ) {

          showToast(
            error.message
          );

        }

      }

      finally {

        addTourButton.disabled =
          false;


        addTourButton.textContent =
          t('addTourButton');

      }

    }
  );



async function loadTours() {

  try {

    const tours =
      await api(
        '/api/admin/tours'
      );


    if (
      !Array.isArray(tours) ||
      tours.length === 0
    ) {

      adminTours.innerHTML =
        `
          <div class="notice">
            ${escapeHtml(
              t('noTours')
            )}
          </div>
        `;


      return;

    }


    tours.sort(
      (a, b) =>
        Number(
          a.sortOrder || 0
        ) -
        Number(
          b.sortOrder || 0
        )
    );


    adminTours.innerHTML =
      tours
        .map(
          (tour) => {

            const title =
              tour.titleEn ||
              tour.titleKa ||
              'Tour';


            const imageVersion =
              encodeURIComponent(
                tour.updatedAt ||
                tour.id ||
                '1'
              );


            return `
              <article
                class="tour-editor"
                data-id="${escapeHtml(tour.id)}"
              >

                <div class="editor-grid">

                  <div>

                    <div class="photo-box">

                      ${
                        tour.image

                          ? `
                            <img
                              src="${escapeHtml(tour.image)}?v=${imageVersion}"
                              alt="${escapeHtml(title)}"
                            >
                          `

                          : `
                            <div>

                              <div
                                style="font-size:36px"
                              >
                                📷
                              </div>

                              <strong>
                                ${escapeHtml(
                                  t('noPhoto')
                                )}
                              </strong>

                              <p>
                                ${escapeHtml(
                                  t('noPhotoText')
                                )}
                              </p>

                            </div>
                          `
                      }

                    </div>


                    <div class="photo-actions">

                      <input
                        class="image-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                      >


                      <button
                        class="admin-button secondary upload-button"
                        type="button"
                      >
                        ${escapeHtml(
                          t('uploadReplace')
                        )}
                      </button>


                      ${
                        tour.image

                          ? `
                            <button
                              class="admin-button secondary remove-photo-button"
                              type="button"
                            >
                              ${escapeHtml(
                                t('removePhoto')
                              )}
                            </button>
                          `

                          : ''
                      }

                    </div>

                  </div>


                  <div>

                    <div class="fields-grid">

                      <label>

                        <span>
                          ${escapeHtml(
                            t(
                              'englishTitleLabel'
                            )
                          )}
                        </span>

                        <input
                          class="title-en"
                          value="${escapeHtml(tour.titleEn)}"
                        >

                      </label>


                      <label>

                        <span>
                          ${escapeHtml(
                            t(
                              'georgianTitleLabel'
                            )
                          )}
                        </span>

                        <input
                          class="title-ka"
                          value="${escapeHtml(tour.titleKa)}"
                        >

                      </label>


                      <label>

                        <span>
                          ${escapeHtml(
                            t('price')
                          )}
                        </span>

                        <input
                          class="price"
                          value="${escapeHtml(tour.price)}"
                          placeholder="From 699 GEL"
                        >

                      </label>


                      <label>

                        <span>
                          ${escapeHtml(
                            t('order')
                          )}
                        </span>

                        <input
                          class="sort-order"
                          type="number"
                          value="${escapeHtml(tour.sortOrder)}"
                        >

                      </label>


                      <label>

                        <span>
                          ${escapeHtml(
                            t('durationEn')
                          )}
                        </span>

                        <input
                          class="duration-en"
                          value="${escapeHtml(tour.durationEn)}"
                        >

                      </label>


                      <label>

                        <span>
                          ${escapeHtml(
                            t('durationKa')
                          )}
                        </span>

                        <input
                          class="duration-ka"
                          value="${escapeHtml(tour.durationKa)}"
                        >

                      </label>


                      <label class="full">

                        <span>
                          ${escapeHtml(
                            t(
                              'englishDescription'
                            )
                          )}
                        </span>

                        <textarea
                          class="description-en"
                          rows="4"
                        >${escapeHtml(tour.descriptionEn)}</textarea>

                      </label>


                      <label class="full">

                        <span>
                          ${escapeHtml(
                            t(
                              'georgianDescription'
                            )
                          )}
                        </span>

                        <textarea
                          class="description-ka"
                          rows="4"
                        >${escapeHtml(tour.descriptionKa)}</textarea>

                      </label>

                    </div>


                    <label class="publish-row">

                      <input
                        class="active"
                        type="checkbox"
                        ${
                          tour.active !== false
                            ? 'checked'
                            : ''
                        }
                      >

                      ${escapeHtml(
                        t('published')
                      )}

                    </label>


                    <div class="editor-actions">

                      <button
                        class="admin-button primary save-button"
                        type="button"
                      >
                        ${escapeHtml(
                          t('saveChanges')
                        )}
                      </button>


                      <button
                        class="admin-button danger delete-button"
                        type="button"
                      >
                        ${escapeHtml(
                          t('deleteTour')
                        )}
                      </button>

                    </div>

                  </div>

                </div>

              </article>
            `;

          }
        )
        .join('');


    bindEditorActions();

  }

  catch (error) {

    if (
      error.message !==
      'Unauthorized'
    ) {

      showToast(
        error.message
      );

    }

  }

}



function bindEditorActions() {

  document
    .querySelectorAll(
      '.tour-editor'
    )
    .forEach(
      (card) => {

        const id =
          card.dataset.id;


        const saveButton =
          card.querySelector(
            '.save-button'
          );


        /*
         * SAVE TOUR TEXT / PRICE
         */
        saveButton
          .addEventListener(
            'click',
            async () => {

              const body = {

                titleEn:
                  card
                    .querySelector(
                      '.title-en'
                    )
                    .value
                    .trim(),

                titleKa:
                  card
                    .querySelector(
                      '.title-ka'
                    )
                    .value
                    .trim(),

                price:
                  card
                    .querySelector(
                      '.price'
                    )
                    .value
                    .trim(),

                durationEn:
                  card
                    .querySelector(
                      '.duration-en'
                    )
                    .value
                    .trim(),

                durationKa:
                  card
                    .querySelector(
                      '.duration-ka'
                    )
                    .value
                    .trim(),

                descriptionEn:
                  card
                    .querySelector(
                      '.description-en'
                    )
                    .value
                    .trim(),

                descriptionKa:
                  card
                    .querySelector(
                      '.description-ka'
                    )
                    .value
                    .trim(),

                sortOrder:
                  Number(
                    card
                      .querySelector(
                        '.sort-order'
                      )
                      .value || 0
                  ),

                active:
                  card
                    .querySelector(
                      '.active'
                    )
                    .checked

              };


              try {

                saveButton.disabled =
                  true;


                saveButton.textContent =
                  t('saving');


                await api(
                  `/api/admin/tours/${encodeURIComponent(id)}`,
                  {
                    method: 'PUT',

                    headers: {
                      'Content-Type':
                        'application/json'
                    },

                    body:
                      JSON.stringify(
                        body
                      )
                  }
                );


                showToast(
                  t('changesSaved')
                );


                await loadTours();

              }

              catch (error) {

                if (
                  error.message !==
                  'Unauthorized'
                ) {

                  showToast(
                    error.message
                  );

                }

              }

              finally {

                saveButton.disabled =
                  false;


                saveButton.textContent =
                  t('saveChanges');

              }

            }
          );



        /*
         * CHANGE PHOTO
         */
        card
          .querySelector(
            '.upload-button'
          )
          .addEventListener(
            'click',
            async () => {

              const file =
                card
                  .querySelector(
                    '.image-input'
                  )
                  .files[0];


              if (!file) {

                return showToast(
                  t(
                    'chooseImageFirst'
                  )
                );

              }


              const validation =
                validatePhoto(file);


              if (
                !validation.valid
              ) {

                return showToast(
                  validation.message
                );

              }


              const formData =
                new FormData();


              formData.append(
                'image',
                file
              );


              try {

                await api(
                  `/api/admin/tours/${encodeURIComponent(id)}/image`,
                  {
                    method: 'POST',
                    body: formData
                  }
                );


                showToast(
                  t('photoUploaded')
                );


                await loadTours();

              }

              catch (error) {

                if (
                  error.message !==
                  'Unauthorized'
                ) {

                  showToast(
                    error.message
                  );

                }

              }

            }
          );



        /*
         * REMOVE PHOTO
         */
        const removePhotoButton =
          card.querySelector(
            '.remove-photo-button'
          );


        if (
          removePhotoButton
        ) {

          removePhotoButton
            .addEventListener(
              'click',
              async () => {

                if (
                  !confirm(
                    t(
                      'confirmRemovePhoto'
                    )
                  )
                ) {

                  return;

                }


                try {

                  await api(
                    `/api/admin/tours/${encodeURIComponent(id)}/image`,
                    {
                      method: 'DELETE'
                    }
                  );


                  showToast(
                    t('photoRemoved')
                  );


                  await loadTours();

                }

                catch (error) {

                  if (
                    error.message !==
                    'Unauthorized'
                  ) {

                    showToast(
                      error.message
                    );

                  }

                }

              }
            );

        }



        /*
         * DELETE TOUR
         */
        card
          .querySelector(
            '.delete-button'
          )
          .addEventListener(
            'click',
            async () => {

              if (
                !confirm(
                  t('confirmDelete')
                )
              ) {

                return;

              }


              try {

                await api(
                  `/api/admin/tours/${encodeURIComponent(id)}`,
                  {
                    method: 'DELETE'
                  }
                );


                showToast(
                  t('tourDeleted')
                );


                await loadTours();

              }

              catch (error) {

                if (
                  error.message !==
                  'Unauthorized'
                ) {

                  showToast(
                    error.message
                  );

                }

              }

            }
          );

      }
    );

}



applyTranslations();


refreshSession()
  .catch(
    (error) => {

      loginError.textContent =
        error.message;

    }
  );
