// Lunar Krystal Bot Website - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initLoadingScreen();
    initNavigation();
    initScrollEffects();
    initCommandTabs();
    initContactForm();
    initAnimations();
    initParticleEffect();
    initThemeToggle();
    initMusicPlayer();
    initFloatingActionButton();
    initChatDemo();
    initStatsCounter();
    initGames();
    initAIAvatar();
    initWeatherWidget();
    initVoiceChat();
    initVoiceToggle();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
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

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(15, 15, 35, 0.98)';
        } else {
            navbar.style.background = 'rgba(15, 15, 35, 0.95)';
        }
    });
}

// Scroll effects and animations
function initScrollEffects() {
    // Intersection Observer for fade-in animations
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

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .command-item, .contact-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.bg-animation');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Command tabs functionality
function initCommandTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Contact form functionality
function initContactForm() {
    const form = document.querySelector('.contact-form form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const message = form.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Email không hợp lệ!', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Đang gửi tin nhắn...', 'info');
            
            setTimeout(() => {
                showNotification('Tin nhắn đã được gửi thành công!', 'success');
                form.reset();
            }, 2000);
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: 'linear-gradient(135deg, #10b981, #059669)',
        error: 'linear-gradient(135deg, #ef4444, #dc2626)',
        info: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        warning: 'linear-gradient(135deg, #f59e0b, #d97706)'
    };
    return colors[type] || colors.info;
}

// Initialize animations
function initAnimations() {
    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 1000);
    }
    
    // Floating animation for hero elements
    const floatingElements = document.querySelectorAll('.element');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Counter animation for features
    const counters = document.querySelectorAll('.feature-card h3');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const number = text.match(/\d+/);
                
                if (number) {
                    animateCounter(target, parseInt(number[0]));
                }
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// Counter animation
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = element.textContent.replace(/\d+/, Math.floor(current));
    }, 50);
}

// Particle effect
function initParticleEffect() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        };
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }
    
    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        });
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
            ctx.fill();
        });
        
        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });
    }
    
    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
    
    // Initialize
    resizeCanvas();
    initParticles();
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

// Utility function for smooth scrolling to sections
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Scroll-based animations and effects
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.bg-animation');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.getElementById('loadingProgress');
    
    if (!loadingScreen || !loadingProgress) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 500);
        }
        loadingProgress.style.width = progress + '%';
    }, 100);
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    if (!themeToggle) return;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('light-theme');
        const isLight = body.classList.contains('light-theme');
        const theme = isLight ? 'light-theme' : '';
        
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (theme === 'light-theme') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Music Player
function initMusicPlayer() {
    const musicToggle = document.getElementById('musicToggle');
    const musicPlayer = document.getElementById('musicPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const musicClose = document.getElementById('musicClose');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    
    if (!musicPlayer) return;
    
    let isPlaying = false;
    let currentTime = 0;
    let totalTime = 225; // 3:45 in seconds
    
    // Toggle music player
    if (musicToggle) {
        musicToggle.addEventListener('click', function() {
            musicPlayer.classList.toggle('active');
        });
    }
    
    // Close music player
    if (musicClose) {
        musicClose.addEventListener('click', function() {
            musicPlayer.classList.remove('active');
        });
    }
    
    // Play/Pause functionality
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            isPlaying = !isPlaying;
            const icon = this.querySelector('i');
            icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
            
            if (isPlaying) {
                startMusicProgress();
            } else {
                stopMusicProgress();
            }
        });
    }
    
    function startMusicProgress() {
        const interval = setInterval(() => {
            if (!isPlaying) {
                clearInterval(interval);
                return;
            }
            
            currentTime += 1;
            const progress = (currentTime / totalTime) * 100;
            progressFill.style.width = progress + '%';
            
            currentTimeEl.textContent = formatTime(currentTime);
            
            if (currentTime >= totalTime) {
                currentTime = 0;
                isPlaying = false;
                playPauseBtn.querySelector('i').className = 'fas fa-play';
                clearInterval(interval);
            }
        }, 1000);
    }
    
    function stopMusicProgress() {
        // Progress stops when isPlaying is false
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Initialize total time
    if (totalTimeEl) {
        totalTimeEl.textContent = formatTime(totalTime);
    }
}

