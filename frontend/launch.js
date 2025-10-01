// --- BACKEND-CONNECTED SCRIPT ---

      const API_BASE_URL = "http://127.0.0.1:8000"; // Your backend URL
      // Extract challenge ID from URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      let currentChallengeId = parseInt(urlParams.get('id')) || 1; // Default to challenge 1
      let initialBudget = 0;

      // Field type configurations for different challenges
const FIELD_TYPES = {
  wheat: {
    groundColor: 0x3c2415,  // Dark brown
    skyColor: 0x87ceeb,      // Light blue
    cropColors: [0x4ade80, 0x16a34a, 0xca8a04, 0xfbbf24],
    fieldPattern: 'rows',
    cropHeight: [0.3, 0.8, 1.4, 1.8],
    cropType: 'wheat'
  },
  rice: {
    groundColor: 0x2d5016,  // Dark green-brown (wet soil)
    skyColor: 0xa0c4ff,      // Lighter blue
    cropColors: [0x65a30d, 0x84cc16, 0xa3e635, 0xd9f99d],
    fieldPattern: 'flooded',
    cropHeight: [0.2, 0.5, 0.9, 1.2],
    waterLevel: true,
    cropType: 'rice'
  },
  maize: {
    groundColor: 0x654321,  // Brown
    skyColor: 0x89CFF0,      // Baby blue
    cropColors: [0x84cc16, 0x65a30d, 0xeab308, 0xf59e0b],
    fieldPattern: 'rows',
    cropHeight: [0.4, 1.0, 1.8, 2.5],
    cropType: 'maize'
  },
  vineyard: {
    groundColor: 0x8b7355,  // Tan/sandy
    skyColor: 0x4a90e2,      // Mediterranean blue
    cropColors: [0x16a34a, 0x15803d, 0x7c2d12, 0xa16207],
    fieldPattern: 'vines',
    cropHeight: [0.3, 0.6, 0.9, 1.2],
    hasTrellis: true,
    cropType: 'grapes'
  },
  desert: {
    groundColor: 0xc19a6b,  // Sand
    skyColor: 0xe6f3ff,      // Very light blue
    cropColors: [0x84cc16, 0x65a30d, 0xa3e635, 0xca8a04],
    fieldPattern: 'sparse',
    cropHeight: [0.2, 0.4, 0.7, 1.0],
    cropType: 'drought-resistant'
  },
  livestock: {
    groundColor: 0x8b7355,  // Dry grassland
    skyColor: 0x87ceeb,      // Sky blue
    cropColors: [0xeab308, 0xf59e0b, 0xb45309],
    fieldPattern: 'grassland',
    cropHeight: [0.1, 0.2, 0.3, 0.4],
    hasAnimals: true,
    cropType: 'grass'
  }
};

