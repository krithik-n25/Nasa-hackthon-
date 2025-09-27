// Create floating particles
        
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Volume control
        const video = document.getElementById('bgVideo');
        const volumeSlider = document.getElementById('volumeSlider');

        volumeSlider.addEventListener('input', function() {
            video.volume = this.value;
        });

        function toggleMute() {
            if (video.muted) {
                video.muted = false;
                document.querySelector('.volume-icon').textContent = '🔊';
            } else {
                video.muted = true;
                document.querySelector('.volume-icon').textContent = '🔇';
            }
        }

        // Authentication
        let isLoggedIn = false;

        function openAuthModal(type) {
            document.getElementById('authModal').style.display = 'flex';
            switchTab(type);
        }

        function closeAuthModal() {
            document.getElementById('authModal').style.display = 'none';
        }

        function switchTab(type) {
            const loginTab = document.getElementById('loginTab');
            const signupTab = document.getElementById('signupTab');
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');

            if (type === 'login') {
                loginTab.classList.add('active');
                signupTab.classList.remove('active');
                loginForm.style.display = 'block';
                signupForm.style.display = 'none';
            } else {
                signupTab.classList.add('active');
                loginTab.classList.remove('active');
                signupForm.style.display = 'block';
                loginForm.style.display = 'none';
            }
        }

        function handleLogin() {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (email && password) {
                isLoggedIn = true;
                alert('Login successful! Welcome to Farm Vision 360°');
                closeAuthModal();
            } else {
                alert('Please fill in all fields');
            }
        }

        function handleSignup() {
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            
            if (name && email && password) {
                isLoggedIn = true;
                alert('Account created successfully! Welcome to Farm Vision 360°');
                closeAuthModal();
            } else {
                alert('Please fill in all fields');
            }
        }

        function checkLogin() {
            if (!isLoggedIn) {
                alert('Please login or sign up to access the farming simulation!');
                openAuthModal('login');
                return false;
            }
            return true;
        }

        // Info modal
        function openInfoModal() {
            document.getElementById('infoModal').style.display = 'flex';
        }

        function closeInfoModal() {
            document.getElementById('infoModal').style.display = 'none';
        }

        // Close modals when clicking outside
        window.onclick = function(event) {
            const authModal = document.getElementById('authModal');
            const infoModal = document.getElementById('infoModal');
            
            if (event.target === authModal) {
                closeAuthModal();
            }
            if (event.target === infoModal) {
                closeInfoModal();
            }
        }

        // Initialize video with error handling
        window.addEventListener('load', function() {
            createParticles();
            
            const video = document.getElementById('bgVideo');
            video.volume = 0.3;
            
            // Handle video loading errors
            video.addEventListener('error', function(e) {
                console.log('Video error:', e);
                // Fallback: create animated background if video fails
                createAnimatedBackground();
            });
            
            // Ensure video plays on interaction if blocked
            video.addEventListener('loadeddata', function() {
                video.play().catch(function(error) {
                    console.log('Video autoplay blocked:', error);
                    // Show play button if needed
                    showVideoPlayButton();
                });
            });
        });

        // Fallback animated background
        function createAnimatedBackground() {
            const overlay = document.querySelector('.bg-overlay');
            overlay.style.background = `
                linear-gradient(45deg, 
                    rgba(0, 50, 0, 0.9) 0%,
                    rgba(0, 20, 0, 0.8) 25%,
                    rgba(0, 0, 0, 0.9) 50%,
                    rgba(0, 30, 0, 0.8) 75%,
                    rgba(0, 40, 0, 0.9) 100%),
                url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="80" cy="40" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="40" cy="80" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>')
            `;
            overlay.style.animation = 'gradientShift 10s ease-in-out infinite, backgroundMove 20s linear infinite';
        }

        // Show video play button if autoplay is blocked
        function showVideoPlayButton() {
            const playBtn = document.createElement('button');
            playBtn.innerHTML = '▶️ Click to Enable Video & Audio';
            playBtn.className = 'btn-secondary';
            playBtn.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 1001;
                animation: pulse 2s infinite;
            `;
            
            playBtn.onclick = function() {
                const video = document.getElementById('bgVideo');
                video.play();
                playBtn.remove();
            };
            
            document.body.appendChild(playBtn);
        }