window.addEventListener("load", () => {
  const tl = gsap.timeline();

  tl
    // --------------------
    // LOADER OUT (FAST + PUNCHY)
    // --------------------
    .to(".loading", {
      scale: 1.2,
      opacity: 0,
      duration: 0.6,
      ease: "power3.inOut",
      onComplete: () => document.querySelector(".loading").remove()
    })

    // --------------------
    // INTRO LOGO ENTER (FROM NOTHING)
    // --------------------
    .fromTo(".intro-title",
      {
        scale: 1.6,
        opacity: 0,
        filter: "blur(30px)"
      },
      {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power4.out"
      }
    )

    // --------------------
    // HOLD (let it breathe)
    // --------------------
    .to({}, { duration: 0.6 })

    // --------------------
    // INTRO COLLAPSE (cinematic exit)
    // --------------------
    .to(".intro-title", {
      scale: 0.9,
      opacity: 0,
      filter: "blur(20px)",
      duration: 0.6,
      ease: "power2.in"
    })

    // --------------------
    // WHITE SCREEN LIFT (reveal world)
    // --------------------
    .to(".intro", {
      y: "-100%",
      duration: 1,
      ease: "power4.inOut",
      onComplete: () => document.querySelector(".intro").remove()
    }, "-=0.3")

    // --------------------
    // MAIN LOGO REVEAL (connected timing)
    // --------------------
    .fromTo(".hb",
      {
        opacity: 0,
        scale: 1.3,
        filter: "blur(20px)"
      },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power4.out"
      },
      "-=0.8"
    );
});

// ----------------------
// ELEMENTS
// ----------------------
const cursor = document.querySelector(".cursor");
const cursorImg = document.querySelector(".cursor-img");
const teamCopy1 = document.querySelector(".team-copy1");
const itemsContainer = document.querySelector(".items-container");

// ----------------------
// SAFETY CHECK
// ----------------------
if (!cursor || !cursorImg || !teamCopy1 || !itemsContainer) {
  console.error("❌ Missing required DOM elements");
}

// ----------------------
// MEDIA DATA (FIXED TITLES)
// ----------------------
const imageData = [
  { src: "./assets/img-1.webp", title: "Production Line" },
  { src: "./assets/img-2.webp", title: "National Heritage" },
  { src: "./assets/img-3.webp", title: "Algiers 1878" },
  { src: "./assets/img-4.webp", title: "Zero C'est Zero" },
  { src: "./assets/img-5.webp", title: "Ana Djazairi" },
  { src: "./assets/img-6.webp", title: "Our Story" }
];

const videoData = [
  { src: "./assets/vid-1.mp4", title: "Slim Effect" },
  { src: "./assets/vid-2.mp4", title: "Hamoud Cola" },
  { src: "./assets/vid-3.mp4", title: "Ana Djazairi" },
  { src: "./assets/vid-4.mp4", title: "Selecto Uno" },
  { src: "./assets/vid-5.mp4", title: "Archive Footage" },
  { src: "./assets/vid-6.mp4", title: "Hamoud Zero" },
  { src: "./assets/vid-7.mp4", title: "Selecto Dos" }
];

// ----------------------
// AUDIO (OPTIMIZED)
// ----------------------
const clickSound = new Audio("./assets/click-sfx.mp3");


// ----------------------
// CURSOR IMAGE SWITCH
// ----------------------
function changeCursorImage(newSrc) {
  if (!cursorImg) return;

  cursorImg.classList.add("hidden");
  setTimeout(() => {
    cursorImg.src = newSrc;
    cursorImg.classList.remove("hidden");
  }, 300);
}

// ----------------------
// CURSOR FOLLOW
// ----------------------
document.addEventListener("mousemove", (e) => {
  if (!cursor) return;

  gsap.to(cursor, {
    x: e.clientX - cursor.offsetWidth / 2,
    y: e.clientY - cursor.offsetHeight / 2,
    duration: 0.5,
    ease: "power2.out",
  });
});

// ----------------------
// HOVER EVENTS
// ----------------------
if (teamCopy1) {
  teamCopy1.addEventListener("mouseenter", () => {
    changeCursorImage("./assets/new-cursor.webp");
  });

  teamCopy1.addEventListener("mouseleave", () => {
    changeCursorImage("./assets/cursor.webp");
  });
}

// ----------------------
// CLICK → SPAWN MEDIA
// ----------------------

let imagePool = [];
let videoPool = [];

