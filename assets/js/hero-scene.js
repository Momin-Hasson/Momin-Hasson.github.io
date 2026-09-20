// Hero: the original colorful node network, full-bleed, with the stack it stands for labeled beside the name.
function initHeroScene() {
  var canvas = document.querySelector('#hero-canvas');
  if (!canvas) return;
  var hero = canvas.parentElement;
  var labelsWrap = document.querySelector('.node-labels');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!window.THREE) {
    canvas.style.display = 'none';
    var fb = document.querySelector('#hero-fallback');
    if (fb) fb.style.display = 'block';
    return;
  }

  var PALETTE = [0xee2560, 0xf7b32b, 0x1fbf75, 0x29b6f6];
  var isMobile = window.innerWidth < 760;
  // Technologies from the résumé, interleaved by category so each side gets a mix. Even index goes left, odd goes right.
  var stack = ['Azure', '.NET', 'Python', 'React', 'Key Vault', 'TypeScript', 'MCP', 'Redis', 'Docker', 'PostgreSQL',
    'Claude', 'Azure Functions', 'AWS', 'Entra ID', 'n8n', 'Supabase', 'C#', 'Node.js', 'GitHub Actions', 'Cosmos DB',
    'Nginx', 'Service Bus', 'GCP', 'MongoDB'];

  var seed = 11;
  function rnd() { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; var t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }

  var scene = new THREE.Scene();
  var FOV = 42, CAMZ = 9.5;
  var camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.z = CAMZ;
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var group = new THREE.Group();
  scene.add(group);

  var W = 1, H = 1;
  function halfExtents() {
    var hh = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAMZ;
    return { hw: hh * (W / H), hh: hh };
  }
  // Build the layout for the current viewport; called on first size and on resize.
  var pts = [], labeled = [], labelEls = [], lines = null, meshes = [];

  function readLine() {
    var cs = getComputedStyle(document.documentElement);
    return { color: parseInt(cs.getPropertyValue('--net-line').trim(), 16), opacity: parseFloat(cs.getPropertyValue('--net-opacity')) };
  }

  function build() {
    meshes.forEach(function (m) { group.remove(m); });
    if (lines) { group.remove(lines); lines.geometry.dispose(); }
    labelsWrap.innerHTML = '';
    pts = []; labeled = []; labelEls = []; meshes = [];
    seed = 11;
    var e = halfExtents(), hw = e.hw, hh = e.hh;
    var showLabels = W >= 980;

    // Labeled nodes flank the centered content, five per side, with text pointing outward.
    if (showLabels) {
      stack.forEach(function (name, i) {
        var side = i % 2 ? 1 : -1, n = Math.floor(i / 2), per = stack.length / 2;
        var base = Math.min(0.6, 340 / (W / 2)); // stay clear of the centered content
        var x = side * hw * (base + 0.03 + rnd() * 0.03 + (n % 2) * 0.1);
        var y = (0.92 - n / (per - 1) * 1.84) * hh * 0.86 + (rnd() - 0.5) * hh * 0.03;
        pts.push(new THREE.Vector3(x, y, (rnd() - 0.5) * 1.2));
        labeled.push({ name: name, index: pts.length - 1, side: side });
      });
    }
    var extra = isMobile ? 34 : 78;
    for (var k = 0; k < extra; k++) pts.push(new THREE.Vector3((rnd() - 0.5) * hw * 2.1, (rnd() - 0.5) * hh * 2.1, (rnd() - 0.5) * 3));

    var seen = {}, pos = [];
    pts.forEach(function (p, i) {
      pts.map(function (q, j) { return { j: j, d: p.distanceToSquared(q) }; })
        .filter(function (o) { return o.j !== i; })
        .sort(function (a, b) { return a.d - b.d; }).slice(0, 2)
        .forEach(function (o) {
          var key = i < o.j ? i + '-' + o.j : o.j + '-' + i;
          if (seen[key]) return; seen[key] = 1;
          pos.push(p.x, p.y, p.z, pts[o.j].x, pts[o.j].y, pts[o.j].z);
        });
    });
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    var ln = readLine();
    lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: ln.color, transparent: true, opacity: ln.opacity }));
    group.add(lines);

    pts.forEach(function (p, i) {
      var isLabel = labeled.some(function (l) { return l.index === i; });
      var r = isLabel ? 0.1 : 0.035 + rnd() * 0.05;
      var m = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 12), new THREE.MeshBasicMaterial({ color: PALETTE[Math.floor(rnd() * PALETTE.length)] }));
      m.position.copy(p);
      group.add(m); meshes.push(m);
    });

    labeled.forEach(function (l, n) {
      var el = document.createElement('div');
      el.className = 'node-label' + (l.side < 0 ? ' left' : '');
      var s = document.createElement('span'); s.textContent = l.name; el.appendChild(s);
      el.style.setProperty('--delay', 900 + n * 60 + 'ms');
      labelsWrap.appendChild(el); labelEls.push(el);
    });
    if (labelsShown) requestAnimationFrame(function () { labelEls.forEach(function (el) { el.classList.add('is-on'); }); });
  }

  var v = new THREE.Vector3();
  function place() {
    camera.updateMatrixWorld(true); // the view matrix is otherwise stale until the first render
    group.updateMatrixWorld(true);
    labeled.forEach(function (l, n) {
      v.copy(pts[l.index]).applyMatrix4(group.matrixWorld).project(camera);
      var x = (v.x * 0.5 + 0.5) * W, y = (-v.y * 0.5 + 0.5) * H;
      labelEls[n].style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      labelEls[n].style.setProperty('--o', (0.6 + 0.4 * (1 - (v.z + 1) / 2)).toFixed(2));
    });
  }

  var labelsShown = false, built = false;
  function resize() {
    W = hero.clientWidth; H = hero.clientHeight;
    if (!W || !H) return;
    isMobile = window.innerWidth < 760;
    camera.aspect = W / H; camera.updateProjectionMatrix();
    renderer.setSize(W, H, false);
    build(); built = true;
    place(); renderer.render(scene, camera);
  }
  var lastW = 0;
  function onResize() { if (Math.abs(hero.clientWidth - lastW) > 40) { lastW = hero.clientWidth; resize(); } }
  if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(hero); else window.addEventListener('resize', onResize);
  lastW = hero.clientWidth; resize();

  window.addEventListener('themechange', function () {
    if (!lines) return;
    var ln = readLine();
    lines.material.color.setHex(ln.color); lines.material.opacity = ln.opacity;
    if (reduce) renderer.render(scene, camera);
  });

  labelsShown = true;
  requestAnimationFrame(function () { requestAnimationFrame(function () { labelEls.forEach(function (el) { el.classList.add('is-on'); }); }); });
  if (reduce) return;

  var mx = 0, my = 0;
  window.addEventListener('mousemove', function (e) {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  var visible = true;
  new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(hero);

  var t0 = performance.now();
  (function animate(now) {
    requestAnimationFrame(animate);
    if (!visible || !built) return;
    var t = (now - t0) / 1000;
    var grow = Math.min(1, t / 1.4), s = 1 - Math.pow(1 - grow, 3);
    group.scale.setScalar(0.001 + 0.999 * s);
    group.rotation.y += ((Math.sin(t * 0.18) * 0.16 + mx * 0.18) - group.rotation.y) * 0.04;
    group.rotation.x += ((my * 0.1) - group.rotation.x) * 0.04;
    place();
    renderer.render(scene, camera);
  })(t0);
}
window.initHeroScene = initHeroScene;
