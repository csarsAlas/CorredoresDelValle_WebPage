/* ═══════════════════════════════════════════════════════════
   main.js  –  Club Corredores del Valle
   Incluye: lógica del mapa interactivo + validación de contacto
   Cada bloque se activa solo si sus elementos existen en el DOM.
═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   MAPA INTERACTIVO  (ubicaciones.html)
───────────────────────────────────────── */
(function initMap() {
  if (!document.getElementById('map')) return;

  const LOCATIONS = [
    {
      id: 1,
      name: 'Monumento Italia‑México',
      address: 'Calzada del Valle frente al Monumento Italia‑México, San Pedro Garza García',
      category: 'ruta',
      distancia: '~15 km (Calzada del Valle)',
      horario: '7:00 – 9:00 am',
      dia: 'Depende de la coach',
      descripcion: 'Punto de reunión del club. Rodajes sobre Calzada del Valle para trabajar resistencia y técnica de carrera.',
      lat: 25.6572,
      lng: -100.4020,
    },
    {
      id: 2,
      name: 'Pista UDEM',
      address: 'Universidad de Monterrey, San Pedro Garza García, N.L.',
      category: 'pista',
      distancia: 'Pista de 400 m',
      horario: '7:00 – 9:00 am',
      dia: 'Depende de la coach',
      descripcion: 'Pista atlética certificada para series, velocidad y trabajo de técnica de carrera.',
      lat: 25.6627,
      lng: -100.4279,
    },
    {
      id: 3,
      name: 'Parque La Huasteca',
      address: 'Parque La Huasteca, Santa Catarina, N.L.',
      category: 'montana',
      distancia: 'Rutas de 5 a 20+ km',
      horario: '6:00 – 9:30 am',
      dia: 'Depende de la coach',
      descripcion: 'Terreno de montaña para trabajar fuerza, elevación y adaptación al trail.',
      lat: 25.6365,
      lng: -100.5092,
    },
    {
      id: 4,
      name: 'Parque Fundidora',
      address: 'Parque Fundidora, Monterrey, N.L.',
      category: 'ruta',
      distancia: '~3 a 10 km por circuito',
      horario: '6:45 – 9:00 am',
      dia: 'Depende de la coach',
      descripcion: 'Circuito urbano plano para series de velocidad y rodajes de ritmo.',
      lat: 25.6791,
      lng: -100.2954,
    },
    {
      id: 5,
      name: 'Parque Ecológico Chipinque',
      address: 'Parque Ecológico Chipinque, San Pedro Garza García, N.L.',
      category: 'montana',
      distancia: 'Senderos de 5 a 25+ km',
      horario: '6:00 – 9:30 am',
      dia: 'Depende de la coach',
      descripcion: 'Senderos de sierra para trabajar fuerza, resistencia y terreno técnico de trail.',
      lat: 25.6167,
      lng: -100.3583,
    },
    {
      id: 6,
      name: 'Parque España',
      address: 'Parque España, Col. Mitras, Monterrey, N.L.',
      category: 'ruta',
      distancia: '~1 a 5 km por circuito',
      horario: '7:00 – 9:00 am',
      dia: 'Depende de la coach',
      descripcion: 'Parque urbano para rodajes suaves y recuperación activa.',
      lat: 25.6830,
      lng: -100.3607,
    },
    {
      id: 7,
      name: 'Pista CARE',
      address: 'Deportivo CARE, San Pedro Garza García, N.L.',
      category: 'pista',
      distancia: 'Pista de 400 m',
      horario: '7:00 – 9:00 am',
      dia: 'Depende de la coach',
      descripcion: 'Pista atlética para velocidad, series y trabajo de ritmo específico.',
      lat: 25.6615,
      lng: -100.3721,
    },
  ];

  const map = L.map('map', {
    center: [25.650, -100.400],
    zoom: 11,
    zoomControl: true,
    scrollWheelZoom: false,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19,
  }).addTo(map);

  const CAT_ICON = {
    pista:   { class: 'marker-pista',   icon: 'fa-person-running' },
    ruta:    { class: 'marker-ruta',    icon: 'fa-route'          },
    montana: { class: 'marker-montana', icon: 'fa-mountain'       },
  };

  const CAT_LABELS = { pista: 'Pista', ruta: 'Ruta', montana: 'Montaña' };
  const CAT_ICONS  = { pista: 'fa-person-running', ruta: 'fa-route', montana: 'fa-mountain' };

  function createIcon(cat) {
    const cfg = CAT_ICON[cat] || CAT_ICON.ruta;
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

  const panel      = document.getElementById('locationsPanel');
  const popup      = document.getElementById('mapInfoPopup');
  const popupClose = document.getElementById('popupClose');

  function openPopup(loc) {
    const label = CAT_LABELS[loc.category] || loc.category;
    document.getElementById('popupDiff').textContent     = label;
    document.getElementById('popupDiff').className       = `diff-badge ${loc.category}`;
    document.getElementById('popupCategory').textContent = '';
    document.getElementById('popupTitle').textContent    = loc.name;
    document.getElementById('popupAddress').textContent  = loc.address;
    document.getElementById('popupDist').textContent     = loc.distancia;
    document.getElementById('popupHorario').textContent  = loc.horario;
    document.getElementById('popupDia').textContent      = loc.dia;
    document.getElementById('popupDesc').textContent     = loc.descripcion;
    popup.classList.add('visible');
  }

  popupClose.addEventListener('click', () => popup.classList.remove('visible'));

  let markers = [];

  function renderLocations(filter) {
    panel.innerHTML = '';
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    const filtered = filter === 'todas'
      ? LOCATIONS
      : LOCATIONS.filter(l => l.category === filter);

    filtered.forEach(loc => {
      const mk = L.marker([loc.lat, loc.lng], { icon: createIcon(loc.category) })
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
      card.setAttribute('aria-label', `${loc.name}, ${CAT_LABELS[loc.category] || loc.category}, ${loc.distancia}`);

      const catLabel = CAT_LABELS[loc.category] || loc.category;
      const catIco   = CAT_ICONS[loc.category]  || 'fa-location-dot';

      card.innerHTML = `
        <div class="loc-icon ${loc.category}">
          <i class="fa-solid ${catIco}" aria-hidden="true"></i>
        </div>
        <div class="loc-info">
          <p class="loc-name">${loc.name}</p>
          <div class="loc-meta">
            <span class="diff-badge ${loc.category}">${catLabel}</span>
            <span>${loc.distancia}</span>
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
   FORMULARIO DE CONTACTO 
  web3forms.com
───────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const btnSubmit = document.getElementById('btnSubmit');
  const toast     = document.getElementById('successToast');
  const charCount = document.getElementById('char-count');
  const msgArea   = document.getElementById('mensaje');

  msgArea.addEventListener('input', () => {
    const len = msgArea.value.length;
    charCount.textContent = `${len} / 500 caracteres`;
    charCount.classList.toggle('warn', len > 400);
  });

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

  Object.keys(RULES).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const evt = (el.type === 'checkbox') ? 'change' : 'blur';
    el.addEventListener(evt, () => validateField(id));
    if (el.tagName === 'SELECT') el.addEventListener('change', () => validateField(id));
  });

  ['nombre', 'telefono', 'email', 'mensaje'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(id);
    });
  });

  function showToast(success) {
    const title = toast.querySelector('.toast-title');
    const text  = toast.querySelector('.toast-text');
    const icon  = toast.querySelector('.toast-icon i');

    if (success) {
      toast.classList.remove('toast--error');
      title.textContent = '¡Mensaje enviado!';
      text.textContent  = 'Gracias por escribirnos. Nuestra entrenadora te contactará pronto.';
      icon.className    = 'fa-solid fa-circle-check';
    } else {
      toast.classList.add('toast--error');
      title.textContent = 'Error al enviar';
      text.textContent  = 'Hubo un problema. Por favor intenta de nuevo o escríbenos por WhatsApp.';
      icon.className    = 'fa-solid fa-circle-exclamation';
    }

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show', 'toast--error'), 6000);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const valid = Object.keys(RULES).map(id => validateField(id)).every(Boolean);
    if (!valid) {
      const firstErr = form.querySelector('.error');
      if (firstErr) firstErr.focus();
      return;
    }

    btnSubmit.classList.add('loading');
    btnSubmit.disabled = true;

    try {
      const payload = {
        access_key:  '3ce4459e-d66f-4352-9d04-0423932d7bb3',
        from_name:   'Club Corredores del Valle – Sitio Web',
        to_email:    'echch73@gmail.com',
        nombre:   document.getElementById('nombre').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        email:    document.getElementById('email').value.trim(),
        asunto:   document.getElementById('asunto').value,
        mensaje:  document.getElementById('mensaje').value.trim(),
      };

      const res  = await fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.message || 'Error en el servidor.');

      showToast(true);
      form.reset();
      charCount.textContent = '0 / 500 caracteres';
      Object.keys(RULES).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('success', 'error');
        clearError(id);
      });

    } catch (_) {
      showToast(false);
    } finally {
      btnSubmit.classList.remove('loading');
      btnSubmit.disabled = false;
    }
  });
})();


/* ─────────────────────────────────────────
   HAMBURGER MENU — todas las páginas
───────────────────────────────────────── */
(function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  if (!toggle) return;

  const navbar = document.getElementById('mainNavbar');

  toggle.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('nav-open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  navbar.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('nav-open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && navbar.classList.contains('nav-open')) {
      navbar.classList.remove('nav-open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ─────────────────────────────────────────
   MODO OSCURO — todas las páginas
───────────────────────────────────────── */
(function initDarkMode() {
  const btn = document.getElementById('darkModeToggle');
  if (!btn) return;

  const DARK_CLASS  = 'dark-mode';
  const STORAGE_KEY = 'cdv-theme';

  function applyTheme(dark) {
    document.documentElement.classList.toggle(DARK_CLASS, dark);
    const icon = btn.querySelector('i');
    if (icon) icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    btn.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  }

  const saved       = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved === 'dark' || (saved === null && prefersDark));

  btn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains(DARK_CLASS);
    applyTheme(!isDark);
    localStorage.setItem(STORAGE_KEY, !isDark ? 'dark' : 'light');
  });
})();
