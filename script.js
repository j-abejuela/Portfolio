/* ============================================================
   JAVE N. ABEJUELA — PORTFOLIO SCRIPTS
   Typewriter, mobile nav, scroll animations, smooth scrolling
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- TYPEWRITER EFFECT ----------
  const typewriter = document.getElementById('typewriter');
  if (typewriter) {
    const phrases = [
      'Electronics Engineer',
      'IoT Developer',
      'Embedded Systems Enthusiast',
      'ML Integrator',
      'PCB Designer'
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const current = phrases[phraseIdx];
      if (isDeleting) {
        typewriter.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        typeSpeed = 40;
      } else {
        typewriter.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        typeSpeed = 100;
      }

      if (!isDeleting && charIdx === current.length) {
        typeSpeed = 1800;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        typeSpeed = 400;
      }

      setTimeout(type, typeSpeed);
    }

    setTimeout(type, 600);
  }

  // ---------- MOBILE NAV TOGGLE ----------
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    // Close mobile nav when a link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  }

  // ---------- NAVBAR SCROLL EFFECT ----------
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Highlight active nav link based on scroll position
      const sections = document.querySelectorAll('section[id]');
      let currentSection = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id');
        }
      });
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active-link');
        }
      });
    });
  }

  // ---------- SCROLL REVEAL (Intersection Observer) ----------
  const revealElements = document.querySelectorAll(
    '.section, .project-card, .cert-card, .exp-card, .timeline-item, .affil-item, .seminar-item, .skill-category'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    revealElements.forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ---------- SMOOTH SCROLL ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 72;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ---------- COUNTER ANIMATION ----------
  const highlightNumbers = document.querySelectorAll('.highlight-number');
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const targetText = el.textContent;
            const targetNum = parseInt(targetText.replace(/\D/g, ''));
            if (!isNaN(targetNum)) {
              animateCounter(el, targetNum, targetText.includes('+') ? '+' : '', 1500);
            }
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    highlightNumbers.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el, target, suffix, duration) {
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor((target - 0) * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ---------- FORM SUBMISSION ----------
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Message Sent! ✓';
      btn.style.background = '#00d4aa';
      btn.style.color = '#0a0f1a';
      btn.disabled = true;
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 3000);
    });
  }

  // ---------- PROJECT SLIDESHOW ----------
  const slideshowCards = document.querySelectorAll('.project-slideshow');

  slideshowCards.forEach(card => {
    const project = card.getAttribute('data-project');
    const imageCount = parseInt(card.getAttribute('data-image-count'), 10);
    const bg = card.querySelector('.slideshow-bg');
    if (!project || !imageCount || !bg) return;

    let currentIdx = 0;
    const images = [];

    // Preload all images
    for (let i = 1; i <= imageCount; i++) {
      const img = new Image();
      img.src = `projects/${project}/${i}.jpg`;
      images.push(img.src);
    }

    // Set first image
    bg.style.backgroundImage = `url(${images[0]})`;

    // Build dot indicators
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slideshow-dots';
    for (let i = 0; i < imageCount; i++) {
      const dot = document.createElement('span');
      dot.className = 'slideshow-dot';
      if (i === 0) dot.classList.add('active');
      dotsContainer.appendChild(dot);
    }
    card.appendChild(dotsContainer);
    const dots = dotsContainer.querySelectorAll('.slideshow-dot');

    // Cycle images
    function nextImage() {
      bg.classList.add('fade-out');
      dots[currentIdx].classList.remove('active');

      setTimeout(() => {
        currentIdx = (currentIdx + 1) % imageCount;
        bg.style.backgroundImage = `url(${images[currentIdx]})`;
        bg.classList.remove('fade-out');
        dots[currentIdx].classList.add('active');
      }, 800); // match CSS transition duration
    }

    // Change every 3.5 seconds
    let interval;
    if (imageCount > 1) {
      interval = setInterval(nextImage, 3500);
    }

    // Pause on hover
    card.addEventListener('mouseenter', () => clearInterval(interval));
    card.addEventListener('mouseleave', () => {
      if (imageCount > 1) {
        interval = setInterval(nextImage, 3500);
      }
    });
  });

});