// Map challenge IDs to field types
const CHALLENGE_FIELD_MAP = {
  1: 'wheat',      // Punjab - wheat
  2: 'rice',       // Dhaka - rice paddies
  3: 'maize',      // Kenya - maize
  4: 'vineyard',   // California - vineyards
  5: 'maize',      // Nigeria - maize
  6: 'wheat',      // Brazil - crops
  7: 'vineyard',   // France - vineyards
  8: 'livestock',  // Ethiopia - livestock grazing
  9: 'rice',       // Pakistan - flood recovery
  10: 'rice',      // Vietnam - rice fields
  11: 'desert',    // Arizona - desert farming
  12: 'wheat',     // Ukraine - wheat belt
  13: 'desert',    // California - mega drought
  14: 'maize',     // Mozambique - crops
  15: 'livestock', // Australia - livestock
  16: 'rice',      // India - monsoon rice
  17: 'rice',      // Bangladesh - coastal rice
  18: 'maize'      // Ghana - maize farming
};


      let gameState = {
      soil_moisture: 10,        // renamed from soilMoisture
      crop_health: 25,          // renamed from vegetationHealth
      livestock_health: 60,     // keep same naming
      budget: 2000,
      yield_estimate: 0,        // renamed from yieldEstimate
      day: 1                    // renamed from currentDay
      };

      let scene,
        camera,
        renderer,
        fieldGroup,
        cropMeshes = [];

      const insights = [
        "SMAP monitors soil moisture globally from space, helping farmers optimize irrigation timing.",
        "MODIS tracks vegetation health through NDVI, showing crop stress before it's visible to the eye.",
        "ECOSTRESS measures plant temperature from space, detecting water stress in crops.",
        "GRACE monitors groundwater levels, crucial for irrigation planning in drought-prone areas.",
        "GPM provides rainfall data helping farmers predict water availability for their crops.",
      ];

      let currentInsightIndex = 0;

    //   function initThreeJS() {
    //     const container = document.getElementById("field3d");
    //     const width = container.clientWidth;
    //     const height = container.clientHeight;

    //     scene = new THREE.Scene();
    //     scene.background = new THREE.Color(0x87ceeb); // Sky blue for daytime
    //     scene.fog = new THREE.Fog(0x87ceeb, 50, 200);

    //     camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    //     camera.position.set(0, 15, 20);
    //     camera.lookAt(0, 0, 0);

    //     renderer = new THREE.WebGLRenderer({ antialias: true });
    //     renderer.setSize(width, height);
    //     renderer.shadowMap.enabled = true;
    //     container.appendChild(renderer.domElement);

    //     // Lights - Daytime atmosphere
    //     const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Brighter ambient for daytime
    //     scene.add(ambientLight);

    //     const directionalLight = new THREE.DirectionalLight(0xffd700, 1.2); // Golden sunlight
    //     directionalLight.position.set(50, 100, 50); // Higher sun position
    //     directionalLight.castShadow = true;
    //     directionalLight.shadow.mapSize.width = 2048;
    //     directionalLight.shadow.mapSize.height = 2048;
    //     directionalLight.shadow.camera.near = 0.1;
    //     directionalLight.shadow.camera.far = 500;
    //     directionalLight.shadow.camera.left = -100;
    //     directionalLight.shadow.camera.right = 100;
    //     directionalLight.shadow.camera.top = 100;
    //     directionalLight.shadow.camera.bottom = -100;
    //     scene.add(directionalLight);

    //     // Remove green light for daytime

    //     // Ground - Dark brown base
    //     const groundGeometry = new THREE.PlaneGeometry(30, 30);
    //     const groundMaterial = new THREE.MeshStandardMaterial({
    //       color: 0x3c2415, // Dark brown base color
    //       roughness: 0.9,
    //       metalness: 0.1,
    //     });
    //     const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    //     ground.rotation.x = -Math.PI / 2;
    //     ground.receiveShadow = true;
    //     scene.add(ground);

    //     fieldGroup = new THREE.Group();
    //     scene.add(fieldGroup);

    //     const rows = 8,
    //       cols = 10,
    //       spacing = 2.5;
    //     for (let i = 0; i < rows; i++) {
    //       for (let j = 0; j < cols; j++) {
    //         const x = (j - cols / 2) * spacing;
    //         const z = (i - rows / 2) * spacing;

    //         // Soil plot - Brown soil
    //         const plotGeometry = new THREE.BoxGeometry(2, 0.3, 2);
    //         const plotMaterial = new THREE.MeshStandardMaterial({
    //           color: 0x8b4513, // Brown soil color
    //           roughness: 0.9,
    //         });
    //         const plot = new THREE.Mesh(plotGeometry, plotMaterial);
    //         plot.position.set(x, 0.15, z);
    //         plot.castShadow = true;
    //         plot.receiveShadow = true;
    //         fieldGroup.add(plot);

    //         const cropGroup = new THREE.Group();
    //         cropGroup.position.set(x, 0.3, z);
    //         cropGroup.userData.stage = 0;
    //         fieldGroup.add(cropGroup);
    //         cropMeshes.push(cropGroup);
    //       }
    //     }

    //     // Add some clouds for daytime atmosphere
    //     const cloudGeometry = new THREE.SphereGeometry(5, 8, 8);
    //     const cloudMaterial = new THREE.MeshBasicMaterial({
    //       color: 0xffffff,
    //       transparent: true,
    //       opacity: 0.7,
    //     });

    //     // Add a few clouds
    //     for (let i = 0; i < 3; i++) {
    //       const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
    //       cloud.position.set(
    //         (Math.random() - 0.5) * 60,
    //         25 + Math.random() * 10,
    //         (Math.random() - 0.5) * 60
    //       );
    //       cloud.scale.setScalar(0.5 + Math.random() * 0.5);
    //       scene.add(cloud);
    //     }

    //     animate();
    //   }

    function initThreeJS() {
  // Get field type based on challenge ID
  const fieldType = CHALLENGE_FIELD_MAP[currentChallengeId] || 'wheat';
  const config = FIELD_TYPES[fieldType];
  
  const container = document.getElementById("field3d");
  const width = container.clientWidth;
  const height = container.clientHeight;

  scene = new THREE.Scene();
  
  // Use field-specific sky color
  scene.background = new THREE.Color(config.skyColor);
  scene.fog = new THREE.Fog(config.skyColor, 50, 200);

  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0, 15, 20);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffd700, 1.2);
  directionalLight.position.set(50, 100, 50);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  // Ground with field-specific color
  const groundGeometry = new THREE.PlaneGeometry(30, 30);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: config.groundColor,
    roughness: 0.9,
    metalness: 0.1,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Add water layer for rice paddies
  if (config.waterLevel) {
    const waterGeometry = new THREE.PlaneGeometry(30, 30);
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a90e2,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.8,
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.05;
    scene.add(water);
  }

  fieldGroup = new THREE.Group();
  scene.add(fieldGroup);

  // Create crops based on field type
  createFieldCrops(config);

  animate();
}


