/* ═══════════════════════════════════════════
   AMENA — main.js  |  IIFE, no ES modules
═══════════════════════════════════════════ */
(function () {
  "use strict";

  /* ── Safety wrapper ── */
  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  /* ── Smooth anchor scroll ── */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  }

  /* ── Nav: solidify on scroll ── */
  function initNav() {
    var nav = document.getElementById("nav");
    if (!nav) return;
    var handler = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 30);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
  }

  /* ── Mobile menu ── */
  function initMobileMenu() {
    var btn = document.querySelector(".nav-hamburger");
    var menu = document.getElementById("nav-mobile");
    if (!btn || !menu) return;

    function toggle() {
      var open = menu.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    }

    btn.addEventListener("click", toggle);

    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) toggle();
    });
  }

  /* ── Reveal on scroll (IntersectionObserver) ── */
  function initReveals() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.04, rootMargin: "0px 0px -3% 0px" });

    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 0.08 + "s";
      io.observe(el);
    });

    /* Safety: force-reveal anything still hidden after 6s */
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight + 100) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  /* ── GSAP: hero parallax only (avoids conflict with CSS reveal) ── */
  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    var heroContent = document.querySelector(".hero-content");
    if (heroContent) {
      gsap.to(heroContent, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }

  /* ── Count-up numbers ── */
  function initCountUp() {
    var nums = document.querySelectorAll("[data-count-to]");
    if (!nums.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseFloat(el.getAttribute("data-count-to"));
        var isFloat = target % 1 !== 0;
        var start = 0;
        var duration = 1400;
        var startTime = null;

        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var val = start + (target - start) * eased;
          el.textContent = isFloat ? val.toFixed(1).replace(".", ",") : Math.round(val);
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });

    nums.forEach(function (el) { io.observe(el); });
  }

  /* ── Service card hover accent ── */
  function initServiceHover() {
    document.querySelectorAll(".service-card").forEach(function (card) {
      card.addEventListener("mouseover", function (e) {
        if (!card.contains(e.relatedTarget)) {
          card.style.setProperty("--hover-scale", "1");
        }
      });
      card.addEventListener("mouseout", function (e) {
        if (!card.contains(e.relatedTarget)) {
          card.style.removeProperty("--hover-scale");
        }
      });
    });
  }

  /* ── WhatsApp booking form ── */
  function initBookingForm() {
    var form = document.getElementById("bookingForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre   = document.getElementById("nombre").value.trim();
      var telefono = document.getElementById("telefono").value.trim();
      var servicio = document.getElementById("servicio").value;
      var horario  = document.getElementById("horario").value || "Cualquier horario";
      var motivo   = document.getElementById("motivo").value.trim();
      if (!nombre || !telefono || !servicio) {
        alert("Por favor completa nombre, teléfono y servicio.");
        return;
      }
      var msg = "Hola Amena! Me gustaría agendar una cita 🙌\n\n" +
        "👤 *Nombre:* " + nombre + "\n" +
        "📱 *Teléfono:* " + telefono + "\n" +
        "🏥 *Servicio:* " + servicio + "\n" +
        "🕐 *Horario preferido:* " + horario +
        (motivo ? "\n\n📝 *Mi situación:* " + motivo : "") +
        "\n\n¿Tienen disponibilidad?";
      window.open("https://wa.me/526121617443?text=" + encodeURIComponent(msg), "_blank");
    });
  }

  /* ── Boot ── */
  function boot() {
    safe(initSmoothScroll, "smoothScroll");
    safe(initNav, "nav");
    safe(initMobileMenu, "mobileMenu");
    safe(initReveals, "reveals");
    safe(initCountUp, "countUp");
    safe(initServiceHover, "serviceHover");
    safe(initGSAP, "gsap");
    safe(initBookingForm, "bookingForm");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
