/* ═══════════════════════════════════════════════════════════
   CV_WebPage.js  –  Club Corredores del Valle
   Incluye: lógica del mapa interactivo + validación de contacto
   Cada bloque se activa solo si sus elementos existen en el DOM.
═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   MAPA INTERACTIVO  (ubicaciones.html)
───────────────────────────────────────── */
(function initMap() {
  if (!document.getElementById('map')) return; // guard: solo corre en ubicaciones.html

  const LOCATIONS = [
    {
      id: 1,
      name: 'Punto de reunión – Monumento Italia‑México',
      address: 'Calzada del Valle, frente al Monumento Italia‑México, San Pedro',
      category: 'Punto de partida',
      dificultad: 'facil',
      distancia: '5 km',
      horario: '7:00 – 9:00 am',
      dia: 'Martes',
      descripcion: 'Punto de encuentro oficial del club. Ideal para corredores de todos los niveles; aquí inician la mayoría de las sesiones grupales.',
      lat: 25.6572,
      lng: -100.4020,
    },
    {
      id: 2,
      name: 'Ruta Valle – Circuito Largo',
      address: 'Calzada del Valle al Parque Humberto Lobo, San Pedro',
      category: 'Ruta',
      dificultad: 'intermedio',
      distancia: '10 km',
      horario: '6:30 – 9:00 am',
      dia: 'Jueves',
      descripcion: 'Circuito que recorre Calzada del Valle hasta Parque Humberto Lobo. Terreno plano con algunas subidas moderadas. Recomendado para corredores con base de 10 km.',
      lat: 25.6608,
      lng: -100.3970,
    },
    {
      id: 3,
      name: 'Ruta San Pedro – Subida Los Pinos',
      address: 'Av. Morones Prieto hacia Cerro del Topo Chico, Monterrey',
      category: 'Ruta',
      dificultad: 'avanzado',
      distancia: '18 km',
      horario: '6:00 – 9:30 am',
      dia: 'Sábado',
      descripcion: 'Ruta de entrenamiento avanzado con ganancia de elevación significativa. Ideal para preparar trail o maratón. Solo para corredores experimentados.',
      lat: 25.6690,
      lng: -100.3890,
    },
    {
      id: 4,
      name: 'Parque La Pastora – Sesión 5k',
      address: 'Parque La Pastora, Guadalupe, N.L.',
      category: 'Sesión especial',
      dificultad: 'facil',
      distancia: '5 km',
      horario: '7:30 – 9:00 am',
      dia: 'Domingo',
      descripcion: 'Sesión dominical en el Parque La Pastora. Ambiente familiar, ideal para principiantes y para quienes buscan una carrera tranquila de fin de semana.',
      lat: 25.6720,
      lng: -100.3760,
    },
    {
      id: 5,
      name: 'Ruta Fundidora – Circuito 10k',
      address: 'Parque Fundidora, Monterrey, N.L.',
      category: 'Ruta',
      dificultad: 'intermedio',
      distancia: '10 km',
      horario: '6:45 – 9:00 am',
      dia: 'Miércoles',
      descripcion: 'Circuito dentro del Parque Fundidora. Terreno llano y bien iluminado. Excelente para series y trabajo de velocidad.',
      lat: 25.6780,
      lng: -100.2980,
    },
  ];

  /* Inicialización del mapa */
  const map = L.map('map', {
    center: [25.6640, -100.3900],
    zoom: 13,
    zoomControl: true,
    scrollWheelZoom: false,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19,
  }).addTo(map);

  /* Marcadores personalizados */
  const DIFF_ICON = {
    facil:      { class: 'marker-facil',      icon: 'fa-person-running' },
    intermedio: { class: 'marker-intermedio', icon: 'fa-route'          },
    avanzado:   { class: 'marker-avanzado',   icon: 'fa-mountain'       },
  };

  function createIcon(dif) {
    const cfg = DIFF_ICON[dif] || DIFF_ICON.facil;
    return L.divIcon({
      html: `<div class="custom-marker ${cfg.class}">
               <i class="fa-solid ${cfg.icon}" style="color:white;font-size:.8rem"></i>
             </div>`,
      className: '',
      iconSize:   [36, 36],
      iconAnchor: [18, 36],
      popupAnchor:[0, -38],
    });
  }

  /* Referencias DOM */
  const panel      = document.getElementById('locationsPanel');
  const popup      = document.getElementById('mapInfoPopup');
  const popupClose = document.getElementById('popupClose');

  /* Mostrar info en popup */
  function openPopup(loc) {
    const labels = { facil: 'Fácil', intermedio: 'Intermedio', avanzado: 'Avanzado' };
    document.getElementById('popupDiff').textContent     = labels[loc.dificultad] || loc.dificultad;
    document.getElementById('popupDiff').className       = `diff-badge ${loc.dificultad}`;
    document.getElementById('popupCategory').textContent = loc.category;
    document.getElementById('popupTitle').textContent    = loc.name;
    document.getElementById('popupAddress').textContent  = loc.address;
    document.getElementById('popupDist').textContent     = loc.distancia;
    document.getElementById('popupDiffVal').textContent  = labels[loc.dificultad];
    document.getElementById('popupHorario').textContent  = loc.horario;
    document.getElementById('popupDia').textContent      = loc.dia;
    document.getElementById('popupDesc').textContent     = loc.descripcion;
    popup.classList.add('visible');
  }

  popupClose.addEventListener('click', () => popup.classList.remove('visible'));

  /* Renderizar lista + marcadores */
  let markers = [];

  function renderLocations(filter) {
    panel.innerHTML = '';
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    const filtered = filter === 'todas'
      ? LOCATIONS
      : LOCATIONS.filter(l => l.dificultad === filter);

    filtered.forEach(loc => {
      const mk = L.marker([loc.lat, loc.lng], { icon: createIcon(loc.dificultad) })
        .addTo(map)
        .on('click', () => {
          openPopup(loc);
          selectCard(loc.id);
          map.flyTo([loc.lat, loc.lng], 15, { animate: true, duration: 0.8 });
        });
      markers.push(mk);

      const card = document.createElement('div');
      card.className = 'location-card';
      card.setAttribute('role', 'listitem');
      card.setAttribute('data-id', loc.id);
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${loc.name}, ${loc.dificultad}, ${loc.distancia}`);

      const diffLabel = { facil: 'Fácil', intermedio: 'Intermedio', avanzado: 'Avanzado' }[loc.dificultad];
      const diffIco   = { facil: 'fa-person-running', intermedio: 'fa-route', avanzado: 'fa-mountain' }[loc.dificultad];

      card.innerHTML = `
        <div class="loc-icon ${loc.dificultad}">
          <i class="fa-solid ${diffIco}" aria-hidden="true"></i>
        </div>
        <div class="loc-info">
          <p class="loc-name">${loc.name}</p>
          <div class="loc-meta">
            <span class="diff-badge ${loc.dificultad}">${diffLabel}</span>
            <span>${loc.distancia}</span>
            <span>${loc.dia}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        openPopup(loc);
        selectCard(loc.id);
        map.flyTo([loc.lat, loc.lng], 15, { animate: true, duration: 0.8 });
      });

      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
      });

      panel.appendChild(card);
    });
  }

  function selectCard(id) {
    document.querySelectorAll('.location-card').forEach(c => c.classList.remove('selected'));
    const target = panel.querySelector(`[data-id="${id}"]`);
    if (target) {
      target.classList.add('selected');
      target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  /* Filtros */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      popup.classList.remove('visible');
      renderLocations(btn.dataset.filter);
    });
  });

  renderLocations('todas');
})();