// Floating Action Button
function initFloatingActionButton() {
    const fabBtn = document.getElementById('fabBtn');
    const fabMenu = document.querySelector('.fab-menu');
    const fabItems = document.querySelectorAll('.fab-item');
    
    if (!fabBtn || !fabMenu) return;
    
    fabBtn.addEventListener('click', function() {
        fabBtn.classList.toggle('active');
        fabMenu.classList.toggle('active');
    });
    
    fabItems.forEach(item => {
        item.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleFabAction(action);
            fabBtn.classList.remove('active');
            fabMenu.classList.remove('active');
        });
    });
}

function handleFabAction(action) {
    switch (action) {
        case 'scroll-top':
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
        case 'toggle-music':
            const musicToggle = document.getElementById('musicToggle');
            if (musicToggle) musicToggle.click();
            break;
        case 'toggle-theme':
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) themeToggle.click();
            break;
        case 'chat-demo':
            const demoSection = document.getElementById('demo');
            if (demoSection) {
                demoSection.scrollIntoView({ behavior: 'smooth' });
            }
            break;
    }
}

// Chat Demo
function initChatDemo() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const demoBtns = document.querySelectorAll('.demo-btn');
    
    if (!chatInput || !sendBtn || !chatMessages) return;
    
    // Send message function
    function sendMessage(message) {
        if (!message.trim()) return;
        
        // Add user message
        addMessage(message, 'user');
        
        // Simulate bot response
        setTimeout(() => {
            const response = getBotResponse(message);
            addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000);
        
        chatInput.value = '';
    }
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = `
            <p>${text}</p>
            <span class="message-time">${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
        `;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Get bot response
    function getBotResponse(message) {
        const responses = {
            '/help': 'Tôi có thể giúp bạn với nhiều lệnh khác nhau! Hãy thử /time, /joke, /weather hoặc hỏi tôi bất cứ điều gì.',
            '/time': `Bây giờ là ${new Date().toLocaleString('vi-VN')}`,
            '/joke': 'Tại sao con gà đi qua đường? Để đến bên kia! 😄',
            '/weather': 'Hôm nay trời đẹp! Nhiệt độ khoảng 25°C, có nắng nhẹ.',
            'hello': 'Xin chào! Tôi là Đức Thuận Bot. Bạn cần tôi giúp gì không?',
            'hi': 'Chào bạn! Tôi sẵn sàng hỗ trợ bạn!',
            'cảm ơn': 'Không có gì! Tôi luôn sẵn sàng giúp đỡ bạn.',
            'bye': 'Tạm biệt! Hẹn gặp lại bạn sau nhé! 👋'
        };
        
        const lowerMessage = message.toLowerCase();
        
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key.toLowerCase())) {
                return response;
            }
        }
        
        return 'Tôi hiểu bạn nói "' + message + '". Bạn có thể thử các lệnh như /help, /time, /joke để xem tôi có thể làm gì!';
    }
    
    // Event listeners
    sendBtn.addEventListener('click', () => sendMessage(chatInput.value));
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage(this.value);
        }
    });
    
    // Demo buttons
    demoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const command = this.getAttribute('data-command');
            sendMessage(command);
        });
    });
}

// Stats Counter
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.getAttribute('data-target'));
                animateCounter(target, finalValue);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Add CSS for light theme
const lightThemeCSS = `
    .light-theme {
        --bg-primary: #ffffff;
        --bg-secondary: #f8fafc;
        --bg-tertiary: #f1f5f9;
        --text-primary: #1e293b;
        --text-secondary: #64748b;
    }
    
    .light-theme .navbar {
        background: rgba(255, 255, 255, 0.95);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .light-theme .nav-link {
        color: var(--text-secondary);
    }
    
    .light-theme .nav-link:hover {
        color: var(--text-primary);
    }
`;

