export const SUPPORTED_LANGUAGES = ["tr", "es", "en"];
export const DEFAULT_LANGUAGE = "es";

const env = import.meta.env || {};

export const DEFAULT_RESTAURANT_SLUG =
  env.VITE_DEFAULT_RESTAURANT_SLUG || "real-kebab-istanbul";

export const DEFAULT_TABLE_CODE = "masa-1";

export const PLACEHOLDER_IMAGES = {
  openingPoster: "/brand/opening-poster.png",
  heroLuxe: "/brand/real-istanbul-hero-kebab.png",
  heroClean: "/brand/real-istanbul-hero-clean.png",
  logoLuxe: "/brand/real-istanbul-logo-luxe.png",
  brandIcons: "/brand/brand-icons-luxe.png",
  openingPrepVideo: "/brand/opening-prep.mp4",
  foostBoxDark: "/brand/dish-plate-box-dark.jpg",
  foostTrayCola: "/brand/dish-plate-trays-cola.jpg",
  foostBoxLight: "/brand/dish-plate-box-light.jpg",
  dishBakedBowls: "/brand/dish-baked-bowls.png",
  dishKebabWrapStudio: "/brand/dish-kebab-wrap-studio.png",
  dishKebabWrapMarble: "/brand/dish-kebab-wrap-marble.png",
  dishPizzaTray: "/brand/dish-pizza-tray.png",
  dishPizzaClose: "/brand/dish-pizza-close.png",
  dishPizzaKebab: "/brand/dish-pizza-kebab.png",
  dishIskender: "/brand/dish-iskender-kebab.png",
  dishKebabRollo: "/brand/dish-kebab-rollo.png",
  dishKebabPan: "/brand/dish-kebab-pan.png",
  dishLahmacun: "/brand/dish-lahmacun.png",
  dishBaklavaPistachio: "/brand/dish-baklava-pistachio.png",
  dishBaklavaWalnut: "/brand/dish-baklava-walnut.png",
  drinkSofts: "/brand/drink-softs.png",
  drinkWater: "/brand/drink-water.png",
  drinkEfes: "/brand/drink-efes.png",
  hero: "/placeholders/hero-restaurant.svg",
  sign: "/placeholders/real-kebab-round-sign.svg",
  doner: "/placeholders/doner.svg",
  wrap: "/placeholders/wrap.svg",
  plate: "/placeholders/plate.svg",
  burger: "/placeholders/burger.svg",
  pizza: "/placeholders/pizza.svg",
  falafel: "/placeholders/falafel.svg",
  fastfood: "/placeholders/fastfood.svg",
  dessert: "/placeholders/dessert.svg",
  drink: "/placeholders/drink.svg",
  chef: "/placeholders/game-chef.svg",
  burnt: "/placeholders/burnt-doner.svg"
};




