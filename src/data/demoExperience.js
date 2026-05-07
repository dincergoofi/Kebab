import { PLACEHOLDER_IMAGES } from "../config/appConfig.js";
import { repairDeep } from "../utils/text.js";
import { menuArtwork, resolveProductPhoto } from "./menuArtwork.js";

function menuProduct({
  id,
  categoryId,
  name,
  description,
  price,
  image,
  ingredients,
  allergens = [],
  calories,
  spiceLevel = 0,
  badge = {},
  signature = false,
  anchor = false,
  priority = 50,
  order = 10
}) {
  return {
    id,
    category_id: categoryId,
    name,
    description,
    price,
    currency: "EUR",
    image_url: resolveProductPhoto(id, menuArtwork(id, categoryId) || image),
    ingredients,
    allergens,
    calories,
    spice_level: spiceLevel,
    badge: {
      tr: badge.tr || "",
      es: badge.es || "",
      en: badge.en || ""
    },
    is_signature: signature,
    is_anchor: anchor,
    sales_priority: priority,
    order_index: order,
    is_available: true
  };
}

const chefChoice = {
  tr: "Sefin Secimi",
  es: "Eleccion del chef",
  en: "Chef's Choice"
};

const mostLoved = {
  tr: "En Sevilen",
  es: "Mas pedido",
  en: "Most ordered"
};

const vegetarianBadge = {
  tr: "Vejetaryen",
  es: "Vegetariano",
  en: "Vegetarian"
};

const premiumBadge = {
  tr: "Premium",
  es: "Premium",
  en: "Premium"
};

