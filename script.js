window.addEventListener('load', () => {
  document.body.classList.remove('before-load');
});
document.querySelector('.loading').addEventListener('transitionend', (e) => {
  document.body.removeChild(e.currentTarget);
});

const cursor = document.querySelector(".cursor");
const cursorImg = document.querySelector(".cursor-img");
const teamCopy1 = document.querySelector(".team-copy1");

// Function to change the image source smoothly
function changeCursorImage(newSrc) {
  cursorImg.classList.add("hidden");
  setTimeout(() => {
    cursorImg.src = newSrc;
    cursorImg.classList.remove("hidden");
  }, 300); // Match this timeout with the CSS transition duration
}

// Handle mousemove to follow the cursor
document.addEventListener("mousemove", (e) => {
  gsap.to(cursor, {
    x: e.clientX - cursor.offsetWidth / 2,
    y: e.clientY - cursor.offsetHeight / 2,
    duration: 0.5,
    ease: "power2.out",
  });
});

// Handle hover events to change the cursor image
teamCopy1.addEventListener("mouseenter", () => {
  changeCursorImage('./assets/new-cursor.webp');
});

teamCopy1.addEventListener("mouseleave", () => {
  changeCursorImage('./assets/cursor.webp');
});


document.addEventListener("click", function (event) {
  const clickSound = new Audio("./assets/click-sfx.mp3");
  clickSound.play();

  const itemType = Math.random() < 0.5 ? "video" : "image";
  let container = document.createElement("div");
  let elementWidth = 700;

  if (itemType === "video") {
    const videoNumber = Math.floor(Math.random() * 7) + 1;
    container.innerHTML = `<div class="video-container">
                                 <video autoplay loop>
                                   <source src="./assets/vid-${videoNumber}.mp4" type="video/mp4"/>
                                 </video>
                               </div>`;
  } else {
    const imgNumber = Math.floor(Math.random() * 6) + 1;
    container.innerHTML = `<div class="img-container">
                                 <img src="./assets/img-${imgNumber}.webp" alt="" />
                               </div>`;
  }

  const appendedElement = container.firstChild;
  document.querySelector(".items-container").appendChild(appendedElement);

  appendedElement.style.left = `${event.clientX - elementWidth / 2}px`;
  appendedElement.style.top = `${event.clientY}px`;
  const randomRotation = Math.random() * 10 - 5;

  gsap.set(appendedElement, {
    scale: 0,
    rotation: randomRotation,
    transformOrigin: "center",
  });

  const tl = gsap.timeline();

  const randomScale = Math.random() * 0.5 + 0.5;
  tl.to(appendedElement, {
    scale: randomScale,
    duration: 0.5,
    delay: 0.1,
  });

  tl.to(
    appendedElement,
    {
      y: () => `-=500`,
      opacity: 1,
      duration: 4,
      ease: "none",
    },
    "<"
  ).to(
    appendedElement,
    {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        appendedElement.parentNode.removeChild(appendedElement);
        const index = itemsArray.indexOf(appendedElement);
        if (index > -1) {
          itemsArray.splice(index, 1);
        }
      },
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