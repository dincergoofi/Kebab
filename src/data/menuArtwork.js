import { PLACEHOLDER_IMAGES } from "../config/appConfig.js";

const PRODUCT_KINDS = {
  "carne-con-arroz": "rice",
  "patatas-con-carne": "fries-meat",
  "plato-kebab-patatas": "plate-fries",
  "plato-kebab-arroz": "rice",
  "plato-kebab": "plate",
  "kebab-pan": "sandwich",
  "kebab-rollo": "wrap",
  lahmacun: "pizza",
  "lahmacun-menu": "pizza-menu",
  "kebab-pan-menu": "sandwich-menu",
  "kebab-rollo-menu": "wrap-menu",
  "hamburguesa-pollo-menu": "burger",
  "rollo-pequeno": "wrap",
  falafel: "falafel",
  "nuggets-pollo": "nuggets",
  "alitas-pollo": "wings",
  "aros-cebolla": "rings",
  "patatas-fritas": "fries",
  "patatas-deluxe": "deluxe-fries",
  "papas-horno": "baked-potato",
  "pizza-kebab": "pizza",
  "iskender-kebab": "iskender",
  "dulce-pistacho": "baklava-green",
  "dulce-nueces": "baklava",
  refrescos: "soda",
  agua: "water",
  cerveza: "beer",
  efes: "beer"
};

const CATEGORY_PALETTES = {
  principales: ["#102f2e", "#0d0d0d", "#c9a227"],
  "fast-food": ["#40170e", "#0d0d0d", "#e4c253"],
  especiales: ["#2a163a", "#0d0d0d", "#c9a227"],
  postres: ["#3f270d", "#0d0d0d", "#e4c253"],
  bebidas: ["#0f2b45", "#0d0d0d", "#25a093"]
};

const PHOTO_LIBRARY = {
  hero: PLACEHOLDER_IMAGES.heroLuxe,
  plateDark: PLACEHOLDER_IMAGES.foostBoxDark,
  plateTray: PLACEHOLDER_IMAGES.foostTrayCola,
  plateLight: PLACEHOLDER_IMAGES.foostBoxLight,
  rollo: PLACEHOLDER_IMAGES.dishKebabRollo,
  wrap: PLACEHOLDER_IMAGES.dishKebabWrapMarble,
  wrapStudio: PLACEHOLDER_IMAGES.dishKebabWrapStudio,
  pan: PLACEHOLDER_IMAGES.dishKebabPan,
  lahmacun: PLACEHOLDER_IMAGES.dishLahmacun,
  pizzaTray: PLACEHOLDER_IMAGES.dishPizzaTray,
  pizzaClose: PLACEHOLDER_IMAGES.dishPizzaClose,
  pizzaKebab: PLACEHOLDER_IMAGES.dishPizzaKebab,
  iskender: PLACEHOLDER_IMAGES.dishIskender,
  bakedBowls: PLACEHOLDER_IMAGES.dishBakedBowls,
  baklava: PLACEHOLDER_IMAGES.dishBaklavaPistachio,
  baklavaWalnut: PLACEHOLDER_IMAGES.dishBaklavaWalnut,
  softs: PLACEHOLDER_IMAGES.drinkSofts,
  water: PLACEHOLDER_IMAGES.drinkWater,
  efes: PLACEHOLDER_IMAGES.drinkEfes
};