// Add light theme CSS to head
const style = document.createElement('style');
style.textContent = lightThemeCSS;
document.head.appendChild(style);

// Games functionality
function initGames() {
    const gameCards = document.querySelectorAll('.game-card');
    const gameModal = document.getElementById('gameModal');
    const gameTitle = document.getElementById('gameTitle');
    const gameArea = document.getElementById('gameArea');
    const closeGame = document.getElementById('closeGame');
    
    gameCards.forEach(card => {
        card.addEventListener('click', function() {
            const gameType = this.getAttribute('data-game');
            openGame(gameType);
        });
    });
    
    closeGame.addEventListener('click', closeGameModal);
    gameModal.addEventListener('click', function(e) {
        if (e.target === gameModal) closeGameModal();
    });
    
    function openGame(gameType) {
        gameTitle.textContent = getGameTitle(gameType);
        gameArea.innerHTML = getGameHTML(gameType);
        gameModal.classList.add('active');
        initGameLogic(gameType);
    }
    
    function closeGameModal() {
        gameModal.classList.remove('active');
    }
    
    function getGameTitle(gameType) {
        const titles = {
            snake: 'Snake Game',
            memory: 'Memory Game',
            typing: 'Typing Test',
            quiz: 'AI Quiz'
        };
        return titles[gameType] || 'Game';
    }
    
    function getGameHTML(gameType) {
        const games = {
            snake: `
                <div class="snake-game">
                    <div class="game-info">
                        <div class="score">Score: <span id="snakeScore">0</span></div>
                        <div class="high-score">High Score: <span id="snakeHighScore">0</span></div>
                    </div>
                    <canvas id="snakeCanvas" width="400" height="400"></canvas>
                    <div class="game-controls">
                        <button id="startSnake">Start Game</button>
                        <button id="pauseSnake">Pause</button>
                        <button id="resetSnake">Reset</button>
                    </div>
                    <div class="game-instructions">
                        <p>Use arrow keys to control the snake. Eat the red food to grow!</p>
                    </div>
                </div>
            `,
            memory: `
                <div class="memory-game">
                    <div class="game-info">
                        <div class="moves">Moves: <span id="memoryMoves">0</span></div>
                        <div class="matches">Matches: <span id="memoryMatches">0</span></div>
                    </div>
                    <div class="memory-grid" id="memoryGrid"></div>
                    <div class="game-controls">
                        <button id="startMemory">Start Game</button>
                        <button id="resetMemory">Reset</button>
                    </div>
                </div>
            `,
            typing: `
                <div class="typing-game">
                    <div class="game-info">
                        <div class="wpm">WPM: <span id="typingWPM">0</span></div>
                        <div class="accuracy">Accuracy: <span id="typingAccuracy">0%</span></div>
                        <div class="time">Time: <span id="typingTime">60</span>s</div>
                    </div>
                    <div class="typing-text" id="typingText"></div>
                    <textarea id="typingInput" placeholder="Start typing here..."></textarea>
                    <div class="game-controls">
                        <button id="startTyping">Start Test</button>
                        <button id="resetTyping">Reset</button>
                    </div>
                </div>
            `,
            quiz: `
                <div class="quiz-game">
                    <div class="game-info">
                        <div class="question-number">Question: <span id="quizQuestionNum">1</span>/10</div>
                        <div class="score">Score: <span id="quizScore">0</span></div>
                    </div>
                    <div class="quiz-question" id="quizQuestion"></div>
                    <div class="quiz-options" id="quizOptions"></div>
                    <div class="game-controls">
                        <button id="startQuiz">Start Quiz</button>
                        <button id="nextQuestion" style="display: none;">Next Question</button>
                    </div>
                </div>
            `
        };
        return games[gameType] || '<p>Game not found</p>';
    }
    
    function initGameLogic(gameType) {
        switch(gameType) {
            case 'snake':
                initSnakeGame();
                break;
            case 'memory':
                initMemoryGame();
                break;
            case 'typing':
                initTypingGame();
                break;
            case 'quiz':
                initQuizGame();
                break;
        }
    }
}