function createFieldCrops(config) {
  const rows = config.fieldPattern === 'sparse' ? 6 : 8;
  const cols = config.fieldPattern === 'sparse' ? 8 : 10;
  const spacing = config.fieldPattern === 'vines' ? 3.5 : 2.5;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // Skip some positions for sparse desert farming
      if (config.fieldPattern === 'sparse' && Math.random() > 0.6) continue;

      const x = (j - cols / 2) * spacing;
      const z = (i - rows / 2) * spacing;

      // Soil plot
      const plotGeometry = new THREE.BoxGeometry(2, 0.3, 2);
      const plotMaterial = new THREE.MeshStandardMaterial({
        color: config.groundColor,
        roughness: 0.9,
      });
      const plot = new THREE.Mesh(plotGeometry, plotMaterial);
      plot.position.set(x, 0.15, z);
      plot.castShadow = true;
      plot.receiveShadow = true;
      fieldGroup.add(plot);

      // Add trellis for vineyards
      if (config.hasTrellis) {
        const postGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
        const postMat = new THREE.MeshStandardMaterial({ color: 0x4a3520 });
        const post = new THREE.Mesh(postGeo, postMat);
        post.position.set(x, 0.75, z);
        fieldGroup.add(post);
        
        const wireGeo = new THREE.CylinderGeometry(0.02, 0.02, 2, 4);
        const wireMat = new THREE.MeshStandardMaterial({ color: 0x808080 });
        const wire = new THREE.Mesh(wireGeo, wireMat);
        wire.rotation.z = Math.PI / 2;
        wire.position.set(x, 1.0, z);
        fieldGroup.add(wire);
      }

      // Create crop group
      const cropGroup = new THREE.Group();
      cropGroup.position.set(x, 0.3, z);
      cropGroup.userData.stage = 0;
      cropGroup.userData.fieldType = config.cropType;
      fieldGroup.add(cropGroup);
      cropMeshes.push(cropGroup);
    }
  }

  // Add simple animals for livestock challenges
  if (config.hasAnimals) {
    for (let i = 0; i < 3; i++) {
      const animalGeo = new THREE.BoxGeometry(0.5, 0.4, 0.8);
      const animalMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
      const animal = new THREE.Mesh(animalGeo, animalMat);
      animal.position.set(
        (Math.random() - 0.5) * 15,
        0.2,
        (Math.random() - 0.5) * 15
      );
      animal.castShadow = true;
      scene.add(animal);
    }
  }
}


      function createCropMesh(stage , fieldType='wheat') {
        const group = new THREE.Group();

         // ✅ ADD THIS ENTIRE SECTION
  // Get configuration for the field type
  const config = Object.values(FIELD_TYPES).find(f => f.cropType === fieldType) || FIELD_TYPES.wheat;
  const colors = config.cropColors;
  const heights = config.cropHeight;
  
  // Route to specialized functions for non-wheat crops
  if (fieldType === 'rice') {
    return createRicePlant(stage, colors, heights);
  } else if (fieldType === 'maize') {
    return createMaizePlant(stage, colors, heights);
  } else if (fieldType === 'grapes') {
    return createVinePlant(stage, colors, heights);
  } else if (fieldType === 'grass') {
    return createGrassland(stage, colors, heights);
  } else if (fieldType === 'drought-resistant') {
    return createDesertCrop(stage, colors, heights);
  }
  // ✅ END OF NEW SECTION

        if (stage === 1) {
          // Seedling stage - small green shoots
          for (let i = 0; i < 3; i++) {
            const shootGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.3, 6);
            const shootMat = new THREE.MeshStandardMaterial({
              color: 0x4ade80,
              roughness: 0.7,
            });
            const shoot = new THREE.Mesh(shootGeo, shootMat);
            shoot.position.set(
              (Math.random() - 0.5) * 0.3,
              0.15,
              (Math.random() - 0.5) * 0.3
            );
            shoot.rotation.z = (Math.random() - 0.5) * 0.2;
            shoot.castShadow = true;
            group.add(shoot);

            // Small blade leaves
            const bladeGeo = new THREE.PlaneGeometry(0.05, 0.2);
            const bladeMat = new THREE.MeshStandardMaterial({
              color: 0x22c55e,
              side: THREE.DoubleSide,
              roughness: 0.8,
            });
            const blade = new THREE.Mesh(bladeGeo, bladeMat);
            blade.position.set(shoot.position.x, 0.25, shoot.position.z);
            blade.rotation.y = Math.random() * Math.PI * 2;
            blade.castShadow = true;
            group.add(blade);
          }
        } else if (stage === 2) {
          // Tillering stage - multiple stems with longer leaves
          for (let i = 0; i < 5; i++) {
            const stemGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.8, 8);
            const stemMat = new THREE.MeshStandardMaterial({
              color: 0x16a34a,
              roughness: 0.6,
            });
            const stem = new THREE.Mesh(stemGeo, stemMat);
            stem.position.set(
              (Math.random() - 0.5) * 0.4,
              0.4,
              (Math.random() - 0.5) * 0.4
            );
            stem.rotation.z = (Math.random() - 0.5) * 0.15;
            stem.castShadow = true;
            group.add(stem);

            // Wheat blade leaves
            for (let j = 0; j < 3; j++) {
              const leafGeo = new THREE.PlaneGeometry(0.08, 0.6);
              const leafMat = new THREE.MeshStandardMaterial({
                color: 0x15803d,
                side: THREE.DoubleSide,
                roughness: 0.7,
              });
              const leaf = new THREE.Mesh(leafGeo, leafMat);
              leaf.position.set(
                stem.position.x + (Math.random() - 0.5) * 0.1,
                0.5 + j * 0.2,
                stem.position.z + (Math.random() - 0.5) * 0.1
              );
              leaf.rotation.y = Math.random() * Math.PI * 2;
              leaf.rotation.z = (Math.random() - 0.5) * 0.3;
              leaf.castShadow = true;
              group.add(leaf);
            }
          }
        } else if (stage === 3) {
          // Stem elongation - taller stems, early head formation
          for (let i = 0; i < 4; i++) {
            const stemGeo = new THREE.CylinderGeometry(0.04, 0.05, 1.4, 8);
            const stemMat = new THREE.MeshStandardMaterial({
              color: 0x166534,
              roughness: 0.5,
            });
            const stem = new THREE.Mesh(stemGeo, stemMat);
            stem.position.set(
              (Math.random() - 0.5) * 0.3,
              0.7,
              (Math.random() - 0.5) * 0.3
            );
            stem.rotation.z = (Math.random() - 0.5) * 0.1;
            stem.castShadow = true;
            group.add(stem);

            // Longer leaves
            for (let j = 0; j < 4; j++) {
              const leafGeo = new THREE.PlaneGeometry(0.1, 0.8);
              const leafMat = new THREE.MeshStandardMaterial({
                color: 0x15803d,
                side: THREE.DoubleSide,
                roughness: 0.6,
              });
              const leaf = new THREE.Mesh(leafGeo, leafMat);
              leaf.position.set(
                stem.position.x + (Math.random() - 0.5) * 0.08,
                0.6 + j * 0.2,
                stem.position.z + (Math.random() - 0.5) * 0.08
              );
              leaf.rotation.y = Math.random() * Math.PI * 2;
              leaf.rotation.z = (Math.random() - 0.5) * 0.4;
              leaf.castShadow = true;
              group.add(leaf);
            }

            // Early wheat head formation
            const headGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.3, 8);
            const headMat = new THREE.MeshStandardMaterial({
              color: 0x84cc16,
              roughness: 0.4,
            });
            const head = new THREE.Mesh(headGeo, headMat);
            head.position.set(stem.position.x, 1.5, stem.position.z);
            head.castShadow = true;
            group.add(head);
          }
        } else if (stage === 4) {
          // Mature wheat - full heads with grains
          for (let i = 0; i < 4; i++) {
            const stemGeo = new THREE.CylinderGeometry(0.05, 0.06, 1.8, 8);
            const stemMat = new THREE.MeshStandardMaterial({
              color: 0xca8a04,
              roughness: 0.4,
            });
            const stem = new THREE.Mesh(stemGeo, stemMat);
            stem.position.set(
              (Math.random() - 0.5) * 0.25,
              0.9,
              (Math.random() - 0.5) * 0.25
            );
            stem.castShadow = true;
            group.add(stem);

            // Mature leaves (yellowing)
            for (let j = 0; j < 3; j++) {
              const leafGeo = new THREE.PlaneGeometry(0.12, 0.9);
              const leafMat = new THREE.MeshStandardMaterial({
                color: 0xa3a3a3,
                side: THREE.DoubleSide,
                roughness: 0.8,
              });
              const leaf = new THREE.Mesh(leafGeo, leafMat);
              leaf.position.set(
                stem.position.x + (Math.random() - 0.5) * 0.06,
                0.8 + j * 0.2,
                stem.position.z + (Math.random() - 0.5) * 0.06
              );
              leaf.rotation.y = Math.random() * Math.PI * 2;
              leaf.rotation.z = (Math.random() - 0.5) * 0.5;
              leaf.castShadow = true;
              group.add(leaf);
            }

            // Mature wheat head with individual grains
            const headGeo = new THREE.CylinderGeometry(0.12, 0.08, 0.6, 8);
            const headMat = new THREE.MeshStandardMaterial({
              color: 0xfbbf24,
              roughness: 0.3,
            });
            const head = new THREE.Mesh(headGeo, headMat);
            head.position.set(stem.position.x, 2.1, stem.position.z);
            head.castShadow = true;
            group.add(head);

            // Individual wheat grains
            for (let k = 0; k < 12; k++) {
              const grainGeo = new THREE.SphereGeometry(0.02, 6, 6);
              const grainMat = new THREE.MeshStandardMaterial({
                color: 0xf59e0b,
                roughness: 0.2,
              });
              const grain = new THREE.Mesh(grainGeo, grainMat);
              const angle = (k / 12) * Math.PI * 2;
              const radius = 0.08 + (k % 3) * 0.02;
              grain.position.set(
                stem.position.x + Math.cos(angle) * radius,
                1.9 + (k % 4) * 0.1,
                stem.position.z + Math.sin(angle) * radius
              );
              grain.castShadow = true;
              group.add(grain);
            }

            // Awns (wheat bristles)
            for (let a = 0; a < 8; a++) {
              const awnGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.4, 4);
              const awnMat = new THREE.MeshStandardMaterial({
                color: 0xeab308,
                roughness: 0.9,
              });
              const awn = new THREE.Mesh(awnGeo, awnMat);
              const angle = (a / 8) * Math.PI * 2;
              awn.position.set(
                stem.position.x + Math.cos(angle) * 0.1,
                2.3,
                stem.position.z + Math.sin(angle) * 0.1
              );
              awn.rotation.z = Math.cos(angle) * 0.3;
              awn.rotation.x = Math.sin(angle) * 0.3;
              awn.castShadow = true;
              group.add(awn);
            }
          }
        } else if (stage === -1) {
          // Drought-stressed/dead wheat
          for (let i = 0; i < 2; i++) {
            const stemGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.6, 6);
            const stemMat = new THREE.MeshStandardMaterial({
              color: 0x78350f,
              roughness: 0.9,
            });
            const stem = new THREE.Mesh(stemGeo, stemMat);
            stem.position.set(
              (Math.random() - 0.5) * 0.4,
              0.3,
              (Math.random() - 0.5) * 0.4
            );
            stem.rotation.z = (Math.random() - 0.5) * 0.8;
            stem.castShadow = true;
            group.add(stem);

            // Withered leaves
            for (let j = 0; j < 2; j++) {
              const leafGeo = new THREE.PlaneGeometry(0.06, 0.4);
              const leafMat = new THREE.MeshStandardMaterial({
                color: 0x451a03,
                side: THREE.DoubleSide,
                roughness: 0.9,
              });
              const leaf = new THREE.Mesh(leafGeo, leafMat);
              leaf.position.set(
                stem.position.x + (Math.random() - 0.5) * 0.1,
                0.4 + j * 0.1,
                stem.position.z + (Math.random() - 0.5) * 0.1
              );
              leaf.rotation.y = Math.random() * Math.PI * 2;
              leaf.rotation.z = (Math.random() - 0.5) * 0.8;
              leaf.castShadow = true;
              group.add(leaf);
            }
          }
        }

        return group;
      }

      // ==========================================
