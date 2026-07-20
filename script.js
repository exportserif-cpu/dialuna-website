// ============================
// DİA LUNA — Language Switcher
// ============================

var currentLang = localStorage.getItem('dialuna-lang') || 'ar';

window.switchLanguage = function(lang) {
  currentLang = lang;
  localStorage.setItem('dialuna-lang', lang);
  
  const t = translations[lang];
  if (!t) return;
  
  // Update html tag direction
  document.documentElement.lang = lang === 'ar' ? 'ar' : (lang === 'tr' ? 'tr' : 'en');
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  // Update lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  // Translate by iterating through translation keys with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key].replace(/<[^>]*>/g, '');
      } else {
        el.innerHTML = t[key];
      }
    }
  });
  
  // Also do specific targeted translations for elements without data-i18n
  // Hero badge
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge && t['hero-badge']) heroBadge.innerHTML = t['hero-badge'];
  
  // Hero brand
  const heroBrand = document.querySelector('.hero-brand');
  if (heroBrand && t['hero-brand']) heroBrand.innerHTML = t['hero-brand'];
  
  // Products tagline
  const prodsTagline = document.querySelector('.products-tagline p');
  if (prodsTagline && t['products-tagline']) prodsTagline.innerHTML = t['products-tagline'];
}

// Listen for lang buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
  });
  
  // Apply stored language
  switchLanguage(currentLang);
});


// ============================
// DİA LUNA — Main Script
// ============================

document.addEventListener('DOMContentLoaded', () => {

  // ====== NAVBAR ======
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  });

  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  // ====== ACTIVE SECTION HIGHLIGHTING ======
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));

  // ====== PARTICLES ======
  const container = document.getElementById('heroParticles');
  if (container) {
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 3 + 1;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = (Math.random() * 60 + 10) + '%';
      particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particle.style.background = Math.random() > 0.6 
        ? '#E53935' 
        : '#C9A84C';
      particle.style.opacity = Math.random() * 0.4 + 0.1;
      container.appendChild(particle);
    }
  }

  // ====== COUNTER ANIMATION ======
  const countNumbers = () => {
    const stats = document.querySelectorAll('.stat-num');
    stats.forEach(stat => {
      const target = parseInt(stat.dataset.count);
      if (!target) return;
      
      const increment = target / 40;
      let current = 0;
      
      const updateCount = () => {
        current += increment;
        if (current < target) {
          stat.textContent = Math.ceil(current) + '+';
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = target + '+';
        }
      };
      
      updateCount();
    });
  };

  const visionCard = document.querySelector('.vision-card');
  if (visionCard) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countNumbers();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(visionCard);
  }

  // ====== REVEAL ANIMATIONS ======
  const revealElements = document.querySelectorAll(
    '.about-text, .vision-card, .product-showcase, .story-chapter, .contact-card, .contact-form, .gallery-item'
  );
  
  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ====== SMOOTH SCROLL ======
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ====== PRODUCT TABS ======
  const tabs = document.querySelectorAll('.product-tab');
  const tabContents = document.querySelectorAll('.product-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Show corresponding content
      const targetId = tab.dataset.tab;
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === 'tab-' + targetId) {
          content.classList.add('active');
        }
      });
    });
  });

  // ====== PRODUCT THUMBNAIL SWITCHING ======
  document.querySelectorAll('.product-thumbs').forEach(thumbContainer => {
    const thumbs = thumbContainer.querySelectorAll('.thumb');
    const mainImg = thumbContainer.closest('.product-showcase-images')
      ?.querySelector('.product-main-img img');

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        // Update active state
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');

        // Update main image
        if (mainImg) {
          mainImg.style.opacity = '0';
          setTimeout(() => {
            mainImg.src = thumb.dataset.src;
            mainImg.style.opacity = '1';
          }, 200);
        }

        // Update size cards in corresponding info section
        const size = thumb.dataset.size;
        const showcase = thumbContainer.closest('.product-showcase');
        if (showcase) {
          const sizeCards = showcase.querySelectorAll('.size-card');
          sizeCards.forEach(card => {
            card.classList.remove('active');
            if (card.dataset.size === size) {
              card.classList.add('active');
            }
          });
        }
      });
    });
  });

  // ====== SIZE CARD CLICKING ======
  document.querySelectorAll('.size-card').forEach(card => {
    card.addEventListener('click', () => {
      const showcase = card.closest('.product-showcase');
      if (!showcase) return;
      
      const size = card.dataset.size;
      
      // Update size cards
      const siblings = showcase.querySelectorAll('.size-card');
      siblings.forEach(s => s.classList.remove('active'));
      card.classList.add('active');
      
      // Update thumbnail
      const thumbs = showcase.querySelectorAll('.thumb');
      thumbs.forEach(t => {
        t.classList.remove('active');
        if (t.dataset.size === size) {
          t.classList.add('active');
          // Update main image
          const mainImg = showcase.querySelector('.product-main-img img');
          if (mainImg) {
            mainImg.style.opacity = '0';
            setTimeout(() => {
              mainImg.src = t.dataset.src;
              mainImg.style.opacity = '1';
            }, 200);
          }
        }
      });
    });
  });

  // ====== CONTACT FORM ======
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = '✓ تم الإرسال';
    btn.style.background = '#38a169';
    btn.style.color = 'white';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.color = '';
      form.reset();
    }, 3000);
  });

  // ====== PARALLAX ======
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroBrand = document.querySelector('.hero-brand');
    if (heroBrand && scrolled < window.innerHeight) {
      heroBrand.style.transform = `translateY(${scrolled * 0.15}px)`;
      heroBrand.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
    }
  });

  // ====== LIGHTBOX FOR GALLERY ======
  const galleryItems = document.querySelectorAll('.gallery-item img');
  galleryItems.forEach(img => {
    img.addEventListener('click', () => {
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(0,0,0,0.9);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      
      const cloned = img.cloneNode();
      cloned.style.cssText = `
        max-width: 90vw;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
      `;
      
      lightbox.appendChild(cloned);
      document.body.appendChild(lightbox);
      
      requestAnimationFrame(() => {
        lightbox.style.opacity = '1';
      });
      
      lightbox.addEventListener('click', () => {
        lightbox.style.opacity = '0';
        setTimeout(() => lightbox.remove(), 300);
      });
      
      document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
          lightbox.style.opacity = '0';
          setTimeout(() => lightbox.remove(), 300);
          document.removeEventListener('keydown', escHandler);
        }
      });
    });
  });

  // Trigger: auto-select first size card
  document.querySelectorAll('.product-tab-content.active').forEach(content => {
    const firstSize = content.querySelector('.size-card');
    if (firstSize) firstSize.classList.add('active');
  });
});


// ====== BANNER AUTO SLIDER - 5 seconds ======
(function() {
  function initAutoSlide() {
    var radios = document.querySelectorAll('input[name="hero"]');
    if (!radios || radios.length === 0) {
      setTimeout(initAutoSlide, 500);
      return;
    }
    var current = 0;
    setInterval(function() {
      radios[current].checked = false;
      current = (current + 1) % radios.length;
      radios[current].checked = true;
    }, 5000);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoSlide);
  } else {
    initAutoSlide();
  }
})();
