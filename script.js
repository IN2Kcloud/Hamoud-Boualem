window.addEventListener('load', () => {
  document.body.classList.remove('before-load');
});
document.querySelector('.loading').addEventListener('transitionend', (e) => {
  document.body.removeChild(e.currentTarget);
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

// --- 1. Create a hidden noise buffer ---
const noiseCanvas = document.createElement('canvas');
const noiseCtx = noiseCanvas.getContext('2d');
noiseCanvas.width = 100;
noiseCanvas.height = 100;

function createNoise() {
    const imageData = noiseCtx.createImageData(100, 100);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255;
        data[i] = data[i+1] = data[i+2] = val; // RGB
        data[i+3] = 25; // Opacity of the grain (keep it low!)
    }
    noiseCtx.putImageData(imageData, 0, 0);
}
createNoise();

let time = 0;

function resize() {
    gridCanvas.width = window.innerWidth;
    gridCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function draw() {
    time += 0.005;
    
    // Clear canvas
    ctx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

    // 2. Draw the Gradient
    const centerX = gridCanvas.width / 2 + Math.cos(time) * (gridCanvas.width * 0.3);
    const centerY = gridCanvas.height / 2 + Math.sin(time * 0.8) * (gridCanvas.height * 0.2);
    const baseRadius = Math.max(gridCanvas.width, gridCanvas.height) * 0.7;
    const pulseRadius = baseRadius + Math.sin(time * 0.5) * 100;

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
    gradient.addColorStop(0, "#FFD100"); 
    gradient.addColorStop(1, "#000");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);

    // 3. Layer the Noise on top
    // We use 'source-over' or 'overlay' to blend the grain
    ctx.globalCompositeOperation = "source-over"; 
    
    // To animate the noise, we draw the small noise tile at random offsets
    const noiseOffsetX = Math.random() * noiseCanvas.width;
    const noiseOffsetY = Math.random() * noiseCanvas.height;

    // Create a pattern from the noise tile
    const pattern = ctx.createPattern(noiseCanvas, 'repeat');
    ctx.save();
    ctx.translate(noiseOffsetX, noiseOffsetY); // Shifts noise every frame
    ctx.fillStyle = pattern;
    ctx.fillRect(-noiseOffsetX, -noiseOffsetY, gridCanvas.width, gridCanvas.height);
    ctx.restore();

    requestAnimationFrame(draw);
}

draw();