const PRODUCT_PHOTOS = {
  "carne-con-arroz": PHOTO_LIBRARY.plateTray,
  "patatas-con-carne": PHOTO_LIBRARY.plateDark,
  "plato-kebab-patatas": PHOTO_LIBRARY.plateLight,
  "plato-kebab-arroz": PHOTO_LIBRARY.plateTray,
  "plato-kebab": PHOTO_LIBRARY.plateDark,
  "kebab-pan": PHOTO_LIBRARY.pan,
  "kebab-rollo": PHOTO_LIBRARY.rollo,
  lahmacun: PHOTO_LIBRARY.lahmacun,
  "lahmacun-menu": PHOTO_LIBRARY.pizzaTray,
  "kebab-pan-menu": PHOTO_LIBRARY.pan,
  "kebab-rollo-menu": PHOTO_LIBRARY.rollo,
  "hamburguesa-pollo-menu": PHOTO_LIBRARY.pan,
  "rollo-pequeno": PHOTO_LIBRARY.rollo,
  falafel: PHOTO_LIBRARY.hero,
  "nuggets-pollo": PHOTO_LIBRARY.plateLight,
  "alitas-pollo": PHOTO_LIBRARY.plateDark,
  "aros-cebolla": PHOTO_LIBRARY.plateLight,
  "patatas-fritas": PHOTO_LIBRARY.plateLight,
  "patatas-deluxe": PHOTO_LIBRARY.bakedBowls,
  "papas-horno": PHOTO_LIBRARY.bakedBowls,
  "pizza-kebab": PHOTO_LIBRARY.pizzaKebab,
  "iskender-kebab": PHOTO_LIBRARY.iskender,
  "dulce-pistacho": PHOTO_LIBRARY.baklava,
  "dulce-nueces": PHOTO_LIBRARY.baklavaWalnut,
  refrescos: PHOTO_LIBRARY.softs,
  agua: PHOTO_LIBRARY.water,
  cerveza: PHOTO_LIBRARY.efes,
  efes: PHOTO_LIBRARY.efes
};

const PRODUCT_NAME_ALIASES = {
  "pilavli et": "carne-con-arroz",
  "carne con arroz": "carne-con-arroz",
  "beef with rice": "carne-con-arroz",
  "etli patates": "patatas-con-carne",
  "patatas con carne": "patatas-con-carne",
  "fries with meat": "patatas-con-carne",
  "kebap tabagi patates": "plato-kebab-patatas",
  "plato kebab patatas": "plato-kebab-patatas",
  "kebab plate fries": "plato-kebab-patatas",
  "kebap tabagi pilav": "plato-kebab-arroz",
  "plato kebab arroz": "plato-kebab-arroz",
  "kebab plate rice": "plato-kebab-arroz",
  "kebap tabagi": "plato-kebab",
  "plato kebab": "plato-kebab",
  "kebab plate": "plato-kebab",
  "ekmek arasi kebap": "kebab-pan",
  "kebab pan": "kebab-pan",
  "kebab sandwich": "kebab-pan",
  "kebap durum": "kebab-rollo",
  "kebab rollo": "kebab-rollo",
  "kebab wrap": "kebab-rollo",
  lahmacun: "lahmacun",
  "lahmacun menu": "lahmacun-menu",
  "kebab pan menu": "kebab-pan-menu",
  "ekmek arasi kebap menu": "kebab-pan-menu",
  "kebap durum menu": "kebab-rollo-menu",
  "kebab rollo menu": "kebab-rollo-menu",
  "hamburguesa pollo menu": "hamburguesa-pollo-menu",
  "tavuk burger menu": "hamburguesa-pollo-menu",
  "rollo pequeno": "rollo-pequeno",
  "kucuk durum": "rollo-pequeno",
  falafel: "falafel",
  "nuggets de pollo": "nuggets-pollo",
  "tavuk nuggets": "nuggets-pollo",
  "alitas de pollo": "alitas-pollo",
  "tavuk kanat": "alitas-pollo",
  "aros de cebolla": "aros-cebolla",
  "sogan halkasi": "aros-cebolla",
  "patatas fritas": "patatas-fritas",
  "patates kizartmasi": "patatas-fritas",
  "patatas deluxe": "patatas-deluxe",
  "deluxe patates": "patatas-deluxe",
  "papas al horno": "papas-horno",
  "firin patates": "papas-horno",
  "pizza kebab": "pizza-kebab",
  "kebap pizza": "pizza-kebab",
  "iskender kebab": "iskender-kebab",
  "iskender kebap": "iskender-kebab",
  "dulce pistacho": "dulce-pistacho",
  "antep fistikli tatli": "dulce-pistacho",
  "pistachio dessert": "dulce-pistacho",
  "dulce nueces": "dulce-nueces",
  "cevizli tatli": "dulce-nueces",
  "walnut dessert": "dulce-nueces",
  refrescos: "refrescos",
  "gazli icecekler": "refrescos",
  "soft drinks": "refrescos",
  agua: "agua",
  su: "agua",
  water: "agua",
  cerveza: "cerveza",
  bira: "cerveza",
  beer: "cerveza",
  efes: "efes"
};