// HELPER FUNCTION 1: Rice Plants
// ==========================================
function createRicePlant(stage, colors, heights) {
  const group = new THREE.Group();
  
  if (stage <= 0) return group; // Dead/stressed
  
  const numStems = stage === 1 ? 3 : stage === 2 ? 5 : 6;
  
  for (let i = 0; i < numStems; i++) {
    // Thin rice stems
    const stemGeo = new THREE.CylinderGeometry(0.015, 0.02, heights[stage-1], 6);
    const stemMat = new THREE.MeshStandardMaterial({ color: colors[stage-1] });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(
      (Math.random() - 0.5) * 0.3,
      heights[stage-1] / 2,
      (Math.random() - 0.5) * 0.3
    );
    stem.castShadow = true;
    group.add(stem);
    
    // Rice leaves - thin and droopy
    if (stage >= 2) {
      const leafGeo = new THREE.PlaneGeometry(0.06, 0.4);
      const leafMat = new THREE.MeshStandardMaterial({ 
        color: colors[Math.min(stage-1, colors.length-1)], 
        side: THREE.DoubleSide 
      });
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(stem.position.x, heights[stage-1] * 0.7, stem.position.z);
      leaf.rotation.y = Math.random() * Math.PI * 2;
      leaf.rotation.x = 0.3; // Droopy angle
      group.add(leaf);
    }
    
    // Rice grain head (stage 4)
    if (stage === 4) {
      const headGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const headMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.set(stem.position.x, heights[3] * 0.9, stem.position.z);
      head.scale.y = 1.5;
      head.castShadow = true;
      group.add(head);
    }
  }
  
  return group;
}

