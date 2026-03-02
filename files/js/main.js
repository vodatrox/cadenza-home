/* ==========================================================================
   Cadenza HR Consulting — Main JavaScript
   Vanilla JS, no dependencies.
   ========================================================================== */

(function () {
  'use strict';

  // --- Sticky Header ---
  var header = document.getElementById('header');
  function handleScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Mobile Menu ---
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  var overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    navToggle.classList.add('active');
    navMenu.classList.add('open');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', function () {
    navMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on overlay tap
  overlay.addEventListener('click', closeMenu);

  // Close on link tap
  navMenu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close menu on resize to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // --- Smooth Scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = header.offsetHeight + 20;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // --- Scroll Reveal (with IntersectionObserver for performance) ---
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers: show everything
    reveals.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- Contact Form Handler (Formspree) ---
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          btn.textContent = 'Message Sent!';
          btn.style.background = '#16a34a';
          form.reset();
        } else {
          btn.textContent = 'Failed — Try Again';
          btn.style.background = '#dc2626';
        }
        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }).catch(function () {
        btn.textContent = 'Network Error';
        btn.style.background = '#dc2626';
        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      });
    });
  }
})();
