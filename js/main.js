/* ============================================================
   PSISTANEK PIĘKNA — Main JS
   Advanced interactions, animations, and effects
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== PRELOADER =====
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    });
    // Fallback: hide after 3s regardless
    setTimeout(() => preloader.classList.add('hidden'), 3000);


    // ===== NAVBAR =====
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    function handleNavScroll() {
        const y = window.scrollY;
        nav.classList.toggle('nav--solid', y > 80);
        lastScroll = y;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();


    // ===== HAMBURGER & MOBILE MENU =====
    const hamburger = document.querySelector('.nav__hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }


    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = nav.offsetHeight + 10;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    // ===== HIGHLIGHT TODAY IN HOURS =====
    const dayMap = [6, 0, 1, 2, 3, 4, 5]; // JS Sunday=0, our rows: Mon=0
    const today = new Date().getDay();
    const todayIdx = dayMap[today];
    const hoursRows = document.querySelectorAll('.hours-row');
    if (hoursRows[todayIdx]) {
        hoursRows[todayIdx].classList.add('hours-row--today');
    }


    // ===== FLOATING PAW PARTICLES =====
    const particleContainer = document.querySelector('.hero__particles');
    if (particleContainer) {
        const paws = ['🐾', '🐾', '🐾', '✨', '💖'];
        function spawnPaw() {
            const el = document.createElement('span');
            el.className = 'paw-particle';
            el.textContent = paws[Math.floor(Math.random() * paws.length)];
            el.style.left = Math.random() * 100 + '%';
            el.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
            el.style.animationDuration = (8 + Math.random() * 12) + 's';
            el.style.animationDelay = Math.random() * 2 + 's';
            particleContainer.appendChild(el);

            setTimeout(() => el.remove(), 22000);
        }

        // Initial burst
        for (let i = 0; i < 8; i++) setTimeout(spawnPaw, i * 400);
        // Continuous
        setInterval(spawnPaw, 2200);
    }


    // ===== SCROLL REVEAL =====
    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // ===== LIGHTBOX =====
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox__img');
    const lightboxClose = document.querySelector('.lightbox__close');

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('lightbox--active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('lightbox--active');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.gallery__item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) openLightbox(img.src);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });


    // ===== COUNTER ANIMATION (About badge) =====
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    function animateCounter(el) {
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }


    // ===== PARALLAX on hero background =====
    const heroBg = document.querySelector('.hero__bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                heroBg.style.transform = `scale(${1 + y * 0.0002}) translateY(${y * 0.15}px)`;
            }
        }, { passive: true });
    }


    // ===== TILT EFFECT on service cards =====
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `translateY(-8px) perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }


    // ===== NAV ACTIVE LINK HIGHLIGHT =====
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav__link[href^="#"]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinksAll.forEach(link => {
                    link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--accent)' : '';
                });
            }
        });
    }, { threshold: 0.2, rootMargin: '-100px 0px -50% 0px' });

    sections.forEach(s => sectionObserver.observe(s));

});