// Snake Game
function initSnakeGame() {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('snakeScore');
    const highScoreEl = document.getElementById('snakeHighScore');
    const startBtn = document.getElementById('startSnake');
    const pauseBtn = document.getElementById('pauseSnake');
    const resetBtn = document.getElementById('resetSnake');
    
    let gameRunning = false;
    let gamePaused = false;
    let snake = [{x: 200, y: 200}];
    let direction = {x: 0, y: 0};
    let food = {x: 0, y: 0};
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    
    highScoreEl.textContent = highScore;
    
    function generateFood() {
        food.x = Math.floor(Math.random() * 20) * 20;
        food.y = Math.floor(Math.random() * 20) * 20;
    }
    
    function draw() {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        ctx.fillStyle = '#6366f1';
        snake.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, 18, 18);
        });
        
        // Draw food
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(food.x, food.y, 18, 18);
    }
    
    function update() {
        if (!gameRunning || gamePaused) return;
        
        const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
        
        // Check wall collision
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            gameOver();
            return;
        }
        
        // Check self collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }
        
        snake.unshift(head);
        
        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreEl.textContent = score;
            generateFood();
        } else {
            snake.pop();
        }
    }
    
    function gameOver() {
        gameRunning = false;
        if (score > highScore) {
            highScore = score;
            highScoreEl.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        alert(`Game Over! Score: ${score}`);
    }
    
    function gameLoop() {
        update();
        draw();
        if (gameRunning) {
            setTimeout(gameLoop, 150);
        }
    }
    
    startBtn.addEventListener('click', () => {
        if (!gameRunning) {
            gameRunning = true;
            gamePaused = false;
            generateFood();
            gameLoop();
        }
    });
    
    pauseBtn.addEventListener('click', () => {
        gamePaused = !gamePaused;
        if (gameRunning && !gamePaused) {
            gameLoop();
        }
    });
    
    resetBtn.addEventListener('click', () => {
        gameRunning = false;
        gamePaused = false;
        snake = [{x: 200, y: 200}];
        direction = {x: 0, y: 0};
        score = 0;
        scoreEl.textContent = score;
        draw();
    });
    
    document.addEventListener('keydown', (e) => {
        if (!gameRunning) return;
        
        switch(e.key) {
            case 'ArrowUp':
                if (direction.y === 0) direction = {x: 0, y: -20};
                break;
            case 'ArrowDown':
                if (direction.y === 0) direction = {x: 0, y: 20};
                break;
            case 'ArrowLeft':
                if (direction.x === 0) direction = {x: -20, y: 0};
                break;
            case 'ArrowRight':
                if (direction.x === 0) direction = {x: 20, y: 0};
                break;
        }
    });
    
    generateFood();
    draw();
}