// ==========================================
// HELPER FUNCTION 2: Maize/Corn Plants
// ==========================================
function createMaizePlant(stage, colors, heights) {
  const group = new THREE.Group();
  
  if (stage <= 0) return group;
  
  const numStalks = stage === 1 ? 1 : 2;
  
  for (let i = 0; i < numStalks; i++) {
    // Thick maize stalk
    const stalkGeo = new THREE.CylinderGeometry(0.08, 0.1, heights[stage-1], 8);
    const stalkMat = new THREE.MeshStandardMaterial({ color: colors[stage-1] });
    const stalk = new THREE.Mesh(stalkGeo, stalkMat);
    stalk.position.set(
      (Math.random() - 0.5) * 0.2, 
      heights[stage-1] / 2, 
      (Math.random() - 0.5) * 0.2
    );
    stalk.castShadow = true;
    group.add(stalk);
    
    // Large corn leaves
    if (stage >= 2) {
      for (let j = 0; j < 4; j++) {
        const leafGeo = new THREE.PlaneGeometry(0.15, 0.8);
        const leafMat = new THREE.MeshStandardMaterial({ 
          color: colors[Math.min(stage-1, colors.length-1)], 
          side: THREE.DoubleSide 
        });
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.position.set(
          stalk.position.x,
          heights[stage-1] * 0.3 + j * 0.3,
          stalk.position.z
        );
        leaf.rotation.y = (j / 4) * Math.PI * 2;
        leaf.rotation.z = 0.4; // Angle outward
        group.add(leaf);
      }
    }
    
    // Corn cob (stage 4)
    if (stage === 4) {
      const cobGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.25, 8);
      const cobMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24 });
      const cob = new THREE.Mesh(cobGeo, cobMat);
      cob.position.set(
        stalk.position.x + 0.1, 
        heights[3] * 0.6, 
        stalk.position.z
      );
      cob.rotation.z = Math.PI / 6;
      cob.castShadow = true;
      group.add(cob);
    }
  }
  
  return group;
}

