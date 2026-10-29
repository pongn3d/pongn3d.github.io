import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

export function mountSculpture(root: HTMLElement): void {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-sculpture-canvas]');
  const fallback = root.querySelector<HTMLElement>('[data-sculpture-fallback]');
  const spinButton = root.querySelector<HTMLButtonElement>('[data-sculpture-spin]');
  if (!canvas || !fallback || !spinButton) return;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    root.dataset.webgl = 'unavailable';
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 40);
  camera.position.set(0, 0, 5.25);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.86;

  const room = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  room.dispose();
  pmrem.dispose();

  const keyLight = new THREE.DirectionalLight(0xfff4e3, 1.8);
  keyLight.position.set(-3.5, 4.5, 5);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.55);
  fillLight.position.set(4, -1, 3);
  scene.add(fillLight);
  const rimLight = new THREE.PointLight(0xf7a06a, 7, 16, 2);
  rimLight.position.set(-3, 1, -2);
  scene.add(rimLight);

  const objectRoot = new THREE.Group();
  objectRoot.rotation.set(0.28, -0.5, 0);
  scene.add(objectRoot);

  // Orbital system: glossy core, a satin band, a frosted ring with small lights and two wire orbits with pearls.
  const orbital = new THREE.Group();
  orbital.scale.setScalar(0.68);
  objectRoot.add(orbital);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.52, 96, 64),
    new THREE.MeshPhysicalMaterial({ color: '#f36c2e', roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2, envMapIntensity: 0.9 }),
  );
  orbital.add(core);

  const annulus = (outer: number, inner: number, depth: number, bevel: number): THREE.ExtrudeGeometry => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outer, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, inner, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 96 });
    geometry.translate(0, 0, -depth / 2);
    return geometry;
  };

  const bandPivot = new THREE.Group();
  const band = new THREE.Mesh(
    annulus(1.62, 1.34, 0.12, 0.025),
    new THREE.MeshPhysicalMaterial({ color: '#542f28', metalness: 0.35, roughness: 0.5, clearcoat: 0.15, envMapIntensity: 1 }),
  );
  bandPivot.add(band);
  orbital.add(bandPivot);

  const glassPivot = new THREE.Group();
  const glass = new THREE.Mesh(
    annulus(1.18, 0.94, 0.1, 0.02),
    new THREE.MeshPhysicalMaterial({ color: '#f5ead1', roughness: 0.4, transparent: true, opacity: 0.62, clearcoat: 0.5, envMapIntensity: 0.9, depthWrite: false }),
  );
  glassPivot.add(glass);
  const lightGeometry = new THREE.BoxGeometry(0.045, 0.045, 0.02);
  const lightMaterial = new THREE.MeshBasicMaterial({ color: '#e17145' });
  for (let index = 0; index < 28; index += 1) {
    const angle = (index / 28) * Math.PI * 2 + (index % 3) * 0.05;
    const radius = 1 + (((index * 37) % 11) / 11) * 0.14;
    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    light.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.06 + ((index * 13) % 5) / 100);
    light.rotation.z = angle * 3;
    glassPivot.add(light);
  }
  orbital.add(glassPivot);

  const wireMaterial = new THREE.MeshStandardMaterial({ color: '#542f28', metalness: 0.6, roughness: 0.35 });
  const pearlGeometry = new THREE.SphereGeometry(0.085, 28, 20);
  const wires = [
    { radius: 1.9, tube: 0.014, tilt: [0.4, 0.2, -0.5], speed: 0.4, color: '#f5ead1', roughness: 0.2, clearcoat: 0.75 },
    { radius: 1.45, tube: 0.012, tilt: [1.35, -0.3, 0.9], speed: -0.55, color: '#572f3e', roughness: 0.22, clearcoat: 0.7 },
  ].map((wire) => {
    const pivot = new THREE.Group();
    pivot.add(new THREE.Mesh(new THREE.TorusGeometry(wire.radius, wire.tube, 12, 160), wireMaterial));
    const pearl = new THREE.Mesh(pearlGeometry, new THREE.MeshPhysicalMaterial({ color: wire.color, roughness: wire.roughness, clearcoat: wire.clearcoat }));
    pivot.add(pearl);
    pivot.rotation.set(wire.tilt[0], wire.tilt[1], wire.tilt[2]);
    orbital.add(pivot);
    return { pearl, radius: wire.radius, speed: wire.speed };
  });

  // Every ring and pearl is a function of time, so the still render for reduced motion uses the same pose.
  const poseOrbits = (time: number): void => {
    band.rotation.z = time * 0.12;
    glass.rotation.z = time * -0.2;
    bandPivot.rotation.set(1.2 + Math.sin(time * 0.25) * 0.1, 0.35, 0.25);
    glassPivot.rotation.set(0.35, -0.4 + Math.sin(time * 0.3) * 0.12, 0.9);
    for (const wire of wires) {
      const angle = time * wire.speed;
      wire.pearl.position.set(Math.cos(angle) * wire.radius, Math.sin(angle) * wire.radius, 0);
    }
  };
  poseOrbits(1);

  const setSize = (): void => {
    const bounds = root.getBoundingClientRect();
    const width = Math.max(1, bounds.width);
    const height = Math.max(1, bounds.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  };
  const resizeObserver = new ResizeObserver(setSize);
  resizeObserver.observe(root);
  setSize();

  const configuredModelPath = root.dataset.modelPath?.trim();
  if (configuredModelPath) {
    const configuredBase = root.dataset.basePath || '/';
    const base = configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`;
    const modelUrl = new URL(`${base}${configuredModelPath.replace(/^\/+/, '')}`, window.location.origin).toString();
    new GLTFLoader().load(
      modelUrl,
      (gltf) => {
        orbital.visible = false;
        const model = gltf.scene;
        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const largestDimension = Math.max(size.x, size.y, size.z) || 1;
        model.scale.setScalar(2.15 / largestDimension);
        bounds.setFromObject(model);
        const center = bounds.getCenter(new THREE.Vector3());
        model.position.sub(center);
        objectRoot.add(model);
        root.dataset.model = 'loaded';
        renderer.render(scene, camera);
      },
      undefined,
      (error) => {
        console.error('Could not load the configured hero GLB; using the built-in orbital sculpture.', error);
        orbital.visible = true;
        root.dataset.model = 'fallback';
        renderer.render(scene, camera);
      },
    );
  }

  fallback.hidden = true;
  root.dataset.webgl = 'ready';

  let elapsed = 0;
  let spinVelocity = 0;
  let dragTilt = 0;
  let dragging = false;
  let frame = 0;
  const animate = (): void => {
    frame = 0;
    elapsed += 0.008;
    if (!reducedMotionQuery.matches) {
      objectRoot.rotation.y += 0.003 + spinVelocity;
      if (!dragging) dragTilt *= 0.96;
      objectRoot.rotation.x = 0.28 + dragTilt + Math.sin(elapsed * 0.5) * 0.035;
      objectRoot.position.y = Math.sin(elapsed * 0.65) * 0.045;
      spinVelocity *= 0.982;
      poseOrbits(elapsed * 2);
    }
    renderer.render(scene, camera);
    if (!reducedMotionQuery.matches) frame = window.requestAnimationFrame(animate);
  };

  const renderStill = (): void => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    renderer.render(scene, camera);
  };

  const startAnimation = (): void => {
    if (reducedMotionQuery.matches) renderStill();
    else if (!frame) frame = window.requestAnimationFrame(animate);
  };
  startAnimation();
  reducedMotionQuery.addEventListener('change', startAnimation);

  spinButton.addEventListener('click', () => {
    if (reducedMotionQuery.matches) {
      objectRoot.rotation.y += Math.PI * 0.65;
      renderStill();
      return;
    }
    spinVelocity += 0.11;
  });

  const canDrag = window.matchMedia('(pointer: fine)').matches;
  if (canDrag) {
    let lastX = 0;
    let lastY = 0;
    canvas.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch') return;
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
      root.dataset.dragging = 'true';
    });
    canvas.addEventListener('pointermove', (event) => {
      if (!dragging || event.pointerType === 'touch') return;
      objectRoot.rotation.y += (event.clientX - lastX) * 0.008;
      dragTilt = Math.max(-1.1, Math.min(1.1, dragTilt + (event.clientY - lastY) * 0.006));
      objectRoot.rotation.x = 0.28 + dragTilt;
      lastX = event.clientX;
      lastY = event.clientY;
      if (reducedMotionQuery.matches) renderStill();
    });
    const stopDragging = (): void => {
      dragging = false;
      delete root.dataset.dragging;
    };
    canvas.addEventListener('pointerup', stopDragging);
    canvas.addEventListener('pointercancel', stopDragging);
    canvas.addEventListener('lostpointercapture', stopDragging);
  }
}
