/* ================================================
   MAIN.JS — Menu mobile, Navbar, Animações, Contadores, Carrossel
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR =====
  const header = document.querySelector('.header');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuBackdrop = document.querySelector('.menu-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');

  // Navbar scroll behavior (transparente apenas na home)
  function handleScroll() {
    if (!header) return;
    if (header.classList.contains('transparent')) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
        header.classList.remove('transparent');
      } else {
        header.classList.remove('scrolled');
        header.classList.add('transparent');
      }
    }
    // Back to top
    handleBackToTop();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ===== MENU MOBILE =====
  function openMenu() {
    if (!hamburger || !mobileMenu || !menuBackdrop) return;
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    menuBackdrop.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!hamburger || !mobileMenu || !menuBackdrop) return;
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    menuBackdrop.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (menuBackdrop) {
    menuBackdrop.addEventListener('click', closeMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fechar menu com Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // ===== ACTIVE NAV LINK =====
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-menu-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  // ===== SCROLL ANIMATIONS (Intersection Observer) =====
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  function observeAnimations() {
    document.querySelectorAll('.animate-on-scroll:not(.visible)').forEach(el => {
      scrollObserver.observe(el);
    });
  }

  observeAnimations();

  // Expor globalmente para blog.js e post.js usarem após injeção dinâmica
  window.observeAnimations = observeAnimations;

  // ===== COUNTERS =====
  const counters = document.querySelectorAll('.counter-number[data-target]');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(timestamp) {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.innerHTML = current.toLocaleString('pt-BR') + `<span class="suffix">${suffix}</span>`;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // ===== CARROSSEL DE DEPOIMENTOS =====
  const carousel = document.querySelector('.carousel-track');
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentSlide = 0;
    let autoplayInterval;
    const totalSlides = slides.length;

    // Criar dots
    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });
    }

    function goToSlide(index) {
      currentSlide = (index + totalSlides) % totalSlides;
      carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
      document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); stopAutoplay(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); stopAutoplay(); startAutoplay(); });

    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
      carouselWrapper.addEventListener('mouseenter', stopAutoplay);
      carouselWrapper.addEventListener('mouseleave', startAutoplay);
    }

    startAutoplay();
  }

  // ===== BACK TO TOP =====
  const backToTop = document.querySelector('.back-to-top');

  function handleBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== FAQ ACCORDION =====
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Fechar todos
        faqItems.forEach(i => i.classList.remove('open'));
        // Abrir o clicado (se não estava aberto)
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  // ===== SMOOTH SCROLL PARA ANCHORS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
