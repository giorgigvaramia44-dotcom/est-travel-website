const loginView =
  document.getElementById(
    'loginView'
  );


const dashboardView =
  document.getElementById(
    'dashboardView'
  );


const loginForm =
  document.getElementById(
    'loginForm'
  );


const adminTours =
  document.getElementById(
    'adminTours'
  );


const toast =
  document.getElementById(
    'toast'
  );


const loginError =
  document.getElementById(
    'loginError'
  );


const adminLangButton =
  document.getElementById(
    'adminLangButton'
  );


const dashboardLangButton =
  document.getElementById(
    'dashboardLangButton'
  );


const addTourButton =
  document.getElementById(
    'addTourButton'
  );


const MAX_GALLERY_IMAGES =
  12;


const I18N = {

  en: {

    ownerPortal:
      'OWNER PORTAL',

    loginHeroTitle:
      'Manage tours in one place.',

    loginHeroText:
      'Update prices, descriptions, visibility, main photos and tour catalogs.',

    feature1:
      'English & Georgian content',

    feature2:
      'Owner-only editing',

    feature3:
      'Main image & photo catalog controls',

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
      'Manage public tour content, main images and separate photo catalogs.',

    newPackage:
      'NEW PACKAGE',

    addNewTour:
      'Add new tour',

    addNewTourText:
      'Create the tour with one main image and optional catalog images.',

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

    mainPhoto:
      'Main image *',

    catalogPhotos:
      'Catalog images',

    catalogHelp:
      'Optional · select up to 12 extra images',

    englishDescription:
      'English description',

    georgianDescription:
      'Georgian description',

    addTourButton:
      '+ Add tour',

    creatingTour:
      'Creating tour...',

    uploadingCatalog:
      'Uploading catalog...',

    savingExisting:
      'Saving previous changes...',

    yourContent:
      'YOUR CONTENT',

    manageTours:
      'Manage tours',

    imageLimit:
      'JPG / PNG / WEBP · Max 6 MB each · Max 12 catalog images',

    noTours:
      'No tours yet. Add the first one above.',

    noPhoto:
      'No main image uploaded',

    noPhotoText:
      'Upload a main image to show it on the public tour card.',

    mainImage:
      'MAIN IMAGE',

    uploadReplace:
      'Upload / replace main image',

    removePhoto:
      'Remove main image',

    photoCatalog:
      'PHOTO CATALOG',

    noCatalog:
      'No catalog images yet.',

    uploadCatalog:
      'Upload selected images',

    englishTitleLabel:
      'English title',

    georgianTitleLabel:
      'Georgian title',

    order:
      'Order',

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
      'Please choose a main image.',

    chooseCatalogFirst:
      'Choose one or more catalog images first.',

    invalidPhoto:
      'Photo must be JPG, PNG or WEBP.',

    photoTooLarge:
      'Each photo must be 6 MB or smaller.',

    tooManyCatalog:
      'A tour can have at most 12 catalog images.',

    tourAdded:
      'Tour created successfully.',

    tourAddedCatalogWarning:
      'Tour was created, but one or more catalog images could not be uploaded.',

    changesSaved:
      'Changes saved.',

    chooseImageFirst:
      'Choose an image first.',

    photoUploaded:
      'Main image updated.',

    photoRemoved:
      'Main image removed.',

    catalogUploaded:
      'Catalog images uploaded.',

    catalogRemoved:
      'Catalog image removed.',

    tourDeleted:
      'Tour deleted.',

    confirmRemovePhoto:
      'Remove this main image?',

    confirmRemoveCatalog:
      'Remove this catalog image?',

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
      'შეცვალე ფასები, აღწერები, მთავარი ფოტო და ფოტო კატალოგი.',

    feature1:
      'ინგლისური და ქართული კონტენტი',

    feature2:
      'რედაქტირება მხოლოდ მფლობელისთვის',

    feature3:
      'მთავარი ფოტო და ფოტო კატალოგის მართვა',

    ownerDashboard:
      'მფლობელის პანელი',

    secureAccess:
      'დაცული წვდომა',

    ownerLogin:
      'მფლობელის ავტორიზაცია',

    loginText:
      'შედი სისტემაში EST Travel-ის ვებსაიტის სამართავად.',

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
      'მართე ტურის ტექსტი, მთავარი ფოტო და ცალკე ფოტო კატალოგი.',

    newPackage:
      'ახალი პაკეტი',

    addNewTour:
      'ახალი ტურის დამატება',

    addNewTourText:
      'შექმენი ტური მთავარი ფოტოთი და სურვილის შემთხვევაში კატალოგის ფოტოებით.',

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

    mainPhoto:
      'მთავარი ფოტო *',

    catalogPhotos:
      'ფოტო კატალოგი',

    catalogHelp:
      'არასავალდებულო · მაქსიმუმ 12 დამატებითი ფოტო',

    englishDescription:
      'ინგლისური აღწერა',

    georgianDescription:
      'ქართული აღწერა',

    addTourButton:
      '+ ტურის დამატება',

    creatingTour:
      'ტური იქმნება...',

    uploadingCatalog:
      'კატალოგი იტვირთება...',

    savingExisting:
      'ცვლილებები ინახება...',

    yourContent:
      'შენი კონტენტი',

    manageTours:
      'ტურების მართვა',

    imageLimit:
      'JPG / PNG / WEBP · მაქს. 6 MB თითოეული · მაქს. 12 კატალოგის ფოტო',

    noTours:
      'ტურები ჯერ არ არის.',

    noPhoto:
      'მთავარი ფოტო არ არის',

    noPhotoText:
      'ატვირთე მთავარი ფოტო.',

    mainImage:
      'მთავარი ფოტო',

    uploadReplace:
      'მთავარი ფოტოს შეცვლა',

    removePhoto:
      'მთავარი ფოტოს წაშლა',

    photoCatalog:
      'ფოტო კატალოგი',

    noCatalog:
      'კატალოგის ფოტოები ჯერ არ არის.',

    uploadCatalog:
      'არჩეული ფოტოების ატვირთვა',

    englishTitleLabel:
      'ინგლისური სათაური',

    georgianTitleLabel:
      'ქართული სათაური',

    order:
      'რიგითობა',

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
      'სესია დასრულდა. თავიდან შედი.',

    choosePhoto:
      'აირჩიე მთავარი ფოტო.',

    chooseCatalogFirst:
      'ჯერ აირჩიე კატალოგის ფოტოები.',

    invalidPhoto:
      'ფოტო უნდა იყოს JPG, PNG ან WEBP.',

    photoTooLarge:
      'თითოეული ფოტო უნდა იყოს მაქსიმუმ 6 MB.',

    tooManyCatalog:
      'ერთ ტურს მაქსიმუმ 12 კატალოგის ფოტო შეიძლება ჰქონდეს.',

    tourAdded:
      'ტური წარმატებით შეიქმნა.',

    tourAddedCatalogWarning:
      'ტური შეიქმნა, მაგრამ ზოგი ფოტო ვერ აიტვირთა.',

    changesSaved:
      'ცვლილებები შენახულია.',

    chooseImageFirst:
      'ჯერ აირჩიე ფოტო.',

    photoUploaded:
      'მთავარი ფოტო განახლებულია.',

    photoRemoved:
      'მთავარი ფოტო წაშლილია.',

    catalogUploaded:
      'კატალოგის ფოტოები აიტვირთა.',

    catalogRemoved:
      'კატალოგის ფოტო წაშლილია.',

    tourDeleted:
      'ტური წაშლილია.',

    confirmRemovePhoto:
      'წავშალოთ მთავარი ფოტო?',

    confirmRemoveCatalog:
      'წავშალოთ ეს კატალოგის ფოტო?',

    confirmDelete:
      'ნამდვილად წავშალოთ ეს ტური?',

    requestFailed:
      'მოთხოვნა ვერ შესრულდა.'

  }

};