function normalizeProductToken(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function findPhotoKey(productKeyOrName = "") {
  if (!productKeyOrName) {
    return "";
  }

  if (PRODUCT_PHOTOS[productKeyOrName]) {
    return productKeyOrName;
  }

  const normalized = normalizeProductToken(productKeyOrName);
  return PRODUCT_NAME_ALIASES[normalized] || "";
}

export function menuPhoto(productId) {
  return PRODUCT_PHOTOS[productId] || "";
}

export function resolveProductPhoto(productKeyOrId, fallback = "", product = null) {
  const candidates = [
    productKeyOrId,
    product?.id,
    product?.name_tr,
    product?.name_es,
    product?.name_en,
    product?.name?.tr,
    product?.name?.es,
    product?.name?.en
  ].filter(Boolean);

  for (const candidate of candidates) {
    const key = findPhotoKey(candidate);
    if (key && PRODUCT_PHOTOS[key]) {
      return PRODUCT_PHOTOS[key];
    }
  }

  return fallback || "";
}

function pieces(kind) {
  const meat = `<g fill="#8b2e1f">
    <rect x="222" y="210" width="136" height="24" rx="12" transform="rotate(-9 290 222)" />
    <rect x="260" y="238" width="148" height="24" rx="12" transform="rotate(8 334 250)" />
    <rect x="194" y="250" width="126" height="23" rx="12" transform="rotate(13 257 261)" />
    <rect x="324" y="196" width="116" height="22" rx="11" transform="rotate(17 382 207)" />
  </g>`;
  const salad = `<g fill="#27a55f">
    <ellipse cx="214" cy="194" rx="40" ry="16" transform="rotate(-20 214 194)" />
    <ellipse cx="396" cy="194" rx="45" ry="17" transform="rotate(16 396 194)" />
    <ellipse cx="332" cy="283" rx="52" ry="18" transform="rotate(-12 332 283)" />
  </g>`;
  const fries = `<g stroke="#e4b52a" stroke-linecap="round" stroke-width="18">
    <path d="M224 310l-28 76" /><path d="M258 302l-13 84" /><path d="M294 306l18 78" />
    <path d="M334 302l-8 84" /><path d="M368 314l34 70" />
  </g>`;
  const rice = `<g fill="#f4ead0">
    <ellipse cx="226" cy="303" rx="54" ry="24" /><ellipse cx="268" cy="318" rx="48" ry="22" />
    <ellipse cx="320" cy="311" rx="56" ry="25" />
  </g>`;

  if (kind.includes("wrap")) {
    return `<g transform="rotate(-12 320 250)">
      <rect x="150" y="170" width="340" height="128" rx="56" fill="#e7c27a" />
      <rect x="172" y="188" width="296" height="92" rx="46" fill="#f7e3a4" />
      ${salad}${meat}
    </g>${friesIfMenu(kind)}`;
  }

  if (kind.includes("sandwich") || kind === "burger") {
    return `<ellipse cx="315" cy="192" rx="140" ry="46" fill="#d89a47" />
      <rect x="188" y="205" width="256" height="34" rx="17" fill="#24864d" />
      <rect x="196" y="238" width="240" height="35" rx="18" fill="${kind === "burger" ? "#dca148" : "#8b2e1f"}" />
      <ellipse cx="315" cy="292" rx="134" ry="43" fill="#c88435" />${friesIfMenu(kind)}`;
  }

  if (kind.includes("pizza")) {
    return `<circle cx="310" cy="246" r="126" fill="#d99b38" />
      <circle cx="310" cy="246" r="105" fill="#c83925" />
      <g fill="#1c8b4f"><circle cx="250" cy="220" r="10" /><circle cx="330" cy="190" r="9" /><circle cx="370" cy="270" r="11" /></g>
      <g fill="#f2d47a"><circle cx="288" cy="266" r="12" /><circle cx="350" cy="238" r="13" /><circle cx="252" cy="298" r="10" /></g>${friesIfMenu(kind)}`;
  }

  if (kind === "falafel") {
    return `<g fill="#9c6b2b"><circle cx="242" cy="235" r="42" /><circle cx="318" cy="218" r="42" /><circle cx="388" cy="246" r="42" /><circle cx="306" cy="296" r="42" /></g>${salad}`;
  }

  if (kind === "nuggets" || kind === "wings" || kind === "rings") {
    return `<g fill="${kind === "rings" ? "none" : "#b96a26"}" stroke="#dca148" stroke-width="${kind === "rings" ? 18 : 0}">
      <ellipse cx="236" cy="234" rx="46" ry="32" /><ellipse cx="314" cy="212" rx="50" ry="34" />
      <ellipse cx="390" cy="248" rx="48" ry="34" /><ellipse cx="298" cy="294" rx="54" ry="34" />
    </g>`;
  }

  if (kind.includes("fries") || kind === "baked-potato") {
    return kind === "baked-potato"
      ? `<ellipse cx="318" cy="252" rx="132" ry="88" fill="#9a5d26" /><ellipse cx="318" cy="234" rx="94" ry="48" fill="#f0d18b" />${meat}`
      : `${fries}${meat}`;
  }

  if (kind.includes("baklava")) {
    const top = kind === "baklava-green" ? "#4f8b41" : "#b1762b";
    return `<g transform="translate(210 174)">
      <polygon points="0,70 76,25 152,70 76,115" fill="${top}" />
      <polygon points="96,70 172,25 248,70 172,115" fill="#d6a24a" />
      <polygon points="48,142 124,96 200,142 124,188" fill="${top}" />
      <g stroke="#f1cf68" stroke-width="5"><path d="M36 70h112M132 70h112M84 142h112" /></g>
    </g>`;
  }

  if (kind === "soda" || kind === "water" || kind === "beer") {
    const fill = kind === "beer" ? "#c98221" : kind === "water" ? "#77bfe8" : "#d8262f";
    return `<rect x="250" y="142" width="92" height="204" rx="22" fill="${fill}" />
      <rect x="268" y="128" width="56" height="26" rx="9" fill="#e8edf2" />
      <rect x="262" y="204" width="68" height="72" rx="12" fill="rgba(255,255,255,.84)" />
      <rect x="358" y="176" width="58" height="168" rx="18" fill="${kind === "beer" ? "#29313a" : "#e4c253"}" />`;
  }

  if (kind === "iskender") {
    return `${meat}<rect x="190" y="300" width="250" height="36" rx="18" fill="#c63722" /><ellipse cx="410" cy="198" rx="48" ry="28" fill="#f5f0df" />`;
  }

  return kind === "rice" ? `${rice}${meat}${salad}` : `${meat}${salad}${fries}`;
}

function friesIfMenu(kind) {
  return kind.includes("menu")
    ? `<g transform="translate(394 286) scale(.62)" stroke="#e4b52a" stroke-linecap="round" stroke-width="18">
      <path d="M0 0l-28 76" /><path d="M34 -8l-13 84" /><path d="M70 -4l18 78" />
      <path d="M110 -8l-8 84" /><path d="M144 4l34 70" />
    </g>`
    : "";
}

export function menuArtwork(productId, categoryId) {
  const [start, end, accent] = CATEGORY_PALETTES[categoryId] || CATEGORY_PALETTES.principales;
  const kind = PRODUCT_KINDS[productId] || "plate";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="460" viewBox="0 0 640 460">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="${start}" />
        <stop offset="1" stop-color="${end}" />
      </linearGradient>
      <radialGradient id="glow" cx="55%" cy="36%" r="58%">
        <stop offset="0" stop-color="${accent}" stop-opacity=".28" />
        <stop offset="1" stop-color="${accent}" stop-opacity="0" />
      </radialGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="20" stdDeviation="18" flood-color="#000" flood-opacity=".36"/>
      </filter>
    </defs>
    <rect width="640" height="460" fill="url(#bg)" />
    <rect width="640" height="460" fill="url(#glow)" />
    <circle cx="514" cy="92" r="8" fill="${accent}" />
    <g filter="url(#shadow)">
      <ellipse cx="320" cy="276" rx="200" ry="110" fill="rgba(255,255,255,.9)" />
      <ellipse cx="320" cy="276" rx="158" ry="78" fill="rgba(244,244,236,.94)" />
      ${pieces(kind)}
    </g>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}





