/* BM Beauty Salon – Interaktionen */
(() => {
  // Nummer hier zentral ändern (ohne + und Leerzeichen)
  const WA_NUMBER = '41767339981';
  const GREETING = 'Hallo Blerta, ';
  const wa = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Jahr
  $$('.year').forEach(e => e.textContent = new Date().getFullYear());

  // WhatsApp-Links mit vorausgefülltem Text
  $$('[data-wa]').forEach(a => {
    const topic = a.dataset.wa;
    const msg = topic
      ? `${GREETING}ich interessiere mich für: ${topic}. Kannst du mir mehr Infos und einen Terminvorschlag schicken?`
      : `${GREETING}ich möchte gerne einen Termin vereinbaren.`;
    a.href = wa(msg);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // Header
  const header = $('#header'), burger = $('#burger'), mbar = $('#mbar');
  const onScroll = () => {
    header.classList.toggle('scrolled', scrollY > 30);
    if (mbar) mbar.classList.toggle('show', scrollY > 500);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll(); addEventListener('load', onScroll);
  if (burger) {
    burger.addEventListener('click', () => {
      const open = header.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('#menu a').forEach(a => a.addEventListener('click', () => {
      header.classList.remove('nav-open'); burger.setAttribute('aria-expanded', false); document.body.style.overflow = '';
    }));
  }

  // Scroll-Reveal
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.rv').forEach(el => io.observe(el));

  // Toggle-Buttons (Zonen, Tage = Mehrfach; Tageszeit = Einfach)
  const toggleGroup = (container, multi, onChange) => {
    $$('button', container).forEach(b => b.addEventListener('click', () => {
      const on = b.getAttribute('aria-pressed') !== 'true';
      if (!multi) $$('button', container).forEach(x => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', on);
      onChange && onChange();
    }));
  };
  const pressed = (container) => $$('button[aria-pressed="true"]', container).map(b => b.textContent.trim());

  // Laser-Zonen
  const zonesBox = $('#zonen');
  if (zonesBox) {
    const zcount = $('#zcount'), zsend = $('#zsend');
    const update = () => {
      const z = pressed(zonesBox);
      zcount.textContent = z.length;
      zsend.href = wa(z.length
        ? `${GREETING}ich interessiere mich für die dauerhafte Haarentfernung mit Laser. Wunschzonen: ${z.join(', ')}. Kannst du mir ein Angebot und einen Terminvorschlag schicken?`
        : `${GREETING}ich interessiere mich für die dauerhafte Haarentfernung mit Laser. Kannst du mich beraten?`);
    };
    $$('.pick', zonesBox).forEach(p => toggleGroup(p, true, update));
    zsend.target = '_blank'; zsend.rel = 'noopener';
    update();
  }

  // Behandlungsfinder
  const quiz = $('#quiz');
  if (quiz) {
    const R = {
      laser: ['Dauerhafte Haarentfernung', 'Mit dem Diodenlaser werden die Haare Sitzung für Sitzung weniger, bis die Haut dauerhaft glatt bleibt. Ideal, wenn du nie mehr rasieren möchtest.'],
      wachs: ['Warmwachs­behandlung', 'Sofort glatte Haut für mehrere Wochen, ohne längere Behandlungsserie. Perfekt vor den Ferien oder einem besonderen Anlass.'],
      gesicht: ['Gesichtsbehandlung mit Clinicare', 'Reinigung, Feuchtigkeit und Pflege, abgestimmt auf deinen Hauttyp. Für einen frischen, strahlenden Teint.'],
      needling: ['Microneedling', 'Regt die hauteigene Erneuerung an: für feinere Poren, ein ebenmässigeres Hautbild und mehr Spannkraft. Am besten als Kur mit mehreren Sitzungen.'],
      madero: ['Madero-Therapie', 'Speziell geformte Holzinstrumente lockern das Gewebe und unterstützen den Lymphfluss. Die Haut wirkt glatter und straffer. Am besten als Kur mit mehreren Sitzungen.'],
      lift: ['Wimpernlifting & Färben', 'Deine eigenen Wimpern, schön geschwungen und betont. Pflegeleicht und natürlich, hält mehrere Wochen.'],
      ext: ['Wimpernverlängerung', 'Mehr Länge und Volumen, ganz nach deinem Geschmack, von natürlich bis glamourös. Ohne Mascara ein wacher Blick.'],
      micro: ['Microblading', 'Feine, gezeichnete Härchen für einen sehr natürlichen Look. Ideal, wenn du Lücken füllen oder die Form betonen möchtest.'],
      powder: ['Powder Brows', 'Ein weicher, gepuderter Look wie frisch geschminkt. Hält meist etwas länger und passt gut zu fettiger Haut.'],
    };
    const Q2 = {
      haare: ['Wie soll das Ergebnis sein?', [['laser', '♾️', 'Dauerhaft', 'Ich will nie mehr rasieren'], ['wachs', '⚡', 'Schnell & sofort', 'Für die nächsten Wochen glatt']]],
      haut: ['Was braucht deine Haut gerade?', [['gesicht', '💧', 'Pflege & Glow', 'Reinigen, durchfeuchten, entspannen'], ['needling', '🔬', 'Sichtbare Erneuerung', 'Poren, Unreinheiten, Narben']]],
      anti: ['Was möchtest du verbessern?', [['needling', '✨', 'Poren & Narben', 'Ebenmässigeres Hautbild'], ['gesicht', '🌿', 'Feuchtigkeit & Frische', 'Müde Haut aufwecken']]],
      koerper: ['Was steht im Vordergrund?', [['madero', '🌀', 'Cellulite & Straffung', 'Sichtbar glattere Haut'], ['madero', '💆', 'Entspannung & Form', 'Wohlfühlen und formen']]],
      augen: ['Welcher Look gefällt dir?', [['lift', '🌱', 'Natürlich', 'Meine eigenen Wimpern, nur schöner'], ['ext', '💫', 'Mehr Volumen', 'Länger, dichter, ausdrucksstark']]],
      brauen: ['Welcher Look gefällt dir?', [['micro', '✏️', 'Härchenzeichnung', 'Sehr natürlich, wie echte Härchen'], ['powder', '🎨', 'Gepudert', 'Weich, wie mit Puder geschminkt']]],
    };
    const bar = $('#qbar');
    const show = (n) => { $$('.q-step', quiz).forEach(s => s.classList.toggle('on', s.dataset.step == n)); bar.style.width = (n / 3 * 100) + '%'; };
    const result = (key) => {
      const [t, d] = R[key];
      $('#rTitle').textContent = t.replace('­', '');
      $('#rText').textContent = d;
      const a = $('#rWa');
      a.href = wa(`${GREETING}der Behandlungsfinder auf deiner Website hat mir „${t.replace('­', '')}“ empfohlen. Kannst du mich dazu beraten?`);
      a.target = '_blank'; a.rel = 'noopener';
      const sel = $('#fTreat');
      $('#rForm').onclick = () => {
        const map = { laser: 0, wachs: 3, gesicht: 1, needling: 4, madero: 2, lift: 5, ext: 5, micro: 6, powder: 6 };
        sel.selectedIndex = key in map ? map[key] : 8;
      };
      show(3);
    };
    $$('[data-goal]', quiz).forEach(b => b.addEventListener('click', () => {
      const [title, opts] = Q2[b.dataset.goal];
      $('#q2title').textContent = title;
      $('#q2opts').innerHTML = opts.map(([k, em, h, s]) => `<button class="opt" data-r="${k}"><span class="em">${em}</span><b>${h}</b><small>${s}</small></button>`).join('');
      $$('[data-r]', quiz).forEach(x => x.addEventListener('click', () => result(x.dataset.r)));
      $('#q2opts').style.gridTemplateColumns = 'repeat(2,1fr)';
      show(2);
    }));
    $('[data-back]', quiz).addEventListener('click', () => show(1));
    $('[data-restart]', quiz).addEventListener('click', () => show(1));
    bar.style.width = '33%';
  }

  // Terminformular → WhatsApp
  const form = $('#bookForm');
  if (form) {
    toggleGroup($('#fDays'), true);
    toggleGroup($('#fTime'), false);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#fName');
      if (!name.value.trim()) { name.focus(); name.style.borderColor = '#b5645c'; return; }
      const days = pressed($('#fDays')), time = pressed($('#fTime'));
      const lines = [
        `${GREETING}ich bin ${name.value.trim()} und möchte gerne einen Termin anfragen.`,
        `Behandlung: ${$('#fTreat').value}`,
        days.length ? `Wunschtag: ${days.join(', ')}` : '',
        time.length ? `Tageszeit: ${time[0]}` : '',
        $('#fTel').value.trim() ? `Telefon: ${$('#fTel').value.trim()}` : '',
        $('#fMsg').value.trim(),
      ].filter(Boolean);
      window.open(wa(lines.join('\n')), '_blank', 'noopener');
    });
  }
})();