// Memory Game
function initMemoryGame() {
    const grid = document.getElementById('memoryGrid');
    const movesEl = document.getElementById('memoryMoves');
    const matchesEl = document.getElementById('memoryMatches');
    const startBtn = document.getElementById('startMemory');
    const resetBtn = document.getElementById('resetMemory');
    
    let cards = [];
    let flippedCards = [];
    let moves = 0;
    let matches = 0;
    let gameStarted = false;
    
    const symbols = ['🎮', '🎯', '🎪', '🎨', '🎵', '🎭', '🎪', '🎨'];
    const allSymbols = [...symbols, ...symbols];
    
    function createCards() {
        grid.innerHTML = '';
        cards = [];
        const shuffled = allSymbols.sort(() => Math.random() - 0.5);
        
        shuffled.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.symbol = symbol;
            card.dataset.index = index;
            card.innerHTML = '<div class="card-back">?</div><div class="card-front">' + symbol + '</div>';
            card.addEventListener('click', flipCard);
            grid.appendChild(card);
            cards.push(card);
        });
    }
    
    function flipCard() {
        if (!gameStarted || flippedCards.length >= 2) return;
        
        const card = this;
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
        
        card.classList.add('flipped');
        flippedCards.push(card);
        
        if (flippedCards.length === 2) {
            moves++;
            movesEl.textContent = moves;
            
            setTimeout(() => {
                if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
                    flippedCards.forEach(card => card.classList.add('matched'));
                    matches++;
                    matchesEl.textContent = matches;
                    
                    if (matches === 8) {
                        alert(`Congratulations! You won in ${moves} moves!`);
                    }
                } else {
                    flippedCards.forEach(card => card.classList.remove('flipped'));
                }
                flippedCards = [];
            }, 1000);
        }
    }
    
    startBtn.addEventListener('click', () => {
        gameStarted = true;
        moves = 0;
        matches = 0;
        movesEl.textContent = moves;
        matchesEl.textContent = matches;
        createCards();
    });
    
    resetBtn.addEventListener('click', () => {
        gameStarted = false;
        createCards();
    });
    
    createCards();
}

// Typing Game
function initTypingGame() {
    const textEl = document.getElementById('typingText');
    const inputEl = document.getElementById('typingInput');
    const wpmEl = document.getElementById('typingWPM');
    const accuracyEl = document.getElementById('typingAccuracy');
    const timeEl = document.getElementById('typingTime');
    const startBtn = document.getElementById('startTyping');
    const resetBtn = document.getElementById('resetTyping');
    
    const sampleTexts = [
        "Lunar Krystal Bot is an advanced AI assistant designed to help users with various tasks and provide intelligent responses.",
        "The bot features over 200 commands including entertainment, utilities, moderation, and AI-powered functions.",
        "Built with modern web technologies and machine learning capabilities for optimal performance and user experience.",
        "Users can interact with the bot through text commands, voice chat, and various interactive features.",
        "The system is constantly updated with new features and improvements based on user feedback and technological advances."
    ];
    
    let currentText = '';
    let startTime = 0;
    let timer = null;
    let timeLeft = 60;
    let gameStarted = false;
    
    function startGame() {
        if (gameStarted) return;
        
        gameStarted = true;
        currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        textEl.textContent = currentText;
        inputEl.value = '';
        inputEl.disabled = false;
        inputEl.focus();
        
        timeLeft = 60;
        timeEl.textContent = timeLeft;
        startTime = Date.now();
        
        timer = setInterval(() => {
            timeLeft--;
            timeEl.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
        
        inputEl.addEventListener('input', updateStats);
    }
    
    function updateStats() {
        const typedText = inputEl.value;
        const wordsTyped = typedText.trim().split(/\s+/).length;
        const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
        const wpm = Math.round(wordsTyped / timeElapsed) || 0;
        
        wpmEl.textContent = wpm;
        
        // Calculate accuracy
        let correctChars = 0;
        for (let i = 0; i < Math.min(typedText.length, currentText.length); i++) {
            if (typedText[i] === currentText[i]) correctChars++;
        }
        const accuracy = typedText.length > 0 ? Math.round((correctChars / typedText.length) * 100) : 0;
        accuracyEl.textContent = accuracy + '%';
    }
    
    function endGame() {
        gameStarted = false;
        clearInterval(timer);
        inputEl.disabled = true;
        alert(`Game Over! Your final WPM: ${wpmEl.textContent}, Accuracy: ${accuracyEl.textContent}`);
    }
    
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', () => {
        gameStarted = false;
        clearInterval(timer);
        inputEl.disabled = true;
        inputEl.value = '';
        wpmEl.textContent = '0';
        accuracyEl.textContent = '0%';
        timeEl.textContent = '60';
    });
}

