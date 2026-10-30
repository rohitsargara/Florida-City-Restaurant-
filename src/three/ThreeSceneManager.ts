/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { TableInfo, ThreeSceneMode, LightingPreset, CameraPreset } from '../types/restaurant';

// Reusable math helpers outside render loop to avoid garbage collection
const _vec3 = new THREE.Vector3();
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 1.5, 0);
const _raycaster = new THREE.Raycaster();
const _pointer = new THREE.Vector2();

export class ThreeSceneManager {
  private container: HTMLDivElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private frameId: number = 0;
  private isDestroyed = false;
  private isSoftwareGl = false;

  // Scene root groups for different modes
  private restaurantGroup = new THREE.Group();
  private dishGroup = new THREE.Group();
  private floorplanGroup = new THREE.Group();

  // Mode & configuration state
  private currentMode: ThreeSceneMode = 'restaurant';
  private currentLighting: LightingPreset = 'sunset';
  private explodedRatio = 0.0;
  private targetExplodedRatio = 0.0;

  // Interactive table meshes mapped by table ID
  private tableMeshes: Map<string, THREE.Group> = new Map();
  private onTableClick?: (table: TableInfo) => void;
  private onTableHover?: (table: TableInfo | null) => void;
  private hoveredTableId: string | null = null;
  private selectedTableId: string | null = null;
  private tablesData: TableInfo[] = [];

  // Lighting references
  private sunLight!: THREE.DirectionalLight;
  private fillLight!: THREE.HemisphereLight;
  private neonPointLights: THREE.PointLight[] = [];

  // Camera animation targets
  private camRadius = 14;
  private camTheta = 0.4;
  private camPhi = 1.1;
  private isUserDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private prevTheta = 0.4;
  private prevPhi = 1.1;
  private autoRotate = true;

  // Burger layer groups for exploded view animation
  private burgerLayers: { group: THREE.Object3D; factor: number; basePos: THREE.Vector3 }[] = [];

  // Palm leaves animation references
  private animatedLeaves: THREE.Mesh[] = [];

  constructor(
    container: HTMLDivElement,
    tables: TableInfo[],
    onTableClick?: (table: TableInfo) => void,
    onTableHover?: (table: TableInfo | null) => void
  ) {
    this.container = container;
    this.tablesData = tables;
    this.onTableClick = onTableClick;
    this.onTableHover = onTableHover;

    this.init();
  }

