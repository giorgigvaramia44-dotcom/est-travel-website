const tourGrid = document.getElementById('tourGrid');
const langButton = document.getElementById('langButton');
const menuButton = document.getElementById('menuButton');
const mobileMenu = document.getElementById('mobileMenu');

let language = localStorage.getItem('est-language') || 'en';
let tours = [];
const SAMPLE_TOURS = [
  { id:'sample-istanbul', titleEn:'Istanbul City Break', titleKa:'სტამბოლი — City Break', descriptionEn:'Flights, hotel and free time to explore the city.', descriptionKa:'ფრენა, სასტუმრო და თავისუფალი დრო ქალაქის დასათვალიერებლად.', price:'From 699 GEL', durationEn:'4 days', durationKa:'4 დღე', image:'' , sortOrder:1},
  { id:'sample-dubai', titleEn:'Dubai Getaway', titleKa:'დუბაი', descriptionEn:'Sun, shopping and modern city experiences.', descriptionKa:'მზე, შოპინგი და თანამედროვე ქალაქის გამოცდილება.', price:'From 1199 GEL', durationEn:'5 days', durationKa:'5 დღე', image:'', sortOrder:2},
  { id:'sample-egypt', titleEn:'Egypt Holiday', titleKa:'ეგვიპტე', descriptionEn:'Sea-side relaxation and resort atmosphere.', descriptionKa:'ზღვისპირა დასვენება და resort ატმოსფერო.', price:'From 899 GEL', durationEn:'6 days', durationKa:'6 დღე', image:'', sortOrder:3}
];

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function t(key) {
  return window.EST_I18N[language]?.[key] || window.EST_I18N.en[key] || key;
}

function applyStaticTranslations() {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  langButton.textContent = language === 'en' ? 'ქართული' : 'EN';
  localStorage.setItem('est-language', language);
}

function tourField(tour, enKey, kaKey) {
  if (language === 'ka') return tour[kaKey] || tour[enKey] || '';
  return tour[enKey] || tour[kaKey] || '';
}

function renderTours() {
  if (!Array.isArray(tours) || tours.length === 0) {
    tourGrid.innerHTML = `<div class="empty-state">${escapeHtml(t('noTours'))}</div>`;
    return;
  }

  const sorted = [...tours].sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
  tourGrid.innerHTML = sorted.map((tour) => {
    const title = tourField(tour, 'titleEn', 'titleKa');
    const description = tourField(tour, 'descriptionEn', 'descriptionKa');
    const duration = tourField(tour, 'durationEn', 'durationKa');
    const subject = encodeURIComponent(`${language === 'ka' ? 'ტურის მოთხოვნა' : 'Tour inquiry'} — ${title}`);

    return `
      <article class="tour-card">
        <div class="tour-media">
          ${tour.image
            ? `<img src="${escapeHtml(tour.image)}" alt="${escapeHtml(title)}" loading="lazy">`
            : `<div class="photo-placeholder"><span class="placeholder-icon">✈</span><strong>${escapeHtml(t('photoPlaceholder'))}</strong></div>`}
          ${tour.price ? `<span class="price-badge">${escapeHtml(tour.price)}</span>` : ''}
        </div>
        <div class="tour-content">
          <div class="tour-title-row">
            <h3>${escapeHtml(title)}</h3>
            ${duration ? `<span class="duration">${escapeHtml(duration)}</span>` : ''}
          </div>
          <p>${escapeHtml(description)}</p>
          <a class="button button-primary button-full" href="mailto:info.est.official@gmail.com?subject=${subject}">${escapeHtml(t('askTour'))}</a>
        </div>
      </article>`;
  }).join('');
}

async function loadTours() {
  tourGrid.innerHTML = `<div class="empty-state">${escapeHtml(t('loadingTours'))}</div>`;
  try {
    const response = await fetch((location.origin && location.origin.startsWith('http')) ? `${location.origin}/api/tours` : '/api/tours', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load tours.');
    tours = await response.json();
    renderTours();
  } catch (error) {
    console.error(error);
    if (location.protocol === 'file:') {
      tours = SAMPLE_TOURS;
      renderTours();
      return;
    }
    tourGrid.innerHTML = `<div class="empty-state">${escapeHtml(t('noTours'))}</div>`;
  }
}

langButton.addEventListener('click', () => {
  language = language === 'en' ? 'ka' : 'en';
  applyStaticTranslations();
  renderTours();
});

menuButton.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

applyStaticTranslations();
loadTours();
