// Backend Api is
const API_BASE_URL = 'http://127.0.0.1:8000';
let weatherChart, soilChart, cropChart;
        // Initialize charts and animations
// Initialize everything when the page loads
        document.addEventListener('DOMContentLoaded', function() {
            initializeCharts();
            initializeMap();
            setupLocationSearch();
            initializeSustainabilityGauge();
            initializeHorizontalGallery();
            initializeFactCarousel();
            const y = document.getElementById('yearSpan'); if (y) y.textContent = new Date().getFullYear();
        });
// --- NEW: Central function to update all dashboard data ---
        async function updateDashboardData(lat, lon) {
            console.log(`Fetching data for: ${lat}, ${lon}`);
            const cards = document.querySelectorAll('.card-hover');
            cards.forEach(card => card.style.opacity = '0.5'); // Dim cards while loading

            try {
                // Fetch all data in parallel for speed
                const [weatherRes, soilRes, cropRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/climate-data?lat=${lat}&lon=${lon}`),
                    fetch(`${API_BASE_URL}/soil-status?lat=${lat}&lon=${lon}`),
                    fetch(`${API_BASE_URL}/crop-health?lat=${lat}&lon=${lon}&crop=maize`)
                ]);

                if (!weatherRes.ok || !soilRes.ok || !cropRes.ok) {
                    throw new Error('One or more API calls failed');
                }

                const weatherData = await weatherRes.json();
                const soilData = await soilRes.json();
                const cropData = await cropRes.json();

                // Update UI with new data
                updateWeatherCard(weatherData);
                updateSoilCard(soilData);
                updateCropCard(cropData);

            } catch (error) {
                console.error("Failed to update dashboard:", error);
                alert("Could not fetch data for the selected location. Please check the backend server and try again.");
            } finally {
                cards.forEach(card => card.style.opacity = '1'); // Restore card opacity
            }
        }

// --- NEW: Functions to update each card ---
        function updateWeatherCard(data) {
            document.getElementById('tempValue').textContent = `${data.temperature.toFixed(1)}°C`;
            document.getElementById('rainfallValue').textContent = `${data.rainfall.toFixed(1)}mm`;
            document.getElementById('droughtValue').textContent = data.drought_index > 0.7 ? 'High' : (data.drought_index > 0.4 ? 'Medium' : 'Low');
            
            weatherChart.data.labels = data.history.map(h => new Date(h.day).toLocaleDateString('en-US', { weekday: 'short' }));
            weatherChart.data.datasets[0].data = data.history.map(h => h.temperature); // Assuming temp history is available
            weatherChart.data.datasets[1].data = data.history.map(h => h.rainfall);
            weatherChart.update();
        }

        function updateSoilCard(data) {
            document.getElementById('moistureValue').textContent = `${data.moisture.toFixed(1)}%`;
            document.getElementById('moistureBar').style.width = `${data.moisture}%`;
            document.getElementById('nValue').textContent = `${data.nutrients.N}%`;
            document.getElementById('pValue').textContent = `${data.nutrients.P}%`;
            document.getElementById('kValue').textContent = `${data.nutrients.K}%`;

            soilChart.data.datasets[0].data = [data.nutrients.N, data.nutrients.P, data.nutrients.K];
            soilChart.update();
        }

        function updateCropCard(data) {
            document.getElementById('yieldValue').textContent = `${data.predicted_yield.toFixed(1)}t/ha`;
            document.getElementById('healthStatus').textContent = data.status.charAt(0).toUpperCase() + data.status.slice(1);
            const healthIndicator = document.getElementById('healthIndicator');
            if (data.status === 'thriving') healthIndicator.className = 'w-4 h-4 bg-emerald rounded-full pulse-glow';
            else if (data.status === 'healthy') healthIndicator.className = 'w-4 h-4 bg-yellow-400 rounded-full pulse-glow';
            else healthIndicator.className = 'w-4 h-4 bg-red-500 rounded-full pulse-glow';
            
            document.getElementById('growthBar').style.width = `${data.health_score}%`;
            document.getElementById('growthText').textContent = `${data.health_score}% Complete`;

            cropChart.data.datasets[0].data = data.trend;
            cropChart.update();
        }        

// Chart initialization
function initializeCharts() {
    // Weather Chart
    const weatherCtx = document.getElementById('weatherChart').getContext('2d');
    weatherChart = new Chart(weatherCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Temperature (°C)',
                data: [25, 28, 26, 30, 28, 27, 29],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Rainfall (mm)',
                data: [5, 15, 8, 0, 12, 20, 3],
                borderColor: '#6ee7b7',
                backgroundColor: 'rgba(110, 231, 183, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });

    // Soil Chart
    const soilCtx = document.getElementById('soilChart').getContext('2d');
    soilChart =new Chart(soilCtx, {
        type: 'doughnut',
        data: {
            labels: ['Nitrogen', 'Phosphorus', 'Potassium'],
            datasets: [{
                data: [85, 72, 91],
                backgroundColor: ['#10b981', '#34d399', '#6ee7b7'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        padding: 10
                    }
                }
            }
        }
    });

    // Crop Chart
    const cropCtx = document.getElementById('cropChart').getContext('2d');
    cropChart = new Chart(cropCtx, {
        type: 'bar',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3'],
            datasets: [{
                label: 'Yield Forecast (t/ha)',
                data: [3.2, 3.8, 4.1],
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: '#10b981',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

// Map initialization
let appMap;
let currentMarker;
let farmIcon;

function initializeMap() {
    appMap = L.map('map').setView([40.7128, -74.0060], 10);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(appMap);
    
    // Add farm marker
    farmIcon = L.divIcon({
        html: '🌾',
        iconSize: [30, 30],
        className: 'farm-marker'
    });
    
    currentMarker = L.marker([40.7128, -74.0060], { icon: farmIcon })
        .addTo(appMap)
        .bindPopup('🌾 Your Farm Location<br>Coordinates: 40.7128, -74.0060');
    
    // Add NASA overlay simulation
    const overlayBounds = [[40.6, -74.2], [40.8, -73.8]];
    L.rectangle(overlayBounds, {
        color: '#10b981',
        weight: 2,
        opacity: 0.6,
        fillOpacity: 0.2
    }).addTo(appMap).bindPopup('NASA Satellite Coverage Area');
}

function updateMapLocation(lat, lon, label) {
    if (!appMap) return;
    appMap.setView([lat, lon], 11);
    if (currentMarker) {
        currentMarker.setLatLng([lat, lon]).setPopupContent(`🌾 ${label}<br>Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    } else {
        currentMarker = L.marker([lat, lon], { icon: farmIcon }).addTo(appMap).bindPopup(`🌾 ${label}<br>Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    }
}

// --- MODIFIED: Setup location search input and button ---
        function setupLocationSearch() {
            const searchBtn = document.getElementById('locationSearchBtn');
            const searchInput = document.getElementById('locationSearchInput');

            searchBtn.addEventListener('click', searchLocation);
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    searchLocation();
                }
            });
            
            // Try geolocating on load for a good default
            geolocateAndUpdate();
        }

        // --- NEW: Function to handle location search ---
        async function searchLocation() {
            const input = document.getElementById('locationSearchInput');
            const query = input.value.trim();
            if (!query) return;

            // Use OpenStreetMap's free Nominatim API for geocoding
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data && data.length > 0) {
                    const { lat, lon, display_name } = data[0];
                    const latitude = parseFloat(lat);
                    const longitude = parseFloat(lon);
                    
                    updateMapLocation(latitude, longitude, display_name);
                    updateDashboardData(latitude, longitude); // <-- UPDATE ALL DATA
                } else {
                    alert('Location not found. Please try a different search term.');
                }
            } catch (error) {
                console.error('Geocoding API error:', error);
                alert('Could not search for location. Please check your connection.');
            }
        }
        
        function geolocateAndUpdate() {
            if (!navigator.geolocation) {
                // Default to a known location if no geolocation
                updateMapLocation(23.0225, 72.5714, 'Ahmedabad, Gujarat, India');
                updateDashboardData(23.0225, 72.5714);
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    updateMapLocation(latitude, longitude, 'Your Current Location');
                    updateDashboardData(latitude, longitude);
                },
                () => {
                    // Fallback to default on error
                    updateMapLocation(23.0225, 72.5714, 'Ahmedabad, Gujarat, India');
                    updateDashboardData(23.0225, 72.5714);
                },
                { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
            );
        }

// Animation initialization
function initializeAnimations() {
    // Animate numbers on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
            }
        });
    });

    document.querySelectorAll('.animate-count').forEach(el => {
        observer.observe(el);
    });

    // Stagger card animations
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach((card, index) => {
        card.style.animationDelay = '${index * 0.2}s';
        card.classList.add('animate-fade-in');
    });
}

// Animate number counting
function animateValue(element) {
    const text = element.textContent;
    const number = parseFloat(text.match(/[\d.]+/)?.[0] || 0);
    const unit = text.replace(/[\d.]+/, '');
    
    if (number > 0) {
        let current = 0;
        const increment = number / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            element.textContent = current.toFixed(number % 1 === 0 ? 0 : 1) + unit;
        }, 40);
    }
}

// Card expansion functionality
function expandCard(cardType) {
    const card = event.currentTarget;
    
    // Add expansion animation
    card.style.transform = 'scale(1.05)';
    card.style.zIndex = '10';
    
    // Reset after animation
    setTimeout(() => {
        card.style.transform = '';
        card.style.zIndex = '';
    }, 300);
    
    // Show detailed view based on card type
    switch(cardType) {
        case 'weather':
            showWeatherDetails();
            break;
        case 'soil':
            showSoilDetails();
            break;
        case 'crop':
            showCropDetails();
            break;
    }
}

// Detailed view functions
function showWeatherDetails() {
    alert('🌤 7-Day Weather Forecast\n\nDetailed weather trends and predictions would be displayed here with interactive charts showing temperature, rainfall, humidity, and wind patterns.');
}

function showSoilDetails() {
    alert('🌱 Soil Analysis Details\n\nDetailed soil composition analysis would be displayed here, including moisture levels at different depths (10cm vs 1m) and nutrient distribution maps.');
}

function showCropDetails() {
    alert('🌾 Crop Management Simulator\n\nInteractive "What if?" simulator would be displayed here, allowing you to toggle irrigation, fertilization, and other factors to see instant yield predictions.');
}

// Tooltip setup
function setupTooltips() {
    const cards = document.querySelectorAll('.card-hover');
    
    cards.forEach(card => {
        const tooltip = card.querySelector('.tooltip');
        if (tooltip) {
            card.addEventListener('mouseenter', () => {
                tooltip.classList.add('show');
            });
            
            card.addEventListener('mouseleave', () => {
                tooltip.classList.remove('show');
            });
        }
    });
}

// Smooth scroll for navigation
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// Add fade-in animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-fade-in {
        animation: fadeIn 0.8s ease-out forwards;
    }
    
    .farm-marker {
        background: none;
        border: none;
        font-size: 24px;
    }
`;
document.head.appendChild(style);

// Add interactive features
document.addEventListener('click', function(e) {
    // Quick action buttons
    if (e.target.closest('button')) {
        const button = e.target.closest('button');
        const text = button.textContent.trim();
        
        if (text.includes('Irrigate')) {
            showIrrigationDialog();
        } else if (text.includes('Fertilize')) {
            showFertilizationDialog();
        } else if (text.includes('Harvest')) {
            showHarvestDialog();
        }
    }
});

function showIrrigationDialog() {
    alert('🚰 Irrigation System\n\nOptimal irrigation schedule calculated based on:\n• Current soil moisture: 78%\n• Weather forecast: Light rain expected\n• Crop water requirements: Moderate\n\nRecommendation: Delay irrigation for 2 days');
}

function showFertilizationDialog() {
    alert('🌱 Fertilization Planner\n\nNutrient analysis shows:\n• Nitrogen: 85% (Good)\n• Phosphorus: 72% (Moderate)\n• Potassium: 91% (Excellent)\n\nRecommendation: Apply phosphorus-rich fertilizer in 1 week');
}

function showHarvestDialog() {
    alert('🌾 Harvest Optimizer\n\nCrop maturity analysis:\n• Growth progress: 85%\n• Estimated harvest date: 15 days\n• Expected yield: 4.2 t/ha\n• Quality grade: Premium\n\nOptimal harvest window: March 15-20');
}

// Sustainability Gauge
let sustainabilityScore = 92;
let sustainabilityGaugeCtx;

function initializeSustainabilityGauge() {
    const canvas = document.getElementById('sustainabilityGauge');
    if (!canvas) return;
    sustainabilityGaugeCtx = canvas.getContext('2d');
    drawSustainabilityGauge(sustainabilityScore);
    // Hook up interactive buttons
    document.querySelectorAll('[data-action][data-delta]').forEach(btn => {
        btn.addEventListener('click', () => {
            const delta = parseInt(btn.getAttribute('data-delta')) || 0;
            adjustSustainabilityScore(delta);
        });
    });
}

function adjustSustainabilityScore(delta) {
    sustainabilityScore = Math.max(0, Math.min(100, sustainabilityScore + delta));
    drawSustainabilityGauge(sustainabilityScore, true);
    const textEl = document.getElementById('sustainabilityScoreText');
    if (textEl) textEl.textContent = sustainabilityScore.toString();
}

function drawSustainabilityGauge(score, animate = false) {
    if (!sustainabilityGaugeCtx) return;
    const ctx = sustainabilityGaugeCtx;
    const { width, height } = ctx.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 8;
    const startAngle = Math.PI * 0.75; // 135deg
    const endAngle = Math.PI * 2.25; // 405deg
    const targetAngle = startAngle + (endAngle - startAngle) * (score / 100);

    let current = animate ? 0 : score;
    const steps = animate ? 30 : 1;
    const increment = (score - current) / steps;

    function renderFrame() {
        ctx.clearRect(0, 0, width, height);

        // Track background
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Gradient arc
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(0.6, '#34d399');
        gradient.addColorStop(1, '#6ee7b7');

        const currentAngle = startAngle + (endAngle - startAngle) * (current / 100);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, currentAngle);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Tick marks
        for (let i = 0; i <= 10; i++) {
            const t = i / 10;
            const angle = startAngle + (endAngle - startAngle) * t;
            const inner = radius - 14;
            const outer = radius + 2;
            ctx.beginPath();
            ctx.moveTo(centerX + inner * Math.cos(angle), centerY + inner * Math.sin(angle));
            ctx.lineTo(centerX + outer * Math.cos(angle), centerY + outer * Math.sin(angle));
            ctx.strokeStyle = 'rgba(255,255,255,0.25)';
            ctx.lineWidth = i % 5 === 0 ? 2 : 1;
            ctx.stroke();
        }

        if (animate && Math.abs(current - score) > 0.01) {
            current += increment;
            requestAnimationFrame(renderFrame);
        }
    }

    renderFrame();
}

// Horizontal scroll video gallery logic
function initializeHorizontalGallery() {
    const outer = document.querySelector('#scrollGallery .hscroll-outer');
    const track = document.querySelector('#scrollGallery .hscroll-track');
    if (!outer || !track) return;

    // Calculate total scroll width
    const cards = Array.from(track.children);
    const totalWidth = cards.reduce((sum, el) => sum + el.getBoundingClientRect().width, 0) + (cards.length - 1) * 24 + 48;
    const viewport = outer.getBoundingClientRect().width;
    const maxTranslate = Math.max(0, totalWidth - viewport);

    const sticky = document.querySelector('#scrollGallery .hscroll-sticky');
    const start = outer.offsetTop;
    const duration = outer.offsetHeight - sticky.offsetHeight;

    function onScroll() {
        const scrollY = window.scrollY || window.pageYOffset;
        const progress = Math.min(1, Math.max(0, (scrollY - start) / duration));
        const translateX = -maxTranslate * progress;
        track.style.transform = `translate3d(${translateX}px, 0, 0)`;

        // Auto-play/pause videos based on visibility
        cards.forEach(card => {
            const video = card.querySelector('video');
            if (!video) return;
            const rect = card.getBoundingClientRect();
            const visible = rect.right > 80 && rect.left < (window.innerWidth - 80);
            if (visible) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }

    // Hover autoplay
    track.querySelectorAll('video').forEach(v => {
        v.addEventListener('mouseenter', () => v.play().catch(() => {}));
        v.addEventListener('mouseleave', () => v.pause());
    });

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => setTimeout(initializeHorizontalGallery, 50), { once: true });
}

// Hide header on scroll down, show on scroll up
(function hideHeaderOnScroll(){
    const header = document.getElementById('mainHeader');
    if (!header) return;
    let lastY = window.scrollY || 0;
    function onScroll(){
        const y = window.scrollY || 0;
        const goingDown = y > lastY && y > 40; // ignore tiny movements
        header.style.transition = 'transform 0.35s ease, opacity 0.25s ease';
        if (goingDown) {
            header.style.transform = 'translateY(-100%)';
            header.style.opacity = '0';
        } else {
            header.style.transform = 'translateY(0)';
            header.style.opacity = '1';
        }
        lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
})();

// Fact Carousel functionality
let currentFactIndex = 0;
let factCarouselInterval;
const factSlides = document.querySelectorAll('.fact-slide');
const indicators = document.querySelectorAll('.indicator');

function initializeFactCarousel() {
    if (!document.getElementById('factCarousel')) return;
    
    // Set up indicator click handlers
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToFact(index);
        });
    });
    
    // Start auto-rotation
    startFactRotation();
    
    // Pause on hover
    const carouselContainer = document.querySelector('.fact-carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', pauseFactRotation);
        carouselContainer.addEventListener('mouseleave', startFactRotation);
    }
}