// Quiz Game
function initQuizGame() {
    const questionEl = document.getElementById('quizQuestion');
    const optionsEl = document.getElementById('quizOptions');
    const questionNumEl = document.getElementById('quizQuestionNum');
    const scoreEl = document.getElementById('quizScore');
    const startBtn = document.getElementById('startQuiz');
    const nextBtn = document.getElementById('nextQuestion');
    
    const questions = [
        {
            question: "What is the main purpose of Lunar Krystal Bot?",
            options: ["Gaming", "AI Assistant", "Music Player", "Photo Editor"],
            correct: 1
        },
        {
            question: "How many commands does the bot have?",
            options: ["50+", "100+", "200+", "500+"],
            correct: 2
        },
        {
            question: "Which technology is NOT used in the bot?",
            options: ["Node.js", "Python", "JavaScript", "CSS"],
            correct: 1
        },
        {
            question: "What is the bot's primary platform?",
            options: ["Discord", "Telegram", "Facebook Messenger", "WhatsApp"],
            correct: 2
        },
        {
            question: "Which feature is NOT available in the bot?",
            options: ["Voice Chat", "Image Generation", "Weather", "Cooking"],
            correct: 3
        }
    ];
    
    let currentQuestion = 0;
    let score = 0;
    let gameStarted = false;
    
    function startQuiz() {
        if (gameStarted) return;
        
        gameStarted = true;
        currentQuestion = 0;
        score = 0;
        scoreEl.textContent = score;
        showQuestion();
    }
    
    function showQuestion() {
        const q = questions[currentQuestion];
        questionEl.textContent = q.question;
        questionNumEl.textContent = currentQuestion + 1;
        
        optionsEl.innerHTML = '';
        q.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option;
            button.addEventListener('click', () => selectAnswer(index));
            optionsEl.appendChild(button);
        });
        
        nextBtn.style.display = 'none';
    }
    
    function selectAnswer(selectedIndex) {
        const q = questions[currentQuestion];
        const options = document.querySelectorAll('.quiz-option');
        
        options.forEach((option, index) => {
            option.disabled = true;
            if (index === q.correct) {
                option.classList.add('correct');
            } else if (index === selectedIndex && index !== q.correct) {
                option.classList.add('wrong');
            }
        });
        
        if (selectedIndex === q.correct) {
            score++;
            scoreEl.textContent = score;
        }
        
        nextBtn.style.display = 'block';
    }
    
    function nextQuestion() {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            alert(`Quiz Complete! Your score: ${score}/${questions.length}`);
            gameStarted = false;
            nextBtn.style.display = 'none';
        }
    }
    
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', nextQuestion);
}

// AI Avatar
function initAIAvatar() {
    const controlBtns = document.querySelectorAll('.control-btn');
    const avatar3D = document.getElementById('avatar3D');
    
    controlBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            performAvatarAction(action);
        });
    });
    
    function performAvatarAction(action) {
        const face = avatar3D.querySelector('.avatar-face');
        const leftArm = avatar3D.querySelector('.left-arm');
        const rightArm = avatar3D.querySelector('.right-arm');
        const mouth = avatar3D.querySelector('.mouth');
        
        // Reset animations
        face.style.animation = 'none';
        leftArm.style.animation = 'none';
        rightArm.style.animation = 'none';
        mouth.style.animation = 'none';
        
        setTimeout(() => {
            switch(action) {
                case 'wave':
                    leftArm.style.animation = 'wave 1s ease-in-out';
                    break;
                case 'dance':
                    face.style.animation = 'dance 2s ease-in-out infinite';
                    leftArm.style.animation = 'dance 2s ease-in-out infinite';
                    rightArm.style.animation = 'dance 2s ease-in-out infinite';
                    break;
                case 'speak':
                    mouth.style.animation = 'speak 0.5s ease-in-out infinite';
                    break;
                case 'sleep':
                    face.style.animation = 'sleep 3s ease-in-out';
                    break;
            }
        }, 10);
    }
}

