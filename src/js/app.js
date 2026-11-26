
(function () {
  'use strict';

  // Enable progressive enhancement for animations
  document.documentElement.classList.add('js-enabled');

  /* ---------- CONFIG ---------- */
  var config = {
    contact: {
      whatsapp: '6283806935439',
      email: 'info@visiagromakmur.com',
      phone: '+62 838 0693 5439',
      address: 'Jl. Raya Villa Regensi II Blok Fb 1 No.14, Kuta Jaya, Pasar Kemis, Tangerang',
      mapUrl: 'https://www.google.com/maps?q=Jl.%20Raya%20Villa%20Regensi%20II%20Blok%20Fb%201%20No.14,%20Pasar%20Kemis,%20Tangerang'
    },
    social: { instagram: '', facebook: '', linkedin: '', youtube: '' },
    animation: {
      revealThreshold: 0.15,
      revealDelay: 100,
      scrollSpyThreshold: 100,
      navbarScrollThreshold: 50
    },
    performance: { debounceDelay: 20, throttleDelay: 100, imageLazyLoadThreshold: 50 },
    ui: { mobileBreakpoint: 768, tabletBreakpoint: 1024, desktopBreakpoint: 1280 }
  };

  /* ---------- HELPERS ---------- */
  function debounce(func, wait) {
    var timeout;
    return function () {
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () { func.apply(null, args); }, wait);
    };
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function smoothScroll(target, offset) {
    offset = offset || 0;
    var element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;
    var elementPosition = element.getBoundingClientRect().top;
    var offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }

  function addClass(el, className) { if (el) el.classList.add(className); }
  function removeClass(el, className) { if (el) el.classList.remove(className); }
  function toggleClass(el, className, force) { if (el) el.classList.toggle(className, force); }

  /* ---------- NAVIGATION ---------- */
  function Navigation() {
    this.navbar = document.querySelector('.navbar');
    this.menuToggle = document.getElementById('menu-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.backdrop = document.getElementById('backdrop');
    this.isOpen = false;
    // Capture navigation links container for later active state updates
    this.navLinks = this.navbar ? this.navbar.querySelector('.nav-links') : null;
    this.init();
  }

  Navigation.prototype.init = function () {
    if (!this.navbar) return;
    this.bindEvents();
    this.handleScroll();
  };

  Navigation.prototype.bindEvents = function () {
    var self = this;

    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', function (e) {
        self.toggleMobileMenu();
      });
    }
    if (this.backdrop) {
      this.backdrop.addEventListener('click', function () { self.closeMobileMenu(); });
    }
    if (this.navMenu) {
      this.navMenu.addEventListener('click', function (e) { self.handleNavClick(e); });
    }

    var debouncedScroll = debounce(function () { self.handleScroll(); }, config.animation.navbarScrollThreshold);
    window.addEventListener('scroll', debouncedScroll);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') self.closeMobileMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= config.ui.mobileBreakpoint) self.closeMobileMenu();
    });
  };

  Navigation.prototype.toggleMobileMenu = function () {
    this.isOpen ? this.closeMobileMenu() : this.openMobileMenu();
  };

  Navigation.prototype.openMobileMenu = function () {
    this.isOpen = true;
    addClass(this.navbar, 'menu-open');
    addClass(this.navMenu, 'show');
    addClass(this.backdrop, 'show');
    addClass(this.menuToggle, 'active');
    document.body.style.overflow = 'hidden';

    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) document.body.style.paddingRight = scrollbarWidth + 'px';

    if (this.menuToggle) {
      this.menuToggle.setAttribute('aria-expanded', 'true');
      this.menuToggle.focus();
    }
  };

  Navigation.prototype.closeMobileMenu = function () {
    this.isOpen = false;
    removeClass(this.navbar, 'menu-open');
    removeClass(this.navMenu, 'show');
    removeClass(this.backdrop, 'show');
    removeClass(this.menuToggle, 'active');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    if (this.menuToggle) this.menuToggle.setAttribute('aria-expanded', 'false');
  };

  Navigation.prototype.handleNavClick = function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    e.preventDefault();
    var href = link.getAttribute('href');
    var target = document.querySelector(href);
    if (!target) return;

    var wasOpen = this.isOpen;
    this.closeMobileMenu();

    var navbarHeight = this.navbar.offsetHeight;
    var offset = navbarHeight + 20;

    setTimeout(function () { smoothScroll(target, offset); }, wasOpen ? 300 : 0);
    this.updateActiveNavigation(href);
  };

  Navigation.prototype.handleScroll = function () {
    var scrolled = window.scrollY > config.animation.navbarScrollThreshold;
    toggleClass(this.navbar, 'scrolled', scrolled);
    this.updateScrollSpy();
  };

  Navigation.prototype.updateActiveNavigation = function (currentSection) {
    if (!this.navLinks) return;
    var links = this.navLinks.querySelectorAll('a');
    links.forEach(function (link) {
      removeClass(link, 'active');
      if (link.getAttribute('href') === currentSection) addClass(link, 'active');
    });
  };

  Navigation.prototype.updateScrollSpy = function () {
    if (!this.navLinks) return;
    var sections = document.querySelectorAll('section[id]');
    var links = this.navLinks.querySelectorAll('a');
    var current = '';
    var navbarHeight = this.navbar.offsetHeight;

    sections.forEach(function (section) {
      var sectionTop = section.offsetTop - navbarHeight - config.animation.scrollSpyThreshold;
      var sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(function (link) {
      removeClass(link, 'active');
      if (link.getAttribute('href') === '#' + current) addClass(link, 'active');
    });
  };

  /* ---------- ANIMATIONS ---------- */
  function Animations() {
    this.observers = [];
    this.init();
  }

  Animations.prototype.init = function () {
    if (prefersReducedMotion()) {
      this.disableAnimations();
      return;
    }
    this.initRevealAnimations();
    this.initLoadingScreen();
    this.initBackToTop();
  };

  Animations.prototype.disableAnimations = function () {
    document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-stagger').forEach(function (el) {
      el.classList.add('active');
    });
    this.initLoadingScreen();
  };

  Animations.prototype.initRevealAnimations = function () {
    var targets = document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-stagger');
    if (!targets.length) return;

    var options = { root: null, rootMargin: '0px', threshold: config.animation.revealThreshold };
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    targets.forEach(function (target) { observer.observe(target); });
    this.observers.push(observer);
  };

  Animations.prototype.initLoadingScreen = function () {
    var loadingScreen = document.querySelector('.loading-screen');
    if (!loadingScreen) return;

    function hide() {
      loadingScreen.classList.add('loading-screen--hidden');
      setTimeout(function () { loadingScreen.style.display = 'none'; }, 500);
    }

    if (document.readyState === 'complete') {
      setTimeout(hide, 300);
    } else {
      window.addEventListener('load', function () { setTimeout(hide, 300); });
    }
  };

  Animations.prototype.initBackToTop = function () {
    var backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', function () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 300) {
        backToTop.classList.add('back-to-top--visible');
      } else {
        backToTop.classList.remove('back-to-top--visible');
      }
    });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  /* ---------- LAZY IMAGE FADE-IN (JS enhancement; CSS already
     guarantees visibility on its own — see _performance.css) ---------- */
  function initLazyImages() {
    var lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(function (img) {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', function () { img.classList.add('loaded'); });
        img.addEventListener('error', function () { img.classList.add('loaded'); });
      }
    });
  }

  /* ---------- APP ---------- */
  function App() {
    this.navigation = null;
    this.animations = null;
    this.init();
  }

  App.prototype.init = function () {
    var self = this;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { self.initializeModules(); });
    } else {
      this.initializeModules();
    }

    this.initHeroBackground();
    this.initProductFilter();
    this.initContactForm();
    this.initStatsCounter();
    initLazyImages();
  };

  App.prototype.initializeModules = function () {
    this.navigation = new Navigation();
    this.animations = new Animations();
  };

  App.prototype.initProductFilter = function () {
    var filterChips = document.querySelectorAll('.filter-chip');
    var productCards = document.querySelectorAll('.card--product');
    if (!filterChips.length || !productCards.length) return;

    filterChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var filter = chip.dataset.filter;

        filterChips.forEach(function (c) {
          c.classList.remove('filter-chip--active');
          c.setAttribute('aria-selected', 'false');
        });
        chip.classList.add('filter-chip--active');
        chip.setAttribute('aria-selected', 'true');

        productCards.forEach(function (card) {
          var category = card.dataset.category;
          var shouldShow = filter === 'all' || category === filter;
          if (shouldShow) {
            card.style.display = '';
            card.style.opacity = '0';
            setTimeout(function () { card.style.opacity = '1'; }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  };

  App.prototype.initContactForm = function () {
    var self = this;
    var form = document.getElementById('formContact');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nama = document.getElementById('contactNama').value.trim();
      var telepon = document.getElementById('contactTelepon').value.trim() || 'Tidak diisi';
      var pesan = document.getElementById('contactPesan').value.trim();

      /* Restore field validation (name >= 3 chars, message >= 10 chars).
         This matched the HTML `required` attributes' intent but was
         missing here, so a name/message of just whitespace or 1-2
         characters silently passed straight through to WhatsApp. */
      if (nama.length < 3) {
        self.showNotification('Nama harus diisi dengan minimal 3 karakter', 'error');
        return;
      }
      if (pesan.length < 10) {
        self.showNotification('Pesan harus diisi dengan minimal 10 karakter', 'error');
        return;
      }

      /* Build the message with each field run through encodeURIComponent.
         Previously the raw field values were concatenated straight into
         the URL query string: any "&", "%", "#" or newline the visitor
         typed (very plausible in a free-text "Pesan" field) would either
         corrupt the wa.me URL or get silently dropped by WhatsApp, so the
         business could receive a truncated or malformed message. */
      var messageBody = 'Halo Admin PT Visi Agro Makmur,\n\nSaya ingin menghubungi Anda:\n\n' +
        'Nama: ' + nama + '\nTelepon: ' + telepon +
        '\n\nPesan:\n' + pesan;

      var whatsappUrl = 'https://wa.me/' + config.contact.whatsapp + '?text=' + encodeURIComponent(messageBody);

      window.open(whatsappUrl, '_blank', 'noopener');
      form.reset();
      self.showNotification('Pesan berhasil dikirim! Anda akan diarahkan ke WhatsApp.', 'success');
    });
  };

  App.prototype.initStatsCounter = function () {
    var self = this;
    var statNumbers = document.querySelectorAll('.stat-item__number[data-count]');
    if (!statNumbers.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          var count = parseInt(target.dataset.count, 10);
          /* Was: target.textContent.replace(/[0-9]/g, ''). That strips every
             digit, including ones that are part of the suffix itself (e.g.
             the initial text "0/7" has its "7" stripped too, leaving just
             "/" and producing "24/" instead of "24/7"). Only the leading
             placeholder digits (the "0" in "0+", "0/7", etc.) should be
             stripped, so match/remove just the leading run of digits. */
          var suffix = target.textContent.replace(/^[0-9]+/, '');
          self.animateCounter(target, count, suffix);
          observer.unobserve(target);
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.5 });

    statNumbers.forEach(function (stat) { observer.observe(stat); });
  };

  App.prototype.animateCounter = function (element, target, suffix) {
    suffix = suffix || '';
    var current = 0;
    var increment = target / 50;
    var duration = 2000;
    var stepTime = duration / 50;

    var timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        element.textContent = target + suffix;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + suffix;
      }
    }, stepTime);
  };

  App.prototype.initHeroBackground = function () {
    var heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    /* Relative path: resolves correctly whether the page is opened from a
       web server or straight off disk, unlike the old "/img/..." absolute
       path which only worked when the site was hosted at a domain root. */
    var imageUrl = 'img/fotoweb1.jpg';
    /* Resolve to an absolute URL (relative to the document, not the
       stylesheet) before handing it to url(). CSS custom properties resolve
       relative url()s against the stylesheet that CONSUMES the variable
       (main.css, once _hero.css is @imported into it) rather than the page
       itself, so a plain relative path here can 404 even though `img.src`
       below loads fine. Using an absolute href sidesteps that ambiguity
       while still working from a web server or straight off disk. */
    var absoluteImageUrl = new URL(imageUrl, document.baseURI).href;
    var img = new Image();

    img.onload = function () {
      heroSection.style.setProperty('--hero-bg-image', "url('" + absoluteImageUrl + "')");
      heroSection.classList.add('bg-loaded');
    };

    img.onerror = function () {
      heroSection.style.setProperty('--hero-bg-image', 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)');
      heroSection.classList.add('bg-loaded');
    };

    img.src = imageUrl;
    // NOTE: bg-loaded hanya ditambah di dalam onload/onerror,
    // bukan di sini, agar CSS variable sudah di-set sebelum opacity dinaikkan.
  };

  App.prototype.showNotification = function (message, type) {
    type = type || 'info';
    var notification = document.createElement('div');
    notification.className = 'notification notification--' + type;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');

    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '16px 24px',
      borderRadius: '12px',
      color: 'white',
      fontWeight: '500',
      zIndex: '9999',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      backgroundColor: type === 'success' ? '#10B981' : '#3B82F6',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px'
    });

    document.body.appendChild(notification);

    setTimeout(function () { notification.style.transform = 'translateX(0)'; }, 100);
    setTimeout(function () {
      notification.style.transform = 'translateX(100%)';
      setTimeout(function () {
        if (notification.parentNode) notification.parentNode.removeChild(notification);
      }, 300);
    }, 4000);
  };

  new App();
})();
