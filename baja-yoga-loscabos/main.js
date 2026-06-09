(function () {
  'use strict';

  function safe(fn, n) { try { fn(); } catch (e) { console.warn('[BajaYoga]', n, e); } }
  function waitGSAP(cb) {
    if (window.gsap && window.ScrollTrigger) { cb(); return; }
    var t = 0, p = setInterval(function () {
      t += 100;
      if (window.gsap && window.ScrollTrigger) { clearInterval(p); cb(); }
      if (t > 4000) { clearInterval(p); cb(); }
    }, 100);
  }

  /* Safety net */
  setTimeout(function () {
    document.querySelectorAll('.reveal:not(.in-view)').forEach(function (el) {
      el.style.opacity = '1'; el.style.transform = 'none'; el.classList.add('in-view');
    });
    // Also reveal hero elements
    ['.hero-logo-anim','.hero-tagline','.hero-rule','.hero-services','.hero-ctas'].forEach(function(s){
      var el = document.querySelector(s); if (el) { el.style.opacity='1'; el.style.clipPath='none'; }
    });
  }, 6000);

  /* NAV */
  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;
    function update() { nav.classList.toggle('solid', window.scrollY > 60); }
    window.addEventListener('scroll', update, { passive: true });
    update();

    var burger = document.getElementById('navBurger');
    var drawer = document.getElementById('navDrawer');
    if (burger && drawer) {
      burger.addEventListener('click', function () { drawer.classList.toggle('open'); });
      drawer.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { drawer.classList.remove('open'); });
      });
    }
  }

  /* Smooth anchors */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        var t = id && document.getElementById(id);
        if (!t) return;
        e.preventDefault();
        window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
      });
    });
  }

  /* IntersectionObserver reveal */
  function initReveal() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.from((el.parentElement || document.body).querySelectorAll('.reveal'));
        setTimeout(function () { el.classList.add('in-view'); }, Math.min(siblings.indexOf(el) * 70, 350));
        io.unobserve(el);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }

  /* Hero animation — logo primero, luego el resto en secuencia */
  function initHeroAnimation() {
    if (!window.gsap) return;
    var logo = document.querySelector('.hero-logo-anim');
    var rest = ['.hero-tagline','.hero-rule','.hero-services','.hero-ctas']
      .map(function(s){ return document.querySelector(s); }).filter(Boolean);

    var tl = gsap.timeline({ delay: 0.4 });

    if (logo) {
      tl.fromTo(logo,
        { opacity: 0 },
        { opacity: 1, duration: 2.0, ease: 'power1.inOut' }
      );
    }
    if (rest.length) {
      tl.fromTo(rest,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out', stagger: 0.14 },
        '+=0.1'  /* empieza 0.1s después de que termina el logo */
      );
    }
  }

  /* GSAP scroll animations */
  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    /* Hero bg parallax */
    safe(function () {
      gsap.to('.hero-bg-img', {
        yPercent: 20, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
      });
    }, 'heroParallax');

    /* Maestros rows stagger */
    safe(function () {
      var rows = document.querySelectorAll('.maestro-row');
      rows.forEach(function (row, i) {
        gsap.fromTo(row,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: row, start: 'top 88%', once: true },
            onComplete: function () { row.classList.add('in-view'); }
          }
        );
      });
    }, 'maestrosRows');

    /* Horarios days */
    safe(function () {
      var days = document.querySelectorAll('.sday');
      gsap.fromTo(days,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08,
          scrollTrigger: { trigger: '.schedule-days', start: 'top 82%', once: true },
          onComplete: function () { days.forEach(function (d) { d.classList.add('in-view'); }); }
        }
      );
    }, 'horariosAnim');

    /* Foto strip parallax */
    safe(function () {
      document.querySelectorAll('.fs-item img').forEach(function (img, i) {
        gsap.to(img, {
          yPercent: -8 + (i % 2) * 6, ease: 'none',
          scrollTrigger: { trigger: '.foto-strip', start: 'top bottom', end: 'bottom top', scrub: 1 }
        });
      });
    }, 'stripParallax');

    /* Nosotros photos parallax */
    safe(function () {
      gsap.to('.np-main img', {
        yPercent: -7, ease: 'none',
        scrollTrigger: { trigger: '.nosotros', start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    }, 'nosotrosParallax');

    /* Reviews cards */
    safe(function () {
      var cards = document.querySelectorAll('.review-card');
      gsap.fromTo(cards,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.12,
          scrollTrigger: { trigger: '.reviews-grid', start: 'top 82%', once: true },
          onComplete: function () { cards.forEach(function (c) { c.classList.add('in-view'); }); }
        }
      );
    }, 'reviewsAnim');

    /* Contacto parallax */
    safe(function () {
      gsap.to('.contacto-bg img', {
        yPercent: 12, ease: 'none',
        scrollTrigger: { trigger: '.contacto', start: 'top bottom', end: 'bottom top', scrub: 1.5 }
      });
    }, 'contactoParallax');
  }

  /* Reserva tipo buttons */
  function initReserva() {
    var btns = document.querySelectorAll('.tipo-btn');
    var waBtn = document.getElementById('reservaWa');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var tipo = btn.getAttribute('data-tipo');
        if (waBtn) {
          waBtn.href = 'https://wa.me/521?text=Hola%2C%20quiero%20reservar%20una%20clase%20de%20' + encodeURIComponent(tipo) + '%20en%20Baja%20Yoga%20Los%20Cabos%20%F0%9F%A7%98';
          waBtn.textContent = 'Reservar ' + tipo + ' por WhatsApp →';
        }
      });
    });
  }

  /* Booking widget */
  function initBooking() {
    var container = document.getElementById('bookingDays');
    var label = document.getElementById('bookWeekLabel');
    var prev = document.getElementById('bookPrev');
    var next = document.getElementById('bookNext');
    if (!container || !label) return;

    // ── Google Sheets CSV URL ──────────────────────────────
    // Reemplaza SHEET_ID con el ID de tu Google Sheet publicado
    var SHEET_CSV_URL = 'SHEET_URL_AQUI';

    // Días en español → número JS (0=Dom)
    var DIA_MAP = {
      'Domingo':0,'Lunes':1,'Martes':2,'Miércoles':3,
      'Miercoles':3,'Jueves':4,'Viernes':5,'Sábado':6,'Sabado':6
    };

    // Horario de respaldo (mientras se carga o si falla el Sheet)
    var fallbackSchedule = {
      1: [
        { time: '8:45 am', end: '10:00 am', name: 'Alineación Restaurativo', instructor: 'Karuna Aguilar' },
        { time: '7:00 pm', end: '8:00 pm',  name: 'Ashtanga Yoga',           instructor: 'Paco Zatarain' }
      ],
      2: [
        { time: '7:30 am', end: '8:30 am',  name: 'Ashtanga Yoga',           instructor: 'Alu Segovia' },
        { time: '8:45 am', end: '10:00 am', name: 'Alineación Restaurativo', instructor: 'Karuna Aguilar' },
        { time: '7:00 pm', end: '8:00 pm',  name: 'Alineación Restaurativo', instructor: 'Pao Martínez' }
      ],
      3: [{ time: '7:00 pm', end: '8:00 pm', name: 'Ashtanga Yoga', instructor: 'Paco Zatarain' }],
      4: [
        { time: '7:30 am', end: '8:30 am',  name: 'Vinyasa Yoga',           instructor: 'Ana Ramírez' },
        { time: '9:00 am', end: '10:00 am', name: 'Ashtanga Yoga',          instructor: 'Alu Segovia' },
        { time: '7:00 pm', end: '8:30 pm',  name: 'Restaurativo + Vinyasa', instructor: 'Pau Ruiz' }
      ],
      5: [{ time: '7:30 am', end: '8:30 am', name: 'Vinyasa Yoga', instructor: 'Rosa Vejar' }]
    };

    var schedule = fallbackSchedule;

    function parseCSV(text) {
      var lines = text.trim().split('\n');
      var result = {};
      for (var i = 1; i < lines.length; i++) {
        var cols = lines[i].split(',').map(function(c){ return c.trim().replace(/^"|"$/g,''); });
        if (cols.length < 5 || !cols[0]) continue;
        var dow = DIA_MAP[cols[0]];
        if (dow === undefined) continue;
        if (!result[dow]) result[dow] = [];
        result[dow].push({ time: cols[1], end: cols[2], name: cols[3], instructor: cols[4] });
      }
      return result;
    }

    // Cargar desde Google Sheets si hay URL configurada
    if (SHEET_CSV_URL !== 'SHEET_URL_AQUI') {
      fetch(SHEET_CSV_URL)
        .then(function(r){ return r.text(); })
        .then(function(text){
          var parsed = parseCSV(text);
          if (Object.keys(parsed).length > 0) {
            schedule = parsed;
            render();
          }
        })
        .catch(function(){});
    }
    var schedule = schedule;

    var DAYS_ES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    var MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    var weekOffset = 0;

    function getMondayOf(date) {
      var d = new Date(date);
      var day = d.getDay();
      var diff = day === 0 ? -6 : 1 - day;
      d.setDate(d.getDate() + diff);
      d.setHours(0,0,0,0);
      return d;
    }

    function fmt(d) {
      return MONTHS_ES[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    }

    function render() {
      var monday = getMondayOf(new Date());
      monday.setDate(monday.getDate() + weekOffset * 7);
      var sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
      label.textContent = fmt(monday) + '  –  ' + fmt(sunday);

      var html = '';
      for (var i = 0; i < 7; i++) {
        var day = new Date(monday); day.setDate(monday.getDate() + i);
        var dow = day.getDay();
        var classes = schedule[dow] || [];
        var dateStr = DAYS_ES[dow] + ', ' + day.getDate() + ' ' + MONTHS_ES[day.getMonth()];

        html += '<div class="booking-day-block">';
        html += '<span class="booking-day-label">' + dateStr + '</span>';

        if (classes.length === 0) {
          html += '<p class="booking-no-class">Sin clases programadas.</p>';
        } else {
          classes.forEach(function(c) {
            var wa = 'https://wa.me/521?text=Hola%2C%20quiero%20reservar%20' + encodeURIComponent(c.name) + '%20con%20' + encodeURIComponent(c.instructor) + '%20%E2%80%94%20Baja%20Yoga%20Los%20Cabos%20%F0%9F%A7%98';
            html += '<div class="booking-class-row">';
            html += '<span class="bc-time">' + c.time + '</span>';
            html += '<div class="bc-info"><span class="bc-name">' + c.name + '</span><span class="bc-instructor">con <strong>' + c.instructor + '</strong></span></div>';
            html += '<a href="' + wa + '" target="_blank" rel="noopener"><button class="bc-book">Reservar</button></a>';
            html += '</div>';
          });
        }
        html += '</div>';
      }
      container.innerHTML = html;
    }

    prev.addEventListener('click', function() { weekOffset--; render(); });
    next.addEventListener('click', function() { weekOffset++; render(); });
    render();
  }

  /* Carrusel maestros */
  function initCarousel() {
    var track = document.getElementById('maestrosTrack');
    var prev = document.getElementById('mPrev');
    var next = document.getElementById('mNext');
    if (!track || !prev || !next) return;

    var cards = track.querySelectorAll('.mc-card');
    var total = cards.length;
    var visible = 3;
    var current = 0;

    function update() {
      var cardW = cards[0].offsetWidth + 32; // width + gap
      track.style.transform = 'translateX(-' + (current * cardW) + 'px)';
      prev.disabled = current === 0;
      next.disabled = current >= total - visible;
    }

    prev.addEventListener('click', function () { if (current > 0) { current--; update(); } });
    next.addEventListener('click', function () { if (current < total - visible) { current++; update(); } });

    window.addEventListener('resize', function () { update(); });
    update();
  }

  /* Newsletter form */
  window.handleNewsletter = function (e) {
    e.preventDefault();
    var input = e.target.querySelector('.nl-input');
    var btn = e.target.querySelector('button');
    if (btn) { btn.textContent = '¡Suscrito! ✓'; btn.style.background = '#4a5e1e'; }
    if (input) input.value = '';
    setTimeout(function () {
      if (btn) btn.textContent = 'Suscribirse →';
    }, 3000);
  };

  function init() {
    safe(initNav, 'nav');
    safe(initAnchors, 'anchors');
    safe(initReveal, 'reveal');
    safe(initReserva, 'reserva');
    safe(initCarousel, 'carousel');
    safe(initBooking, 'booking');
    waitGSAP(function () {
      safe(initHeroAnimation, 'heroAnim');
      safe(initGSAP, 'gsap');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