// Weather Widget
function initWeatherWidget() {
    const refreshWeather = document.getElementById('refreshWeather');
    const refreshCrypto = document.getElementById('refreshCrypto');
    
    if (refreshWeather) {
        refreshWeather.addEventListener('click', updateWeather);
    }
    
    if (refreshCrypto) {
        refreshCrypto.addEventListener('click', updateCrypto);
    }
    
    function updateWeather() {
        // Simulate weather data update
        const temperature = document.querySelector('.temperature');
        const description = document.querySelector('.description');
        const humidity = document.querySelector('.detail-item span:last-child');
        
        // Add loading animation
        refreshWeather.style.animation = 'spin 1s linear infinite';
        
        setTimeout(() => {
            const temps = [22, 25, 28, 30, 26, 24];
            const descs = ['Nắng nhẹ', 'Mây rải rác', 'Nắng', 'Mưa nhẹ', 'Nắng', 'Mây đen'];
            const humidities = [60, 65, 70, 75, 68, 62];
            
            const randomIndex = Math.floor(Math.random() * temps.length);
            temperature.textContent = temps[randomIndex] + '°C';
            description.textContent = descs[randomIndex];
            humidity.textContent = humidities[randomIndex] + '%';
            
            refreshWeather.style.animation = 'none';
        }, 1000);
    }
    
    function updateCrypto() {
        // Simulate crypto data update
        refreshCrypto.style.animation = 'spin 1s linear infinite';
        
        setTimeout(() => {
            const prices = document.querySelectorAll('.price');
            const changes = document.querySelectorAll('.change');
            
            prices.forEach(price => {
                const currentPrice = parseFloat(price.textContent.replace(/[$,]/g, ''));
                const change = (Math.random() - 0.5) * 0.1; // ±5% change
                const newPrice = currentPrice * (1 + change);
                price.textContent = '$' + newPrice.toLocaleString();
            });
            
            changes.forEach(change => {
                const isPositive = Math.random() > 0.5;
                const changeValue = (Math.random() * 5).toFixed(1);
                change.textContent = (isPositive ? '+' : '-') + changeValue + '%';
                change.className = 'change ' + (isPositive ? 'positive' : 'negative');
            });
            
            refreshCrypto.style.animation = 'none';
        }, 1000);
    }
}

// Voice Chat
function initVoiceChat() {
    const voiceModal = document.getElementById('voiceModal');
    const closeVoice = document.getElementById('closeVoice');
    const startVoice = document.getElementById('startVoice');
    const stopVoice = document.getElementById('stopVoice');
    const voiceStatus = document.getElementById('voiceStatus');
    const waves = document.querySelectorAll('.wave');
    
    let isRecording = false;
    let recognition = null;
    
    // Check for speech recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'vi-VN';
        
        recognition.onstart = function() {
            isRecording = true;
            startVoice.disabled = true;
            stopVoice.disabled = false;
            voiceStatus.textContent = 'Đang nghe... Hãy nói!';
            waves.forEach(wave => wave.style.animation = 'wave 0.5s ease-in-out infinite');
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            voiceStatus.textContent = `Bạn nói: "${transcript}"`;
            
            // Simulate bot response
            setTimeout(() => {
                const responses = [
                    'Tôi hiểu bạn nói: ' + transcript,
                    'Cảm ơn bạn đã nói chuyện với tôi!',
                    'Tôi đã ghi nhận thông tin của bạn.',
                    'Bạn có cần tôi giúp gì thêm không?'
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                voiceStatus.textContent = `Bot: ${randomResponse}`;
            }, 1000);
        };
        
        recognition.onerror = function(event) {
            voiceStatus.textContent = 'Lỗi: ' + event.error;
            isRecording = false;
            startVoice.disabled = false;
            stopVoice.disabled = true;
            waves.forEach(wave => wave.style.animation = 'wave 1.5s ease-in-out infinite');
        };
        
        recognition.onend = function() {
            isRecording = false;
            startVoice.disabled = false;
            stopVoice.disabled = true;
            waves.forEach(wave => wave.style.animation = 'wave 1.5s ease-in-out infinite');
        };
    } else {
        voiceStatus.textContent = 'Trình duyệt không hỗ trợ nhận dạng giọng nói';
        startVoice.disabled = true;
    }
    
    startVoice.addEventListener('click', () => {
        if (recognition && !isRecording) {
            recognition.start();
        }
    });
    
    stopVoice.addEventListener('click', () => {
        if (recognition && isRecording) {
            recognition.stop();
        }
    });
    
    closeVoice.addEventListener('click', () => {
        voiceModal.classList.remove('active');
        if (isRecording) {
            recognition.stop();
        }
    });
    
    voiceModal.addEventListener('click', (e) => {
        if (e.target === voiceModal) {
            voiceModal.classList.remove('active');
            if (isRecording) {
                recognition.stop();
            }
        }
    });
}