let language =
  localStorage.getItem(
    'est-admin-language'
  )
  ||
  'en';


function t(
  key
) {

  return (
    I18N[language]?.[key]
    ||
    I18N.en[key]
    ||
    key
  );
}


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


function applyTranslations() {

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


  document
    .querySelectorAll(
      '[data-i18n-placeholder]'
    )
    .forEach(
      (element) => {

        element.placeholder =
          t(
            element.dataset.i18nPlaceholder
          );

      }
    );


  const switchText =
    language === 'en'
      ? 'ქართული'
      : 'EN';


  if (adminLangButton) {

    adminLangButton.textContent =
      switchText;

  }


  if (dashboardLangButton) {

    dashboardLangButton.textContent =
      switchText;

  }


  localStorage.setItem(
    'est-admin-language',
    language
  );
}


function showToast(
  message
) {

  toast.textContent =
    message;


  toast
    .classList
    .add(
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
          .remove(
            'show'
          ),
      2600
    );
}


function showLoginForExpiredSession() {

  dashboardView
    .classList
    .add(
      'hidden'
    );


  loginView
    .classList
    .remove(
      'hidden'
    );


  loginError.textContent =
    t(
      'sessionExpired'
    );
}


function validatePhoto(
  file
) {

  if (!file) {

    return {
      valid:
        false,

      message:
        t('choosePhoto')
    };

  }


  const allowedTypes =
    [
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
      valid:
        false,

      message:
        t('invalidPhoto')
    };

  }


  if (
    file.size >
    6 * 1024 * 1024
  ) {

    return {
      valid:
        false,

      message:
        t('photoTooLarge')
    };

  }


  return {
    valid:
      true
  };
}


