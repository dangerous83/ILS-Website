/* ============================================
   WIREFRAME NETWORK GLOBE (shared module)
   Renders every .globe-scene on the page:
   - the interactive hero globe (index.html)
   - decorative .globe-scene--card tiles in the
     "owned hubs" grid (index.html + network.html)
   Loaded standalone so subpages get the globe
   without pulling in the whole homepage script.
   ============================================ */
(function () {
  const scenes = document.querySelectorAll('.globe-scene');
  if (!scenes.length) return;
  scenes.forEach(mountGlobe);

  function mountGlobe(scene) {
  const canvas = scene.querySelector('canvas');
  if (!canvas) return;
  // Card instances (in the hubs grid) are purely decorative — auto-spin
  // only, no drag / cursor torch, so they never trap page scroll.
  const interactive = !scene.classList.contains('globe-scene--card');

  const ctx = canvas.getContext('2d');
  const chips = Array.from(scene.querySelectorAll('[data-globe-node]'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- geometry ---------- */
  const POINTS = 190;
  const pts = [];
  // Fibonacci sphere — evenly distributed points
  const GA = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < POINTS; i++) {
    const y = 1 - (i / (POINTS - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = GA * i;
    pts.push({ x: Math.cos(th) * r, y: y, z: Math.sin(th) * r });
  }

  // Precompute the wireframe topology once — rigid rotation keeps
  // distances constant, so neighbor pairs never change.
  const links = [];
  const LINK_DIST = 0.36;
  for (let i = 0; i < POINTS; i++) {
    for (let j = i + 1; j < POINTS; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const dz = pts[i].z - pts[j].z;
      if (dx * dx + dy * dy + dz * dz < LINK_DIST * LINK_DIST) links.push([i, j]);
    }
  }

  // A few of the points get drawn as little "cargo cubes"
  const cubes = [];
  for (let i = 7; i < POINTS; i += 23) cubes.push(i);

  // Region chip anchors — spread over the sphere (lat°, lon°)
  const anchorLL = [
    [18, 10], [-14, 70], [26, 135], [-8, 195], [20, 258], [-24, 315]
  ];
  const anchors = anchorLL.map(([lat, lon]) => {
    const la = (lat * Math.PI) / 180;
    const lo = (lon * Math.PI) / 180;
    return { x: Math.cos(la) * Math.cos(lo), y: Math.sin(la), z: Math.cos(la) * Math.sin(lo) };
  });

  /* ---------- state ---------- */
  let W = 0, H = 0, CX = 0, CY = 0, R = 0, DPR = 1;
  let yaw = 0.6;                 // current rotation
  const pitch = -0.35;           // fixed tilt (like the reference)
  let vel = 0.0032;              // auto-spin speed (rad/frame @60fps)
  const BASE_VEL = 0.0032;
  let glow = 0, glowTarget = 0;  // eased hover glow 0..1
  let dragging = false, lastX = 0, lastT = 0, dragVel = 0;
  let paused = false;            // chip hover pauses the spin
  let raf = null;
  // cursor position (canvas px) for the proximity "torch" glow
  let mx = -9999, my = -9999, mInside = false;
  const TORCH = 108;             // glow radius around the cursor

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    const rect = scene.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    CX = W / 2; CY = H / 2;
    R = W * 0.41;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  // 0..1 closeness of a screen point to the cursor (for the torch glow)
  function torch(x, y) {
    if (!mInside) return 0;
    const dx = x - mx, dy = y - my;
    const d = Math.sqrt(dx * dx + dy * dy);
    return d < TORCH ? 1 - d / TORCH : 0;
  }

  const cosP = () => Math.cos(pitch), sinP = () => Math.sin(pitch);

  // rotate + perspective-project a unit vector; returns screen pos, depth, scale
  function project(p, cy, sy) {
    // yaw (around Y)
    const x1 = p.x * cy + p.z * sy;
    const z1 = -p.x * sy + p.z * cy;
    // pitch (around X)
    const y2 = p.y * cosP() - z1 * sinP();
    const z2 = p.y * sinP() + z1 * cosP();
    const d = 3.2;                       // camera distance (in radii)
    const s = d / (d - z2);              // perspective scale
    return { sx: CX + x1 * R * s, sy: CY + y2 * R * s, z: z2, s: s };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const cy = Math.cos(yaw), sy = Math.sin(yaw);

    const proj = pts.map((p) => project(p, cy, sy));
    const g = glow;

    // wireframe links — subtle by default; depth + hover + the cursor
    // "torch" brighten them. Lines the cursor passes over light up.
    for (let k = 0; k < links.length; k++) {
      const a = proj[links[k][0]], b = proj[links[k][1]];
      const depth = (a.z + b.z) / 2;               // -1 back … +1 front
      const t = (depth + 1) / 2;
      const near = torch((a.sx + b.sx) / 2, (a.sy + b.sy) / 2);
      const alpha = (0.03 + t * 0.20) * (1 + g * 1.1) + near * 0.75;
      // near the cursor the line shifts brighter / whiter-blue
      const col = near > 0.02 ? (150 + near * 70) + ', ' + (190 + near * 45) + ', 255'
                              : '112, 168, 255';
      ctx.strokeStyle = 'rgba(' + col + ',' + Math.min(alpha, 0.95) + ')';
      ctx.lineWidth = 0.9 + g * 0.5 + near * 1.4;
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
    }

    // points
    for (let i = 0; i < proj.length; i++) {
      const p = proj[i];
      const t = (p.z + 1) / 2;
      const near = torch(p.sx, p.sy);
      const alpha = (0.16 + t * 0.42) * (1 + g * 0.6) + near * 0.7;
      const size = (0.85 + t * 1.2) * p.s + near * 1.6;
      const col = near > 0.02 ? (170 + near * 60) + ', ' + (205 + near * 30) + ', 255'
                              : '168, 204, 255';
      ctx.fillStyle = 'rgba(' + col + ',' + Math.min(alpha, 1) + ')';
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // small "cargo cube" accents
    for (let c = 0; c < cubes.length; c++) {
      const p = proj[cubes[c]];
      if (p.z < -0.2) continue;                    // hide far-back cubes
      const t = (p.z + 1) / 2;
      const near = torch(p.sx, p.sy);
      const s = (3 + t * 3) * p.s;
      ctx.save();
      ctx.translate(p.sx, p.sy);
      ctx.rotate(yaw + c);
      ctx.globalAlpha = Math.min(0.22 + t * 0.4 + near * 0.5, 1);
      ctx.strokeStyle = 'rgba(190, 218, 255,' + (0.45 + g * 0.35 + near * 0.4) + ')';
      ctx.lineWidth = 1.1;
      ctx.strokeRect(-s / 2, -s / 2, s, s);
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    // outer glow halo (stronger on hover)
    const halo = ctx.createRadialGradient(CX, CY, R * 0.55, CX, CY, R * 1.25);
    halo.addColorStop(0, 'rgba(64, 130, 255, 0)');
    halo.addColorStop(0.8, 'rgba(64, 130, 255,' + (0.04 + g * 0.09) + ')');
    halo.addColorStop(1, 'rgba(64, 130, 255, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, W, H);

    // soft spotlight that follows the cursor across the mesh
    if (mInside) {
      const spot = ctx.createRadialGradient(mx, my, 0, mx, my, TORCH);
      spot.addColorStop(0, 'rgba(120, 180, 255, 0.16)');
      spot.addColorStop(1, 'rgba(120, 180, 255, 0)');
      ctx.fillStyle = spot;
      ctx.beginPath();
      ctx.arc(mx, my, TORCH, 0, Math.PI * 2);
      ctx.fill();
    }

    // position the 6 region chips on the sphere
    for (let i = 0; i < chips.length; i++) {
      const a = project(anchors[i], cy, sy);
      const t = (a.z + 1) / 2;                      // 0 back … 1 front
      const scale = 0.55 + t * 0.55;
      const el = chips[i];
      el.style.transform =
        'translate(' + (a.sx - 26) + 'px,' + (a.sy - 26) + 'px) scale(' + scale.toFixed(3) + ')';
      el.style.opacity = (0.30 + t * 0.70).toFixed(3);
      el.style.zIndex = a.z > 0 ? 4 : 1;            // front chips above canvas
      el.style.pointerEvents = a.z > 0 ? 'auto' : 'none';
    }
  }

  function tick() {
    if (!dragging && !paused) yaw += vel;
    // ease drag inertia back to the cruise speed
    if (!dragging) vel += (BASE_VEL - vel) * 0.02;
    // ease the glow
    glow += (glowTarget - glow) * 0.08;
    draw();
    raf = requestAnimationFrame(tick);
  }

  /* ---------- interaction ---------- */
  if (interactive) {
  scene.addEventListener('mouseenter', () => { glowTarget = 1; mInside = true; });
  scene.addEventListener('mouseleave', () => {
    glowTarget = 0; mInside = false; mx = my = -9999;
    dragging = false; scene.classList.remove('is-dragging');
  });

  chips.forEach((el) => {
    el.addEventListener('mouseenter', () => { paused = true; });
    el.addEventListener('mouseleave', () => { paused = false; });
    el.addEventListener('focus', () => { paused = true; });
    el.addEventListener('blur', () => { paused = false; });
  });

  scene.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.globe-node')) return;   // let chip clicks through
    dragging = true;
    lastX = e.clientX;
    lastT = performance.now();
    scene.classList.add('is-dragging');
    scene.setPointerCapture && scene.setPointerCapture(e.pointerId);
  });
  scene.addEventListener('pointermove', (e) => {
    // track the cursor over the canvas for the torch glow (hover or drag)
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
    mInside = true;
    if (!dragging) return;
    const now = performance.now();
    const dx = e.clientX - lastX;
    yaw += dx * 0.006;
    dragVel = (dx * 0.006) / Math.max(now - lastT, 1) * 16.7;
    lastX = e.clientX;
    lastT = now;
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    scene.classList.remove('is-dragging');
    // hand off inertia, clamped so it can't spin wildly
    vel = Math.max(-0.05, Math.min(0.05, dragVel || BASE_VEL));
    if (Math.abs(vel) < 0.0005) vel = BASE_VEL;
  };
  scene.addEventListener('pointerup', endDrag);
  scene.addEventListener('pointercancel', endDrag);
  }

  /* ---------- boot ---------- */
  resize();
  window.addEventListener('resize', () => { resize(); if (reduceMotion) draw(); });

  if (reduceMotion) {
    draw();                                        // static frame only
  } else {
    // don't burn frames while the globe is off-screen
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { if (!raf) tick(); }
          else if (raf) { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0.05 });
      io.observe(scene);
    } else {
      tick();
    }
  }
  }
})();
