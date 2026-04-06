/* ========================================
   MOE'S SIDEKICKS TAEKWONDO - MAIN JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar scroll behavior ---
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- Mobile menu toggle ---
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navItems = navLinks.querySelectorAll('a[href^="#"]');

  function setActiveNav() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveNav);

  // --- Scroll-triggered fade-in animations ---
  const fadeElements = document.querySelectorAll('.fade-in');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => fadeObserver.observe(el));

  // --- Animated number counters ---
  const statNumbers = document.querySelectorAll('.hero-stat .number[data-count]');

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + (target > 5 ? '+' : '');

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numbers = entry.target.querySelectorAll('.number[data-count]');
        numbers.forEach(num => animateCount(num));
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  // --- Smooth scrolling for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const navHeight = navbar.offsetHeight;
        const targetPos = targetEl.offsetTop - navHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Contact form handling ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const data = {};
      formData.forEach((value, key) => { data[key] = value; });

      // Show confirmation (in production, send to backend)
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Message Sent!';
      btn.style.background = '#2D8C2D';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        this.reset();
      }, 3000);
    });
  }

  // --- Parallax-like effect on hero ---
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-content');
    if (hero) {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.15}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.6;
      }
    }
  });

  // --- Taegeuk rotation speed on scroll ---
  const taegeuk = document.querySelector('.hero-taegeuk');
  if (taegeuk) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      taegeuk.style.transform = `translateY(-50%) rotate(${scrolled * 0.1}deg)`;
    });
  }

  // --- Floating sparks/particles in hero ---
  const hero = document.querySelector('.hero');
  if (hero) {
    function createSpark() {
      const spark = document.createElement('div');
      spark.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: ${Math.random() > 0.5 ? 'rgba(205,46,58,0.6)' : 'rgba(0,71,160,0.6)'};
        border-radius: 50%;
        pointer-events: none;
        left: ${Math.random() * 100}%;
        bottom: -5px;
        z-index: 1;
        box-shadow: 0 0 ${Math.random() * 6 + 2}px currentColor;
      `;
      hero.appendChild(spark);

      const duration = Math.random() * 4000 + 3000;
      const xDrift = (Math.random() - 0.5) * 200;

      spark.animate([
        { transform: 'translateY(0) translateX(0)', opacity: 0 },
        { opacity: 0.8, offset: 0.1 },
        { opacity: 0.6, offset: 0.7 },
        { transform: `translateY(-${window.innerHeight}px) translateX(${xDrift}px)`, opacity: 0 }
      ], { duration, easing: 'ease-out' });

      setTimeout(() => spark.remove(), duration);
    }

    // Spawn sparks periodically
    setInterval(createSpark, 300);
    // Initial burst
    for (let i = 0; i < 8; i++) setTimeout(createSpark, i * 100);
  }

  // --- Typed effect on hero motto ---
  const motto = document.querySelector('.hero-motto');
  if (motto) {
    motto.style.opacity = '1';
  }

  // --- Navbar background blur enhancement ---
  const navbarEl = document.getElementById('navbar');
  if (navbarEl) {
    navbarEl.style.backdropFilter = 'blur(0px)';
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbarEl.style.backdropFilter = 'blur(12px)';
      } else {
        navbarEl.style.backdropFilter = 'blur(0px)';
      }
    });
  }

});