function validateCatalogFiles(
  files,
  existingCount = 0
) {

  const list =
    [...files];


  if (
    existingCount +
    list.length >
    MAX_GALLERY_IMAGES
  ) {

    return {
      valid:
        false,

      message:
        t('tooManyCatalog')
    };

  }


  for (
    const file
    of list
  ) {

    const result =
      validatePhoto(file);


    if (!result.valid) {

      return result;

    }

  }


  return {
    valid:
      true
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

        credentials:
          'include',

        cache:
          'no-store',

        ...options

      }
    );


  let payload =
    {};


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


  if (!response.ok) {

    throw new Error(
      payload.error
      ||
      t('requestFailed')
    );

  }


  return payload;
}


async function uploadCatalogFile(
  tourId,
  file
) {

  const formData =
    new FormData();


  formData.append(
    'image',
    file
  );


  return api(
    `/api/admin/tours/${encodeURIComponent(tourId)}/gallery`,
    {

      method:
        'POST',

      body:
        formData

    }
  );
}


async function refreshSession() {

  const response =
    await fetch(
      '/api/admin/status',
      {

        credentials:
          'include',

        cache:
          'no-store'

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

    loginError.textContent =
      '';


    await loadTours();

  }
}


async function switchLanguage() {

  try {

    if (
      !dashboardView
        .classList
        .contains(
          'hidden'
        )
    ) {

      await saveAllDirtyTours();

    }


    language =
      language === 'en'
        ? 'ka'
        : 'en';


    applyTranslations();


    if (
      !dashboardView
        .classList
        .contains(
          'hidden'
        )
    ) {

      await loadTours();

    }

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


adminLangButton
  ?.addEventListener(
    'click',
    switchLanguage
  );


dashboardLangButton
  ?.addEventListener(
    'click',
    switchLanguage
  );


loginForm
  ?.addEventListener(
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

              method:
                'POST',

              credentials:
                'include',

              cache:
                'no-store',

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


        const payload =
          await response.json();


        if (!response.ok) {

          loginError.textContent =
            payload.error
            ||
            t('invalidLogin');


          return;

        }


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
  ?.addEventListener(
    'click',
    async () => {

      await fetch(
        '/api/admin/logout',
        {
          method:
            'POST',

          credentials:
            'include'
        }
      );


      await refreshSession();

    }
  );


document
  .getElementById(
    'refreshButton'
  )
  ?.addEventListener(
    'click',
    async () => {

      try {

        await saveAllDirtyTours();

        await loadTours();

      }

      catch (error) {

        showToast(
          error.message
        );

      }

    }
  );


document
  .getElementById(
    'addTourForm'
  )
  ?.addEventListener(
    'submit',
    async (event) => {

      event.preventDefault();


      const form =
        event.currentTarget;


      const mainPhoto =
        document
          .getElementById(
            'newTourPhoto'
          )
          .files[0];


      const catalogFiles =
        [
          ...document
            .getElementById(
              'newGalleryPhotos'
            )
            .files
        ];


      const mainValidation =
        validatePhoto(
          mainPhoto
        );


      if (
        !mainValidation.valid
      ) {

        showToast(
          mainValidation.message
        );

        return;

      }


      const catalogValidation =
        validateCatalogFiles(
          catalogFiles,
          0
        );


      if (
        !catalogValidation.valid
      ) {

        showToast(
          catalogValidation.message
        );

        return;

      }


      try {

        addTourButton.disabled =
          true;


        await saveAllDirtyTours();


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
          'descriptionEn',
          document
            .getElementById(
              'newDescriptionEn'
            )
            .value
            .trim()
        );


        formData.append(
          'descriptionKa',
          document
            .getElementById(
              'newDescriptionKa'
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
          mainPhoto
        );


        addTourButton.textContent =
          t('creatingTour');


        const created =
          await api(
            '/api/admin/tours',
            {

              method:
                'POST',

              body:
                formData

            }
          );


        let catalogFailed =
          false;


        if (
          catalogFiles.length > 0
        ) {

          addTourButton.textContent =
            t('uploadingCatalog');


          for (
            const file
            of catalogFiles
          ) {

            try {

              await uploadCatalogFile(
                created.id,
                file
              );

            }

            catch (error) {

              catalogFailed =
                true;


              console.error(
                error
              );

            }

          }

        }


        form.reset();


        showToast(
          catalogFailed
            ? t(
                'tourAddedCatalogWarning'
              )
            : t(
                'tourAdded'
              )
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


function renderCatalogHtml(
  tour
) {

  const catalog =
    Array.isArray(
      tour.galleryImages
    )
      ? tour.galleryImages
      : [];


  if (
    catalog.length === 0
  ) {

    return `
      <p class="catalog-empty">
        ${escapeHtml(
          t('noCatalog')
        )}
      </p>
    `;

  }


  return `
    <div class="catalog-grid">

      ${
        catalog
          .map(
            (image) => `
              <div class="catalog-item">

                <img
                  src="${escapeHtml(image.url)}?v=${encodeURIComponent(image.id)}"
                  alt="Catalog image"
                >

                <button
                  class="catalog-delete"
                  type="button"
                  data-catalog-id="${escapeHtml(image.id)}"
                >
                  ×
                </button>

              </div>
            `
          )
          .join('')
      }

    </div>
  `;
}


async function loadTours() {

  try {

    const tours =
      await api(
        '/api/admin/tours'
      );


    if (
      !Array.isArray(tours)
      ||
      tours.length === 0
    ) {

      adminTours.innerHTML =
        `
          <div class="tour-editor">
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
        )
        -
        Number(
          b.sortOrder || 0
        )
    );


    adminTours.innerHTML =
      tours
        .map(
          (tour) => {

            const title =
              tour.titleEn
              ||
              tour.titleKa
              ||
              'Tour';


            const imageVersion =
              encodeURIComponent(
                tour.mainImageId
                ||
                tour.updatedAt
                ||
                tour.id
                ||
                '1'
              );


            const catalog =
              Array.isArray(
                tour.galleryImages
              )
                ? tour.galleryImages
                : [];


            return `
              <article
                class="tour-editor"
                data-id="${escapeHtml(tour.id)}"
              >

                <div class="editor-grid">


                  <div>

                    <p class="image-section-title">
                      ${escapeHtml(
                        t('mainImage')
                      )}
                    </p>


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

                              <div style="font-size:36px">
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
                            t('englishTitleLabel')
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
                            t('georgianTitleLabel')
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
                            t('englishDescription')
                          )}
                        </span>

                        <textarea
                          class="description-en"
                          rows="5"
                        >${escapeHtml(tour.descriptionEn)}</textarea>

                      </label>


                      <label class="full">

                        <span>
                          ${escapeHtml(
                            t('georgianDescription')
                          )}
                        </span>

                        <textarea
                          class="description-ka"
                          rows="5"
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



                    <!-- PHOTO CATALOG -->

                    <section class="catalog-panel">

                      <div class="catalog-heading">

                        <strong>
                          ${escapeHtml(
                            t('photoCatalog')
                          )}
                        </strong>

                        <span class="catalog-count">
                          ${catalog.length}/${MAX_GALLERY_IMAGES}
                        </span>

                      </div>


                      ${renderCatalogHtml(tour)}


                      <div class="catalog-tools">

                        <input
                          class="catalog-input"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                        >


                        <button
                          class="admin-button secondary catalog-upload-button"
                          type="button"
                        >
                          ${escapeHtml(
                            t('uploadCatalog')
                          )}
                        </button>

                      </div>

                    </section>



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


function collectCardBody(
  card
) {

  return {

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
          .value
        ||
        0
      ),

    active:
      card
        .querySelector(
          '.active'
        )
        .checked

  };
}


async function saveTextFields(
  card
) {

  const id =
    card.dataset.id;


  await api(
    `/api/admin/tours/${encodeURIComponent(id)}`,
    {

      method:
        'PUT',

      headers: {
        'Content-Type':
          'application/json'
      },

      body:
        JSON.stringify(
          collectCardBody(
            card
          )
        )

    }
  );


  card.dataset.dirty =
    '0';
}


async function saveAllDirtyTours() {

  const dirtyCards =
    [
      ...document
        .querySelectorAll(
          '.tour-editor[data-id]'
        )
    ]
      .filter(
        (card) =>
          card.dataset.dirty ===
          '1'
      );


  for (
    const card
    of dirtyCards
  ) {

    await saveTextFields(
      card
    );

  }
}


function bindEditorActions() {

  document
    .querySelectorAll(
      '.tour-editor[data-id]'
    )
    .forEach(
      (card) => {

        const id =
          card.dataset.id;


        card.dataset.dirty =
          '0';


        card
          .querySelectorAll(
            'input:not(.image-input):not(.catalog-input), textarea'
          )
          .forEach(
            (field) => {

              field.addEventListener(
                'input',
                () => {

                  card.dataset.dirty =
                    '1';

                }
              );

              field.addEventListener(
                'change',
                () => {

                  card.dataset.dirty =
                    '1';

                }
              );

            }
          );


        /*
         * SAVE
         */
        card
          .querySelector(
            '.save-button'
          )
          .addEventListener(
            'click',
            async () => {

              try {

                await saveTextFields(
                  card
                );


                showToast(
                  t('changesSaved')
                );


                await loadTours();

              }

              catch (error) {

                showToast(
                  error.message
                );

              }

            }
          );


        /*
         * MAIN IMAGE
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

                showToast(
                  t('chooseImageFirst')
                );

                return;

              }


              const validation =
                validatePhoto(
                  file
                );


              if (
                !validation.valid
              ) {

                showToast(
                  validation.message
                );

                return;

              }


              try {

                if (
                  card.dataset.dirty ===
                  '1'
                ) {

                  await saveTextFields(
                    card
                  );

                }


                const formData =
                  new FormData();


                formData.append(
                  'image',
                  file
                );


                await api(
                  `/api/admin/tours/${encodeURIComponent(id)}/image`,
                  {

                    method:
                      'POST',

                    body:
                      formData

                  }
                );


                showToast(
                  t('photoUploaded')
                );


                await loadTours();

              }

              catch (error) {

                showToast(
                  error.message
                );

              }

            }
          );


        const removePhotoButton =
          card.querySelector(
            '.remove-photo-button'
          );


        if (removePhotoButton) {

          removePhotoButton.addEventListener(
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
                    method:
                      'DELETE'
                  }
                );


                showToast(
                  t('photoRemoved')
                );


                await loadTours();

              }

              catch (error) {

                showToast(
                  error.message
                );

              }

            }
          );

        }


        /*
         * CATALOG UPLOAD
         */
        const catalogUploadButton =
          card.querySelector(
            '.catalog-upload-button'
          );


        catalogUploadButton
          .addEventListener(
            'click',
            async () => {

              const catalogInput =
                card.querySelector(
                  '.catalog-input'
                );


              const files =
                [
                  ...catalogInput.files
                ];


              const existingCount =
                card
                  .querySelectorAll(
                    '.catalog-item'
                  )
                  .length;


              if (
                files.length === 0
              ) {

                showToast(
                  t(
                    'chooseCatalogFirst'
                  )
                );

                return;

              }


              const validation =
                validateCatalogFiles(
                  files,
                  existingCount
                );


              if (
                !validation.valid
              ) {

                showToast(
                  validation.message
                );

                return;

              }


              try {

                catalogUploadButton.disabled =
                  true;


                catalogUploadButton.textContent =
                  t(
                    'uploadingCatalog'
                  );


                if (
                  card.dataset.dirty ===
                  '1'
                ) {

                  await saveTextFields(
                    card
                  );

                }


                for (
                  const file
                  of files
                ) {

                  await uploadCatalogFile(
                    id,
                    file
                  );

                }


                showToast(
                  t('catalogUploaded')
                );


                await loadTours();

              }

              catch (error) {

                showToast(
                  error.message
                );

              }

            }
          );


        /*
         * DELETE CATALOG IMAGE
         */
        card
          .querySelectorAll(
            '.catalog-delete'
          )
          .forEach(
            (button) => {

              button.addEventListener(
                'click',
                async () => {

                  if (
                    !confirm(
                      t(
                        'confirmRemoveCatalog'
                      )
                    )
                  ) {

                    return;

                  }


                  const imageId =
                    button.dataset.catalogId;


                  try {

                    await api(
                      `/api/admin/tours/${encodeURIComponent(id)}/gallery/${encodeURIComponent(imageId)}`,
                      {
                        method:
                          'DELETE'
                      }
                    );


                    showToast(
                      t('catalogRemoved')
                    );


                    await loadTours();

                  }

                  catch (error) {

                    showToast(
                      error.message
                    );

                  }

                }
              );

            }
          );


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
                  t(
                    'confirmDelete'
                  )
                )
              ) {

                return;

              }


              try {

                await api(
                  `/api/admin/tours/${encodeURIComponent(id)}`,
                  {
                    method:
                      'DELETE'
                  }
                );


                showToast(
                  t('tourDeleted')
                );


                await loadTours();

              }

              catch (error) {

                showToast(
                  error.message
                );

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
