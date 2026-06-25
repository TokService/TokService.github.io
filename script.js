document.addEventListener('DOMContentLoaded', () => {
    /* 
    ==============================================
       Header Scroll Effect
    ==============================================
    */
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* 
    ==============================================
       Mobile Menu Toggle
    ==============================================
    */
    const burgerMenu = document.getElementById('burger-menu');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    /* 
    ==============================================
       Smooth Scroll for Anchor Links
    ==============================================
    */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* 
    ==============================================
       Scroll Animations (Intersection Observer)
    ==============================================
    */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => observer.observe(el));

    /* 
    ==============================================
       Language Modal & Switcher Logic
    ==============================================
    */
    const langModal = document.getElementById('langModal');
    const currentPath = window.location.pathname;
    const isKzPage = currentPath.endsWith('kz.html');
    const actualLang = isKzPage ? 'kz' : 'ru';
    
    const savedLang = localStorage.getItem('langSelected');

    if (!savedLang) {
        // Первый заход на сайт
        if (langModal) {
            langModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    } else {
        // Если язык сохранен, проверяем, нужно ли сделать редирект
        // Если пользователь зашел по прямой ссылке на другой язык, 
        // но в localStorage сохранен другой, делаем редирект один раз.
        // Чтобы не было вечного цикла, мы обновляем localStorage при клике на ссылки-переключатели.
        if (savedLang === 'kz' && actualLang === 'ru') {
            window.location.href = 'kz.html';
        } else if (savedLang === 'ru' && actualLang === 'kz') {
            window.location.href = 'index.html';
        }
    }

    // Обработка клика в модальном окне
    document.querySelectorAll('.btn-lang').forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            localStorage.setItem('langSelected', target);
            
            if (target === actualLang) {
                langModal.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                window.location.href = target === 'kz' ? 'kz.html' : 'index.html';
            }
        });
    });

    // Обработка клика по ссылкам в шапке
    document.querySelectorAll('.lang-switcher .lang-link').forEach(link => {
        link.addEventListener('click', function() {
            const target = this.getAttribute('href') === 'kz.html' ? 'kz' : 'ru';
            localStorage.setItem('langSelected', target);
        });
    });

    /* 
    ==============================================
       WhatsApp Form Submission
    ==============================================
    */
    const leadForm = document.getElementById('leadForm');
    if(leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = leadForm.querySelectorAll('input');
            const name = inputs[0].value.trim();
            const phone = inputs[1].value.trim();
            const problem = leadForm.querySelector('textarea').value.trim();
            
            let message = '';
            
            if (actualLang === 'kz') {
                message = `Сәлеметсіз бе! Консультация алғым келеді.\n\nМенің атым: ${name}\nМенің телефоным: ${phone}`;
                if (problem) {
                    message += `\nНе бұзылды: ${problem}`;
                }
            } else {
                message = `Здравствуйте! Хочу получить консультацию.\n\nМеня зовут: ${name}\nМой телефон: ${phone}`;
                if (problem) {
                    message += `\nЧто сломалось: ${problem}`;
                }
            }
            
            const whatsappNumber = '77051450826';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
            leadForm.reset();
        });
    }
});
