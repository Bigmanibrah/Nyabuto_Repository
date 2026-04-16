document.addEventListener('DOMContentLoaded', () => {

  // 1. Preloader
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    if(preloader) {
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }, 500);
    }
  });

  // 2. Navbar
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      if(navbar) navbar.classList.add('scrolled');
      if(backToTop) backToTop.classList.add('visible');
    } else {
      if(navbar) navbar.classList.remove('scrolled');
      if(backToTop) backToTop.classList.remove('visible');
    }
    
    // Active link highlighting
    let current = '';
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinkItems.forEach(link => {
      link.classList.remove('active');
      if (current && link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  if(hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      if(navLinks) navLinks.classList.toggle('active');
    });
  }

  // Smooth scroll and close menu
  navLinkItems.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        if(hamburger) hamburger.classList.remove('active');
        if(navLinks) navLinks.classList.remove('active');
        const targetId = document.querySelector(href);
        if(targetId){
          window.scrollTo({
            top: targetId.offsetTop - (navbar ? navbar.offsetHeight : 0),
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Back to Top functionality
  if(backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
         top: 0,
         behavior: 'smooth'
      });
    });
  }

  // 4. Hero Stats Animation
  const stats = document.querySelectorAll('.stat-num');
  let hasAnimated = false;

  const animateStats = () => {
    stats.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const duration = 2000;
      const increment = target / (duration / 16); 
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          stat.innerText = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          stat.innerText = target;
        }
      };
      updateCounter();
    });
  };

  const observerOptions = {
    threshold: 0.5
  };
  
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        animateStats();
        hasAnimated = true;
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  stats.forEach(stat => {
    statsObserver.observe(stat);
  });

  // 5. Gallery Filters
  const galleryFilters = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 6. Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxPrev = document.getElementById('lightbox-prev');
  
  let currentImageIndex = 0;
  let visibleImages = [];

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      visibleImages = Array.from(galleryItems).filter(i => i.style.display !== 'none');
      currentImageIndex = visibleImages.indexOf(item);
      showLightboxImage(currentImageIndex);
      if(lightbox) lightbox.classList.add('active');
    });
  });

  const showLightboxImage = (index) => {
    if(visibleImages.length === 0 || !lightboxImg) return;
    const item = visibleImages[index];
    const img = item.querySelector('img');
    const captionEl = item.querySelector('.gallery-caption h4');
    const caption = captionEl ? captionEl.innerText : '';
    lightboxImg.src = img.src;
    if(lightboxCaption) lightboxCaption.innerText = caption;
  };

  if(lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  if(lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
      showLightboxImage(currentImageIndex);
    });
  }

  if(lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
      showLightboxImage(currentImageIndex);
    });
  }

  if(lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
         lightbox.classList.remove('active');
      }
    });
  }

  // 7. Video Modal
  window.openVideoModal = (src, title) => {
    const modal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video');
    const modalSource = document.getElementById('modal-source');
    const modalTitle = document.getElementById('modal-title');
    
    if(modalTitle) modalTitle.innerText = title;
    if(modalSource) modalSource.src = src;
    if(modalVideo) modalVideo.load();
    if(modal) modal.classList.add('active');
    if(modalVideo) modalVideo.play().catch(e => console.log('Autoplay blocked:', e));
  };

  const videoModal = document.getElementById('video-modal');
  const videoModalClose = document.getElementById('modal-close');
  const modalVideo = document.getElementById('modal-video');

  if(videoModalClose) {
    videoModalClose.addEventListener('click', () => {
      if(videoModal) videoModal.classList.remove('active');
      if(modalVideo) modalVideo.pause();
    });
  }
  
  if(videoModal) {
    videoModal.addEventListener('click', (e) => {
      if(e.target === videoModal) {
        videoModal.classList.remove('active');
        if(modalVideo) modalVideo.pause();
      }
    });
  }

  // 8. Files Filtering
  const fileCategories = document.querySelectorAll('.file-cat-btn');
  const fileCards = document.querySelectorAll('.file-card');
  const searchInput = document.getElementById('file-search');
  const noFilesMsg = document.getElementById('no-files-msg');

  fileCategories.forEach(btn => {
    btn.addEventListener('click', () => {
      if(btn.id === 'filter-all' || !btn.hasAttribute('data-cat')) return; // ignore gallery filters if any mixing
      fileCategories.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      filterFiles(cat, searchInput ? searchInput.value.toLowerCase() : '');
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeCatBtn = document.querySelector('.file-cat-btn.active');
      const activeCat = activeCatBtn ? activeCatBtn.getAttribute('data-cat') : 'all';
      filterFiles(activeCat, e.target.value.toLowerCase());
    });
  }

  const filterFiles = (category, searchTerm) => {
    let visibleCount = 0;
    fileCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const titleEl = card.querySelector('.file-name');
      const title = titleEl ? titleEl.innerText.toLowerCase() : '';
      const contentEl = card.querySelector('.file-desc-full');
      const content = contentEl ? contentEl.innerText.toLowerCase() : '';
      
      const matchesCategory = category === 'all' || !category || cardCategory === category;
      const matchesSearch = title.includes(searchTerm) || content.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex'; // It matches flex in CSS
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
        card.style.display = 'none';
      }
    });
    
    if (noFilesMsg) {
      noFilesMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };
  
  // Initial file setup based on active category
  const initialActiveCat = document.querySelector('.file-cat-btn.active');
  if(initialActiveCat) {
      filterFiles(initialActiveCat.getAttribute('data-cat'), '');
  }

  // 9. Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      if (document.body.classList.contains('light-mode')) {
        if(sunIcon) sunIcon.style.display = 'none';
        if(moonIcon) moonIcon.style.display = 'inline';
      } else {
        if(sunIcon) sunIcon.style.display = 'inline';
        if(moonIcon) moonIcon.style.display = 'none';
      }
    });
  }

});