// ==========================================
// HELPER FUNCTION 3: Vine/Grape Plants
// ==========================================
function createVinePlant(stage, colors, heights) {
  const group = new THREE.Group();
  
  if (stage <= 0) return group;
  
  // Vine stem wrapping around trellis
  const vineGeo = new THREE.CylinderGeometry(0.03, 0.04, heights[stage-1], 8);
  const vineMat = new THREE.MeshStandardMaterial({ 
    color: colors[Math.min(stage-1, colors.length-1)] 
  });
  const vine = new THREE.Mesh(vineGeo, vineMat);
  vine.position.y = heights[stage-1] / 2;
  vine.castShadow = true;
  group.add(vine);
  
  // Grape leaves (heart-shaped approximation)
  const numLeaves = stage * 2;
  for (let i = 0; i < numLeaves; i++) {
    const leafGeo = new THREE.CircleGeometry(0.1, 5);
    const leafMat = new THREE.MeshStandardMaterial({ 
      color: colors[Math.min(stage-1, colors.length-1)], 
      side: THREE.DoubleSide 
    });
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(
      (Math.random() - 0.5) * 0.2,
      (i / numLeaves) * heights[stage-1],
      (Math.random() - 0.5) * 0.2
    );
    leaf.rotation.y = Math.random() * Math.PI * 2;
    group.add(leaf);
  }
  
  // Grape clusters (stage 3-4)
  if (stage >= 3) {
    for (let i = 0; i < 3; i++) {
      const grapeGeo = new THREE.SphereGeometry(0.05, 8, 8);
      const grapeMat = new THREE.MeshStandardMaterial({ 
        color: stage === 4 ? 0x7c2d12 : 0xa16207  // Dark purple when ripe
      });
      const grape = new THREE.Mesh(grapeGeo, grapeMat);
      grape.position.set(
        (Math.random() - 0.5) * 0.15,
        heights[stage-1] * 0.6 - i * 0.08,
        (Math.random() - 0.5) * 0.15
      );
      grape.castShadow = true;
      group.add(grape);
    }
  }
  
  return group;
}

