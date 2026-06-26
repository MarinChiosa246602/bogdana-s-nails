document.addEventListener('DOMContentLoaded', () => {
    // 1. LOADING SCREEN
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.remove(), 500);
        }, 1500);
    }

    // 2. NAVBAR & SMOOTH SCROLL
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const scrollTopBtn = document.getElementById('scroll-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll to top button
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 3. PARTICLE SYSTEM
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 80;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = `rgba(255, 45, 138, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Connect particles
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 45, 138, ${0.1 - distance/1000})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // 4. SCROLL ANIMATIONS & COUNTERS
    const revealElements = document.querySelectorAll('.reveal');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animate stats if we hit the hero-stats section
                if (entry.target.classList.contains('hero-stats') && !animatedStats) {
                    animatedStats = true;
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'));
                        const suffix = stat.getAttribute('data-suffix') || '';
                        animateCounter(stat, target, suffix, 2000);
                    });
                }
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    function animateCounter(el, target, suffix, duration) {
        let start = 0;
        const increment = target / (duration / 16); // 60fps
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                clearInterval(timer);
                el.innerText = target + suffix;
            } else {
                el.innerText = Math.ceil(start) + suffix;
            }
        }, 16);
    }

    // 5. GALLERY FILTER & LIGHTBOX
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });

    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');

    if (lightboxModal) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('img').src;
                lightboxImg.src = imgSrc;
                lightboxModal.classList.add('active');
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightboxModal.classList.remove('active');
        });

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
            }
        });
    }

    // 6. BEFORE/AFTER SLIDER
    const baSlider = document.getElementById('ba-slider');
    const baBefore = document.getElementById('ba-before');
    const baHandle = document.getElementById('ba-handle');
    let isDragging = false;

    if (baSlider && baBefore && baHandle) {
        const setHandlePosition = (clientX) => {
            const rect = baSlider.getBoundingClientRect();
            let x = clientX - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            const percentage = (x / rect.width) * 100;
            
            baHandle.style.left = `${percentage}%`;
            baBefore.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
        };

        baHandle.addEventListener('mousedown', () => isDragging = true);
        baHandle.addEventListener('touchstart', () => isDragging = true, {passive: true});
        
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('touchend', () => isDragging = false);
        
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            setHandlePosition(e.clientX);
        });
        
        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            setHandlePosition(e.touches[0].clientX);
        }, {passive: true});
    }

    // 7. TESTIMONIALS CAROUSEL
    const track = document.getElementById('testimonials-track');
    if (track) {
        let index = 0;
        const cards = track.querySelectorAll('.testimonial-card');
        const totalCards = cards.length;
        let cardWidth = cards[0].offsetWidth + 30; // Including margin
        let autoScrollInterval;

        window.addEventListener('resize', () => {
            cardWidth = cards[0].offsetWidth + 30;
        });

        function moveCarousel() {
            index++;
            if (index >= totalCards - 1) { // Basic loop, could be improved with cloneNode for infinite
                index = 0;
            }
            track.style.transform = `translateX(-${index * cardWidth}px)`;
        }

        function startCarousel() {
            autoScrollInterval = setInterval(moveCarousel, 4000);
        }

        function stopCarousel() {
            clearInterval(autoScrollInterval);
        }

        startCarousel();
        track.addEventListener('mouseenter', stopCarousel);
        track.addEventListener('mouseleave', startCarousel);
        track.addEventListener('touchstart', stopCarousel, {passive:true});
        track.addEventListener('touchend', startCarousel);
    }

    // 8. BOOKING SYSTEM
    const bookingState = {
        step: 1,
        service: null,
        price: null,
        duration: null,
        date: null,
        time: null,
        contact: {}
    };

    const nextBtns = document.querySelectorAll('.booking-next');
    const backBtns = document.querySelectorAll('.booking-back');
    const confirmBtn = document.getElementById('booking-confirm');
    const steps = document.querySelectorAll('.booking-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const serviceOptions = document.querySelectorAll('.service-option');
    const prefillServices = document.querySelectorAll('.service-card, .pricing-card .btn');

    // Pre-select service from other sections
    prefillServices.forEach(el => {
        el.addEventListener('click', (e) => {
            // Find related service option
            let serviceName = el.getAttribute('data-service');
            if (!serviceName && el.closest('.pricing-card')) {
                const nameNode = el.closest('.pricing-card').querySelector('.pricing-name');
                serviceName = nameNode ? nameNode.innerText : null;
            }
            
            if (serviceName) {
                serviceOptions.forEach(opt => {
                    if (opt.getAttribute('data-service').toLowerCase().includes(serviceName.toLowerCase()) || 
                        serviceName.toLowerCase().includes(opt.getAttribute('data-service').toLowerCase())) {
                        opt.click();
                    }
                });
            }
        });
    });

    // Step 1: Select Service
    serviceOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            serviceOptions.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            bookingState.service = opt.getAttribute('data-service');
            bookingState.price = opt.getAttribute('data-price');
            bookingState.duration = opt.getAttribute('data-duration');
        });
    });

    function updateSteps() {
        steps.forEach((s, idx) => {
            if (idx + 1 === bookingState.step) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });

        progressSteps.forEach((s, idx) => {
            s.classList.remove('active', 'completed');
            if (idx + 1 === bookingState.step) {
                s.classList.add('active');
            } else if (idx + 1 < bookingState.step) {
                s.classList.add('completed');
            }
        });
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Validation
            if (bookingState.step === 1 && !bookingState.service) {
                createToast('Te rugăm să alegi un serviciu!', 'warning');
                return;
            }
            if (bookingState.step === 2 && (!bookingState.date || !bookingState.time)) {
                createToast('Te rugăm să alegi o dată și o oră!', 'warning');
                return;
            }
            if (bookingState.step === 3) {
                const name = document.getElementById('booking-name').value;
                const phone = document.getElementById('booking-phone').value;
                if (!name || !phone) {
                    createToast('Numele și telefonul sunt obligatorii!', 'warning');
                    return;
                }
                bookingState.contact = {
                    name,
                    phone,
                    email: document.getElementById('booking-email').value,
                    notes: document.getElementById('booking-notes').value
                };
                updateSummary();
            }

            bookingState.step++;
            updateSteps();
        });
    });

    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            bookingState.step--;
            updateSteps();
        });
    });

    // Calendar Generation
    const calGrid = document.getElementById('calendar-grid');
    const calMonthLabel = document.getElementById('calendar-month');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const timeSlotsGrid = document.getElementById('time-slots');
    
    let currentDate = new Date();
    const months = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];

    function renderCalendar() {
        if (!calGrid) return;
        calGrid.innerHTML = '';
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        calMonthLabel.textContent = `${months[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1).getDay();
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Mon = 0
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const today = new Date();
        today.setHours(0,0,0,0);

        // Empty cells before first day
        for (let i = 0; i < adjustedFirstDay; i++) {
            const el = document.createElement('div');
            el.className = 'cal-day empty';
            calGrid.appendChild(el);
        }

        // Days
        for (let i = 1; i <= daysInMonth; i++) {
            const el = document.createElement('div');
            el.className = 'cal-day';
            el.textContent = i;
            
            const thisDate = new Date(year, month, i);
            const dayOfWeek = thisDate.getDay();
            
            // Disable past days and Sundays(0)
            if (thisDate < today || dayOfWeek === 0) {
                el.classList.add('disabled');
            } else {
                el.addEventListener('click', () => {
                    document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
                    el.classList.add('selected');
                    bookingState.date = `${i} ${months[month]} ${year}`;
                    bookingState.time = null; // reset time
                    generateTimeSlots(dayOfWeek);
                });
            }
            
            calGrid.appendChild(el);
        }
    }

    if (document.getElementById('cal-prev')) {
        document.getElementById('cal-prev').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
            timeSlotsContainer.style.display = 'none';
        });

        document.getElementById('cal-next').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
            timeSlotsContainer.style.display = 'none';
        });
        
        renderCalendar();
    }

    function generateTimeSlots(dayOfWeek) {
        timeSlotsContainer.style.display = 'block';
        timeSlotsGrid.innerHTML = '';
        
        // Saturday is shorter: 10-16. Weekday: 9-18. Lunch 13.
        const startHour = dayOfWeek === 6 ? 10 : 9;
        const endHour = dayOfWeek === 6 ? 15 : 17; // last appt starts at endHour
        
        for (let h = startHour; h <= endHour; h++) {
            if (h === 13) continue; // Lunch break
            
            const el = document.createElement('div');
            el.className = 'time-slot';
            el.textContent = `${h}:00`;
            
            el.addEventListener('click', () => {
                document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
                el.classList.add('selected');
                bookingState.time = `${h}:00`;
            });
            
            timeSlotsGrid.appendChild(el);
        }
    }

    function updateSummary() {
        const summary = document.getElementById('booking-summary');
        if (!summary) return;
        
        summary.innerHTML = `
            <div class="summary-item">
                <span>Serviciu:</span>
                <span>${bookingState.service}</span>
            </div>
            <div class="summary-item">
                <span>Dată și Oră:</span>
                <span>${bookingState.date} la ${bookingState.time}</span>
            </div>
            <div class="summary-item">
                <span>Nume:</span>
                <span>${bookingState.contact.name}</span>
            </div>
            <div class="summary-item">
                <span>Telefon:</span>
                <span>${bookingState.contact.phone}</span>
            </div>
            <div class="summary-item">
                <span>Durată Estimată:</span>
                <span>${bookingState.duration} min</span>
            </div>
            <div class="summary-item">
                <span>Total Estimativ:</span>
                <span>${bookingState.price} LEI</span>
            </div>
        `;
    }

    // Calendar Helpers
    function parseBookingDate(dateStr, timeStr) {
        const monthNames = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
        const parts = dateStr.split(' ');
        const day = parseInt(parts[0]);
        const monthIndex = monthNames.indexOf(parts[1]);
        const year = parseInt(parts[2]);
        
        const timeParts = timeStr.split(':');
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);

        return new Date(year, monthIndex, day, hours, minutes, 0);
    }

    function generateGoogleCalendarLink(startDate, durationMins, title, details) {
        const endDate = new Date(startDate.getTime() + durationMins * 60000);
        const formatTime = (date) => date.toISOString().replace(/-|:|\.\d+/g, '');
        const params = new URLSearchParams({
            text: title,
            dates: `${formatTime(startDate)}/${formatTime(endDate)}`,
            details: details
        });
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&${params.toString()}`;
    }

    function generateICSFile(startDate, durationMins, title, details) {
        const endDate = new Date(startDate.getTime() + durationMins * 60000);
        const formatTime = (date) => date.toISOString().replace(/-|:|\.\d+/g, '');
        
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Bogdana Nails//Booking//RO',
            'BEGIN:VEVENT',
            `DTSTART:${formatTime(startDate)}`,
            `DTEND:${formatTime(endDate)}`,
            `SUMMARY:${title}`,
            `DESCRIPTION:${details.replace(/\n/g, '\\n')}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        return URL.createObjectURL(blob);
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            // Save to localStorage
            const bookings = JSON.parse(localStorage.getItem('bogdana_bookings') || '[]');
            bookings.push({ ...bookingState, id: Date.now() });
            localStorage.setItem('bogdana_bookings', JSON.stringify(bookings));

            // 1. Prepare calendar links
            const startDate = parseBookingDate(bookingState.date, bookingState.time);
            const duration = parseInt(bookingState.duration) || 60;
            const title = `Programare ${bookingState.service} - Bogdana Nails`;
            const details = `Programare pentru: ${bookingState.contact.name}\nTelefon: ${bookingState.contact.phone}\nServiciu: ${bookingState.service}\nPreț estimativ: ${bookingState.price} LEI`;
            
            const gcalLink = generateGoogleCalendarLink(startDate, duration, title, details);
            const icsLink = generateICSFile(startDate, duration, title, details);

            const gcalBtn = document.getElementById('gcal-btn');
            const icsBtn = document.getElementById('ics-btn');
            
            if (gcalBtn) gcalBtn.href = gcalLink;
            if (icsBtn) {
                icsBtn.href = icsLink;
                icsBtn.download = 'programare-bogdana-nails.ics';
            }

            // 2. Send data to Google Apps Script Webhook
            const webhookUrl = "https://script.google.com/macros/s/AKfycbzasZ4XVHu6iXMdzGdDj6hIDc_IhWgr3T8jkmnwdqHIjnSMeN7AOQzxpI-GHcmi761U/exec";
            
            const payload = {
                clientName: bookingState.contact.name,
                clientPhone: bookingState.contact.phone,
                clientEmail: bookingState.contact.email,
                service: bookingState.service,
                dateStr: bookingState.date,
                timeStr: bookingState.time,
                durationMins: duration,
                price: bookingState.price,
                notes: bookingState.contact.notes
            };

            fetch(webhookUrl, {
                method: 'POST',
                body: JSON.stringify(payload)
            }).then(response => {
                console.log("Date trimise către Google Apps Script cu succes!");
            }).catch(error => {
                console.error("Eroare la trimiterea datelor:", error);
            });

            // 3. Show success screen
            steps.forEach(s => s.style.display = 'none');
            document.querySelector('.booking-progress').style.display = 'none';
            document.getElementById('booking-success').style.display = 'block';
        });
    }

    if (document.getElementById('booking-reset')) {
        document.getElementById('booking-reset').addEventListener('click', () => {
            location.reload(); // Simple reset
        });
    }

    // 9. THEME TOGGLE
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn ? themeBtn.querySelector('.theme-icon') : null;
    
    // Check saved theme
    if (localStorage.getItem('bogdana_theme') === 'light') {
        document.body.classList.add('light-mode');
        if (themeIcon) themeIcon.textContent = '☀️';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('bogdana_theme', isLight ? 'light' : 'dark');
            themeIcon.textContent = isLight ? '☀️' : '🌙';
        });
    }

    // 10. LANGUAGE TOGGLE (Simulated i18n)
    const langBtn = document.getElementById('lang-toggle');
    const langText = langBtn ? langBtn.querySelector('.lang-text') : null;
    let currentLang = localStorage.getItem('bogdana_lang') || 'RO';
    
    // Very basic translations map for demo
    const translations = {
        'RO': {
            'nav_about': 'Despre', 'hero_title_1': 'Unghii care', 'hero_title_2': 'Strălucesc',
            'btn_next': 'Următorul Pas →', 'hero_cta_book': 'Programează-te Acum'
        },
        'EN': {
            'nav_about': 'About', 'hero_title_1': 'Nails that', 'hero_title_2': 'Shine',
            'btn_next': 'Next Step →', 'hero_cta_book': 'Book Now'
        }
    };

    function applyTranslations() {
        if (!langText) return;
        langText.textContent = currentLang === 'RO' ? 'EN' : 'RO';
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang] && translations[currentLang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    // Update placeholder if needed, though for simplicity skipping here
                } else {
                    // For a robust implementation, we'd replace innerHTML safely.
                    // Just showing concept here for a few keys.
                    el.innerHTML = translations[currentLang][key]; 
                }
            }
        });
    }

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'RO' ? 'EN' : 'RO';
            localStorage.setItem('bogdana_lang', currentLang);
            applyTranslations();
            createToast(`Limba schimbată în ${currentLang}`, 'info');
        });
        // Initial application is skipped here for brevity unless keys fully match, default is RO HTML
    }

    // 12. COOKIE BANNER
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieDecline = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('bogdana_cookies')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 2000);

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('bogdana_cookies', 'accepted');
            cookieBanner.classList.remove('show');
        });

        cookieDecline.addEventListener('click', () => {
            localStorage.setItem('bogdana_cookies', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // 13. CURSOR SPARKLE EFFECT
    let lastSparkleTime = 0;
    const colors = ['#ff2d8a', '#a855f7', '#fbbf24'];

    window.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastSparkleTime > 50) { // throttle
            lastSparkleTime = now;
            
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = `${e.clientX}px`;
            sparkle.style.top = `${e.clientY}px`;
            
            const size = Math.random() * 6 + 2;
            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            sparkle.style.backgroundColor = color;
            sparkle.style.boxShadow = `0 0 ${size*2}px ${color}`;
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 600);
        }
    });

    // 14. CONTACT FORM
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Se trimite...';
            btn.style.opacity = '0.7';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
                contactForm.reset();
                createToast('Mesajul a fost trimis cu succes! Te voi contacta în curând.', 'success');
            }, 1500);
        });
    }

    // 15. TOAST NOTIFICATIONS
    const toastContainer = document.getElementById('toast-container');
    
    function createToast(message, type = 'success', duration = 3000) {
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = '✅';
        if (type === 'info') icon = 'ℹ️';
        if (type === 'warning') icon = '⭐';
        
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger reflow to animate
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300); // Wait for transition
        }, duration);
    }
});
