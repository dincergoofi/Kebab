import { mkdir, writeFile } from "node:fs/promises";
import { demoExperience } from "../src/data/demoExperience.js";

const outputDocs = new URL("../docs/", import.meta.url);
const outputSupabase = new URL("../supabase/", import.meta.url);
const tableCountArg = process.argv.find((arg) => arg.startsWith("--tables="));
const tableCount = Math.max(1, Math.min(120, Number(tableCountArg?.split("=")[1]) || 12));

function csvCell(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function sqlText(value) {
  if (value == null || value === "") {
    return "null";
  }

  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlJson(value) {
  return `'${JSON.stringify(value ?? null).replaceAll("'", "''")}'::jsonb`;
}

function bool(value) {
  return value ? "true" : "false";
}

function money(value) {
  return Number(value || 0).toFixed(2);
}

function categoryName(category, language) {
  return category.name?.[language] || "";
}

function productName(product, language) {
  return product.name?.[language] || "";
}

function productDescription(product, language) {
  return product.description?.[language] || "";
}

function productBadge(product, language) {
  return product.badge?.[language] || "";
}

function buildCsv() {
  const headers = [
    "category_id",
    "category_es",
    "product_id",
    "name_es",
    "name_tr",
    "name_en",
    "description_es",
    "description_tr",
    "description_en",
    "price_eur",
    "ingredients_es",
    "ingredients_tr",
    "ingredients_en",
    "allergens",
    "calories",
    "spice_level",
    "is_available",
    "is_signature",
    "sales_priority",
    "order_index",
    "image_url"
  ];

  const categoryById = Object.fromEntries(demoExperience.categories.map((category) => [category.id, category]));
  const rows = demoExperience.products.map((product) => {
    const category = categoryById[product.category_id];
    return [
      product.category_id,
      categoryName(category, "es"),
      product.id,
      productName(product, "es"),
      productName(product, "tr"),
      productName(product, "en"),
      productDescription(product, "es"),
      productDescription(product, "tr"),
      productDescription(product, "en"),
      money(product.price),
      (product.ingredients?.es || []).join("; "),
      (product.ingredients?.tr || []).join("; "),
      (product.ingredients?.en || []).join("; "),
      (product.allergens || []).join("; "),
      product.calories,
      product.spice_level,
      product.is_available !== false ? "yes" : "no",
      product.is_signature ? "yes" : "no",
      product.sales_priority,
      product.order_index,
      product.image_url
    ];
  });

  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

function buildSeedSql() {
  const restaurant = demoExperience.restaurant;
  const lines = [
    "-- Generated from src/data/demoExperience.js.",
    "-- Run after migrations. Safe to rerun for the same restaurant slug.",
    "",
    "begin;",
    "",
    "insert into public.restaurants (",
    "  slug, name, city, country_code, default_language, address, phone, hours, custom_link,",
    "  tagline_tr, tagline_es, tagline_en, logo_image_url, cover_image_url, hero_video_url,",
    "  social_links, theme, google_place_id, google_review_url, whatsapp_number,",
    "  is_feedback_enabled, is_game_enabled, promo_enabled, promo_threshold",
    ") values (",
    `  ${sqlText(restaurant.slug)}, ${sqlText(restaurant.name)}, ${sqlText(restaurant.city)}, ${sqlText(restaurant.country_code)}, ${sqlText(restaurant.default_language)},`,
    `  ${sqlText(restaurant.address)}, ${sqlText(restaurant.phone)}, ${sqlText(restaurant.hours)}, ${sqlText(restaurant.custom_link)},`,
    `  ${sqlText(restaurant.tagline?.tr)}, ${sqlText(restaurant.tagline?.es)}, ${sqlText(restaurant.tagline?.en)},`,
    `  ${sqlText(restaurant.logo_image_url)}, ${sqlText(restaurant.cover_image_url)}, ${sqlText(restaurant.hero_video_url)},`,
    `  ${sqlJson(restaurant.social_links)}, ${sqlJson(restaurant.theme)}, ${sqlText(restaurant.google_place_id)}, ${sqlText(restaurant.google_review_url)}, ${sqlText(restaurant.whatsapp_number)},`,
    `  ${bool(restaurant.is_feedback_enabled)}, ${bool(restaurant.is_game_enabled)}, ${bool(restaurant.promo_enabled)}, ${Number(restaurant.promo_threshold || 90)}`,
    ")",
    "on conflict (slug) do update set",
    "  name = excluded.name,",
    "  city = excluded.city,",
    "  address = excluded.address,",
    "  phone = excluded.phone,",
    "  hours = excluded.hours,",
    "  custom_link = excluded.custom_link,",
    "  tagline_tr = excluded.tagline_tr,",
    "  tagline_es = excluded.tagline_es,",
    "  tagline_en = excluded.tagline_en,",
    "  logo_image_url = excluded.logo_image_url,",
    "  cover_image_url = excluded.cover_image_url,",
    "  social_links = excluded.social_links,",
    "  theme = excluded.theme,",
    "  google_place_id = excluded.google_place_id,",
    "  google_review_url = excluded.google_review_url,",
    "  whatsapp_number = excluded.whatsapp_number,",
    "  is_feedback_enabled = excluded.is_feedback_enabled,",
    "  is_game_enabled = excluded.is_game_enabled,",
    "  promo_enabled = excluded.promo_enabled,",
    "  promo_threshold = excluded.promo_threshold;",
    "",
    `-- Table count generated with --tables=${tableCount}.`,
    "with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')",
    "insert into public.restaurant_tables (restaurant_id, code, label)",
    "select restaurant.id, 'masa-' || table_no, 'Mesa ' || table_no",
    `from restaurant, generate_series(1, ${tableCount}) as table_no`,
    "on conflict (restaurant_id, code) do update set label = excluded.label;",
    ""
  ];

  demoExperience.categories.forEach((category) => {
    lines.push(
      "with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')",
      "insert into public.categories (id, restaurant_id, name_tr, name_es, name_en, order_index, is_active)",
      `select gen_random_uuid(), restaurant.id, ${sqlText(categoryName(category, "tr"))}, ${sqlText(categoryName(category, "es"))}, ${sqlText(categoryName(category, "en"))}, ${Number(category.order_index || 0)}, true`,
      "from restaurant",
      "where not exists (",
      "  select 1 from public.categories c",
      "  where c.restaurant_id = restaurant.id",
      `    and c.name_es = ${sqlText(categoryName(category, "es"))}`,
      ");",
      "with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')",
      "update public.categories c set",
      `  name_tr = ${sqlText(categoryName(category, "tr"))},`,
      `  name_en = ${sqlText(categoryName(category, "en"))},`,
      `  order_index = ${Number(category.order_index || 0)},`,
      "  is_active = true",
      "from restaurant",
      "where c.restaurant_id = restaurant.id",
      `  and c.name_es = ${sqlText(categoryName(category, "es"))};`,
      ""
    );
  });

  demoExperience.links.forEach((link) => {
    lines.push(
      "with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')",
      "insert into public.restaurant_links (restaurant_id, kind, label, url, order_index, is_active)",
      `select restaurant.id, ${sqlText(link.kind)}, ${sqlText(link.label)}, ${sqlText(link.url)}, ${Number(link.order_index || 0)}, true`,
      "from restaurant",
      "where not exists (",
      "  select 1 from public.restaurant_links l",
      "  where l.restaurant_id = restaurant.id",
      `    and l.kind = ${sqlText(link.kind)}`,
      ");",
      "with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')",
      "update public.restaurant_links l set",
      `  label = ${sqlText(link.label)},`,
      `  url = ${sqlText(link.url)},`,
      `  order_index = ${Number(link.order_index || 0)},`,
      "  is_active = true",
      "from restaurant",
      "where l.restaurant_id = restaurant.id",
      `  and l.kind = ${sqlText(link.kind)};`,
      ""
    );
  });

  demoExperience.products.forEach((product) => {
    const category = demoExperience.categories.find((item) => item.id === product.category_id);
    lines.push(
      "with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),",
      `category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = ${sqlText(categoryName(category, "es"))} limit 1)`,
      "insert into public.products (",
      "  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,",
      "  price, currency, image_url, ingredients, allergens, calories, spice_level,",
      "  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available",
      ")",
      `select restaurant.id, category.id, ${sqlText(productName(product, "tr"))}, ${sqlText(productName(product, "es"))}, ${sqlText(productName(product, "en"))},`,
      `  ${sqlText(productDescription(product, "tr"))}, ${sqlText(productDescription(product, "es"))}, ${sqlText(productDescription(product, "en"))},`,
      `  ${money(product.price)}, ${sqlText(product.currency || "EUR")}, ${sqlText(product.image_url)}, ${sqlJson(product.ingredients)}, ${sqlJson(product.allergens)}, ${Number(product.calories || 0)}, ${Number(product.spice_level || 0)},`,
      `  ${sqlText(productBadge(product, "tr"))}, ${sqlText(productBadge(product, "es"))}, ${sqlText(productBadge(product, "en"))}, ${bool(product.is_signature)}, ${bool(product.is_anchor)}, ${Number(product.sales_priority || 0)}, ${Number(product.order_index || 0)}, ${bool(product.is_available !== false)}`,
      "from restaurant, category",
      "where not exists (",
      "  select 1 from public.products p",
      "  where p.restaurant_id = restaurant.id",
      `    and p.name_es = ${sqlText(productName(product, "es"))}`,
      ");",
      "with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),",
      `category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = ${sqlText(categoryName(category, "es"))} limit 1)`,
      "update public.products p set",
      "  category_id = category.id,",
      `  name_tr = ${sqlText(productName(product, "tr"))},`,
      `  name_en = ${sqlText(productName(product, "en"))},`,
      `  description_tr = ${sqlText(productDescription(product, "tr"))},`,
      `  description_es = ${sqlText(productDescription(product, "es"))},`,
      `  description_en = ${sqlText(productDescription(product, "en"))},`,
      `  price = ${money(product.price)},`,
      `  currency = ${sqlText(product.currency || "EUR")},`,
      `  image_url = ${sqlText(product.image_url)},`,
      `  ingredients = ${sqlJson(product.ingredients)},`,
      `  allergens = ${sqlJson(product.allergens)},`,
      `  calories = ${Number(product.calories || 0)},`,
      `  spice_level = ${Number(product.spice_level || 0)},`,
      `  badge_tr = ${sqlText(productBadge(product, "tr"))},`,
      `  badge_es = ${sqlText(productBadge(product, "es"))},`,
      `  badge_en = ${sqlText(productBadge(product, "en"))},`,
      `  is_signature = ${bool(product.is_signature)},`,
      `  is_anchor = ${bool(product.is_anchor)},`,
      `  sales_priority = ${Number(product.sales_priority || 0)},`,
      `  order_index = ${Number(product.order_index || 0)},`,
      `  is_available = ${bool(product.is_available !== false)}`,
      "from restaurant, category",
      "where p.restaurant_id = restaurant.id",
      `  and p.name_es = ${sqlText(productName(product, "es"))};`,
      ""
    );
  });

  lines.push("commit;", "");
  return lines.join("\n");
}

await mkdir(outputDocs, { recursive: true });
await mkdir(outputSupabase, { recursive: true });
await writeFile(new URL("menu-export-demo.csv", outputDocs), buildCsv(), "utf8");
await writeFile(new URL("seed.demo-generated.sql", outputSupabase), buildSeedSql(), "utf8");

console.log("Generated docs/menu-export-demo.csv");
console.log(`Generated supabase/seed.demo-generated.sql with ${tableCount} tables`);
