import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PLACEHOLDER_IMAGES } from "../config/appConfig.js";

const ROUND_SECONDS = 35;
const START_LIVES = 3;
const LOCAL_BEST_KEY = "realKebabSliceBest";
const TRAIL_WINDOW_MS = 140;
const ITEM_RADIUS_SCALE = 0.42;

const MENU_ITEMS = [
  {
    id: "rollo",
    label: "Rollo",
    image: PLACEHOLDER_IMAGES.dishKebabRollo,
    glow: "#e0a347",
    accent: "#f7d285",
    points: 16
  },
  {
    id: "pan",
    label: "Kebab Pan",
    image: PLACEHOLDER_IMAGES.dishKebabPan,
    glow: "#d68638",
    accent: "#f3c06e",
    points: 15
  },
  {
    id: "lahmacun",
    label: "Lahmacun",
    image: PLACEHOLDER_IMAGES.dishLahmacun,
    glow: "#ef6f39",
    accent: "#f3b37d",
    points: 18
  },
  {
    id: "iskender",
    label: "Iskender",
    image: PLACEHOLDER_IMAGES.dishIskender,
    glow: "#ea5a45",
    accent: "#f3b482",
    points: 20
  },
  {
    id: "pizza-kebab",
    label: "Pizza Kebab",
    image: PLACEHOLDER_IMAGES.dishPizzaKebab,
    glow: "#ff7342",
    accent: "#f8d58d",
    points: 19
  },
  {
    id: "baklava",
    label: "Baklava",
    image: PLACEHOLDER_IMAGES.dishBaklavaPistachio,
    glow: "#e0bf59",
    accent: "#fff2a1",
    points: 21
  },
  {
    id: "softs",
    label: "Refresco",
    image: PLACEHOLDER_IMAGES.drinkSofts,
    glow: "#4ecde0",
    accent: "#c2ffff",
    points: 13
  },
  {
    id: "efes",
    label: "Efes",
    image: PLACEHOLDER_IMAGES.drinkEfes,
    glow: "#8ac3ff",
    accent: "#d6edff",
    points: 14
  },
  {
    id: "water",
    label: "Agua",
    image: PLACEHOLDER_IMAGES.drinkWater,
    glow: "#78d8ff",
    accent: "#ddfbff",
    points: 12
  },
  {
    id: "fries",
    label: "Patatas",
    draw: "fries",
    glow: "#f7c84d",
    accent: "#fff0a3",
    points: 14
  },
  {
    id: "tomato",
    label: "Tomate",
    draw: "tomato",
    glow: "#ff6169",
    accent: "#ffd6b0",
    points: 11
  },
  {
    id: "onion",
    label: "Cebolla",
    draw: "onion",
    glow: "#b887ff",
    accent: "#f0ddff",
    points: 11
  },
  {
    id: "salad",
    label: "Ensalada",
    draw: "salad",
    glow: "#67d881",
    accent: "#d6ffd8",
    points: 12
  },
  {
    id: "ayran",
    label: "Ayran",
    draw: "ayran",
    glow: "#d8f8ff",
    accent: "#ffffff",
    points: 13
  }
];

const BAD_ITEMS = [
  {
    id: "burnt",
    label: "Burnt",
    image: PLACEHOLDER_IMAGES.burnt,
    glow: "#ff4d33",
    accent: "#ffc1b3",
    bad: true,
    points: 0
  },
  {
    id: "charcoal",
    label: "Coal",
    draw: "coal",
    glow: "#ff5a3d",
    accent: "#ffc3ab",
    bad: true,
    points: 0
  }
];

const PREVIEW_ITEMS = MENU_ITEMS.slice(0, 4);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function localBest() {
  try {
    return Number(localStorage.getItem(LOCAL_BEST_KEY) || 0);
  } catch {
    return 0;
  }
}

function safeVibrate(pattern) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function segmentIntersectsCircle(p1, p2, centerX, centerY, radius) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const fx = p1.x - centerX;
  const fy = p1.y - centerY;
  const a = dx * dx + dy * dy;

  if (a < 0.0001) {
    return false;
  }

  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - radius * radius;
  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) {
    return false;
  }

  const root = Math.sqrt(discriminant);
  const t1 = (-b - root) / (2 * a);
  const t2 = (-b + root) / (2 * a);

  return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1) || (t1 < 0 && t2 > 1);
}

function pointToSegmentDistance(px, py, p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  if (dx === 0 && dy === 0) {
    return Math.hypot(px - p1.x, py - p1.y);
  }

  const t = clamp(((px - p1.x) * dx + (py - p1.y) * dy) / (dx * dx + dy * dy), 0, 1);
  const projectionX = p1.x + t * dx;
  const projectionY = p1.y + t * dy;

  return Math.hypot(px - projectionX, py - projectionY);
}

function createImageBank() {
  const sources = [
    ...MENU_ITEMS.filter((item) => item.image).map((item) => item.image),
    ...BAD_ITEMS.filter((item) => item.image).map((item) => item.image)
  ];

  return Object.fromEntries(
    [...new Set(sources)].map((source) => {
      const image = new Image();
      image.src = source;
      return [source, image];
    })
  );
}

