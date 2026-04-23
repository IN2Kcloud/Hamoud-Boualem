window.addEventListener('load', () => {
  document.body.classList.remove('before-load');
});
document.querySelector('.loading').addEventListener('transitionend', (e) => {
  document.body.removeChild(e.currentTarget);
});

gsap.to(".intro-title", {
  blur: 20,
  scale: 1.4,
  opacity: 0,
  duration: .5,
  ease: "power2.out"
});

gsap.to(".intro-title", {
  scale: 1,
  opacity: 1,
  delay: 2,
  duration: 1,
  ease: "power2.out"
});

gsap.to(".intro-title", {
  scale: 1.4,
  blur: 20,
  delay: 3.5,
  duration: .5
});

gsap.to(".intro", {
  opacity: 0,
  delay: 4,
  duration: 1,
  onComplete: () => document.querySelector(".intro").remove()
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
// DRAW
// --------------------
function draw() {
  t += 0.01;

  const w = canvas.width;
  const h = canvas.height;

  // black base
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);

  const centerX = w / 2;

  const wave1 = Math.sin(t * 1.2) * 40;
  const wave2 = Math.sin(t * 0.7 + 2) * 60;
  const wave3 = Math.sin(t * 1.8 + 4) * 30;

  // yellow core
  ctx.fillStyle = "#FFD100";

  const baseWidth = w * 0.8;

  const leftEdge =
    centerX -
    baseWidth / 2 +
    Math.sin(t * 1.1) * 20 +
    wave3;

  const rightEdge =
    centerX +
    baseWidth / 2 +
    Math.cos(t * 1.3) * 20 -
    wave3;

  ctx.beginPath();

  // --------------------
  // DOWNWARD FLOW FIX
  // --------------------
  const flowSpeed = t * 120; // 🔥 THIS creates downward motion

  // left side (flowing down)
  ctx.moveTo(leftEdge, 0);

  for (let y = 0; y <= h; y += 20) {
    const wobble =
      Math.sin(y * 0.01 + t * 2 + flowSpeed * 0.01) * 25 +
      Math.sin(y * 0.02 + t * 1.5 + flowSpeed * 0.02) * 12;

    const x = leftEdge + wobble;
    ctx.lineTo(x, y);
  }

  // right side (return path)
  for (let y = h; y >= 0; y -= 20) {
    const wobble =
      Math.sin(y * 0.01 + t * 2 + flowSpeed * 0.01 + 3) * 25 +
      Math.sin(y * 0.02 + t * 1.5 + flowSpeed * 0.02 + 2) * 12;

    const x = rightEdge + wobble;
    ctx.lineTo(x, y);
  }

  ctx.closePath();
  ctx.fill();

  // --------------------
  // BLACK EDGE WALLS
  // --------------------
  const edge = 80;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, edge, h);
  ctx.fillRect(w - edge, 0, edge, h);

  requestAnimationFrame(draw);
}

draw();