// ==========================================
// HELPER FUNCTION 4: Grassland (Livestock)
// ==========================================
function createGrassland(stage, colors, heights) {
  const group = new THREE.Group();
  
  if (stage <= 0) return group;
  
  const numBlades = 8;
  
  for (let i = 0; i < numBlades; i++) {
    const bladeGeo = new THREE.PlaneGeometry(0.03, heights[stage-1]);
    const bladeMat = new THREE.MeshStandardMaterial({ 
      color: colors[Math.min(stage-1, colors.length-1)], 
      side: THREE.DoubleSide 
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.set(
      (Math.random() - 0.5) * 0.4,
      heights[stage-1] / 2,
      (Math.random() - 0.5) * 0.4
    );
    blade.rotation.y = Math.random() * Math.PI * 2;
    blade.rotation.z = (Math.random() - 0.5) * 0.3;
    group.add(blade);
  }
  
  return group;
}

// ==========================================
// HELPER FUNCTION 5: Desert Crops
// ==========================================
function createDesertCrop(stage, colors, heights) {
  const group = new THREE.Group();
  
  if (stage <= 0) return group;
  
  // Small, compact plants for water conservation
  for (let i = 0; i < 2; i++) {
    const stemGeo = new THREE.CylinderGeometry(0.04, 0.05, heights[stage-1], 6);
    const stemMat = new THREE.MeshStandardMaterial({ 
      color: colors[Math.min(stage-1, colors.length-1)] 
    });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(
      (Math.random() - 0.5) * 0.3, 
      heights[stage-1] / 2, 
      (Math.random() - 0.5) * 0.3
    );
    stem.castShadow = true;
    group.add(stem);
    
    // Small thick leaves (water-storing adaptation)
    const leafGeo = new THREE.BoxGeometry(0.08, 0.04, 0.15);
    const leafMat = new THREE.MeshStandardMaterial({ 
      color: colors[Math.min(stage-1, colors.length-1)] 
    });
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(
      stem.position.x, 
      heights[stage-1] * 0.8, 
      stem.position.z
    );
    leaf.rotation.y = Math.random() * Math.PI * 2;
    group.add(leaf);
  }
  
  return group;
}


      function updateCropVisuals() {
        const stage =
        gameState.crop_health < 30 ? -1 :
        gameState.crop_health < 40 ? 1 :
        gameState.crop_health < 60 ? 2 :
         gameState.crop_health < 80 ? 3 : 4;

        cropMeshes.forEach((cropGroup) => {
          if (cropGroup.userData.stage !== stage) {
            while (cropGroup.children.length > 0) {
              cropGroup.remove(cropGroup.children[0]);
            }

            // Create new crop with field type
             const fieldType = cropGroup.userData.fieldType || 'wheat';
             const newCrop = createCropMesh(stage, fieldType);
            newCrop.userData.swayOffset = Math.random() * Math.PI * 2;
            newCrop.userData.swaySpeed = 0.5 + Math.random() * 0.5;

            cropGroup.add(newCrop);
            cropGroup.userData.stage = stage;
            cropGroup.userData.cropMesh = newCrop;
          }
        });
      }

      function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        if (fieldGroup) {
          fieldGroup.rotation.y = time * 0.1;
        }

        cropMeshes.forEach((cropGroup) => {
          if (cropGroup.userData.cropMesh) {
            const crop = cropGroup.userData.cropMesh;
            if (crop.userData.swaySpeed !== undefined) {
              crop.rotation.z =
                Math.sin(
                  time * crop.userData.swaySpeed + crop.userData.swayOffset
                ) * 0.05;
            }
          }
        });

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      }

      window.addEventListener("resize", () => {
        const container = document.getElementById("field3d");
        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      });

      async function init() {
  // Get challenge ID from URL (e.g., launch.html?id=1)
  const params = new URLSearchParams(window.location.search);
  currentChallengeId = parseInt(params.get('id'));

  if (!currentChallengeId) {
    document.getElementById('challengeTitle').textContent = "ERROR: NO CHALLENGE SELECTED";
    return;
  }

  try {
    // Fetch challenge data from backend
    const response = await fetch(`${API_BASE_URL}/api/challenges/${currentChallengeId}`);
    const challengeData = await response.json();
    
    // Populate UI with challenge data
    populateChallengeInfo(challengeData);
    
    // Initialize game state from backend data
    gameState = {
      soil_moisture: challengeData.initial_state.soil_moisture,
      crop_health: challengeData.initial_state.crop_health,
      livestock_health: challengeData.initial_state.livestock_health,
      budget: challengeData.initial_state.budget,
      yield_estimate: 0,
      day: 1
    };
    initialBudget = challengeData.initial_state.budget;

    document.getElementById("totalPoints").textContent = 
      localStorage.getItem("totalPoints") || "600";
    
    initThreeJS();
    updateAllStats();

  } catch (error) {
    console.error("Failed to load challenge data:", error);
    document.getElementById('challengeTitle').textContent = "ERROR: COULD NOT LOAD CHALLENGE";
  }
}
  

  function updateAllStats() {
  if (!gameState) return;

  // Use new property names
  document.getElementById("moisturePercent").textContent = 
    Math.round(gameState.soil_moisture) + "%";
  document.getElementById("moistureFill").style.width = 
    gameState.soil_moisture + "%";

  // Update vegetation to use crop_health
  const ndviStatus = gameState.crop_health < 40 ? "Poor" : 
                     gameState.crop_health < 70 ? "Moderate" : "Healthy";
  document.getElementById("ndviStatus").textContent = ndviStatus;
  document.getElementById("ndviFill").style.width = gameState.crop_health + "%";

  document.getElementById("livestockHealth").textContent = 
    gameState.livestock_health + "%";
  document.getElementById("livestockFill").style.width = 
    gameState.livestock_health + "%";

  document.getElementById("yieldEstimate").textContent = 
    gameState.yield_estimate + " kg";
  document.getElementById("budgetRemaining").textContent = 
    "$" + gameState.budget;
  document.getElementById("currentDay").textContent = gameState.day;

  updateCropVisuals();
}

      function populateChallengeInfo(challenge) {
      document.querySelector('.challenge-title').textContent = challenge.title;
      document.getElementById('metaLocation').textContent = challenge.location;
      document.getElementById('metaTemp').textContent = `${challenge.initial_state.temperature}°C`;
      document.getElementById('metaGoal').textContent = challenge.goal.description;
  
      const datasetsEl = document.querySelector('.nasa-badges');
      datasetsEl.innerHTML = challenge.datasets.map(d => 
      `<span class="badge">${d}</span>`
      ).join('');
     }

      function showToast(message) {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => {
          toast.classList.remove("show");
        }, 3000);
      }

      // function irrigate() {
      //   if (gameState.budget < 100) {
      //     showToast("Insufficient budget!");
      //     return;
      //   }
      //   gameState.budget -= 100;
      //   gameState.soilMoisture = Math.min(100, gameState.soilMoisture + 25);
      //   gameState.vegetationHealth = Math.min(
      //     100,
      //     gameState.vegetationHealth + 15
      //   );
      //   gameState.yieldEstimate = Math.floor(gameState.vegetationHealth * 5);
      //   gameState.currentDay++;
      //   updateAllStats();
      //   showToast("Irrigation complete! SMAP data updated.");
      //   rotateInsight();
      // }

      // function fertilize() {
      //   if (gameState.budget < 150) {
      //     showToast("Insufficient budget!");
      //     return;
      //   }
      //   gameState.budget -= 150;
      //   gameState.vegetationHealth = Math.min(
      //     100,
      //     gameState.vegetationHealth + 20
      //   );
      //   gameState.yieldEstimate = Math.floor(gameState.vegetationHealth * 5);
      //   gameState.currentDay++;
      //   updateAllStats();
      //   showToast("Fertilizer applied! MODIS shows improvement.");
      //   rotateInsight();
      // }

      // function pesticide() {
      //   if (gameState.budget < 80) {
      //     showToast("Insufficient budget!");
      //     return;
      //   }
      //   gameState.budget -= 80;
      //   gameState.vegetationHealth = Math.min(
      //     100,
      //     gameState.vegetationHealth + 10
      //   );
      //   gameState.yieldEstimate = Math.floor(gameState.vegetationHealth * 5);
      //   gameState.currentDay++;
      //   updateAllStats();
      //   showToast("Pest protection applied successfully!");
      //   rotateInsight();
      // }

      // function feedLivestock() {
      //   if (gameState.budget < 50) {
      //     showToast("Insufficient budget!");
      //     return;
      //   }
      //   gameState.budget -= 50;
      //   gameState.livestockHealth = Math.min(
      //     100,
      //     gameState.livestockHealth + 20
      //   );
      //   gameState.currentDay++;
      //   updateAllStats();
      //   showToast("Livestock health improved!");
      //   rotateInsight();
      // }

      async function performAction(actionType) {
      if (!gameState) return;
  
       // Disable all buttons during API call
      document.querySelectorAll('.action-btn').forEach(btn => btn.disabled = true);

      try {
       const response = await fetch(`${API_BASE_URL}/api/simulation/action`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
       challenge_id: currentChallengeId,
       current_state: gameState,
       action: { action_type: actionType }
      })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    
       gameState = result.new_state;
    updateAllStats();
    showToast(result.message);

    // 🔧 Auto-advance day after each action
    if (actionType !== 'next_day' && !result.is_complete) {
      // Wait 1 second so user sees the action result
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Automatically call next_day action
      const nextDayResponse = await fetch(`${API_BASE_URL}/api/simulation/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge_id: currentChallengeId,
          current_state: gameState,
          action: { action_type: 'next_day' }
        })
      });

      if (nextDayResponse.ok) {
        const nextDayResult = await nextDayResponse.json();
        gameState = nextDayResult.new_state;
        updateAllStats();
        showToast(`Day ${gameState.day} begins...`);
        
        if (nextDayResult.is_complete) {
          showHarvestModal(nextDayResult.is_success);
        }
      }
    } else if (result.is_complete) {
      showHarvestModal(result.is_success);
    }


  } catch (error) {
    console.error("Error:", error);
    showToast("Error: Could not connect to server.");
  } finally {
    document.querySelectorAll('.action-btn').forEach(btn => btn.disabled = false);
  }
}

      function rotateInsight() {
        currentInsightIndex = (currentInsightIndex + 1) % insights.length;
        document.getElementById("insightText").textContent =
          insights[currentInsightIndex];
      }

      function showHarvestModal(isSuccess) {
  const pointsEarned = isSuccess ? 100 : 0;
  const totalPoints = (parseInt(localStorage.getItem("totalPoints") || "600")) + pointsEarned;
  localStorage.setItem("totalPoints", totalPoints);

  document.getElementById("modalYield").textContent = gameState.yield_estimate + " kg";
  document.getElementById("modalPoints").textContent = "+" + pointsEarned;
  document.getElementById("modalMoneyUsed").textContent = 
    "$" + (initialBudget - gameState.budget);
  document.getElementById("modalMoneySaved").textContent = "$" + gameState.budget;
  document.getElementById("modalMoisture").textContent = 
    Math.round(gameState.soil_moisture) + "%";
  document.getElementById("modalVegetation").textContent = 
    Math.round(gameState.crop_health) + "%";

  const statusEl = document.getElementById("modalStatus");
  if (isSuccess) {
    statusEl.textContent = "Mission Success!";
    statusEl.className = "modal-status success";
  } else {
    statusEl.textContent = "Mission Failed";
    statusEl.className = "modal-status failure";
  }

  // Disable all action buttons when game ends
  document.querySelectorAll('.action-btn').forEach(btn => btn.disabled = true);
  document.getElementById("modalOverlay").classList.add("show");
}

   async function advanceToNextDay() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/simulation/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        challenge_id: currentChallengeId,
        current_state: gameState,
        action: { action_type: "next_day" }
      })
    });

    const data = await response.json();
    
    // Update game state with new day
    gameState = data.new_state;
    updateUI();
    
    // Check if mission is complete
    if (data.is_complete) {
      showHarvestModal(data.is_success);
    } else {
      showNotification(data.message);
    }
  } catch (error) {
    console.error('Error advancing day:', error);
  }
}


      function closeModal() {
        document.getElementById("modalOverlay").classList.remove("show");
      }

      function returnToDashboard() {
        window.location.href = "simulator.html";
      }

      function goBack() {
        if (confirm("Are you sure you want to leave? Progress will be lost.")) {
          window.location.href = "simulator.html";
        }
      }
      window.onload = init;