const RAW_DEMO_EXPERIENCE = {
  source: "demo",
  restaurant: {
    id: "demo-restaurant",
    slug: "real-kebab-istanbul",
    name: "Kebab Real Istanbul",
    city: "San Fernando",
    country_code: "ES",
    default_language: "es",
    address: "C. Real, 204, 11100 San Fernando, Cadiz, Spain",
    phone: "+34 612 58 28 37",
    hours: "Mar-Jue 13:00-16:00 · 20:00-00:00 · Vie-Sab hasta 00:30 · Dom hasta 00:00 · Lun cerrado",
    custom_link: "https://www.realistanbul.es",
    tagline: {
      tr: "San Fernando'da gercek Istanbul lezzeti.",
      es: "El autentico sabor de Estambul en San Fernando.",
      en: "Authentic Istanbul flavor in San Fernando."
    },
    logo_image_url: PLACEHOLDER_IMAGES.logoLuxe,
    cover_image_url: PLACEHOLDER_IMAGES.heroLuxe,
    hero_video_url: PLACEHOLDER_IMAGES.openingPrepVideo,
    social_links: [
      { label: "Instagram", url: "https://www.instagram.com/realistanbul.es" }
    ],
    theme: {
      primary: "#c9151b",
      accent: "#f5c542",
      fresh: "#138a50"
    },
    google_place_id: "",
    google_review_url: "https://www.google.com/search?sa=X&sca_esv=1264130d37fc9ab6&sxsrf=ANbL-n7ewADy5m7bXPooo47dGDNtU5yIgQ:1777739716501&q=Kebab+Real+Istambul+Yorumlar&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxK2NDE3sjQzMTQyMje1MDczMjAw3sDI-IpRxjs1KTFJISg1MUfBs7gkMTepNEchMr-oNDcnsWgRK15pAEyif5FYAAAA&rldimm=9472964122758762003&tbm=lcl&hl=tr-TR&ved=2ahUKEwjrk7jChJuUAxVaB9sEHWgZJuUQ9fQKegQIUBAG&biw=1536&bih=730&dpr=1.25#lkt=LocalPoiReviews",
    whatsapp_number: "34612582837",
    is_feedback_enabled: true,
    is_game_enabled: true,
    promo_enabled: false,
    promo_threshold: 90
  },
  links: [
    { id: "phone", kind: "phone", label: "Telefono", url: "tel:+34612582837", order_index: 10 },
    { id: "whatsapp", kind: "whatsapp", label: "WhatsApp", url: "https://wa.me/34612582837?text=Hola%2C%20quiero%20hacer%20un%20pedido.", order_index: 20 },
    { id: "maps", kind: "maps", label: "Google Maps", url: "https://www.google.com/maps/search/?api=1&query=Kebab%20Real%20Istanbul%2C%20C.%20Real%20204%2C%2011100%20San%20Fernando%2C%20Cadiz%2C%20Spain", order_index: 30 },
    { id: "website", kind: "website", label: "Web", url: "https://www.realistanbul.es", order_index: 35 },
    { id: "reviews", kind: "reviews", label: "Google Reviews", url: "https://www.google.com/search?sa=X&sca_esv=1264130d37fc9ab6&sxsrf=ANbL-n7ewADy5m7bXPooo47dGDNtU5yIgQ:1777739716501&q=Kebab+Real+Istambul+Yorumlar&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxK2NDE3sjQzMTQyMje1MDczMjAw3sDI-IpRxjs1KTFJISg1MUfBs7gkMTepNEchMr-oNDcnsWgRK15pAEyif5FYAAAA&rldimm=9472964122758762003&tbm=lcl&hl=tr-TR&ved=2ahUKEwjrk7jChJuUAxVaB9sEHWgZJuUQ9fQKegQIUBAG&biw=1536&bih=730&dpr=1.25#lkt=LocalPoiReviews", order_index: 40 }
  ],
  categories: [
    { id: "principales", name: { tr: "Ana Lezzetler", es: "Principales", en: "Mains" }, order_index: 10 },
    { id: "fast-food", name: { tr: "Yan Lezzetler", es: "Complementos", en: "Sides" }, order_index: 20 },
    { id: "especiales", name: { tr: "Ozel Lezzetler", es: "Especiales", en: "Specials" }, order_index: 30 },
    { id: "postres", name: { tr: "Tatlilar", es: "Postres", en: "Desserts" }, order_index: 40 },
    { id: "bebidas", name: { tr: "Icecekler", es: "Bebidas", en: "Drinks" }, order_index: 50 }  ],
  products: [
    menuProduct({
      id: "carne-con-arroz",
      categoryId: "principales",
      name: { tr: "Pilavli Et", es: "Carne con arroz", en: "Beef with rice" },
      description: {
        tr: "Doner eti aromali pirinc pilavi ve taze salata ile.",
        es: "Carne kebab con arroz aromatico y ensalada fresca.",
        en: "Kebab meat with aromatic rice and fresh salad."
      },
      price: 8.50,
      image: PLACEHOLDER_IMAGES.plate,
      ingredients: {
        tr: ["et doner", "pirinc", "salata"],
        es: ["carne kebab", "arroz", "ensalada"],
        en: ["kebab meat", "rice", "salad"]
      },
      allergens: [],
      calories: 760,
      spiceLevel: 1,
      badge: mostLoved,
      signature: true,
      anchor: false,
      priority: 92,
      order: 10
    }),
    menuProduct({
      id: "patatas-con-carne",
      categoryId: "principales",
      name: { tr: "Etli Patates", es: "Patatas con carne", en: "Fries with meat" },
      description: {
        tr: "Citir patates uzerinde kebap eti ve sos.",
        es: "Patatas crujientes con carne kebab y salsa.",
        en: "Crispy fries with kebab meat and sauce."
      },
      price: 7.50,
      image: PLACEHOLDER_IMAGES.fastfood,
      ingredients: {
        tr: ["et doner", "patates", "sos"],
        es: ["carne kebab", "patatas", "salsa"],
        en: ["kebab meat", "fries", "sauce"]
      },
      allergens: ["gluten"],
      calories: 820,
      spiceLevel: 1,
      badge: {},
      signature: false,
      anchor: false,
      priority: 82,
      order: 20
    }),
    menuProduct({
      id: "plato-kebab-patatas",
      categoryId: "principales",
      name: { tr: "Kebap Tabagi + Patates", es: "Plato kebab + patatas", en: "Kebab plate + fries" },
      description: {
        tr: "Doyurucu tabakta kebap eti patates salata ve sos.",
        es: "Plato completo con carne kebab patatas ensalada y salsa.",
        en: "Full plate with kebab meat fries salad and sauce."
      },
      price: 8.90,
      image: PLACEHOLDER_IMAGES.plate,
      ingredients: {
        tr: ["et doner", "patates", "salata"],
        es: ["carne kebab", "patatas", "ensalada"],
        en: ["kebab meat", "fries", "salad"]
      },
      allergens: ["gluten"],
      calories: 850,
      spiceLevel: 1,
      badge: chefChoice,
      signature: true,
      anchor: false,
      priority: 96,
      order: 30
    }),
    menuProduct({
      id: "plato-kebab-arroz",
      categoryId: "principales",
      name: { tr: "Kebap Tabagi + Pilav", es: "Plato kebab + arroz", en: "Kebab plate + rice" },
      description: {
        tr: "Klasik tabakta kebap eti pilav salata ve soslar.",
        es: "Plato clasico con carne kebab arroz ensalada y salsas.",
        en: "Classic plate with kebab meat rice salad and sauces."
      },
      price: 8.90,
      image: PLACEHOLDER_IMAGES.plate,
      ingredients: {
        tr: ["et doner", "pirinc", "salata"],
        es: ["carne kebab", "arroz", "ensalada"],
        en: ["kebab meat", "rice", "salad"]
      },
      allergens: [],
      calories: 790,
      spiceLevel: 1,
      badge: {},
      signature: false,
      anchor: false,
      priority: 88,
      order: 40
    }),
    menuProduct({
      id: "plato-kebab",
      categoryId: "principales",
      name: { tr: "Kebap Tabagi", es: "Plato kebab", en: "Kebab plate" },
      description: {
        tr: "Bol kebap eti salata ve ev soslari ile.",
        es: "Racion de carne kebab con ensalada y salsas de la casa.",
        en: "Generous kebab meat with salad and house sauces."
      },
      price: 7.90,
      image: PLACEHOLDER_IMAGES.doner,
      ingredients: {
        tr: ["et doner", "salata", "sos"],
        es: ["carne kebab", "ensalada", "salsa"],
        en: ["kebab meat", "salad", "sauce"]
      },
      allergens: [],
      calories: 640,
      spiceLevel: 1,
      badge: {},
      signature: false,
      anchor: false,
      priority: 78,
      order: 50
    }),
    menuProduct({
      id: "kebab-pan",
      categoryId: "principales",
      name: { tr: "Ekmek Arasi Kebap", es: "Kebab pan", en: "Kebab sandwich" },
      description: {
        tr: "Kizarmis ekmek icinde kebap eti yesillik ve sos.",
        es: "Pan tostado con carne kebab verduras y salsa.",
        en: "Toasted bread with kebab meat greens and sauce."
      },
      price: 5.50,
      image: PLACEHOLDER_IMAGES.burger,
      ingredients: {
        tr: ["ekmek", "et doner", "salata"],
        es: ["pan", "carne kebab", "ensalada"],
        en: ["bread", "kebab meat", "salad"]
      },
      allergens: ["gluten"],
      calories: 560,
      spiceLevel: 1,
      badge: {},
      signature: false,
      anchor: false,
      priority: 74,
      order: 60
    }),
    menuProduct({
      id: "kebab-rollo",
      categoryId: "principales",
      name: { tr: "Kebap Durum", es: "Kebab rollo", en: "Kebab wrap" },
      description: {
        tr: "Lavas icinde kebap eti yesillik ve sos.",
        es: "Rollo con carne kebab verduras y salsa.",
        en: "Wrap with kebab meat greens and sauce."
      },
      price: 6.00,
      image: PLACEHOLDER_IMAGES.wrap,
      ingredients: {
        tr: ["et doner", "yesillik", "sos"],
        es: ["carne kebab", "verduras", "salsa"],
        en: ["kebab meat", "greens", "sauce"]
      },
      allergens: ["gluten"],
      calories: 650,
      spiceLevel: 1,
      badge: mostLoved,
      signature: true,
      anchor: false,
      priority: 94,
      order: 70
    }),
    menuProduct({
      id: "lahmacun",
      categoryId: "principales",
      name: { tr: "Lahmacun", es: "Lahmacun", en: "Lahmacun" },
      description: {
        tr: "Ince hamur uzerinde baharatli kiyma ve limon.",
        es: "Masa fina con carne especiada y limon fresco.",
        en: "Thin dough with spiced minced meat and lemon."
      },
      price: 6.50,
      image: PLACEHOLDER_IMAGES.pizza,
      ingredients: {
        tr: ["hamur", "kiyma", "limon"],
        es: ["masa", "carne picada", "limon"],
        en: ["dough", "minced meat", "lemon"]
      },
      allergens: ["gluten"],
      calories: 620,
      spiceLevel: 2,
      badge: {},
      signature: false,
      anchor: false,
      priority: 80,
      order: 80
    }),
    menuProduct({
      id: "lahmacun-menu",
      categoryId: "principales",
      name: { tr: "Lahmacun Menu", es: "Lahmacun menu", en: "Lahmacun menu" },
      description: {
        tr: "Lahmacun patates sos ve icecek ile.",
        es: "Lahmacun con patatas salsa y bebida.",
        en: "Lahmacun with fries sauce and drink."
      },
      price: 8.90,
      image: PLACEHOLDER_IMAGES.pizza,
      ingredients: {
        tr: ["lahmacun", "patates", "icecek"],
        es: ["lahmacun", "patatas", "bebida"],
        en: ["lahmacun", "fries", "drink"]
      },
      allergens: ["gluten"],
      calories: 940,
      spiceLevel: 2,
      badge: {},
      signature: false,
      anchor: true,
      priority: 86,
      order: 90
    }),
    menuProduct({
      id: "kebab-pan-menu",
      categoryId: "principales",
      name: { tr: "Ekmek Arasi Kebap Menu", es: "Kebab pan menu", en: "Kebab sandwich menu" },
      description: {
        tr: "Ekmek arasi kebap patates ve icecek ile.",
        es: "Kebab en pan con patatas y bebida.",
        en: "Kebab sandwich with fries and drink."
      },
      price: 7.90,
      image: PLACEHOLDER_IMAGES.burger,
      ingredients: {
        tr: ["ekmek", "et doner", "patates", "icecek"],
        es: ["pan", "carne kebab", "patatas", "bebida"],
        en: ["bread", "kebab meat", "fries", "drink"]
      },
      allergens: ["gluten"],
      calories: 850,
      spiceLevel: 1,
      badge: {},
      signature: false,
      anchor: false,
      priority: 83,
      order: 100
    }),
    menuProduct({
      id: "kebab-rollo-menu",
      categoryId: "principales",
      name: { tr: "Kebap Durum Menu", es: "Kebab rollo menu", en: "Kebab wrap menu" },
      description: {
        tr: "Kebap durum patates ve icecek ile.",
        es: "Rollo kebab con patatas y bebida.",
        en: "Kebab wrap with fries and drink."
      },
      price: 8.50,
      image: PLACEHOLDER_IMAGES.wrap,
      ingredients: {
        tr: ["durum", "patates", "icecek"],
        es: ["rollo", "patatas", "bebida"],
        en: ["wrap", "fries", "drink"]
      },
      allergens: ["gluten"],
      calories: 930,
      spiceLevel: 1,
      badge: chefChoice,
      signature: true,
      anchor: false,
      priority: 98,
      order: 110
    }),
    menuProduct({
      id: "hamburguesa-pollo-menu",
      categoryId: "fast-food",
      name: { tr: "Tavuk Burger Menu", es: "Hamburguesa pollo menu", en: "Chicken burger menu" },
      description: {
        tr: "Tavuk burger patates ve icecek ile.",
        es: "Hamburguesa de pollo con patatas y bebida.",
        en: "Chicken burger with fries and drink."
      },
      price: 7.50,
      image: PLACEHOLDER_IMAGES.burger,
      ingredients: {
        tr: ["pilic", "ekmek", "patates"],
        es: ["pollo", "pan", "patatas"],
        en: ["chicken", "bread", "fries"]
      },
      allergens: ["gluten", "egg"],
      calories: 880,
      spiceLevel: 0,
      badge: {},
      signature: false,
      anchor: false,
      priority: 74,
      order: 10
    }),
    menuProduct({
      id: "rollo-pequeno",
      categoryId: "fast-food",
      name: { tr: "Kucuk Durum", es: "Rollo pequeno", en: "Small wrap" },
      description: {
        tr: "Hafif porsiyon icin kucuk kebap durum.",
        es: "Rollo pequeno de kebab para una opcion ligera.",
        en: "Small kebab wrap for a lighter option."
      },
      price: 4.50,
      image: PLACEHOLDER_IMAGES.wrap,
      ingredients: {
        tr: ["et doner", "yesillik", "sos"],
        es: ["carne kebab", "verduras", "salsa"],
        en: ["kebab meat", "greens", "sauce"]
      },
      allergens: ["gluten"],
      calories: 470,
      spiceLevel: 1,
      badge: {},
      signature: false,
      anchor: false,
      priority: 70,
      order: 20
    }),
    menuProduct({
      id: "falafel",
      categoryId: "fast-food",
      name: { tr: "Falafel", es: "Falafel", en: "Falafel" },
      description: {
        tr: "Nohut kofte salata ve sos ile.",
        es: "Croquetas de garbanzo con ensalada y salsa.",
        en: "Chickpea bites with salad and sauce."
      },
      price: 6.00,
      image: PLACEHOLDER_IMAGES.falafel,
      ingredients: {
        tr: ["nohut", "salata", "sos"],
        es: ["garbanzo", "ensalada", "salsa"],
        en: ["chickpea", "salad", "sauce"]
      },
      allergens: ["sesame"],
      calories: 540,
      spiceLevel: 0,
      badge: vegetarianBadge,
      signature: true,
      anchor: false,
      priority: 84,
      order: 30
    }),
    menuProduct({
      id: "nuggets-pollo",
      categoryId: "fast-food",
      name: { tr: "Tavuk Nuggets", es: "Nuggets de pollo", en: "Chicken nuggets" },
      description: {
        tr: "Citir tavuk parcalari ve dip sos.",
        es: "Nuggets crujientes de pollo con salsa.",
        en: "Crispy chicken nuggets with dip."
      },
      price: 5.50,
      image: PLACEHOLDER_IMAGES.fastfood,
      ingredients: {
        tr: ["tavuk", "pane", "sos"],
        es: ["pollo", "rebozado", "salsa"],
        en: ["chicken", "breadcrumb", "sauce"]
      },
      allergens: ["gluten", "egg"],
      calories: 520,
      spiceLevel: 0,
      badge: {},
      signature: false,
      anchor: false,
      priority: 68,
      order: 40
    }),
    menuProduct({
      id: "alitas-pollo",
      categoryId: "fast-food",
      name: { tr: "Tavuk Kanat", es: "Alitas de pollo", en: "Chicken wings" },
      description: {
        tr: "Soslu citir tavuk kanatlari.",
        es: "Alitas de pollo crujientes con salsa.",
        en: "Crispy chicken wings with sauce."
      },
      price: 6.50,
      image: PLACEHOLDER_IMAGES.fastfood,
      ingredients: {
        tr: ["tavuk kanat", "baharat", "sos"],
        es: ["alitas", "especias", "salsa"],
        en: ["wings", "spices", "sauce"]
      },
      allergens: [],
      calories: 690,
      spiceLevel: 2,
      badge: {},
      signature: false,
      anchor: false,
      priority: 76,
      order: 50
    }),
    menuProduct({
      id: "aros-cebolla",
      categoryId: "fast-food",
      name: { tr: "Sogan Halkasi", es: "Aros de cebolla", en: "Onion rings" },
      description: {
        tr: "Altin renkli citir sogan halkalari.",
        es: "Aros de cebolla dorados y crujientes.",
        en: "Golden crispy onion rings."
      },
      price: 4.00,
      image: PLACEHOLDER_IMAGES.fastfood,
      ingredients: {
        tr: ["sogan", "pane"],
        es: ["cebolla", "rebozado"],
        en: ["onion", "breadcrumb"]
      },
      allergens: ["gluten"],
      calories: 430,
      spiceLevel: 0,
      badge: {},
      signature: false,
      anchor: false,
      priority: 58,
      order: 60
    }),
    menuProduct({
      id: "patatas-fritas",
      categoryId: "fast-food",
      name: { tr: "Patates Kizartmasi", es: "Patatas fritas", en: "French fries" },
      description: {
        tr: "Klasik citir patates kizartmasi.",
        es: "Patatas fritas clasicas y crujientes.",
        en: "Classic crispy french fries."
      },
      price: 3.50,
      image: PLACEHOLDER_IMAGES.fastfood,
      ingredients: {
        tr: ["patates"],
        es: ["patatas"],
        en: ["potatoes"]
      },
      allergens: [],
      calories: 390,
      spiceLevel: 0,
      badge: {},
      signature: false,
      anchor: false,
      priority: 64,
      order: 70
    }),
    menuProduct({
      id: "patatas-deluxe",
      categoryId: "fast-food",
      name: { tr: "Deluxe Patates", es: "Patatas deluxe", en: "Deluxe potatoes" },
      description: {
        tr: "Baharatli deluxe patates ve ozel sos.",
        es: "Patatas especiadas con salsa especial.",
        en: "Seasoned deluxe potatoes with special sauce."
      },
      price: 4.50,
      image: PLACEHOLDER_IMAGES.fastfood,
      ingredients: {
        tr: ["patates", "baharat", "sos"],
        es: ["patatas", "especias", "salsa"],
        en: ["potatoes", "spices", "sauce"]
      },
      allergens: ["milk"],
      calories: 510,
      spiceLevel: 1,
      badge: mostLoved,
      signature: false,
      anchor: false,
      priority: 82,
      order: 80
    }),
    menuProduct({
      id: "papas-horno",
      categoryId: "fast-food",
      name: { tr: "Firin Patates", es: "Papas al horno", en: "Baked potato" },
      description: {
        tr: "Firin patates sos ve sicak garnitur ile.",
        es: "Papa al horno con salsa y topping caliente.",
        en: "Baked potato with sauce and warm topping."
      },
      price: 5.50,
      image: PLACEHOLDER_IMAGES.plate,
      ingredients: {
        tr: ["patates", "sos", "garnitur"],
        es: ["papa", "salsa", "topping"],
        en: ["potato", "sauce", "topping"]
      },
      allergens: ["milk"],
      calories: 620,
      spiceLevel: 0,
      badge: {},
      signature: false,
      anchor: false,
      priority: 66,
      order: 90
    }),
    menuProduct({
      id: "pizza-kebab",
      categoryId: "especiales",
      name: { tr: "Kebap Pizza", es: "Pizza kebab", en: "Kebab pizza" },
      description: {
        tr: "Kebap eti ile hazirlanan bol malzemeli pizza.",
        es: "Pizza con carne kebab salsa y queso fundido.",
        en: "Pizza with kebab meat sauce and melted cheese."
      },
      price: 8.90,
      image: PLACEHOLDER_IMAGES.dishPizzaKebab,
      ingredients: {
        tr: ["hamur", "kebap eti", "peynir"],
        es: ["masa", "carne kebab", "queso"],
        en: ["dough", "kebab meat", "cheese"]
      },
      allergens: ["gluten", "milk"],
      calories: 940,
      spiceLevel: 1,
      badge: chefChoice,
      signature: true,
      anchor: false,
      priority: 91,
      order: 10
    }),
    menuProduct({
      id: "iskender-kebab",
      categoryId: "especiales",
      name: { tr: "Iskender Kebap", es: "Iskender kebab", en: "Iskender kebab" },
      description: {
        tr: "Kebap eti ekmek ustu yogurt ve domates sos ile.",
        es: "Carne kebab sobre pan con yogur y salsa de tomate.",
        en: "Kebab meat over bread with yogurt and tomato sauce."
      },
      price: 10.90,
      image: PLACEHOLDER_IMAGES.dishIskender,
      ingredients: {
        tr: ["et doner", "pide", "yogurt"],
        es: ["carne kebab", "pan", "yogur"],
        en: ["kebab meat", "bread", "yogurt"]
      },
      allergens: ["gluten", "milk"],
      calories: 880,
      spiceLevel: 1,
      badge: premiumBadge,
      signature: false,
      anchor: true,
      priority: 89,
      order: 20
    }),
    menuProduct({
      id: "dulce-pistacho",
      categoryId: "postres",
      name: { tr: "Antep Fistikli Tatli", es: "Dulce pistacho", en: "Pistachio dessert" },
      description: {
        tr: "Fistikli serbetli tatli.",
        es: "Dulce de pistacho con toque turco.",
        en: "Pistachio dessert with a Turkish touch."
      },
      price: 3.50,
      image: PLACEHOLDER_IMAGES.dishBaklavaPistachio,
      ingredients: {
        tr: ["fistik", "hamur", "serbet"],
        es: ["pistacho", "masa", "almibar"],
        en: ["pistachio", "dough", "syrup"]
      },
      allergens: ["gluten", "nuts"],
      calories: 360,
      spiceLevel: 0,
      badge: {},
      signature: false,
      anchor: false,
      priority: 74,
      order: 10
    }),
    menuProduct({
      id: "dulce-nueces",
      categoryId: "postres",
      name: { tr: "Cevizli Tatli", es: "Dulce nueces", en: "Walnut dessert" },
      description: {
        tr: "Cevizli tatli kahve sonrasi icin ideal.",
        es: "Dulce con nueces ideal para terminar.",
        en: "Walnut dessert ideal to finish the meal."
      },
      price: 3.50,
      image: PLACEHOLDER_IMAGES.dishBaklavaPistachio,
      ingredients: {
        tr: ["ceviz", "hamur", "serbet"],
        es: ["nueces", "masa", "almibar"],
        en: ["walnuts", "dough", "syrup"]
      },
      allergens: ["gluten", "nuts"],
      calories: 380,
      spiceLevel: 0,
      badge: {},
      signature: false,
      anchor: false,
      priority: 70,
      order: 20
    }),
    menuProduct({
      id: "refrescos",
      categoryId: "bebidas",
      name: { tr: "Gazli Icecekler", es: "Refrescos", en: "Soft drinks" },
      description: {
        tr: "Soguk kutu icecek secenekleri.",
        es: "Bebidas frias en lata.",
        en: "Cold canned soft drinks."
      },
      price: 2.00,
      image: PLACEHOLDER_IMAGES.drinkSofts,
      ingredients: {
        tr: ["icecek"],
        es: ["refresco"],
        en: ["soft drink"]
      },
      allergens: [],
      calories: 140,
      spiceLevel: 0,
      badge: {},
      signature: false,
      anchor: false,
      priority: 76,
      order: 10
    }),
    menuProduct({
      id: "agua",
      categoryId: "bebidas",
      name: { tr: "Su", es: "Agua", en: "Water" },
      description: {
        tr: "Soguk sise su.",
        es: "Botella de agua fria.",
        en: "Cold bottled water."
      },
      price: 1.50,
      image: PLACEHOLDER_IMAGES.drinkWater,
      ingredients: {
        tr: ["su"],
        es: ["agua"],
        en: ["water"]
      },
      allergens: [],
      calories: 0,
      spiceLevel: 0,
      badge: {},
      signature: false,
      anchor: false,
      priority: 68,
      order: 20
    }),
    menuProduct({
      id: "cerveza",
      categoryId: "bebidas",
      name: { tr: "Bira", es: "Cerveza", en: "Beer" },
      description: {
        tr: "Soguk bira secenegi.",
        es: "Cerveza fria.",
        en: "Cold beer."
      },
      price: 2.50,
      image: PLACEHOLDER_IMAGES.drinkEfes,
      ingredients: {
        tr: ["bira"],
        es: ["cerveza"],
        en: ["beer"]
      },
      allergens: ["gluten"],
      calories: 150,
      spiceLevel: 0,
      badge: {},
      signature: false,
      anchor: false,
      priority: 54,
      order: 30
    }),
    menuProduct({
      id: "efes",
      categoryId: "bebidas",
      name: { tr: "Efes", es: "Efes", en: "Efes" },
      description: {
        tr: "Soguk Efes birasi.",
        es: "Cerveza Efes bien fria.",
        en: "Cold Efes beer."
      },
      price: 2.50,
      image: PLACEHOLDER_IMAGES.drinkEfes,
      ingredients: {
        tr: ["bira"],
        es: ["cerveza"],
        en: ["beer"]
      },
      allergens: ["gluten"],
      calories: 150,
      spiceLevel: 0,
      badge: {},
      signature: false,
      anchor: false,
      priority: 56,
      order: 40
    })  ],
  leaderboard: [
    { id: "lead-1", player_name: "Mert", score: 132, created_at: new Date().toISOString() },
    { id: "lead-2", player_name: "Sofia", score: 114, created_at: new Date().toISOString() },
    { id: "lead-3", player_name: "Leo", score: 98, created_at: new Date().toISOString() }
  ]
};

export const demoExperience = repairDeep(RAW_DEMO_EXPERIENCE);


