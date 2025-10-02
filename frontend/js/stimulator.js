// Challenge Data
        const challenges = [
            // EASY
            {
                id: 1,
                title: "Optimizing Irrigation in Punjab",
                location: "Punjab, India",
                description: "Use NASA SMAP soil moisture data to optimize wheat irrigation timing and reduce water waste.",
                icon: "🌱",
                difficulty: "easy",
                temperature: "28°C",
                soilMoisture: "45%",
                budget: "$5,000",
                datasets: ["SMAP (Soil Moisture)", "GPM (Rainfall)"],
                goal: "Reduce irrigation by 20% without lowering wheat yield below 4 t/ha"
            },
            {
                id: 2,
                title: "Flood-Resistant Rice Planting",
                location: "Dhaka, Bangladesh",
                description: "Adjust rice planting windows using MODIS flood data to avoid peak flooding periods.",
                icon: "🌾",
                difficulty: "easy",
                temperature: "32°C",
                soilMoisture: "85%",
                budget: "$3,500",
                datasets: ["MODIS (Flood Extent)", "GPM (Rainfall)"],
                goal: "Plant rice to avoid 2 weeks of peak flooding while maintaining yield"
            },
            {
                id: 3,
                title: "Drought Planning in Kenya",
                location: "Turkana, Kenya",
                description: "Manage water resources using NASA SMAP and NDVI data during dry spells.",
                icon: "🌵",
                difficulty: "easy",
                temperature: "35°C",
                soilMoisture: "25%",
                budget: "$2,500",
                datasets: ["SMAP (Soil Moisture)", "MODIS NDVI (Vegetation Health)"],
                goal: "Keep 70% of crops alive during drought conditions"
            },
            {
                id: 4,
                title: "Heatwave Readiness in California Vineyards",
                location: "Napa Valley, USA",
                description: "Use ECOSTRESS temperature data to reduce heat stress impacts on grapes during heatwaves.",
                icon: "🍇",
                difficulty: "easy",
                temperature: "38°C",
                soilMoisture: "35%",
                budget: "$8,000",
                datasets: ["ECOSTRESS (Temperature)", "MODIS LST (Land Surface Temp)"],
                goal: "Reduce heat stress impacts on grapes during 1-week heatwave"
            },
            {
                id: 5,
                title: "Rainfall Prediction for Maize in Nigeria",
                location: "Kano, Nigeria",
                description: "Time maize planting using GPM rainfall forecasts to maximize rainfall benefits.",
                icon: "🌽",
                difficulty: "easy",
                temperature: "31°C",
                soilMoisture: "55%",
                budget: "$4,200",
                datasets: ["GPM (Rainfall Forecasts)", "GLDAS (Hydrology)"],
                goal: "Time maize planting to maximize rainfall benefits"
            },
            {
                id: 6,
                title: "Soil Fertility Balance in Brazil",
                location: "Mato Grosso, Brazil",
                description: "Apply fertilizer efficiently using soil moisture and vegetation data to boost yield.",
                icon: "🌿",
                difficulty: "easy",
                temperature: "29°C",
                soilMoisture: "60%",
                budget: "$6,500",
                datasets: ["SMAP (Soil Moisture)", "MODIS (Vegetation Indices)"],
                goal: "Apply fertilizer efficiently to raise yield by 10% while reducing cost"
            },
            // MEDIUM
            {
                id: 7,
                title: "Cold Snap Protection in France's Vineyards",
                location: "Bordeaux, France",
                description: "Minimize frost damage by deploying protective irrigation and frost covers using temperature data.",
                icon: "🥶",
                difficulty: "medium",
                temperature: "2°C",
                soilMoisture: "70%",
                budget: "$12,000",
                datasets: ["MODIS LST", "ECOSTRESS (Frost/Temperature)"],
                goal: "Minimize frost damage by deploying protective irrigation/frost covers"
            },
            {
                id: 8,
                title: "Drought and Livestock Migration in Ethiopia",
                location: "Somali Region, Ethiopia",
                description: "Relocate livestock to green zones using soil moisture and pasture condition data.",
                icon: "🐄",
                difficulty: "medium",
                temperature: "37°C",
                soilMoisture: "18%",
                budget: "$7,500",
                datasets: ["SMAP (Soil Moisture)", "MODIS NDVI (Pasture Condition)"],
                goal: "Relocate 80% of livestock to green zones to avoid mass die-off"
            },
            {
                id: 9,
                title: "Flood Recovery in Pakistan's Sindh Province",
                location: "Sindh, Pakistan",
                description: "Identify safe replanting zones after monsoon flooding using flood maps and land use data.",
                icon: "🌊",
                difficulty: "medium",
                temperature: "33°C",
                soilMoisture: "95%",
                budget: "$5,800",
                datasets: ["MODIS (Flood Maps)", "Landsat (Land Use Change)"],
                goal: "Identify safe replanting zones after monsoon flooding"
            },
            {
                id: 10,
                title: "Pest Outbreak in Vietnam Rice Fields",
                location: "Mekong Delta, Vietnam",
                description: "Detect early pest outbreak using NDVI anomalies and save crops before widespread damage.",
                icon: "🦗",
                difficulty: "medium",
                temperature: "30°C",
                soilMoisture: "80%",
                budget: "$4,800",
                datasets: ["MODIS NDVI (Crop Stress)", "ECOSTRESS (Canopy Temp)"],
                goal: "Detect early pest outbreak using NDVI anomalies & save 70% of crops"
            },
            {
                id: 11,
                title: "Sustainable Water Use in Arizona",
                location: "Arizona Desert, USA",
                description: "Balance groundwater extraction using GRACE and SMAP data to reduce aquifer depletion.",
                icon: "💧",
                difficulty: "medium",
                temperature: "40°C",
                soilMoisture: "15%",
                budget: "$15,000",
                datasets: ["GRACE (Groundwater)", "SMAP (Soil Moisture)"],
                goal: "Balance groundwater extraction to reduce aquifer depletion by 25%"
            },
            {
                id: 12,
                title: "Soil Nutrient Loss in Ukraine Wheat Belt",
                location: "Dnipro, Ukraine",
                description: "Improve soil health using NDVI and soil fertility data while maintaining steady yields.",
                icon: "🌾",
                difficulty: "medium",
                temperature: "24°C",
                soilMoisture: "50%",
                budget: "$9,200",
                datasets: ["MODIS NDVI", "Crop-CASMA (Soil Moisture & Fertility)"],
                goal: "Improve soil health while keeping yields steady despite nutrient depletion"
            },
            // HARD
            {
                id: 13,
                title: "Mega Drought in California",
                location: "Central Valley, California, USA",
                description: "Navigate a 3-year drought using groundwater, soil moisture, and heat stress data to save crops.",
                icon: "🔥",
                difficulty: "hard",
                temperature: "42°C",
                soilMoisture: "12%",
                budget: "$25,000",
                datasets: ["GRACE (Groundwater)", "SMAP (Soil Moisture)", "ECOSTRESS (Heat Stress)"],
                goal: "Save 60% of crops and maintain farm profits during a 3-year drought"
            },
            {
                id: 14,
                title: "Cyclone Crop Recovery in Mozambique",
                location: "Beira, Mozambique",
                description: "Replant crops quickly in cyclone-affected zones using flood and land cover change data.",
                icon: "🌀",
                difficulty: "hard",
                temperature: "28°C",
                soilMoisture: "90%",
                budget: "$8,500",
                datasets: ["MODIS (Flood)", "Landsat (Land Cover Change)", "GPM (Rainfall)"],
                goal: "Replant crops quickly in cyclone-affected zones to restore 70% production"
            },
            {
                id: 15,
                title: "Heat-Induced Livestock Migration in Australia",
                location: "Northern Territory, Australia",
                description: "Relocate cattle during extreme heatwaves using heat and pasture data to keep herd healthy.",
                icon: "🐂",
                difficulty: "hard",
                temperature: "45°C",
                soilMoisture: "8%",
                budget: "$18,000",
                datasets: ["ECOSTRESS (Heat)", "MODIS NDVI (Pasture)"],
                goal: "Relocate cattle during extreme heatwaves and keep 75% herd healthy"
            },
            {
                id: 16,
                title: "Monsoon Flood & Pest Double Impact in India",
                location: "Bihar, India",
                description: "Manage dual threats of floods and pest outbreaks using multiple NASA datasets.",
                icon: "🌧️",
                difficulty: "hard",
                temperature: "34°C",
                soilMoisture: "88%",
                budget: "$6,800",
                datasets: ["MODIS (Flood)", "NDVI (Vegetation Stress)", "GPM (Rainfall)"],
                goal: "Manage dual threats (floods + pest outbreaks) while sustaining 65% yield"
            },
            {
                id: 17,
                title: "Sea Level Rise in Bangladesh Farmlands",
                location: "Coastal Bangladesh",
                description: "Adapt farming methods to sea level rise using flood, groundwater, and sea level data.",
                icon: "🌊",
                difficulty: "hard",
                temperature: "31°C",
                soilMoisture: "92%",
                budget: "$11,000",
                datasets: ["MODIS (Flood)", "GRACE (Groundwater)", "Sea Level Data"],
                goal: "Adapt farming methods (salt-tolerant crops, raised beds) to protect 70% farmland"
            },
            {
                id: 18,
                title: "Climate-Smart Farming Transition in Sub-Saharan Africa",
                location: "Ghana, Africa",
                description: "Shift from monocropping to mixed sustainable farming using comprehensive NASA datasets.",
                icon: "🌍",
                difficulty: "hard",
                temperature: "33°C",
                soilMoisture: "42%",
                budget: "$14,500",
                datasets: ["MODIS NDVI", "ECOSTRESS (Temp)", "SMAP (Soil Moisture)", "NASA Harvest Data"],
                goal: "Shift from monocropping to mixed sustainable farming while keeping income stable"
            }
        ];

        // State
        let points = 0;
        let completedChallenges = new Set();
        let currentFilter = 'all';

        // Render challenges
        function renderChallenges(filteredChallenges = challenges) {
            const grid = document.getElementById('challengesGrid');
            
            if (filteredChallenges.length === 0) {
                grid.innerHTML = '<div class="no-results">No challenges found. Try a different search or filter.</div>';
                return;
            }

            grid.innerHTML = filteredChallenges.map(challenge => `
                <div class="challenge-card" data-difficulty="${challenge.difficulty}">
                    <div class="card-header">
                        <div class="card-icon">${challenge.icon}</div>
                        <div class="card-meta">
                            <div class="difficulty-badge ${challenge.difficulty}">${challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}</div>
                            <div class="points-badge">+100</div>
                        </div>
                    </div>
                    
                    <div class="card-title">${challenge.title}</div>
                    
                    <div class="card-location">
                        <span>🌍</span>
                        <span>${challenge.location}</span>
                    </div>
                    
                    <div class="card-description">${challenge.description}</div>
                    
                    <div class="card-metrics">
                        <div class="metric-row">
                            <span class="metric-label">Temperature</span>
                            <span class="metric-value">${challenge.temperature}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Soil Moisture</span>
                            <span class="metric-value">${challenge.soilMoisture}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Budget</span>
                            <span class="metric-value">${challenge.budget}</span>
                        </div>
                    </div>
                    
                    <div>
                        <div class="dataset-label">NASA Datasets:</div>
                        <div class="nasa-datasets">
                            ${challenge.datasets.map(dataset => `
                                <span class="dataset-badge">${dataset}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="card-goal">
                        <div class="goal-label">Goal:</div>
                        <div class="goal-text">${challenge.goal}</div>
                    </div>
                    
                    <button class="launch-btn" onclick="launchChallenge(${challenge.id})">
                        Launch Challenge
                    </button>
                </div>
            `).join('');
        }

        // Launch challenge
        function launchChallenge(id) {
            // if (!completedChallenges.has(id)) {
            //     completedChallenges.add(id);
            //     points += 100;
            //     updatePoints();
                
            //     if (points % 500 === 0) {
            //         showNotification();
            //     }
            // }
            
            window.location.href = `launch.html?id=${id}`; 
        }

        // Update points display
        function updatePoints() {
            document.getElementById('pointsValue').textContent = points;
        }

        // Show tree notification
        function showNotification() {
            const notification = document.getElementById('notification');
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 4000);
        }

        // Filter functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                currentFilter = this.dataset.filter;
                applyFilters();
            });
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', function(e) {
            applyFilters();
        });

        // Apply filters
        function applyFilters() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            
            let filtered = challenges;
            
            // Filter by difficulty
            if (currentFilter !== 'all') {
                filtered = filtered.filter(c => c.difficulty === currentFilter);
            }
            
            // Filter by search term
            if (searchTerm) {
                filtered = filtered.filter(c => 
                    c.title.toLowerCase().includes(searchTerm) ||
                    c.location.toLowerCase().includes(searchTerm) ||
                    c.description.toLowerCase().includes(searchTerm) ||
                    c.goal.toLowerCase().includes(searchTerm) ||
                    c.datasets.some(d => d.toLowerCase().includes(searchTerm))
                );
            }
            
            renderChallenges(filtered);
        }

        // Tutorial modal functions
        function openTutorial() {
            document.getElementById('tutorialModal').classList.add('active');
        }

        function closeTutorial() {
            document.getElementById('tutorialModal').classList.remove('active');
        }

        // Close modal when clicking outside
        document.getElementById('tutorialModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeTutorial();
            }
        });

        // Initial render
        renderChallenges();