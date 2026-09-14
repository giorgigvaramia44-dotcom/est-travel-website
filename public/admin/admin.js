const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const loginForm = document.getElementById('loginForm');
const adminTours = document.getElementById('adminTours');
const toast = document.getElementById('toast');
const loginError = document.getElementById('loginError');

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
}

async function api(url, options = {}) {
  const response = await fetch(url, options);
  let payload = {};
  try { payload = await response.json(); } catch (_) {}
  if (!response.ok) throw new Error(payload.error || 'Request failed.');
  return payload;
}

async function refreshSession() {
  const status = await api('/api/admin/status');
  const isAuthenticated = status.authenticated === true;
  loginView.classList.toggle('hidden', isAuthenticated);
  dashboardView.classList.toggle('hidden', !isAuthenticated);
  if (isAuthenticated) await loadTours();
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginError.textContent = '';
  try {
    await api('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: document.getElementById('username').value.trim(),
        password: document.getElementById('password').value
      })
    });
    document.getElementById('password').value = '';
    await refreshSession();
  } catch (error) {
    loginError.textContent = error.message;
  }
});

document.getElementById('logoutButton').addEventListener('click', async () => {
  await api('/api/admin/logout', { method: 'POST' });
  await refreshSession();
});

document.getElementById('refreshButton').addEventListener('click', loadTours);

document.getElementById('addTourForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const body = {
    titleEn: document.getElementById('newTitleEn').value.trim(),
    titleKa: document.getElementById('newTitleKa').value.trim(),
    price: document.getElementById('newPrice').value.trim(),
    durationEn: document.getElementById('newDurationEn').value.trim(),
    durationKa: document.getElementById('newDurationKa').value.trim(),
    active: true
  };

  try {
    await api('/api/admin/tours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    event.target.reset();
    showToast('Tour added.');
    await loadTours();
  } catch (error) {
    showToast(error.message);
  }
});

async function loadTours() {
  try {
    const tours = await api('/api/admin/tours');
    if (!tours.length) {
      adminTours.innerHTML = '<div class="notice">No tours yet. Add the first one above.</div>';
      return;
    }

    tours.sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
    adminTours.innerHTML = tours.map((tour) => `
      <article class="tour-editor" data-id="${escapeHtml(tour.id)}">
        <div class="editor-grid">
          <div>
            <div class="photo-box">
              ${tour.image
                ? `<img src="${escapeHtml(tour.image)}" alt="${escapeHtml(tour.titleEn || tour.titleKa)}">`
                : '<div><div style="font-size:36px">📷</div><strong>No photo uploaded</strong><p>The public website shows a placeholder until the owner uploads a photo.</p></div>'}
            </div>
            <div class="photo-actions">
              <input class="image-input" type="file" accept="image/jpeg,image/png,image/webp">
              <button class="admin-button secondary upload-button" type="button">Upload / replace photo</button>
              ${tour.image ? '<button class="admin-button secondary remove-photo-button" type="button">Remove photo</button>' : ''}
            </div>
          </div>

          <div>
            <div class="fields-grid">
              <label>English title<input class="title-en" value="${escapeHtml(tour.titleEn)}"></label>
              <label>ქართული სათაური<input class="title-ka" value="${escapeHtml(tour.titleKa)}"></label>
              <label>Price<input class="price" value="${escapeHtml(tour.price)}" placeholder="From 699 GEL"></label>
              <label>Order<input class="sort-order" type="number" value="${escapeHtml(tour.sortOrder)}"></label>
              <label>Duration EN<input class="duration-en" value="${escapeHtml(tour.durationEn)}"></label>
              <label>ხანგრძლივობა KA<input class="duration-ka" value="${escapeHtml(tour.durationKa)}"></label>
              <label class="full">English description<textarea class="description-en" rows="4">${escapeHtml(tour.descriptionEn)}</textarea></label>
              <label class="full">ქართული აღწერა<textarea class="description-ka" rows="4">${escapeHtml(tour.descriptionKa)}</textarea></label>
            </div>

            <label class="publish-row"><input class="active" type="checkbox" ${tour.active !== false ? 'checked' : ''}> Published on public website</label>

            <div class="editor-actions">
              <button class="admin-button primary save-button" type="button">Save changes</button>
              <button class="admin-button danger delete-button" type="button">Delete tour</button>
            </div>
          </div>
        </div>
      </article>`).join('');

    bindEditorActions();
  } catch (error) {
    if (error.message === 'Unauthorized') return refreshSession();
    showToast(error.message);
  }
}

function bindEditorActions() {
  document.querySelectorAll('.tour-editor').forEach((card) => {
    const id = card.dataset.id;

    card.querySelector('.save-button').addEventListener('click', async () => {
      const body = {
        titleEn: card.querySelector('.title-en').value.trim(),
        titleKa: card.querySelector('.title-ka').value.trim(),
        price: card.querySelector('.price').value.trim(),
        durationEn: card.querySelector('.duration-en').value.trim(),
        durationKa: card.querySelector('.duration-ka').value.trim(),
        descriptionEn: card.querySelector('.description-en').value.trim(),
        descriptionKa: card.querySelector('.description-ka').value.trim(),
        sortOrder: Number(card.querySelector('.sort-order').value || 0),
        active: card.querySelector('.active').checked
      };

      try {
        await api(`/api/admin/tours/${encodeURIComponent(id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        showToast('Changes saved.');
      } catch (error) {
        showToast(error.message);
      }
    });

    card.querySelector('.upload-button').addEventListener('click', async () => {
      const input = card.querySelector('.image-input');
      const file = input.files[0];
      if (!file) return showToast('Choose an image first.');

      const formData = new FormData();
      formData.append('image', file);

      try {
        await api(`/api/admin/tours/${encodeURIComponent(id)}/image`, {
          method: 'POST',
          body: formData
        });
        showToast('Photo uploaded.');
        await loadTours();
      } catch (error) {
        showToast(error.message);
      }
    });

    const removePhotoButton = card.querySelector('.remove-photo-button');
    if (removePhotoButton) {
      removePhotoButton.addEventListener('click', async () => {
        if (!confirm('Remove this tour photo?')) return;
        try {
          await api(`/api/admin/tours/${encodeURIComponent(id)}/image`, { method: 'DELETE' });
          showToast('Photo removed.');
          await loadTours();
        } catch (error) {
          showToast(error.message);
        }
      });
    }

    card.querySelector('.delete-button').addEventListener('click', async () => {
      if (!confirm('Delete this tour permanently?')) return;
      try {
        await api(`/api/admin/tours/${encodeURIComponent(id)}`, { method: 'DELETE' });
        showToast('Tour deleted.');
        await loadTours();
      } catch (error) {
        showToast(error.message);
      }
    });
  });
}


if (location.protocol === 'file:') {
  loginError.textContent = 'Visual preview works, but owner login requires the Node server. Start START_WEBSITE.bat and open http://localhost:3000/admin';
}

refreshSession().catch((error) => {
  loginError.textContent = location.protocol === 'file:'
    ? 'Visual preview works, but owner login requires the Node server. Start START_WEBSITE.bat and open http://localhost:3000/admin'
    : error.message;
});