/* ─────────────────────────────────────────
   FORMULARIO DE CONTACTO  (Contacto.html)
───────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return; // guard: solo corre en Contacto.html

  const btnSubmit = document.getElementById('btnSubmit');
  const toast     = document.getElementById('successToast');
  const charCount = document.getElementById('char-count');
  const msgArea   = document.getElementById('mensaje');

  /* Contador de caracteres */
  msgArea.addEventListener('input', () => {
    const len = msgArea.value.length;
    charCount.textContent = `${len} / 500 caracteres`;
    charCount.classList.toggle('warn', len > 400);
  });

  /* Reglas de validación */
  const RULES = {
    nombre:     { required: true, minLen: 3,  msg: { required: 'El nombre es obligatorio.',          minLen: 'Escribe al menos 3 caracteres.' } },
    telefono:   { required: true, pattern: /^[\d\s\-()+]{7,15}$/, msg: { required: 'El teléfono es obligatorio.', pattern: 'Número inválido. Ej: 81 1234 5678' } },
    email:      { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: { required: 'El correo es obligatorio.', pattern: 'Escribe un correo válido.' } },
    asunto:     { required: true, msg: { required: 'Selecciona un asunto.' } },
    mensaje:    { required: true, minLen: 15, msg: { required: 'El mensaje es obligatorio.',          minLen: 'Escribe al menos 15 caracteres.' } },
    privacidad: { required: true, checkbox: true, msg: { required: 'Acepta el aviso de privacidad para continuar.' } },
  };

  function showError(id, message) {
    const errEl = document.getElementById(`error-${id}`);
    if (!errEl) return;
    errEl.querySelector('span').textContent = message;
    errEl.classList.add('show');
    const input = document.getElementById(id);
    if (input) { input.classList.add('error'); input.classList.remove('success'); }
  }

  function clearError(id) {
    const errEl = document.getElementById(`error-${id}`);
    if (errEl) errEl.classList.remove('show');
    const input = document.getElementById(id);
    if (input) input.classList.remove('error');
  }

  function markSuccess(id) {
    const input = document.getElementById(id);
    if (input && id !== 'privacidad') { input.classList.add('success'); input.classList.remove('error'); }
  }

  function validateField(id) {
    const rule  = RULES[id];
    const input = document.getElementById(id);
    if (!input || !rule) return true;

    const value = rule.checkbox ? input.checked : input.value.trim();

    if (rule.required && !value)                                              { showError(id, rule.msg.required); return false; }
    if (rule.minLen  && typeof value === 'string' && value.length < rule.minLen) { showError(id, rule.msg.minLen);  return false; }
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value))  { showError(id, rule.msg.pattern); return false; }

    clearError(id);
    markSuccess(id);
    return true;
  }

  /* Validación al salir del campo */
  Object.keys(RULES).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const evt = (el.type === 'checkbox') ? 'change' : 'blur';
    el.addEventListener(evt, () => validateField(id));
    if (el.tagName === 'SELECT') el.addEventListener('change', () => validateField(id));
  });

  /* Validación en tiempo real si ya tiene error */
  ['nombre', 'telefono', 'email', 'mensaje'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(id);
    });
  });

  /* Envío del formulario */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const valid = Object.keys(RULES).map(id => validateField(id)).every(Boolean);
    if (!valid) {
      const firstErr = form.querySelector('.error, [aria-invalid="true"]');
      if (firstErr) firstErr.focus();
      return;
    }

    btnSubmit.classList.add('loading');
    btnSubmit.disabled = true;

    await new Promise(r => setTimeout(r, 1800));

    btnSubmit.classList.remove('loading');
    btnSubmit.disabled = false;

    toast.classList.add('show');
    form.reset();
    charCount.textContent = '0 / 500 caracteres';

    Object.keys(RULES).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('success', 'error');
      clearError(id);
    });

    setTimeout(() => toast.classList.remove('show'), 6000);
  });
})();