  private init() {
    // 1. Detect software WebGL safely
    this.isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 2. Setup WebGLRenderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 3. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f172a); // Deep Florida twilight slate
    this.scene.fog = new THREE.FogExp2(0x0f172a, 0.025);

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 6, 14);

    // 4. Environment reflection using RoomEnvironment
    try {
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch {
      // fallback to directional lighting
    }

    // 5. Lighting Rig
    this.setupLighting();

    // 6. Build the 3 procedural 3D sub-scenes
    this.scene.add(this.restaurantGroup);
    this.scene.add(this.dishGroup);
    this.scene.add(this.floorplanGroup);

    this.buildRestaurantScene();
    this.buildDishScene();
    this.buildFloorplanScene();

    // Default mode: Restaurant
    this.setMode('restaurant');
    this.applyLightingPreset('sunset');

    // 7. Input listeners
    this.setupEvents();

    // 8. Start render loop
    this.startLoop();
  }

  private setupLighting() {
    // Fill light (Warm sky, cool earth)
    this.fillLight = new THREE.HemisphereLight(0xffedd5, 0x1e293b, 1.2);
    this.scene.add(this.fillLight);

    // Key Sun Light (Warm golden hour)
    this.sunLight = new THREE.DirectionalLight(0xffa834, 2.5);
    this.sunLight.position.set(12, 16, 10);
    this.sunLight.castShadow = !this.isSoftwareGl;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.bias = -0.0005;
    this.sunLight.shadow.normalBias = 0.02;
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 40;
    const d = 14;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.scene.add(this.sunLight);

    // Rim accent light (Cyan / turquoise coastal rim)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    rimLight.position.set(-12, 10, -10);
    this.scene.add(rimLight);
  }

  // --- PROCEDURAL TEXTURE GENERATORS ---
  private createNoiseTexture(colorA: string, colorB: string, size = 256): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = colorA;
    ctx.fillRect(0, 0, size, size);

    // Add noise grain
    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 25;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }

  private createNeonSignTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 128);

    ctx.font = 'bold 34px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Neon glow effect
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#fff7ed';
    ctx.fillText('FLORIDA CITY', 256, 44);

    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('RESTAURANT & DINER', 256, 88);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // --- SCENE 1: RESTAURANT & TROPICAL TERRACE ---
  private buildRestaurantScene() {
    const group = this.restaurantGroup;

    // Ground platform / asphalt street & sidewalk
    const groundGeo = new THREE.BoxGeometry(32, 0.4, 26);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.85,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.2;
    ground.receiveShadow = !this.isSoftwareGl;
    group.add(ground);

    // Patio Wooden Deck
    const deckGeo = new THREE.BoxGeometry(16, 0.25, 10);
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0x9a3412,
      roughness: 0.7,
      metalness: 0.05,
    });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(-1, 0.13, 3);
    deck.receiveShadow = !this.isSoftwareGl;
    group.add(deck);

    // Main Diner Building (Composite multi-part structure)
    const buildingBody = new THREE.Mesh(
      new THREE.BoxGeometry(14, 5.2, 8),
      new THREE.MeshStandardMaterial({
        color: 0xfef08a, // Classic warm Florida pastel yellow/sand
        roughness: 0.55,
        metalness: 0.05,
      })
    );
    buildingBody.position.set(0, 2.6, -5);
    buildingBody.castShadow = !this.isSoftwareGl;
    buildingBody.receiveShadow = !this.isSoftwareGl;
    group.add(buildingBody);

    // Decorative retro art-deco roof parapet (Turquoise coastal trim)
    const roofTrim = new THREE.Mesh(
      new THREE.BoxGeometry(14.6, 0.6, 8.6),
      new THREE.MeshStandardMaterial({
        color: 0x0ea5e9, // Florida coastal turquoise
        roughness: 0.3,
        metalness: 0.2,
      })
    );
    roofTrim.position.set(0, 5.4, -5);
    group.add(roofTrim);

    // Glowing Neon Signboard atop roof
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 2.0, 0.3),
      new THREE.MeshStandardMaterial({
        map: this.createNeonSignTexture(),
        roughness: 0.2,
        metalness: 0.3,
        emissive: 0xf97316,
        emissiveIntensity: 0.45,
      })
    );
    signBoard.position.set(0, 6.7, -4.5);
    group.add(signBoard);

    // Neon amber point light casting real warmth on roof
    const neonLight = new THREE.PointLight(0xf97316, 2.2, 10);
    neonLight.position.set(0, 6.5, -3.5);
    group.add(neonLight);
    this.neonPointLights.push(neonLight);

    // Panoramic Front Glass Windows with warm interior diner glow
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.85,
    });
    const frontWindow = new THREE.Mesh(new THREE.BoxGeometry(10.5, 2.4, 0.2), windowMat);
    frontWindow.position.set(0, 2.2, -0.9);
    group.add(frontWindow);

    // Striped Awning above entrance (Red & Cream)
    const awningGroup = new THREE.Group();
    awningGroup.position.set(0, 3.6, -0.8);
    awningGroup.rotation.x = 0.25;
    for (let i = 0; i < 9; i++) {
      const stripeMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.12, 2.2),
        new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? 0xef4444 : 0xfffbeb,
          roughness: 0.6,
        })
      );
      stripeMesh.position.x = -4.8 + i * 1.2;
      awningGroup.add(stripeMesh);
    }
    group.add(awningGroup);

    // Outdoor Terrace Dining Sets (Bistro Tables, Chairs, Striped Patio Umbrellas)
    for (let i = -2; i <= 2; i++) {
      const tableX = i * 2.8;
      const tableZ = 3.2 + (i % 2) * 1.2;
      const patioSet = this.createPatioTableSet(tableX, tableZ, i);
      group.add(patioSet);
    }

    // Bistro String Festoon Lights across patio
    this.createFestoonStringLights(group);

    // Procedural Florida Palm Trees (Left and Right)
    group.add(this.createPalmTree(-8.5, 0, -2, 1.15));
    group.add(this.createPalmTree(8.5, 0, -1, 1.05));
    group.add(this.createPalmTree(-9.0, 0, 5, 0.95));

    // Vintage Florida Diner Cruiser Car parked at driveway (Right flank)
    const carGroup = this.createVintageCar();
    carGroup.position.set(9.2, 0.25, 4.5);
    carGroup.rotation.y = -0.35;
    group.add(carGroup);

    // Highway Signpost ("Gateway to the Florida Keys & Everglades")
    const signpost = this.createGatewaySignpost();
    signpost.position.set(-9.5, 0, 8.5);
    group.add(signpost);
  }

  private createPatioTableSet(x: number, z: number, seed: number): THREE.Group {
    const set = new THREE.Group();
    set.position.set(x, 0.25, z);

    // Tabletop
    const topGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.08, 16);
    const topMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.1 });
    const top = new THREE.Mesh(topGeo, topMat);
    top.position.y = 0.8;
    top.castShadow = !this.isSoftwareGl;
    set.add(top);

    // Center table leg & base
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 })
    );
    leg.position.y = 0.4;
    set.add(leg);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 0.04, 12),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 })
    );
    base.position.y = 0.02;
    set.add(base);

    // Umbrella
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 2.6, 8),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.5 })
    );
    pole.position.y = 1.3;
    set.add(pole);

    const canopy = new THREE.Mesh(
      new THREE.ConeGeometry(1.4, 0.6, 8),
      new THREE.MeshStandardMaterial({
        color: seed % 2 === 0 ? 0x0284c7 : 0xf97316,
        roughness: 0.6,
      })
    );
    canopy.position.y = 2.4;
    set.add(canopy);

    // 2 Bistro Chairs
    for (let c = 0; c < 2; c++) {
      const chair = new THREE.Group();
      chair.position.set(c === 0 ? -0.85 : 0.85, 0, 0);
      chair.rotation.y = c === 0 ? Math.PI / 2 : -Math.PI / 2;

      const seat = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.05, 0.45),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.3 })
      );
      seat.position.y = 0.45;
      chair.add(seat);

      const back = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.45, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.3 })
      );
      back.position.set(0, 0.7, -0.2);
      chair.add(back);

      set.add(chair);
    }

    return set;
  }

  private createFestoonStringLights(parent: THREE.Group) {
    const festoon = new THREE.Group();
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });

    const positions = [
      [-6, 3.2, 0], [-4, 3.0, 1.5], [-2, 3.2, 3],
      [0, 2.9, 4], [2, 3.2, 3], [4, 3.0, 1.5], [6, 3.2, 0],
    ];

    positions.forEach((pos) => {
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), bulbMat);
      bulb.position.set(pos[0], pos[1], pos[2]);
      festoon.add(bulb);
    });

    parent.add(festoon);
  }

  private createPalmTree(x: number, y: number, z: number, scale = 1.0): THREE.Group {
    const palm = new THREE.Group();
    palm.position.set(x, y, z);
    palm.scale.set(scale, scale, scale);

    // Segmented Trunk with natural Florida curve
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.85,
      metalness: 0.05,
    });

    const segments = 7;
    let currY = 0;
    let currX = 0;
    for (let i = 0; i < segments; i++) {
      const radiusBottom = 0.32 - i * 0.025;
      const radiusTop = 0.28 - i * 0.025;
      const height = 0.85;

      const seg = new THREE.Mesh(
        new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 8),
        trunkMat
      );
      seg.position.set(currX, currY + height / 2, 0);
      seg.rotation.z = -0.06;
      palm.add(seg);

      currY += height * 0.95;
      currX += 0.08;
    }

    // Lush Palm Fronds / Leaves (6-8 radial fan fronds)
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x15803d, // vibrant tropical palm green
      roughness: 0.45,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    const leafCount = 8;
    for (let l = 0; l < leafCount; l++) {
      const angle = (l / leafCount) * Math.PI * 2;
      const leafGeo = new THREE.ConeGeometry(0.45, 2.6, 5);
      leafGeo.rotateX(Math.PI / 2.4);

      const leafMesh = new THREE.Mesh(leafGeo, leafMat);
      leafMesh.position.set(currX, currY + 0.2, 0);
      leafMesh.rotation.y = angle;
      leafMesh.castShadow = !this.isSoftwareGl;
      palm.add(leafMesh);

      this.animatedLeaves.push(leafMesh);
    }

    // Coconut cluster
    for (let c = 0; c < 3; c++) {
      const coconut = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 })
      );
      coconut.position.set(currX + Math.sin(c) * 0.25, currY - 0.1, Math.cos(c) * 0.25);
      palm.add(coconut);
    }

    return palm;
  }

  private createVintageCar(): THREE.Group {
    const car = new THREE.Group();

    // Body chassis
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.85, 2.0),
      new THREE.MeshPhysicalMaterial({
        color: 0x0284c7, // Tropical Florida blue
        roughness: 0.2,
        metalness: 0.7,
        clearcoat: 0.8,
      })
    );
    body.position.y = 0.65;
    body.castShadow = !this.isSoftwareGl;
    car.add(body);

    // White convertible top / windshield
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.6, 1.7),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
    );
    cabin.position.set(-0.2, 1.25, 0);
    car.add(cabin);

    // Windshield glass
    const windshield = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.5, 1.6),
      new THREE.MeshStandardMaterial({
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.6,
      })
    );
    windshield.position.set(0.9, 1.3, 0);
    windshield.rotation.z = -0.3;
    car.add(windshield);

    // Chrome Bumpers
    const bumperMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
    const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 2.1), bumperMat);
    frontBumper.position.set(2.15, 0.45, 0);
    car.add(frontBumper);

    // Headlights glowing
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      emissive: 0xfef08a,
      emissiveIntensity: 0.8,
    });
    for (const zOff of [-0.65, 0.65]) {
      const headlight = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.1, 12), headMat);
      headlight.rotation.z = Math.PI / 2;
      headlight.position.set(2.15, 0.75, zOff);
      car.add(headlight);
    }

    // 4 Wheels
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.8, roughness: 0.2 });
    const wheelPositions = [
      [1.3, 0.35, -1.0], [1.3, 0.35, 1.0],
      [-1.3, 0.35, -1.0], [-1.3, 0.35, 1.0],
    ];
    wheelPositions.forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Group();
      wheel.position.set(wx, wy, wz);
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.25, 16), tireMat);
      tire.rotation.x = Math.PI / 2;
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.26, 12), rimMat);
      hub.rotation.x = Math.PI / 2;
      wheel.add(tire);
      wheel.add(hub);
      car.add(wheel);
    });

    return car;
  }

  private createGatewaySignpost(): THREE.Group {
    const post = new THREE.Group();

    // Wood post
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 3.6, 8),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
    );
    pole.position.y = 1.8;
    post.add(pole);

    // Signboard
    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 1.2, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 })
    );
    sign.position.set(0, 2.7, 0);
    post.add(sign);

    return post;
  }

  // --- SCENE 2: SIGNATURE 3D GOURMET DISH (EXPLODED VIEW) ---
  private buildDishScene() {
    const group = this.dishGroup;
    this.burgerLayers = [];

    // Wooden Serving Platter & Slate Base
    const platterMat = new THREE.MeshStandardMaterial({
      color: 0x854d0e, // Rich walnut wood
      roughness: 0.6,
      metalness: 0.05,
    });
    const platter = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.4, 0.25, 32), platterMat);
    platter.position.y = -0.12;
    platter.receiveShadow = !this.isSoftwareGl;
    group.add(platter);

    const slateMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.15,
    });
    const slate = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.08, 32), slateMat);
    slate.position.y = 0.04;
    group.add(slate);

    // BURGER LAYERS (Composite procedural assembly)
    // 1. Bottom Brioche Bun
    const bottomBunGroup = new THREE.Group();
    const bottomBun = new THREE.Mesh(
      new THREE.CylinderGeometry(1.35, 1.3, 0.35, 24),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.45, metalness: 0.05 })
    );
    bottomBun.position.y = 0.25;
    bottomBun.castShadow = !this.isSoftwareGl;
    bottomBunGroup.add(bottomBun);
    group.add(bottomBunGroup);
    this.burgerLayers.push({ group: bottomBunGroup, factor: 0.0, basePos: bottomBunGroup.position.clone() });

    // 2. Angus Beef Patty
    const pattyGroup = new THREE.Group();
    const patty = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.42, 0.45, 24),
      new THREE.MeshStandardMaterial({
        color: 0x3f1d0b, // deep charred beef brown
        roughness: 0.85,
        metalness: 0.1,
      })
    );
    patty.position.y = 0.65;
    patty.castShadow = !this.isSoftwareGl;
    pattyGroup.add(patty);
    group.add(pattyGroup);
    this.burgerLayers.push({ group: pattyGroup, factor: 0.25, basePos: pattyGroup.position.clone() });

    // 3. Melted Sharp Florida Cheddar Cheese
    const cheeseGroup = new THREE.Group();
    const cheese = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.12, 2.1),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b, // glowing yellow-orange melted cheese
        roughness: 0.25,
        metalness: 0.05,
      })
    );
    cheese.position.y = 0.95;
    cheese.rotation.y = 0.4;
    cheeseGroup.add(cheese);
    group.add(cheeseGroup);
    this.burgerLayers.push({ group: cheeseGroup, factor: 0.45, basePos: cheeseGroup.position.clone() });

    // 4. Crisp Rippled Lettuce
    const lettuceGroup = new THREE.Group();
    const lettuceMat = new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      roughness: 0.35,
      side: THREE.DoubleSide,
    });
    for (let i = 0; i < 4; i++) {
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.25, 6), lettuceMat);
      leaf.rotation.x = Math.PI / 1.8;
      leaf.rotation.z = (i * Math.PI) / 2;
      leaf.position.set(Math.sin((i * Math.PI) / 2) * 0.7, 1.15, Math.cos((i * Math.PI) / 2) * 0.7);
      lettuceGroup.add(leaf);
    }
    group.add(lettuceGroup);
    this.burgerLayers.push({ group: lettuceGroup, factor: 0.65, basePos: lettuceGroup.position.clone() });

    // 5. Heirloom Homestead Tomato Slices
    const tomatoGroup = new THREE.Group();
    const tomatoMat = new THREE.MeshPhysicalMaterial({
      color: 0xef4444,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 0.9,
    });
    for (const offset of [-0.4, 0.4]) {
      const slice = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.12, 20), tomatoMat);
      slice.position.set(offset, 1.35, 0);
      tomatoGroup.add(slice);
    }
    group.add(tomatoGroup);
    this.burgerLayers.push({ group: tomatoGroup, factor: 0.85, basePos: tomatoGroup.position.clone() });

    // 6. Sweet Caramelized Onions & Relish
    const onionGroup = new THREE.Group();
    const onionMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.3 });
    for (let o = 0; o < 6; o++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.35 + o * 0.08, 0.04, 8, 16), onionMat);
      ring.position.set(Math.sin(o) * 0.3, 1.5, Math.cos(o) * 0.3);
      ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.2;
      onionGroup.add(ring);
    }
    group.add(onionGroup);
    this.burgerLayers.push({ group: onionGroup, factor: 1.05, basePos: onionGroup.position.clone() });

    // 7. Golden Glazed Sesame Brioche Top Bun
    const topBunGroup = new THREE.Group();
    const topBun = new THREE.Mesh(
      new THREE.SphereGeometry(1.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.35,
        metalness: 0.05,
      })
    );
    topBun.position.y = 1.55;
    topBun.castShadow = !this.isSoftwareGl;
    topBunGroup.add(topBun);

    // Procedural Sesame Seeds sprinkled on bun
    const seedMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.5 });
    for (let s = 0; s < 45; s++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0) * 0.45; // top hemisphere only
      const sr = 1.41;
      const sx = sr * Math.sin(phi) * Math.cos(theta);
      const sy = 1.55 + sr * Math.cos(phi);
      const sz = sr * Math.sin(phi) * Math.sin(theta);

      const seed = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.07), seedMat);
      seed.position.set(sx, sy, sz);
      seed.rotation.set(Math.random(), Math.random(), Math.random());
      topBunGroup.add(seed);
    }
    group.add(topBunGroup);
    this.burgerLayers.push({ group: topBunGroup, factor: 1.35, basePos: topBunGroup.position.clone() });

    // SIDE 1: Crispy Golden Steak Fries Pile
    const friesGroup = new THREE.Group();
    friesGroup.position.set(2.1, 0.1, 0.3);
    const fryMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.55 });
    for (let f = 0; f < 18; f++) {
      const fry = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 1.3), fryMat);
      fry.position.set((Math.random() - 0.5) * 0.8, 0.1 + f * 0.05, (Math.random() - 0.5) * 0.8);
      fry.rotation.set(Math.random() * 0.3, Math.random() * Math.PI, Math.random() * 0.3);
      fry.castShadow = !this.isSoftwareGl;
      friesGroup.add(fry);
    }
    group.add(friesGroup);

    // SIDE 2: Iced Florida Key Lime Spritz in glass
    const drinkGroup = new THREE.Group();
    drinkGroup.position.set(-2.2, 0.1, -0.6);

    const glass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.45, 1.8, 18),
      new THREE.MeshStandardMaterial({
        color: 0x86efac, // key lime translucent green
        transparent: true,
        opacity: 0.65,
        roughness: 0.15,
        metalness: 0.1,
      })
    );
    glass.position.y = 0.9;
    drinkGroup.add(glass);

    // Lime wheel garnish
    const lime = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 0.05, 16),
      new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.3 })
    );
    lime.position.set(0.45, 1.8, 0);
    lime.rotation.z = 0.5;
    drinkGroup.add(lime);

    // Striped straw
    const straw = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8),
      new THREE.MeshStandardMaterial({ color: 0xef4444 })
    );
    straw.position.set(0.1, 1.4, 0);
    straw.rotation.z = -0.25;
    drinkGroup.add(straw);

    group.add(drinkGroup);
  }

  // --- SCENE 3: 3D INTERACTIVE TABLE FLOOR PLAN ---
  private buildFloorplanScene() {
    const group = this.floorplanGroup;
    this.tableMeshes.clear();

    // Floor Base with 4 Distinct Dining Zones
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(22, 0.3, 18),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 })
    );
    floor.position.y = -0.15;
    group.add(floor);

    // Zone 1: Tropical Patio Floor (Wood Deck)
    const patioDeck = new THREE.Mesh(
      new THREE.BoxGeometry(18, 0.08, 6),
      new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.6 })
    );
    patioDeck.position.set(0, 0.04, 4);
    group.add(patioDeck);

    // Zone 2: Main Diner Booths Floor (Retro Checkerboard or Terra Cotta)
    const dinerFloor = new THREE.Mesh(
      new THREE.BoxGeometry(18, 0.08, 5),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 })
    );
    dinerFloor.position.set(0, 0.04, -1);
    group.add(dinerFloor);

    // Zone 3: Citrus Bar & Veranda Floor (Teak and Brass)
    const barFloor = new THREE.Mesh(
      new THREE.BoxGeometry(18, 0.08, 5),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 })
    );
    barFloor.position.set(0, 0.04, -6);
    group.add(barFloor);

    // Low dividing architectural partition walls
    const dividerMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5 });
    const div1 = new THREE.Mesh(new THREE.BoxGeometry(18, 0.6, 0.2), dividerMat);
    div1.position.set(0, 0.3, 1.2);
    group.add(div1);

    const div2 = new THREE.Mesh(new THREE.BoxGeometry(18, 0.6, 0.2), dividerMat);
    div2.position.set(0, 0.3, -3.5);
    group.add(div2);

    // Build each interactive table
    this.tablesData.forEach((table) => {
      const tableGroup = this.createInteractiveTable(table);
      this.tableMeshes.set(table.id, tableGroup);
      group.add(tableGroup);
    });
  }

  private createInteractiveTable(table: TableInfo): THREE.Group {
    const tableGroup = new THREE.Group();
    tableGroup.position.set(table.x, 0, table.z);
    tableGroup.name = table.id;

    const isAvailable = table.status === 'available';
    const isSelected = table.status === 'selected' || this.selectedTableId === table.id;

    // Status ring marker on floor
    const ringMat = new THREE.MeshBasicMaterial({
      color: isSelected ? 0xf59e0b : isAvailable ? 0x22c55e : 0x64748b,
      transparent: true,
      opacity: 0.85,
    });
    const statusRing = new THREE.Mesh(new THREE.RingGeometry(1.0, 1.15, 24), ringMat);
    statusRing.rotation.x = -Math.PI / 2;
    statusRing.position.y = 0.1;
    tableGroup.add(statusRing);

    // Tabletop
    let topMesh: THREE.Mesh;
    const topMat = new THREE.MeshStandardMaterial({
      color: isSelected ? 0xfef08a : 0xf1f5f9,
      roughness: 0.3,
      metalness: 0.1,
    });

    if (table.shape === 'round') {
      topMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.1, 20), topMat);
      topMesh.position.y = 0.85;
    } else if (table.shape === 'long') {
      topMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.2), topMat);
      topMesh.position.y = 0.85;
    } else if (table.shape === 'high_top') {
      topMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.1, 16), topMat);
      topMesh.position.y = 1.15;
    } else {
      // Booth
      topMesh = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 1.2), topMat);
      topMesh.position.y = 0.85;

      // Add booth seats on both sides
      const boothSeatMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6 }); // classic diner red leather
      for (const zSide of [-0.9, 0.9]) {
        const seat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 0.5), boothSeatMat);
        seat.position.set(0, 0.4, zSide);
        const back = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 0.2), boothSeatMat);
        back.position.set(0, 0.8, zSide + (zSide > 0 ? 0.25 : -0.25));
        tableGroup.add(seat);
        tableGroup.add(back);
      }
    }

    topMesh.castShadow = !this.isSoftwareGl;
    tableGroup.add(topMesh);

    // Central stand/legs
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, topMesh.position.y, 8),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 })
    );
    leg.position.y = topMesh.position.y / 2;
    tableGroup.add(leg);

    // 3D Floating Table Number Badge
    const numberCanvas = document.createElement('canvas');
    numberCanvas.width = 128;
    numberCanvas.height = 128;
    const nctx = numberCanvas.getContext('2d')!;
    nctx.fillStyle = isSelected ? '#f59e0b' : isAvailable ? '#059669' : '#475569';
    nctx.beginPath();
    nctx.arc(64, 64, 56, 0, Math.PI * 2);
    nctx.fill();

    nctx.fillStyle = '#ffffff';
    nctx.font = 'bold 52px sans-serif';
    nctx.textAlign = 'center';
    nctx.textBaseline = 'middle';
    nctx.fillText(`T${table.number}`, 64, 64);

    const badgeTex = new THREE.CanvasTexture(numberCanvas);
    badgeTex.colorSpace = THREE.SRGBColorSpace;
    const badge = new THREE.Sprite(new THREE.SpriteMaterial({ map: badgeTex }));
    badge.position.set(0, topMesh.position.y + 0.7, 0);
    badge.scale.set(0.9, 0.9, 0.9);
    tableGroup.add(badge);

    // Tag data for raycasting
    tableGroup.userData = { table };

    return tableGroup;
  }

  public updateTableStatuses(tables: TableInfo[], selectedId: string | null) {
    this.tablesData = tables;
    this.selectedTableId = selectedId;
    this.buildFloorplanScene();
  }

  // --- INTERACTION & EVENTS ---
  private setupEvents() {
    const el = this.renderer.domElement;

    // Pointer down for rotation / click
    el.addEventListener('pointerdown', (e) => {
      this.isUserDragging = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.prevTheta = this.camTheta;
      this.prevPhi = this.camPhi;
      this.autoRotate = false;
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isUserDragging) {
        const deltaX = (e.clientX - this.dragStartX) * 0.006;
        const deltaY = (e.clientY - this.dragStartY) * 0.006;

        this.camTheta = this.prevTheta - deltaX;
        this.camPhi = Math.max(0.2, Math.min(Math.PI / 2.05, this.prevPhi - deltaY));
      }

      // Raycast for floorplan hover
      if (this.currentMode === 'floorplan') {
        const rect = el.getBoundingClientRect();
        _pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        _pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        _raycaster.setFromCamera(_pointer, this.camera);
        const intersects = _raycaster.intersectObjects(this.floorplanGroup.children, true);

        let hitTable: TableInfo | null = null;
        for (const hit of intersects) {
          let curr: THREE.Object3D | null = hit.object;
          while (curr && curr !== this.floorplanGroup) {
            if (curr.userData?.table) {
              hitTable = curr.userData.table as TableInfo;
              break;
            }
            curr = curr.parent;
          }
          if (hitTable) break;
        }

        if (hitTable?.id !== this.hoveredTableId) {
          this.hoveredTableId = hitTable ? hitTable.id : null;
          el.style.cursor = hitTable ? 'pointer' : 'default';
          if (this.onTableHover) {
            this.onTableHover(hitTable);
          }
        }
      }
    });

    window.addEventListener('pointerup', (e) => {
      if (!this.isUserDragging) return;
      const dist = Math.hypot(e.clientX - this.dragStartX, e.clientY - this.dragStartY);
      this.isUserDragging = false;

      // Handle table click if not dragging
      if (dist < 5 && this.currentMode === 'floorplan') {
        const rect = el.getBoundingClientRect();
        _pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        _pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        _raycaster.setFromCamera(_pointer, this.camera);
        const intersects = _raycaster.intersectObjects(this.floorplanGroup.children, true);

        for (const hit of intersects) {
          let curr: THREE.Object3D | null = hit.object;
          while (curr && curr !== this.floorplanGroup) {
            if (curr.userData?.table) {
              const table = curr.userData.table as TableInfo;
              if (this.onTableClick) {
                this.onTableClick(table);
              }
              return;
            }
            curr = curr.parent;
          }
        }
      }
    });

    // Resize handler
    window.addEventListener('resize', this.onResize);
  }

  private onResize = () => {
    if (this.isDestroyed || !this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  // --- CONTROLLER API ---
  public setMode(mode: ThreeSceneMode) {
    this.currentMode = mode;
    this.restaurantGroup.visible = mode === 'restaurant';
    this.dishGroup.visible = mode === 'dish';
    this.floorplanGroup.visible = mode === 'floorplan';

    if (mode === 'restaurant') {
      this.camRadius = 16;
      this.camTheta = 0.45;
      this.camPhi = 1.15;
      _targetLookAt.set(0, 2.2, 0);
      this.autoRotate = true;
    } else if (mode === 'dish') {
      this.camRadius = 7.5;
      this.camTheta = 0.6;
      this.camPhi = 1.05;
      _targetLookAt.set(0, 1.0, 0);
      this.autoRotate = false;
    } else if (mode === 'floorplan') {
      this.camRadius = 24;
      this.camTheta = 0.1;
      this.camPhi = 0.65;
      _targetLookAt.set(0, 0, 0);
      this.autoRotate = false;
    }
  }

  public setExplodedRatio(ratio: number) {
    this.targetExplodedRatio = Math.max(0, Math.min(1, ratio));
  }

  public setCameraPreset(preset: CameraPreset) {
    this.autoRotate = false;
    if (preset === 'terrace') {
      this.setMode('restaurant');
      this.camRadius = 14;
      this.camTheta = 0.05;
      this.camPhi = 1.25;
      _targetLookAt.set(0, 1.8, 2);
    } else if (preset === 'aerial') {
      this.camRadius = 22;
      this.camTheta = 0.2;
      this.camPhi = 0.45;
      _targetLookAt.set(0, 1, 0);
    } else if (preset === 'dish') {
      this.setMode('dish');
      this.camRadius = 6.8;
      this.camTheta = 0.7;
      this.camPhi = 1.1;
      _targetLookAt.set(0, 1.2, 0);
    } else if (preset === 'orbit') {
      this.autoRotate = true;
    }
  }

  public applyLightingPreset(preset: LightingPreset) {
    this.currentLighting = preset;
    if (preset === 'sunset') {
      this.scene.background = new THREE.Color(0x0f172a);
      if (this.scene.fog) this.scene.fog.color = new THREE.Color(0x0f172a);
      this.sunLight.color.set(0xffa834);
      this.sunLight.intensity = 2.6;
      this.fillLight.color.set(0xffedd5);
      this.fillLight.groundColor.set(0x1e293b);
      this.neonPointLights.forEach((n) => (n.intensity = 2.2));
    } else if (preset === 'night') {
      this.scene.background = new THREE.Color(0x020617);
      if (this.scene.fog) this.scene.fog.color = new THREE.Color(0x020617);
      this.sunLight.color.set(0x38bdf8);
      this.sunLight.intensity = 0.6;
      this.fillLight.color.set(0x1e1b4b);
      this.fillLight.groundColor.set(0x020617);
      this.neonPointLights.forEach((n) => (n.intensity = 4.5));
    } else if (preset === 'noon') {
      this.scene.background = new THREE.Color(0x38bdf8);
      if (this.scene.fog) this.scene.fog.color = new THREE.Color(0x38bdf8);
      this.sunLight.color.set(0xffffff);
      this.sunLight.intensity = 3.2;
      this.fillLight.color.set(0xffffff);
      this.fillLight.groundColor.set(0x64748b);
      this.neonPointLights.forEach((n) => (n.intensity = 0.5));
    }
  }

  // --- ANIMATION LOOP ---
  private startLoop() {
    let lastTime = performance.now();

    const tick = (now: number) => {
      if (this.isDestroyed) return;

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Gentle auto-rotation when enabled
      if (this.autoRotate && !this.isUserDragging) {
        this.camTheta += 0.15 * delta;
      }

      // Smooth camera position damping
      _targetCamPos.x = _targetLookAt.x + this.camRadius * Math.sin(this.camPhi) * Math.sin(this.camTheta);
      _targetCamPos.y = _targetLookAt.y + this.camRadius * Math.cos(this.camPhi);
      _targetCamPos.z = _targetLookAt.z + this.camRadius * Math.sin(this.camPhi) * Math.cos(this.camTheta);

      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, _targetCamPos.x, 5.0, delta);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, _targetCamPos.y, 5.0, delta);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, _targetCamPos.z, 5.0, delta);

      _currentLookAt.x = THREE.MathUtils.damp(_currentLookAt.x, _targetLookAt.x, 5.0, delta);
      _currentLookAt.y = THREE.MathUtils.damp(_currentLookAt.y, _targetLookAt.y, 5.0, delta);
      _currentLookAt.z = THREE.MathUtils.damp(_currentLookAt.z, _targetLookAt.z, 5.0, delta);
      this.camera.lookAt(_currentLookAt);

      // Smooth Exploded View Layer interpolation
      this.explodedRatio = THREE.MathUtils.damp(
        this.explodedRatio,
        this.targetExplodedRatio,
        6.0,
        delta
      );

      if (this.currentMode === 'dish') {
        const spreadDistance = 2.4 * this.explodedRatio;
        this.burgerLayers.forEach((layer) => {
          layer.group.position.y = layer.basePos.y + layer.factor * spreadDistance;
        });
      }

      // Gentle breeze on palm fronds
      if (this.currentMode === 'restaurant') {
        const wave = Math.sin(now * 0.002) * 0.035;
        this.animatedLeaves.forEach((leaf, idx) => {
          leaf.rotation.z = Math.sin(now * 0.002 + idx) * 0.04;
        });
      }

      this.renderer.render(this.scene, this.camera);

      this.frameId = requestAnimationFrame(tick);
    };

    this.frameId = requestAnimationFrame(tick);
  }

  public dispose() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.onResize);
    try {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    } catch {
      // ignore
    }
  }
}
