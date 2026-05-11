document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const links = document.querySelectorAll('a, button, .portfolio-item, .filter-btn');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        link.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Sticky Navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Portfolio Data Loading
    let portfolioData = [];
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    const renderPortfolio = (filter = 'all') => {
        if (!portfolioGrid) return;
        portfolioGrid.innerHTML = '';
        
        const filteredData = filter === 'all' 
            ? portfolioData 
            : portfolioData.filter(item => item.category === filter);

        filteredData.forEach(item => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = `portfolio-item ${item.category} reveal active`;
            portfolioItem.innerHTML = `
                <img src="${item.image}" alt="${item.alt}" loading="lazy" class="lazy-image">
                <div class="portfolio-overlay">
                    <span>${item.alt}</span>
                </div>
            `;
            portfolioGrid.appendChild(portfolioItem);

            const img = portfolioItem.querySelector('img');
            img.onload = () => {
                img.classList.add('loaded');
            };

            portfolioItem.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            portfolioItem.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    };

    // Fetch and Initialize Portfolio
    fetch('portfolio.json')
        .then(response => response.json())
        .then(data => {
            portfolioData = data;
            renderPortfolio('wedding'); // Default to wedding instead of all
        })
        .catch(error => console.error('Error loading portfolio data:', error));

    // Portfolio Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            renderPortfolio(filter);
        });
    });

    // Stat Counters
    const stats = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats');
    let started = false;

    const countUp = (el) => {
        const target = +el.getAttribute('data-target');
        const count = +el.innerText;
        const speed = 200;
        const inc = target / speed;

        if (count < target) {
            el.innerText = Math.ceil(count + inc);
            setTimeout(() => countUp(el), 1);
        } else {
            el.innerText = target + (target === 500 || target === 1200 ? '+' : '');
        }
    };

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !started) {
            stats.forEach(stat => countUp(stat));
            started = true;
        }
    }, { threshold: 0.5 });

    if (statsSection) statsObserver.observe(statsSection);

    // Testimonials Slider
    const track = document.querySelector('.testimonial-track');
    const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
    const dots = Array.from(document.querySelectorAll('.dot'));
    let currentSlide = 0;

    const updateSlider = (index) => {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        currentSlide = index;
    };

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => updateSlider(index));
    });

    // Auto slide every 5 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider(currentSlide);
    }, 5000);

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-active');
        menuToggle.classList.toggle('active');
        
        if (navLinks.classList.contains('mobile-active')) {
            navLinks.style.display = 'flex';
            navLinks.style.position = 'fixed';
            navLinks.style.top = '0';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.height = '100vh';
            navLinks.style.backgroundColor = 'var(--bg-primary)';
            navLinks.style.flexDirection = 'column';
            navLinks.style.justifyContent = 'center';
            navLinks.style.alignItems = 'center';
            navLinks.style.zIndex = '999';
            document.body.style.overflow = 'hidden';
        } else {
            navLinks.style.display = '';
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu on link click
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('mobile-active');
            menuToggle.classList.remove('active');
            navLinks.style.display = '';
            document.body.style.overflow = '';
        });
    });

    // Contact Form Submission (Mock)
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerText;
        
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Thank you! Your message has been sent successfully.');
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
            contactForm.reset();
        }, 2000);
    });
});