function startFactRotation() {
    if (factCarouselInterval) clearInterval(factCarouselInterval);
    factCarouselInterval = setInterval(() => {
        nextFact();
    }, 4000); // Change every 4 seconds
}

function pauseFactRotation() {
    if (factCarouselInterval) {
        clearInterval(factCarouselInterval);
        factCarouselInterval = null;
    }
}

function nextFact() {
    const nextIndex = (currentFactIndex + 1) % factSlides.length;
    goToFact(nextIndex);
}

function goToFact(index) {
    if (index === currentFactIndex) return;
    
    // Add special effect for manual navigation
    const container = document.querySelector('.fact-carousel-container');
    if (container) {
        container.style.transform = 'scale(0.98)';
        setTimeout(() => {
            container.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Remove active classes
    factSlides[currentFactIndex].classList.remove('active');
    indicators[currentFactIndex].classList.remove('active');
    
    // Add prev class to current slide for smooth transition
    factSlides[currentFactIndex].classList.add('prev');
    
    // Update current index
    currentFactIndex = index;
    
    // Add active classes with enhanced animation
    factSlides[currentFactIndex].classList.add('active');
    indicators[currentFactIndex].classList.add('active');
    
    // Add sparkle effect
    createSparkleEffect();
    
    // Remove prev class after transition
    setTimeout(() => {
        factSlides.forEach(slide => slide.classList.remove('prev'));
    }, 1200);
}

function createSparkleEffect() {
    const container = document.querySelector('.fact-carousel-container');
    if (!container) return;
    
    for (let i = 0; i < 4; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 20;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: sparkleEffect 1.2s ease-out forwards;
        `;
        
        container.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 1200);
    }
}

// Add sparkle animation CSS
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleEffect {
        0% {
            opacity: 0;
            transform: scale(0);
        }
        50% {
            opacity: 1;
            transform: scale(1.2);
        }
        100% {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(sparkleStyle);

// Farmer's Voices Carousel Functionality
class FarmersCarousel {
    constructor() {
        this.carousel = document.getElementById('farmersCarousel');
        this.indicators = document.querySelectorAll('.farmer-indicator');
        this.cards = document.querySelectorAll('.farmer-card');
        this.currentIndex = 0;
        this.autoSlideInterval = null;
        
        console.log('FarmersCarousel found:', this.carousel ? 'Yes' : 'No');
        console.log('FarmersCarousel indicators:', this.indicators.length);
        console.log('FarmersCarousel cards:', this.cards.length);
        
        if (this.carousel && this.indicators.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.startAutoSlide();
    }
    
    bindEvents() {
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoSlide();
            });
        });
        
        // Pause auto-slide on hover
        if (this.carousel) {
            this.carousel.addEventListener('mouseenter', () => {
                this.stopAutoSlide();
            });
            
            this.carousel.addEventListener('mouseleave', () => {
                this.startAutoSlide();
            });
        }
    }
    
    goToSlide(index) {
        if (index === this.currentIndex) return;
        
        // Remove active classes
        this.cards.forEach(card => card.classList.remove('active', 'prev'));
        this.indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add prev class to current card
        this.cards[this.currentIndex].classList.add('prev');
        
        // Set new active card and indicator
        this.currentIndex = index;
        this.cards[this.currentIndex].classList.add('active');
        this.indicators[this.currentIndex].classList.add('active');
        
        // Remove prev class after animation
        setTimeout(() => {
            this.cards.forEach(card => card.classList.remove('prev'));
        }, 800);
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.cards.length;
        this.goToSlide(nextIndex);
    }
    
    startAutoSlide() {
        this.stopAutoSlide();
        console.log('Starting FarmersCarousel auto slide with 4 second interval');
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 4000); // Change slide every 4 seconds
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    resetAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
}

// Initialize both carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing carousels...');
    new FarmersCarousel();
    initializeFactCarousel();
});