function drawPhotoToken(ctx, item, image) {
  const radius = item.size * 0.52;
  const ringRadius = radius + item.size * 0.14;
  const lift = item.bad ? item.size * 0.02 : item.size * 0.05;
  const platterWidth = radius + item.size * 0.1;
  const platterHeight = radius + item.size * 0.06;

  ctx.save();
  ctx.translate(item.x, item.y - lift);
  ctx.rotate(item.rotation);

  ctx.save();
  ctx.globalAlpha = item.bad ? 0.56 : 0.42;
  ctx.fillStyle = item.bad ? "rgba(34,8,6,0.96)" : "rgba(6,5,4,0.92)";
  ctx.shadowColor = item.bad ? "rgba(255,88,54,0.34)" : "rgba(0,0,0,0.34)";
  ctx.shadowBlur = item.bad ? 22 : 28;
  ctx.beginPath();
  ctx.ellipse(0, platterHeight * 1.08, platterWidth * 0.96, platterHeight * 0.34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.scale(1.02, 0.92);
  ctx.shadowColor = item.glow;
  ctx.shadowBlur = item.bad ? 28 : 38;

  const ring = ctx.createRadialGradient(0, -radius * 0.08, radius * 0.24, 0, 0, ringRadius);
  ring.addColorStop(0, item.bad ? "rgba(255,120,90,0.7)" : `${item.glow}d8`);
  ring.addColorStop(0.55, item.bad ? "rgba(255,70,45,0.26)" : `${item.glow}5c`);
  ring.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = ring;
  ctx.beginPath();
  ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
  const underside = ctx.createLinearGradient(0, -platterHeight, 0, platterHeight);
  underside.addColorStop(0, item.bad ? "#351610" : "#191210");
  underside.addColorStop(1, item.bad ? "#0f0907" : "#060505");
  ctx.fillStyle = underside;
  ctx.beginPath();
  ctx.ellipse(0, platterHeight * 0.12, platterWidth + 8, platterHeight + 8, 0, 0, Math.PI * 2);
  ctx.fill();

  const platter = ctx.createLinearGradient(0, -platterHeight, 0, platterHeight);
  if (item.bad) {
    platter.addColorStop(0, "#6d2618");
    platter.addColorStop(0.5, "#35110d");
    platter.addColorStop(1, "#120707");
  } else {
    platter.addColorStop(0, "#fff5ea");
    platter.addColorStop(0.45, "#f4d7b0");
    platter.addColorStop(1, "#7b4b2d");
  }
  ctx.fillStyle = platter;
  ctx.beginPath();
  ctx.ellipse(0, -2, platterWidth, platterHeight, 0, 0, Math.PI * 2);
  ctx.fill();

  const border = ctx.createLinearGradient(-radius, -radius, radius, radius);
  border.addColorStop(0, item.accent);
  border.addColorStop(0.6, "#fff7d1");
  border.addColorStop(1, item.glow);
  ctx.strokeStyle = border;
  ctx.lineWidth = item.bad ? 4.5 : 4;
  ctx.beginPath();
  ctx.ellipse(0, -2, platterWidth - 1.5, platterHeight - 1.5, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, -radius * 0.04, radius * 0.98, radius * 0.92, 0, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  if (image?.complete) {
    ctx.filter = item.bad ? "contrast(1.06) saturate(0.92)" : "contrast(1.05) saturate(1.08)";
    ctx.drawImage(image, -radius * 1.02, -radius * 0.98, radius * 2.04, radius * 1.98);
    ctx.filter = "none";
  } else {
    const fallback = ctx.createLinearGradient(-radius, -radius, radius, radius);
    fallback.addColorStop(0, item.accent);
    fallback.addColorStop(1, item.glow);
    ctx.fillStyle = fallback;
    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
  }

  const gloss = ctx.createLinearGradient(0, -radius, 0, radius);
  gloss.addColorStop(0, "rgba(255,255,255,0.3)");
  gloss.addColorStop(0.33, "rgba(255,255,255,0.05)");
  gloss.addColorStop(1, "rgba(0,0,0,0.24)");
  ctx.fillStyle = gloss;
  ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
  ctx.restore();

  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.beginPath();
  ctx.ellipse(-radius * 0.22, -radius * 0.34, radius * 0.42, radius * 0.16, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.66;
  ctx.strokeStyle = "rgba(255,255,255,0.42)";
  ctx.lineWidth = 2.1;
  ctx.beginPath();
  ctx.arc(-radius * 0.2, -radius * 0.18, radius * 0.82, Math.PI * 1.04, Math.PI * 1.62);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();
  ctx.restore();
}

function drawTomato(ctx, item) {
  const radius = item.size * 0.46;
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.rotation);
  ctx.shadowColor = item.glow;
  ctx.shadowBlur = 28;

  const skin = ctx.createRadialGradient(-radius * 0.25, -radius * 0.2, radius * 0.18, 0, 0, radius);
  skin.addColorStop(0, "#ffd4bd");
  skin.addColorStop(0.2, "#ff7d6d");
  skin.addColorStop(0.75, "#ef3d43");
  skin.addColorStop(1, "#a10e18");
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.beginPath();
  ctx.ellipse(-radius * 0.26, -radius * 0.22, radius * 0.36, radius * 0.2, -0.55, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,240,210,0.72)";
  ctx.lineWidth = 2;
  for (let index = 0; index < 5; index += 1) {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * radius * 0.72, Math.sin(angle) * radius * 0.72);
    ctx.stroke();
  }

  ctx.fillStyle = "#6ac35f";
  ctx.beginPath();
  ctx.arc(0, -radius * 0.9, radius * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawOnion(ctx, item) {
  const radius = item.size * 0.48;
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.rotation);
  ctx.shadowColor = item.glow;
  ctx.shadowBlur = 26;

  const rings = ["#f5e7ff", "#d2abff", "#9d63eb", "#f5e7ff"];
  rings.forEach((color, index) => {
    ctx.lineWidth = 6 - index;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, radius - index * radius * 0.2, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255,255,255,0.42)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(-radius * 0.16, -radius * 0.16, radius * 0.48, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawSalad(ctx, item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.rotation);
  ctx.shadowColor = item.glow;
  ctx.shadowBlur = 24;

  const leaves = [
    { x: -16, y: 6, r: -0.6, color: "#57c96f" },
    { x: 0, y: -8, r: 0, color: "#7fe08f" },
    { x: 15, y: 8, r: 0.55, color: "#48b95f" },
    { x: -4, y: 16, r: -0.1, color: "#97ef9d" }
  ];

  leaves.forEach((leaf) => {
    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate(leaf.r);
    ctx.fillStyle = leaf.color;
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.bezierCurveTo(16, -12, 18, 14, 0, 22);
    ctx.bezierCurveTo(-18, 14, -16, -12, 0, -20);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.32)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(0, 15);
    ctx.stroke();
    ctx.restore();
  });

  ctx.restore();
}

function drawFries(ctx, item) {
  const width = item.size * 0.88;
  const height = item.size * 0.78;
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.rotation);
  ctx.shadowColor = item.glow;
  ctx.shadowBlur = 22;

  const fries = Array.from({ length: 7 }, (_, index) => ({
    x: -width * 0.32 + index * (width * 0.11),
    y: -height * 0.32 + (index % 2) * 3,
    rotate: -0.2 + index * 0.05
  }));

  fries.forEach((fry) => {
    ctx.save();
    ctx.translate(fry.x, fry.y);
    ctx.rotate(fry.rotate);
    const fryGradient = ctx.createLinearGradient(0, -height * 0.24, 0, height * 0.2);
    fryGradient.addColorStop(0, "#fff0b3");
    fryGradient.addColorStop(0.45, "#f8c74c");
    fryGradient.addColorStop(1, "#d88c26");
    ctx.fillStyle = fryGradient;
    roundedRect(ctx, -5, -18, 10, 38, 4);
    ctx.fill();
    ctx.restore();
  });

  ctx.shadowBlur = 0;
  const packGradient = ctx.createLinearGradient(0, -height * 0.12, 0, height * 0.45);
  packGradient.addColorStop(0, "#d11d22");
  packGradient.addColorStop(1, "#7b0d12");
  ctx.fillStyle = packGradient;
  roundedRect(ctx, -width * 0.26, -2, width * 0.52, height * 0.44, 10);
  ctx.fill();
  ctx.fillStyle = "#ffe2a2";
  ctx.font = "bold 11px DM Sans, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("FRIES", 0, 13);
  ctx.restore();
}

function drawAyran(ctx, item) {
  const width = item.size * 0.62;
  const height = item.size * 0.88;
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.rotation);
  ctx.shadowColor = item.glow;
  ctx.shadowBlur = 24;

  const glass = ctx.createLinearGradient(0, -height * 0.5, 0, height * 0.45);
  glass.addColorStop(0, "rgba(255,255,255,0.96)");
  glass.addColorStop(0.6, "rgba(226,248,255,0.9)");
  glass.addColorStop(1, "rgba(180,225,240,0.72)");
  ctx.fillStyle = glass;
  roundedRect(ctx, -width * 0.5, -height * 0.44, width, height * 0.88, 12);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.ellipse(-width * 0.18, -height * 0.1, width * 0.14, height * 0.26, -0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#44c0d5";
  ctx.fillRect(width * 0.22, -height * 0.5, 4, height * 0.38);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(width * 0.24, -height * 0.52, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCoal(ctx, item) {
  const radius = item.size * 0.46;
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.rotation);
  ctx.shadowColor = item.glow;
  ctx.shadowBlur = 22;

  const coal = ctx.createRadialGradient(-radius * 0.22, -radius * 0.2, radius * 0.12, 0, 0, radius);
  coal.addColorStop(0, "#6e2418");
  coal.addColorStop(0.18, "#391612");
  coal.addColorStop(0.68, "#16110f");
  coal.addColorStop(1, "#040404");
  ctx.fillStyle = coal;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.9, -radius * 0.15);
  ctx.lineTo(-radius * 0.32, -radius * 0.82);
  ctx.lineTo(radius * 0.62, -radius * 0.55);
  ctx.lineTo(radius * 0.92, radius * 0.18);
  ctx.lineTo(radius * 0.22, radius * 0.92);
  ctx.lineTo(-radius * 0.78, radius * 0.42);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ff6c3f";
  ctx.beginPath();
  ctx.arc(-radius * 0.18, 2, radius * 0.16, 0, Math.PI * 2);
  ctx.arc(radius * 0.22, -radius * 0.12, radius * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawItemToken(ctx, item, imageBank) {
  if (item.image) {
    drawPhotoToken(ctx, item, imageBank[item.image]);
    return;
  }

  switch (item.draw) {
    case "tomato":
      drawTomato(ctx, item);
      return;
    case "onion":
      drawOnion(ctx, item);
      return;
    case "salad":
      drawSalad(ctx, item);
      return;
    case "fries":
      drawFries(ctx, item);
      return;
    case "ayran":
      drawAyran(ctx, item);
      return;
    case "coal":
      drawCoal(ctx, item);
      return;
    default:
      drawPhotoToken(ctx, item);
  }
}

class KebabSliceEngine {
  constructor(canvas, imageBank, labels) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.imageBank = imageBank;
    this.labels = labels;
    this.handlers = {};
    this.items = [];
    this.particles = [];
    this.textBursts = [];
    this.embers = Array.from({ length: 18 }, () => this.createEmber(true));
    this.trail = [];
    this.pointerDown = false;
    this.score = 0;
    this.combo = 0;
    this.caught = 0;
    this.lives = START_LIVES;
    this.spawnClock = 0;
    this.elapsed = 0;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  on(eventName, handler) {
    this.handlers[eventName] = handler;
  }

  emit(eventName, payload) {
    this.handlers[eventName]?.(payload);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  reset() {
    this.items = [];
    this.particles = [];
    this.textBursts = [];
    this.trail = [];
    this.pointerDown = false;
    this.score = 0;
    this.combo = 0;
    this.caught = 0;
    this.lives = START_LIVES;
    this.spawnClock = 0;
    this.elapsed = 0;
  }

  createEmber(randomizeY = false) {
    return {
      x: Math.random() * this.width,
      y: randomizeY ? Math.random() * this.height : this.height + 30,
      vx: (Math.random() - 0.5) * 0.32,
      vy: -(0.45 + Math.random() * 0.65),
      size: 1 + Math.random() * 2.6,
      alpha: 0.18 + Math.random() * 0.42,
      decay: 0.0022 + Math.random() * 0.0034
    };
  }

  createItem(definition) {
    const size = definition.bad ? 72 + Math.random() * 16 : 78 + Math.random() * 22;
    const fromLeft = Math.random() > 0.5;
    const x = clamp(Math.random() * this.width, 80, this.width - 80);
    const liftBase = clamp(this.height / 52 + (definition.bad ? 2.4 : 3.4), definition.bad ? 9.8 : 11.4, definition.bad ? 11.2 : 13.2);

    return {
      id: uid(),
      ...definition,
      size,
      x,
      y: this.height + size * 0.22,
      vx: (fromLeft ? -1 : 1) * (0.7 + Math.random() * 1.2),
      vy: -(liftBase + Math.random() * 2.1),
      rotation: (Math.random() - 0.5) * 0.26,
      spin: (Math.random() - 0.5) * 0.02,
      sliced: false
    };
  }

  spawnItem() {
    const useBadItem = Math.random() < 0.16;
    const library = useBadItem ? BAD_ITEMS : MENU_ITEMS;
    const definition = library[Math.floor(Math.random() * library.length)];
    this.items.push(this.createItem(definition));
  }

  addTextBurst(item, text, quality) {
    this.textBursts.push({
      id: uid(),
      text,
      quality,
      x: item.x,
      y: item.y - item.size * 0.1,
      vy: quality === "perfect" ? 0.12 : 0.09,
      life: quality === "perfect" ? 920 : 760,
      opacity: 1
    });
  }

  addParticles(item, quality) {
    const palette =
      quality === "danger"
        ? ["#ff6c3f", "#ffc0a8", "#ff2f14"]
        : [item.glow, item.accent, "#fff4d1"];

    const particleCount = quality === "danger" ? 16 : 14;

    for (let index = 0; index < particleCount; index += 1) {
      const angle = (Math.PI * 2 * index) / particleCount + Math.random() * 0.45;
      const speed = 60 + Math.random() * 90;

      this.particles.push({
        id: uid(),
        x: item.x,
        y: item.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 30,
        gravity: 130 + Math.random() * 65,
        rotate: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 5.4,
        size: 4 + Math.random() * 8,
        color: palette[index % palette.length],
        life: 520 + Math.random() * 260,
        opacity: 1
      });
    }
  }

  emitState() {
    this.emit("state", {
      score: this.score,
      lives: this.lives,
      combo: this.combo,
      caught: this.caught
    });
  }

  penalize(reason) {
    this.lives = Math.max(0, this.lives - 1);
    this.combo = 0;
    this.emitState();
    this.emit("penalty", { reason, lives: this.lives });
    if (this.lives <= 0) {
      this.emit("dead", { score: this.score });
    }
  }

  pointerStart(x, y) {
    this.pointerDown = true;
    this.trail = [{ x, y, time: performance.now() }];
  }

  pointerMove(x, y) {
    if (!this.pointerDown) {
      return;
    }

    const now = performance.now();
    this.trail.push({ x, y, time: now });
    this.trail = this.trail.filter((point) => now - point.time <= TRAIL_WINDOW_MS);

    if (this.trail.length < 2) {
      return;
    }

    const first = this.trail[this.trail.length - 2];
    const last = this.trail[this.trail.length - 1];
    this.checkSlice(first, last);
  }

  pointerEnd() {
    this.pointerDown = false;
    this.trail = [];
  }

  checkSlice(first, last) {
    for (const item of this.items) {
      if (item.sliced) {
        continue;
      }

      const radius = item.size * ITEM_RADIUS_SCALE;

      if (!segmentIntersectsCircle(first, last, item.x, item.y, radius)) {
        continue;
      }

      item.sliced = true;

      if (item.bad) {
        this.addParticles(item, "danger");
        this.addTextBurst(item, "-1", "danger");
        this.penalize("burnt");
        continue;
      }

      const sliceDistance = pointToSegmentDistance(item.x, item.y, first, last);
      const centerRatio = sliceDistance / radius;
      const quality = centerRatio <= 0.24 ? "perfect" : "clean";
      const comboBefore = this.combo;
      const bonus = quality === "perfect" ? 10 : 0;
      const comboBonus = Math.min(comboBefore, 6) * 3;
      const points = item.points + bonus + comboBonus;

      this.score += points;
      this.combo += quality === "perfect" ? 2 : 1;
      this.caught += 1;
      this.addParticles(item, quality);
      this.addTextBurst(item, `+${points}`, quality);
      if (quality === "perfect") {
        this.addTextBurst(item, this.labels.perfect, "label");
      }

      this.emitState();
      this.emit("slice", {
        quality,
        item,
        points,
        combo: this.combo,
        score: this.score
      });
    }

    this.items = this.items.filter((item) => !item.sliced);
  }

  drawBackground(now) {
    const ctx = this.ctx;
    const width = this.width;
    const height = this.height;

    const base = ctx.createLinearGradient(0, 0, 0, height);
    base.addColorStop(0, "#110a08");
    base.addColorStop(0.48, "#1a100c");
    base.addColorStop(1, "#090808");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);

    const warmGlow = ctx.createRadialGradient(width * 0.5, height * 0.64, 0, width * 0.5, height * 0.64, width * 0.72);
    warmGlow.addColorStop(0, "rgba(245,197,66,0.16)");
    warmGlow.addColorStop(0.4, "rgba(201,21,27,0.1)");
    warmGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = warmGlow;
    ctx.fillRect(0, 0, width, height);

    for (let index = 0; index < 9; index += 1) {
      const lineX = (width / 10) * (index + 1);
      ctx.strokeStyle = "rgba(255,255,255,0.018)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(lineX, 0);
      ctx.lineTo(lineX, height);
      ctx.stroke();
    }

    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    for (let row = 0; row < 6; row += 1) {
      ctx.beginPath();
      ctx.moveTo(0, height * (0.18 + row * 0.11));
      ctx.bezierCurveTo(
        width * 0.18,
        height * (0.13 + row * 0.11),
        width * 0.42,
        height * (0.23 + row * 0.11),
        width,
        height * (0.18 + row * 0.11)
      );
      ctx.stroke();
    }
    ctx.restore();

    this.embers.forEach((ember) => {
      ember.x += ember.vx;
      ember.y += ember.vy;
      ember.alpha -= ember.decay;

      if (ember.alpha <= 0 || ember.y < -12) {
        Object.assign(ember, this.createEmber());
      }

      ctx.beginPath();
      ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 168, 96, ${ember.alpha})`;
      ctx.fill();
    });

    const pulse = 0.18 + Math.sin(now / 530) * 0.08;
    ctx.fillStyle = `rgba(244, 110, 57, ${pulse})`;
    ctx.beginPath();
    ctx.ellipse(width * 0.2, height * 0.86, 90, 24, 0, 0, Math.PI * 2);
    ctx.ellipse(width * 0.8, height * 0.86, 100, 26, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawItems() {
    const ctx = this.ctx;
    this.items.forEach((item) => drawItemToken(ctx, item, this.imageBank));
  }

  drawParticles() {
    const ctx = this.ctx;
    this.particles.forEach((particle) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotate);
      ctx.globalAlpha = clamp(particle.opacity, 0, 1);
      ctx.fillStyle = particle.color;
      roundedRect(ctx, -particle.size * 0.35, -particle.size * 0.5, particle.size * 0.7, particle.size, 4);
      ctx.fill();
      ctx.restore();
    });
    ctx.globalAlpha = 1;
  }

  drawTexts() {
    const ctx = this.ctx;
    this.textBursts.forEach((burst) => {
      ctx.save();
      ctx.globalAlpha = clamp(burst.opacity, 0, 1);
      ctx.textAlign = "center";

      if (burst.quality === "label") {
        ctx.fillStyle = "#fff5cb";
        ctx.shadowColor = "#f5c542";
        ctx.shadowBlur = 16;
        ctx.font = "700 24px 'DM Sans', Arial, sans-serif";
      } else if (burst.quality === "perfect") {
        ctx.fillStyle = "#ffe08a";
        ctx.shadowColor = "#f5c542";
        ctx.shadowBlur = 12;
        ctx.font = "800 22px 'DM Sans', Arial, sans-serif";
      } else if (burst.quality === "danger") {
        ctx.fillStyle = "#ff8d73";
        ctx.shadowColor = "#ff4f2b";
        ctx.shadowBlur = 10;
        ctx.font = "800 20px 'DM Sans', Arial, sans-serif";
      } else {
        ctx.fillStyle = "#cbfff7";
        ctx.shadowColor = "#25a093";
        ctx.shadowBlur = 8;
        ctx.font = "700 18px 'DM Sans', Arial, sans-serif";
      }

      ctx.fillText(burst.text, burst.x, burst.y);
      ctx.restore();
    });
  }

  drawTrail(now) {
    if (this.trail.length < 2) {
      return;
    }

    const ctx = this.ctx;
    const trail = this.trail.filter((point) => now - point.time <= TRAIL_WINDOW_MS);

    if (trail.length < 2) {
      return;
    }

    const gradient = ctx.createLinearGradient(trail[0].x, trail[0].y, trail[trail.length - 1].x, trail[trail.length - 1].y);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.3, "rgba(255,225,153,0.72)");
    gradient.addColorStop(1, "rgba(245,197,66,0.98)");

    ctx.save();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = "#f5c542";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);
    trail.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.stroke();
    ctx.restore();
  }

  update(delta, now) {
    this.elapsed += delta;
    this.spawnClock += delta;

    const spawnDelay = clamp(840 - Math.floor(this.score / 130) * 12, 430, 840);
    while (this.spawnClock >= spawnDelay) {
      this.spawnItem();
      this.spawnClock -= spawnDelay;
    }

    const gravity = 0.33;
    this.items = this.items.filter((item) => {
      item.x += item.vx * (delta / 16.67);
      item.y += item.vy * (delta / 16.67);
      item.vy += gravity * (delta / 16.67);
      item.rotation += item.spin * (delta / 16.67);

      if (item.y > this.height + item.size * 0.8) {
        if (!item.bad) {
          this.penalize("drop");
        }
        return false;
      }

      return !item.sliced;
    });

    this.particles = this.particles
      .map((particle) => ({
        ...particle,
        x: particle.x + particle.vx * (delta / 1000),
        y: particle.y + particle.vy * (delta / 1000),
        vy: particle.vy + particle.gravity * (delta / 1000),
        rotate: particle.rotate + particle.spin * (delta / 1000),
        life: particle.life - delta,
        opacity: particle.life / 720
      }))
      .filter((particle) => particle.life > 0);

    this.textBursts = this.textBursts
      .map((burst) => ({
        ...burst,
        y: burst.y - burst.vy * (delta / 16.67),
        life: burst.life - delta,
        opacity: burst.life / (burst.quality === "label" ? 920 : 760)
      }))
      .filter((burst) => burst.life > 0);

    this.drawBackground(now);
    this.drawItems();
    this.drawParticles();
    this.drawTexts();
    this.drawTrail(now);
  }
}

export default function OrderRushGame({ copy, promoEnabled, scoreTarget = 850, onStart, onFinish }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const lastFrameRef = useRef(0);
  const startedAtRef = useRef(0);
  const runningRef = useRef(false);
  const audioContextRef = useRef(null);
  const engineRef = useRef(null);
  const pointerDownRef = useRef(false);
  const imageBankRef = useRef({});

  const scoreRef = useRef(0);
  const livesRef = useRef(START_LIVES);
  const comboRef = useRef(0);
  const slicesRef = useRef(0);

  const [playerName, setPlayerName] = useState("");
  const [score, setScore] = useState(0);
  const [remaining, setRemaining] = useState(ROUND_SECONDS);
  const [lives, setLives] = useState(START_LIVES);
  const [combo, setCombo] = useState(0);
  const [slices, setSlices] = useState(0);
  const [best, setBest] = useState(localBest);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasFinishedRound, setHasFinishedRound] = useState(false);
  const [resultText, setResultText] = useState(copy.gameHint);
  const [promoCode, setPromoCode] = useState(null);
  const [feed, setFeed] = useState([]);
  const [perfectPulse, setPerfectPulse] = useState(0);

  const level = useMemo(() => clamp(Math.floor(score / 260) + 1, 1, 9), [score]);

  useEffect(() => {
    imageBankRef.current = createImageBank();
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(frameRef.current);
      audioContextRef.current?.close?.();
    };
  }, []);

  useEffect(() => {
    if (!isRunning) {
      pointerDownRef.current = false;
    }
  }, [isRunning]);

  const ensureAudioContext = useCallback(() => {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioCtor();
    }

    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume().catch(() => {});
    }

    return audioContextRef.current;
  }, []);

  const playTone = useCallback(
    (type) => {
      const context = ensureAudioContext();
      if (!context) {
        return;
      }

      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      const toneMap = {
        start: { frequency: 290, duration: 0.18, gain: 0.055, wave: "triangle" },
        clean: { frequency: 430, duration: 0.12, gain: 0.06, wave: "sine" },
        perfect: { frequency: 620, duration: 0.18, gain: 0.08, wave: "triangle" },
        miss: { frequency: 180, duration: 0.22, gain: 0.055, wave: "sawtooth" }
      };
      const tone = toneMap[type] || toneMap.clean;

      oscillator.type = tone.wave;
      oscillator.frequency.setValueAtTime(tone.frequency, now);
      gain.gain.setValueAtTime(tone.gain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.duration);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + tone.duration);
    },
    [ensureAudioContext]
  );

  const playSlashAccent = useCallback(
    (quality) => {
      const context = ensureAudioContext();
      if (!context) {
        return;
      }

      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const accent =
        quality === "perfect"
          ? { start: 2400, end: 740, gain: 0.024, duration: 0.1 }
          : { start: 1800, end: 680, gain: 0.018, duration: 0.08 };

      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(accent.start, now);
      oscillator.frequency.exponentialRampToValueAtTime(accent.end, now + accent.duration);
      gain.gain.setValueAtTime(accent.gain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + accent.duration);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + accent.duration);
    },
    [ensureAudioContext]
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const bounds = canvas.getBoundingClientRect();
    const nextWidth = Math.max(320, Math.round(bounds.width));
    const nextHeight = Math.max(420, Math.round(bounds.height));

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
      engineRef.current?.resize(nextWidth, nextHeight);
    }
  }, []);

  const finishGame = useCallback(
    async (finalScore = scoreRef.current) => {
      if (!runningRef.current && !isSubmitting) {
        return;
      }

      cancelAnimationFrame(frameRef.current);
      runningRef.current = false;
      pointerDownRef.current = false;
      setIsRunning(false);
      setIsSubmitting(true);
      setHasFinishedRound(true);

      if (finalScore > best) {
        setBest(finalScore);
        try {
          localStorage.setItem(LOCAL_BEST_KEY, String(finalScore));
        } catch {
          // Storage can be blocked.
        }
        safeVibrate([65, 40, 120]);
      }

      try {
        const result = await onFinish({
          playerName: playerName.trim() || "Guest",
          score: finalScore
        });
        setPromoCode(promoEnabled ? result.promo_code || null : null);
        setResultText(finalScore >= scoreTarget ? copy.gameWin : copy.gameTry);
      } catch {
        setResultText(copy.gameSaveError);
      } finally {
        setIsSubmitting(false);
      }
    },
    [best, copy.gameSaveError, copy.gameTry, copy.gameWin, isSubmitting, onFinish, playerName, promoEnabled, scoreTarget]
  );

  const loop = useCallback(
    (timestamp) => {
      if (!runningRef.current || !engineRef.current) {
        return;
      }

      if (!lastFrameRef.current) {
        lastFrameRef.current = timestamp;
      }

      const delta = Math.min(timestamp - lastFrameRef.current, 42);
      lastFrameRef.current = timestamp;

      engineRef.current.update(delta, timestamp);

      const elapsedSeconds = (timestamp - startedAtRef.current) / 1000;
      const nextRemaining = Math.max(0, Math.ceil(ROUND_SECONDS - elapsedSeconds));
      setRemaining(nextRemaining);

      if (nextRemaining <= 0 || livesRef.current <= 0) {
        finishGame(scoreRef.current);
        return;
      }

      frameRef.current = requestAnimationFrame(loop);
    },
    [finishGame]
  );

  const attachEngineCallbacks = useCallback(
    (engine) => {
      engine.on("state", ({ score: nextScore, lives: nextLives, combo: nextCombo, caught: nextCaught }) => {
        scoreRef.current = nextScore;
        livesRef.current = nextLives;
        comboRef.current = nextCombo;
        slicesRef.current = nextCaught;

        setScore(nextScore);
        setLives(nextLives);
        setCombo(nextCombo);
        setSlices(nextCaught);
      });

      engine.on("slice", ({ quality, item, points, combo: nextCombo }) => {
        setFeed((current) => [{ id: uid(), quality, label: item.label, points }, ...current].slice(0, 5));
        setResultText(quality === "perfect" ? copy.gameCombo : copy.gameCatch);
        playTone(quality === "perfect" ? "perfect" : "clean");
        playSlashAccent(quality);

        if (quality === "perfect") {
          setPerfectPulse((current) => current + 1);
          safeVibrate([30, 24, 30]);
        } else {
          safeVibrate(20);
        }

        if (nextCombo >= 4) {
          setPerfectPulse((current) => current + 1);
        }
      });

      engine.on("penalty", ({ reason }) => {
        setResultText(reason === "burnt" ? copy.gameAvoidBurnt : copy.gameMiss);
        playTone("miss");
        safeVibrate(90);
        setFeed((current) => [{ id: uid(), quality: "danger", label: reason === "burnt" ? "Burnt" : "Drop", points: -1 }, ...current].slice(0, 5));
      });

      engine.on("dead", () => {
        finishGame(scoreRef.current);
      });
    },
    [copy.gameAvoidBurnt, copy.gameCatch, copy.gameCombo, copy.gameMiss, finishGame, playSlashAccent, playTone]
  );

  const startGame = useCallback(() => {
    resizeCanvas();
    ensureAudioContext();
    playTone("start");

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const engine = new KebabSliceEngine(canvas, imageBankRef.current, {
      perfect: copy.gamePerfectLabel || "Perfect slice"
    });

    engine.reset();
    engine.resize(canvas.width, canvas.height);
    attachEngineCallbacks(engine);
    engineRef.current = engine;

    runningRef.current = true;
    pointerDownRef.current = false;
    startedAtRef.current = performance.now();
    lastFrameRef.current = 0;
    scoreRef.current = 0;
    livesRef.current = START_LIVES;
    comboRef.current = 0;
    slicesRef.current = 0;

    setScore(0);
    setRemaining(ROUND_SECONDS);
    setLives(START_LIVES);
    setCombo(0);
    setSlices(0);
    setFeed([]);
    setPromoCode(null);
    setResultText(copy.gameHint);
    setHasFinishedRound(false);
    setIsSubmitting(false);
    setIsRunning(true);

    onStart?.();
    frameRef.current = requestAnimationFrame(loop);
  }, [attachEngineCallbacks, copy.gameHint, copy.gamePerfectLabel, ensureAudioContext, loop, onStart, playTone, resizeCanvas]);

  useEffect(() => {
    if (!canvasRef.current) {
      return undefined;
    }

    resizeCanvas();
    const onResize = () => resizeCanvas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [resizeCanvas]);

  function getCanvasPoint(event) {
    const canvas = canvasRef.current;
    const bounds = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - bounds.left) / bounds.width) * canvas.width,
      y: ((event.clientY - bounds.top) / bounds.height) * canvas.height
    };
  }

  function handlePointerDown(event) {
    if (!isRunning || !engineRef.current) {
      return;
    }

    pointerDownRef.current = true;
    const point = getCanvasPoint(event);
    engineRef.current.pointerStart(point.x, point.y);
  }

  function handlePointerMove(event) {
    if (!isRunning || !pointerDownRef.current || !engineRef.current) {
      return;
    }

    const point = getCanvasPoint(event);
    engineRef.current.pointerMove(point.x, point.y);
  }

  function handlePointerEnd() {
    pointerDownRef.current = false;
    engineRef.current?.pointerEnd();
  }

  return (
    <div className="order-rush kebab-slice-game">
      <div className="kebab-slice-stage">
        <canvas ref={canvasRef} className="kebab-slice-canvas" />

        <div className="kebab-slice-hud" aria-hidden="true">
          <span>
            <small>{copy.scoreLabel}</small>
            <strong>{score}</strong>
          </span>
          <span className="is-center">
            <small>{copy.timeLabel}</small>
            <strong>{remaining}s</strong>
          </span>
          <span>
            <small>{copy.livesLabel}</small>
            <strong>{Array.from({ length: START_LIVES }, (_, index) => (index < lives ? "\u2022" : "\u25e6")).join(" ")}</strong>
          </span>
        </div>

        <div
          className="slice-touch-layer"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onPointerLeave={handlePointerEnd}
          role="button"
          tabIndex={0}
          aria-label={copy.canvasLabel}
        />

        <div className="kebab-slice-bottom-bar" aria-hidden="true">
          <span className={`slice-live-badge ${combo > 2 ? "is-hot" : ""}`} key={perfectPulse}>
            Combo x{Math.max(combo, 1)}
          </span>
          <span className="slice-live-badge">{copy.caughtLabel}: {slices}</span>
          <span className="slice-live-badge">{copy.levelLabel}: {level}</span>
        </div>

        {!isRunning ? (
          <div className="game-overlay slice-overlay slice-start-overlay">
            <strong>{hasFinishedRound ? resultText : copy.gameReadyTitle}</strong>
            <p>{hasFinishedRound ? `${copy.scoreLabel}: ${score} \u2022 ${copy.caughtLabel}: ${slices}` : copy.gameReadyLead}</p>

            <div className="slice-overlay-pills">
              <span>{copy.gameTitle}</span>
              <span>{copy.caughtLabel}</span>
              <span>{copy.levelLabel}</span>
            </div>

            <div className="slice-preview-grid" aria-hidden="true">
              {PREVIEW_ITEMS.map((item) => (
                <div key={item.id} className="slice-preview-card">
                  <span className="slice-preview-thumb">
                    <img src={item.image} alt="" />
                  </span>
                  <span className="slice-preview-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <aside className="score-panel slice-score-panel" aria-label={copy.scorePanelLabel}>
        <div className="score-highlight">
          <small>{copy.gameTitle}</small>
          <strong>{isRunning ? resultText : hasFinishedRound ? resultText : copy.gameHint}</strong>
        </div>

        <label className="player-field">
          <span>{copy.playerName}</span>
          <input
            value={playerName}
            maxLength="40"
            onChange={(event) => setPlayerName(event.target.value)}
            placeholder={copy.playerNamePlaceholder}
          />
        </label>

        <div className="score-row">
          <span>{copy.scoreLabel}</span>
          <strong>{score}</strong>
        </div>
        <div className="score-row">
          <span>{copy.timeLabel}</span>
          <strong>{remaining}</strong>
        </div>
        <div className="score-row">
          <span>{copy.livesLabel}</span>
          <strong>{lives}</strong>
        </div>
        <div className="score-row">
          <span>{copy.caughtLabel}</span>
          <strong>{slices}</strong>
        </div>
        <div className="score-row">
          <span>Combo</span>
          <strong>x{Math.max(combo, 1)}</strong>
        </div>
        <div className="score-row">
          <span>{copy.bestLabel}</span>
          <strong>{best}</strong>
        </div>

        <div className="slice-feed-list" aria-live="polite">
          {feed.length ? (
            feed.map((entry) => (
              <span key={entry.id} className={`slice-feed-chip is-${entry.quality}`}>
                {entry.label} {entry.points > 0 ? `+${entry.points}` : entry.points}
              </span>
            ))
          ) : (
            <span className="slice-feed-chip is-idle">{copy.gameReadyTitle}</span>
          )}
        </div>

        <button type="button" className="primary-button" disabled={isRunning || isSubmitting} onClick={startGame}>
          {isSubmitting ? copy.savingGame : copy.startGame}
        </button>

        <p className="game-result">{resultText}</p>

        {promoCode ? (
          <p className="promo-code">
            <span>{copy.promoCode}</span>
            <strong>{promoCode}</strong>
          </p>
        ) : null}
      </aside>
    </div>
  );
}
