import { demoExperience } from "../data/demoExperience.js";
import { hasSupabaseConfig, supabase } from "./supabaseClient.js";
import { repairDeep } from "../utils/text.js";

function mapCategory(row) {
  return repairDeep({
    id: row.id,
    name: {
      tr: row.name_tr,
      es: row.name_es,
      en: row.name_en
    },
    order_index: row.order_index
  });
}

function mapProduct(row) {
  return repairDeep({
    id: row.id,
    category_id: row.category_id,
    name: {
      tr: row.name_tr,
      es: row.name_es,
      en: row.name_en
    },
    description: {
      tr: row.description_tr,
      es: row.description_es,
      en: row.description_en
    },
    price: Number(row.price),
    currency: row.currency,
    image_url: row.image_url,
    ingredients: row.ingredients || {},
    allergens: row.allergens || [],
    calories: row.calories ? Number(row.calories) : null,
    spice_level: Number(row.spice_level || 0),
    badge: {
      tr: row.badge_tr,
      es: row.badge_es,
      en: row.badge_en
    },
    is_signature: row.is_signature,
    is_anchor: row.is_anchor,
    sales_priority: row.sales_priority,
    order_index: row.order_index,
    is_available: row.is_available
  });
}

function mapLink(row) {
  return repairDeep({
    id: row.id,
    kind: row.kind,
    label: row.label,
    url: row.url,
    order_index: row.order_index
  });
}

function mapRestaurant(row) {
  return repairDeep({
    ...row,
    tagline: {
      tr: row.tagline_tr || "",
      es: row.tagline_es || "",
      en: row.tagline_en || ""
    }
  });
}

function readDemoLeaderboard() {
  try {
    const saved = JSON.parse(localStorage.getItem("realKebabDemoLeaderboard") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function writeDemoLeaderboard(entries) {
  try {
    localStorage.setItem("realKebabDemoLeaderboard", JSON.stringify(entries));
  } catch {
    // Demo scores remain visible for the current session only.
  }
}

function loadDemoExperience() {
  return {
    ...demoExperience,
    leaderboard: [...readDemoLeaderboard(), ...demoExperience.leaderboard]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
  };
}

function loadDemoLeaderboard() {
  return [...readDemoLeaderboard(), ...demoExperience.leaderboard]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function createDemoGameResult({ playerName, score }) {
  const entry = {
    id: `demo-game-${Date.now()}`,
    player_name: playerName,
    score,
    created_at: new Date().toISOString()
  };
  const nextLeaderboard = [entry, ...readDemoLeaderboard()]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  writeDemoLeaderboard(nextLeaderboard);

  return {
    leaderboard_id: entry.id,
    promo_code: null
  };
}

function isRecoverableSupabaseError(error) {
  const code = error?.code;
  const message = `${error?.message || ""} ${error?.details || ""}`.toLowerCase();

  return (
    code === "PGRST202" ||
    code === "PGRST205" ||
    message.includes("could not find the table") ||
    message.includes("could not find the function") ||
    message.includes("schema cache") ||
    message.includes("failed to fetch") ||
    message.includes("networkerror")
  );
}

function warnDemoFallback(scope, error) {
  if (import.meta.env.DEV) {
    console.warn(`[Real Kebab] Supabase ${scope} failed; using demo fallback.`, error);
  }
}

async function resolveRestaurantId(restaurantSlug) {
  const { data, error } = await supabase
    .from("restaurants")
    .select("id")
    .eq("slug", restaurantSlug)
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}

export async function loadExperience(restaurantSlug) {
  if (!hasSupabaseConfig) {
    return loadDemoExperience();
  }

  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", restaurantSlug)
    .single();

  if (restaurantError) {
    if (isRecoverableSupabaseError(restaurantError)) {
      warnDemoFallback("experience load", restaurantError);
      return loadDemoExperience();
    }

    throw restaurantError;
  }

  const requests = [
    supabase
      .from("categories")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .eq("is_active", true)
      .order("order_index", { ascending: true }),
    supabase
      .from("products")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .eq("is_available", true)
      .order("order_index", { ascending: true }),
    supabase
      .from("game_leaderboard")
      .select("id, player_name, score, created_at")
      .eq("restaurant_id", restaurant.id)
      .order("score", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("restaurant_links")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .eq("is_active", true)
      .order("order_index", { ascending: true })
  ];

  const [
    { data: categories, error: categoriesError },
    { data: products, error: productsError },
    { data: leaderboard, error: leaderboardError },
    { data: links, error: linksError }
  ] = await Promise.all(requests);

  if (categoriesError || productsError || leaderboardError || linksError) {
    const firstError = categoriesError || productsError || leaderboardError || linksError;

    if (isRecoverableSupabaseError(firstError)) {
      warnDemoFallback("related data load", firstError);
      return loadDemoExperience();
    }

    throw firstError;
  }

  return {
    source: "supabase",
    restaurant: mapRestaurant(restaurant),
    categories: categories.map(mapCategory),
    products: products.map(mapProduct),
    links: links.map(mapLink),
    leaderboard
  };
}

export async function loadLeaderboard(restaurantSlug) {
  if (!hasSupabaseConfig) {
    return loadDemoLeaderboard();
  }

  let restaurantId;
  try {
    restaurantId = await resolveRestaurantId(restaurantSlug);
  } catch (error) {
    if (isRecoverableSupabaseError(error)) {
      warnDemoFallback("leaderboard restaurant lookup", error);
      return loadDemoLeaderboard();
    }

    throw error;
  }

  const { data, error } = await supabase
    .from("game_leaderboard")
    .select("id, player_name, score, created_at")
    .eq("restaurant_id", restaurantId)
    .order("score", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    if (isRecoverableSupabaseError(error)) {
      warnDemoFallback("leaderboard load", error);
      return loadDemoLeaderboard();
    }

    throw error;
  }

  return data || [];
}

export async function submitFeedback({ restaurantSlug, tableCode, stars, comment, platform, language, sessionId }) {
  if (!hasSupabaseConfig) {
    return { id: `demo-feedback-${Date.now()}` };
  }

  const { data, error } = await supabase.rpc("create_feedback", {
    p_restaurant_slug: restaurantSlug,
    p_table_code: tableCode,
    p_star_rating: stars,
    p_comment: comment,
    p_platform: platform,
    p_language: language,
    p_user_agent: navigator.userAgent,
    p_session_id: sessionId
  });

  if (error) {
    if (isRecoverableSupabaseError(error)) {
      warnDemoFallback("feedback submit", error);
      return { id: `demo-feedback-${Date.now()}` };
    }

    throw error;
  }

  return { id: data };
}

export async function submitGameResult({ restaurantSlug, tableCode, playerName, score }) {
  if (!hasSupabaseConfig) {
    return createDemoGameResult({ playerName, score });
  }

  const { data, error } = await supabase.rpc("create_game_result", {
    p_restaurant_slug: restaurantSlug,
    p_table_code: tableCode,
    p_player_name: playerName,
    p_score: score
  });

  if (error) {
    if (isRecoverableSupabaseError(error)) {
      warnDemoFallback("game result submit", error);
      return createDemoGameResult({ playerName, score });
    }

    throw error;
  }

  return data?.[0] || { leaderboard_id: null, promo_code: null };
}