function refillPools() {
  imagePool = [...imageData];
  videoPool = [...videoData];

  shuffle(imagePool);
  shuffle(videoPool);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

refillPools();

document.addEventListener("click", function (event) {
  if (!itemsContainer) return;

  // play sound safely
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});

  const isVideo = Math.random() < 0.5;
  let container = document.createElement("div");
  const elementWidth = 700;

  let item;

  // ✅ NON-REPEATING LOGIC
  if (isVideo) {
    if (videoPool.length === 0) refillPools();
    item = videoPool.pop();

    container.innerHTML = `
      <div class="video-container">
        <video autoplay loop muted playsinline>
          <source src="${item.src}" type="video/mp4"/>
        </video>
        <div class="media-title">${item.title}</div>
      </div>
    `;
  } else {
    if (imagePool.length === 0) refillPools();
    item = imagePool.pop();

    container.innerHTML = `
      <div class="img-container">
        <img src="${item.src}" alt="" />
        <div class="media-title">${item.title}</div>
      </div>
    `;
  }

  const el = container.firstElementChild;
  if (!el) return;

  itemsContainer.appendChild(el);

  // position
  el.style.left = `${event.clientX - elementWidth / 2}px`;
  el.style.top = `${event.clientY}px`;

  const randomRotation = Math.random() * 10 - 5;

  // initial state
  gsap.set(el, {
    scale: 0,
    rotation: randomRotation,
    transformOrigin: "center",
  });

  const randomScale = Math.random() * 0.5 + 0.5;

  // animation
  const tl = gsap.timeline();

  tl.to(el, {
    scale: randomScale,
    duration: 0.5,
    delay: 0.1,
  });

  tl.to(
    el,
    {
      y: "-=500",
      opacity: 1,
      duration: 4,
      ease: "none",
    },
    "<"
  ).to(
    el,
    {
      opacity: 0,
      duration: 1,
      onComplete: () => el.remove(),
    },
    "-=0.5"
  );
});

// BG points -----------------------------------------------------------------

const gridCanvas = document.getElementById("grid-bg");
const ctx = gridCanvas.getContext("2d");

let mouse = { x: 0.5, y: 0.5 };
let time = 0;

function resize() {
  gridCanvas.width = window.innerWidth;
  gridCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX / window.innerWidth;
  mouse.y = e.clientY / window.innerHeight;
});

function draw() {
  time += 0.01;

  ctx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
  ctx.fillStyle = "#FFD100";
  ctx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);

  const spacing = 32;
  const rows = Math.ceil(gridCanvas.height / spacing);
  const cols = Math.ceil(gridCanvas.width / spacing);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {

      const px = x * spacing;
      const py = y * spacing;

      // wave motion
      const wave =
        Math.sin(x * 0.3 + time) +
        Math.cos(y * 0.3 + time);

      // mouse pull
      const mx = (mouse.x - 0.5) * 40;
      const my = (mouse.y - 0.5) * 40;

      const dx = px + wave * 3 + mx * (y / rows);
      const dy = py + wave * 3 + my * (x / cols);

      //const size = 1.2 + wave * 0.3;
      const size = (1.2 + wave * 0.3) * Math.min(window.innerWidth / 1000, 1);

      ctx.beginPath();
      ctx.arc(dx, dy, size, 0, Math.PI * 2);
      ctx.fillStyle = "#000";
      ctx.fill();
    }
  }

  requestAnimationFrame(draw);
}

draw();

/*
// BG points -----------------------------------------------------------------

const canvas = document.getElementById("grid-bg");
const ctx = canvas.getContext("2d");

let t = 0;

// --------------------
// RESIZE
// --------------------
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// --------------------
// CORE SETTINGS
// --------------------
const BLACK = "#000";
const YELLOW = "#FFD100";

// --------------------
// DRAW
// --------------------
function draw() {
  t += 0.008;

  const w = canvas.width;
  const h = canvas.height;

  // background
  ctx.fillStyle = BLACK;
  ctx.fillRect(0, 0, w, h);

  const centerX = w / 2;

  // 🔥 gravity pulse (this drives everything)
  const gravity = t * 160;

  // subtle breathing width (organic pressure)
  const pressure = Math.sin(t * 0.6) * 40;

  const baseWidth = w * 0.65 + pressure;

  const leftBase = centerX - baseWidth / 2;
  const rightBase = centerX + baseWidth / 2;

  ctx.fillStyle = YELLOW;
  ctx.beginPath();

  // --------------------
  // LEFT EDGE (flowing down)
  // --------------------
  ctx.moveTo(leftBase, 0);

  for (let y = 0; y <= h; y += 12) {
    const flow =
      Math.sin(y * 0.015 - gravity * 0.02) * 25 +
      Math.sin(y * 0.03 - gravity * 0.01) * 10;

    const pinch = Math.sin(t + y * 0.005) * 15;

    ctx.lineTo(leftBase + flow + pinch, y);
  }

  // --------------------
  // RIGHT EDGE (mirrored chaos)
  // --------------------
  for (let y = h; y >= 0; y -= 12) {
    const flow =
      Math.sin(y * 0.015 - gravity * 0.02 + 3) * 25 +
      Math.sin(y * 0.03 - gravity * 0.01 + 2) * 10;

    const pinch = Math.cos(t + y * 0.005) * 15;

    ctx.lineTo(rightBase + flow + pinch, y);
  }

  ctx.closePath();
  ctx.fill();

  // --------------------
  // EDGE CONFINEMENT (black “walls” feel alive now)
  // --------------------
  const edgeW = 90 + Math.sin(t * 1.2) * 10;

  ctx.fillStyle = BLACK;

  // left wall
  ctx.fillRect(
    0,
    0,
    edgeW + Math.sin(t * 1.5) * 5,
    h
  );

  // right wall
  ctx.fillRect(
    w - edgeW - Math.cos(t * 1.3) * 5,
    0,
    edgeW,
    h
  );

  // --------------------
  // SUBTLE INTERNAL “ENERGY STRAND”
  // --------------------
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = YELLOW;
  ctx.lineWidth = 2;

  ctx.beginPath();
  for (let y = 0; y <= h; y += 20) {
    const x =
      centerX +
      Math.sin(y * 0.02 + t * 3) * 40;

    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  requestAnimationFrame(draw);
}

draw();
*/
