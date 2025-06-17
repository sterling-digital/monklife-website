// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Smooth scrolling for anchor links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    function updateActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    updateActiveNav();

    // Fade in animation for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animation
    const animateElements = document.querySelectorAll('.feature-card, .step, .practice-card, .resource-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Back to top functionality
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #8B4513, #D2691E);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(backToTopBtn);

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
        } else {
            backToTopBtn.style.opacity = '0';
        }
    });

    // Meditation timer functionality (if on meditation page)
    const timerDisplay = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-meditation');
    const pauseBtn = document.getElementById('pause-meditation');
    const resetBtn = document.getElementById('reset-meditation');
    const durationSelect = document.getElementById('meditation-duration');

    if (timerDisplay && startBtn) {
        let meditationTimer;
        let timeRemaining = 300; // 5 minutes default
        let isRunning = false;

        function updateDisplay() {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        function playSound() {
            // Create a simple tone for meditation end
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(528, audioContext.currentTime); // Healing frequency
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 2);
        }

        if (durationSelect) {
            durationSelect.addEventListener('change', function() {
                timeRemaining = parseInt(this.value);
                updateDisplay();
            });
        }

        startBtn.addEventListener('click', function() {
            if (!isRunning) {
                isRunning = true;
                startBtn.textContent = 'Meditating...';
                startBtn.disabled = true;
                
                if (pauseBtn) pauseBtn.disabled = false;

                meditationTimer = setInterval(function() {
                    timeRemaining--;
                    updateDisplay();

                    if (timeRemaining <= 0) {
                        clearInterval(meditationTimer);
                        isRunning = false;
                        startBtn.textContent = 'Start Meditation';
                        startBtn.disabled = false;
                        if (pauseBtn) pauseBtn.disabled = true;
                        playSound();
                        alert('Meditation session complete! 🧘‍♀️');
                    }
                }, 1000);
            }
        });

        if (pauseBtn) {
            pauseBtn.addEventListener('click', function() {
                if (isRunning) {
                    clearInterval(meditationTimer);
                    isRunning = false;
                    startBtn.textContent = 'Resume';
                    startBtn.disabled = false;
                    pauseBtn.disabled = true;
                }
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                clearInterval(meditationTimer);
                isRunning = false;
                timeRemaining = durationSelect ? parseInt(durationSelect.value) : 300;
                updateDisplay();
                startBtn.textContent = 'Start Meditation';
                startBtn.disabled = false;
                if (pauseBtn) pauseBtn.disabled = true;
            });
        }

        updateDisplay();
    }
});
