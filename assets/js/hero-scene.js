function initHeroScene() {
  const canvas = document.querySelector('#hero-canvas');
  if (!canvas) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !window.THREE) {
    canvas.style.display = 'none';
    const fallback = document.querySelector('#hero-fallback');
    if (fallback) fallback.style.display = 'block';
    return;
  }

  const isMobile = window.innerWidth < 640;
  const nodeCount = isMobile ? 14 : 28;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const nodes = [];
  const nodeGeometry = new THREE.SphereGeometry(0.04, 8, 8);
  const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x2b4257 });
  for (let i = 0; i < nodeCount; i += 1) {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.set(
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 4
    );
    nodes.push(node);
  }

  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x2b4257, transparent: true, opacity: 0.35 });
  const lineGroup = new THREE.Group();
  nodes.forEach((node, i) => {
    const next = nodes[(i + 1) % nodes.length];
    const geometry = new THREE.BufferGeometry().setFromPoints([node.position, next.position]);
    lineGroup.add(new THREE.Line(geometry, lineMaterial));
  });

  const group = new THREE.Group();
  nodes.forEach((n) => group.add(n));
  group.add(lineGroup);
  scene.add(group);

  let mouseX = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  });

  let visible = true;
  const observer = new IntersectionObserver(
    ([entry]) => { visible = entry.isIntersecting; },
    { threshold: 0 }
  );
  observer.observe(canvas);

  function animate() {
    requestAnimationFrame(animate);
    if (!visible) return;
    group.rotation.y += 0.0015;
    group.rotation.y += (mouseX * 0.05 - group.rotation.y) * 0.01;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });

  if (window.gsap) {
    gsap.from(group.scale, { x: 0, y: 0, z: 0, duration: 1.2, ease: 'power3.out' });
  }
}

window.initHeroScene = initHeroScene;
