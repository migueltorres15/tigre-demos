(function () {
  'use strict';

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn('Init failed [' + name + ']:', e); }
  }

  /* ── NAV ─────────────────────────────────────────────── */
  function initNav() {
    var nav = document.getElementById('nav');
    var burger = document.getElementById('navBurger');
    var drawer = document.getElementById('navDrawer');
    if (!nav) return;

    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    if (burger && drawer) {
      burger.addEventListener('click', function () {
        drawer.classList.toggle('open');
      });
      drawer.querySelectorAll('.drawer-link').forEach(function (link) {
        link.addEventListener('click', function () { drawer.classList.remove('open'); });
      });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        var el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* ── REVEAL ──────────────────────────────────────────── */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    items.forEach(function (el) { observer.observe(el); });

    // Safety: reveal everything after 6s
    setTimeout(function () {
      items.forEach(function (el) { el.classList.add('visible'); });
    }, 6000);
  }

  /* ── GSAP SCROLL ANIMATIONS ──────────────────────────── */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero parallax
    gsap.to('.hero-img', {
      yPercent: 25,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // Stats bar counter feel
    gsap.from('.stat-item', {
      y: 20, opacity: 0, stagger: 0.1, duration: 0.6,
      scrollTrigger: { trigger: '.stats-bar', start: 'top 90%', once: true }
    });

    // Cards stagger
    gsap.from('.servicio-card', {
      y: 40, opacity: 0, stagger: 0.15, duration: 0.7,
      scrollTrigger: { trigger: '.servicios-grid', start: 'top 80%', once: true }
    });

    gsap.from('.galeria-item', {
      scale: 0.95, opacity: 0, stagger: 0.1, duration: 0.6,
      scrollTrigger: { trigger: '.galeria-grid', start: 'top 80%', once: true }
    });

    gsap.from('.paso', {
      y: 30, opacity: 0, stagger: 0.12, duration: 0.6,
      scrollTrigger: { trigger: '.proceso-steps', start: 'top 80%', once: true }
    });
  }

  /* ── CONTACT FORM ────────────────────────────────────── */
  window.handleContacto = function (e) {
    e.preventDefault();
    var form = e.target;
    var nombre = form.nombre.value;
    var email = form.email.value;
    var telefono = form.telefono ? form.telefono.value : '';
    var servicio = form.servicio.value;
    var mensaje = form.mensaje.value;

    var msg = '¡Hola Abonanza! 🌱\n\n'
      + '👤 *Nombre:* ' + nombre + '\n'
      + '📧 *Email:* ' + email + '\n'
      + (telefono ? '📱 *Teléfono:* ' + telefono + '\n' : '')
      + (servicio ? '🌿 *Servicio:* ' + servicio + '\n' : '')
      + (mensaje ? '💬 *Mensaje:* ' + mensaje + '\n' : '');

    var url = 'https://wa.me/5216462551995?text=' + encodeURIComponent(msg);
    window.open(url, '_blank');

    var success = document.getElementById('formSuccess');
    if (success) {
      success.style.display = 'block';
      setTimeout(function () { success.style.display = 'none'; form.reset(); }, 5000);
    }
  };

  /* ── INIT ────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    safe(initNav, 'nav');
    safe(initReveal, 'reveal');
    setTimeout(function () { safe(initGSAP, 'gsap'); }, 100);
  });

})();