// Add CSS for games
const gamesCSS = `
    .memory-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        max-width: 400px;
        margin: 0 auto;
    }
    
    .memory-card {
        aspect-ratio: 1;
        position: relative;
        cursor: pointer;
        transform-style: preserve-3d;
        transition: transform 0.6s;
    }
    
    .memory-card.flipped {
        transform: rotateY(180deg);
    }
    
    .card-back, .card-front {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        font-size: 2rem;
    }
    
    .card-back {
        background: var(--gradient-primary);
        color: white;
    }
    
    .card-front {
        background: var(--bg-primary);
        color: var(--text-primary);
        transform: rotateY(180deg);
    }
    
    .memory-card.matched .card-front {
        background: #10b981;
        color: white;
    }
    
    .memory-card.matched .card-back {
        background: #10b981;
    }
    
    .typing-text {
        background: var(--bg-primary);
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 1rem;
        font-size: 1.1rem;
        line-height: 1.6;
        min-height: 100px;
    }
    
    .typing-input {
        width: 100%;
        padding: 1rem;
        border: 2px solid var(--primary-color);
        border-radius: 10px;
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: 1rem;
        margin-bottom: 1rem;
    }
    
    .quiz-option {
        width: 100%;
        padding: 1rem;
        margin: 0.5rem 0;
        border: 2px solid var(--primary-color);
        border-radius: 10px;
        background: var(--bg-primary);
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .quiz-option:hover {
        background: var(--gradient-primary);
        color: white;
    }
    
    .quiz-option.correct {
        background: #10b981;
        color: white;
        border-color: #10b981;
    }
    
    .quiz-option.wrong {
        background: #ef4444;
        color: white;
        border-color: #ef4444;
    }
    
    .game-controls {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 1rem;
    }
    
    .game-controls button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 25px;
        background: var(--gradient-primary);
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .game-controls button:hover {
        transform: scale(1.05);
        box-shadow: var(--shadow-primary);
    }
    
    .game-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        font-weight: 600;
    }
    
    @keyframes wave {
        0% { transform: rotate(0deg); }
        25% { transform: rotate(20deg); }
        75% { transform: rotate(-20deg); }
        100% { transform: rotate(0deg); }
    }
    
    @keyframes dance {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-10px) rotate(5deg); }
        75% { transform: translateY(-5px) rotate(-5deg); }
    }
    
    @keyframes speak {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(1.5); }
    }
    
    @keyframes sleep {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(15deg); }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;

// Add games CSS to head
const gamesStyle = document.createElement('style');
gamesStyle.textContent = gamesCSS;
document.head.appendChild(gamesStyle);

// Voice Toggle
function initVoiceToggle() {
    const voiceToggle = document.getElementById('voiceToggle');
    const voiceModal = document.getElementById('voiceModal');
    
    if (voiceToggle && voiceModal) {
        voiceToggle.addEventListener('click', () => {
            voiceModal.classList.add('active');
        });
    }
}
