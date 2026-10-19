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
  scene.add(objectRoot);

  const sculptureMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#f36c2e'),
    roughness: 0.36,
    metalness: 0.02,
    clearcoat: 0.2,
    clearcoatRoughness: 0.34,
    sheen: 0.14,
    sheenColor: new THREE.Color('#f58a52'),
    sheenRoughness: 0.55,
    envMapIntensity: 0.58,
  });
  const flowerGeometry = new THREE.SphereGeometry(1, 128, 80);
  const positions = flowerGeometry.getAttribute('position');
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const z = positions.getZ(index);
    const radial = Math.hypot(x, y);
    const angle = Math.atan2(y, x);
    const lobeScale = 1 + 0.31 * Math.cos(6 * angle) * Math.pow(radial, 2.1);
    positions.setXYZ(index, x * lobeScale, y * lobeScale, z * 0.53);
  }
  flowerGeometry.computeVertexNormals();
  const flower = new THREE.Mesh(flowerGeometry, sculptureMaterial);
  flower.castShadow = false;
  flower.receiveShadow = false;
  objectRoot.add(flower);

  const pearlGeometry = new THREE.SphereGeometry(0.075, 28, 20);
  const creamPearl = new THREE.Mesh(
    pearlGeometry,
    new THREE.MeshPhysicalMaterial({ color: '#f5ead1', roughness: 0.2, clearcoat: 0.75, clearcoatRoughness: 0.17 }),
  );
const winePearl = new THREE.Mesh(
    pearlGeometry,
    new THREE.MeshPhysicalMaterial({ color: '#572f3e', roughness: 0.22, clearcoat: 0.7, clearcoatRoughness: 0.18 }),
  );
  creamPearl.position.set(1.35, 0.32, 0.2);
  winePearl.position.set(-1.28, -0.28, -0.15);
  scene.add(creamPearl, winePearl);

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
        flower.visible = false;
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
        console.error('Could not load the configured hero GLB; using the built-in sculpture.', error);
        flower.visible = true;
        root.dataset.model = 'fallback';
        renderer.render(scene, camera);
      },
    );
  }

  fallback.hidden = true;
  root.dataset.webgl = 'ready';

  let elapsed = 0;
  let spinVelocity = 0;
  let frame = 0;
  const animate = (): void => {
    frame = 0;
    elapsed += 0.008;
    if (!reducedMotionQuery.matches) {
      objectRoot.rotation.y += 0.003 + spinVelocity;
      objectRoot.rotation.x = Math.sin(elapsed * 0.5) * 0.035;
      objectRoot.position.y = Math.sin(elapsed * 0.65) * 0.045;
      spinVelocity *= 0.982;
      const orbit = elapsed * 0.52;
      creamPearl.position.set(Math.cos(orbit) * 1.55, Math.sin(orbit * 0.88) * 0.7 + 0.3, Math.sin(orbit) * 0.55);
      winePearl.position.set(Math.cos(orbit + 3.0) * 1.48, Math.sin(orbit * 0.9 + 2.1) * 0.68 - 0.12, Math.sin(orbit + 3.0) * 0.45);
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
    let dragging = false;
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
      objectRoot.rotation.x += (event.clientY - lastY) * 0.006;
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
