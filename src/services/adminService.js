import { hasSupabaseConfig, supabase } from "./supabaseClient.js";

function ensureSupabase() {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error("Supabase ayarlari eksik.");
  }
}

export async function getAdminSession() {
  ensureSupabase();
  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return session;
}

export function subscribeAdminAuth(callback) {
  if (!hasSupabaseConfig || !supabase) {
    return () => {};
  }

  const {
    data: { subscription }
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return () => subscription.unsubscribe();
}

export async function signInAdminWithPassword({ email, password }) {
  ensureSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw error;
  }

  return data.session;
}

export async function sendAdminMagicLink({ email, restaurantSlug }) {
  ensureSupabase();
  const redirectTo = `${window.location.origin}/admin/${restaurantSlug}`;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo
    }
  });

  if (error) {
    throw error;
  }
}

export async function signOutAdmin() {
  ensureSupabase();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function loadAdminWorkspace(restaurantSlug) {
  ensureSupabase();

  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", restaurantSlug)
    .single();

  if (restaurantError) {
    throw restaurantError;
  }

  const [categoriesResult, productsResult, linksResult, feedbackResult, leaderboardResult] = await Promise.all([
    supabase.from("categories").select("*").eq("restaurant_id", restaurant.id).order("order_index", { ascending: true }),
    supabase.from("products").select("*").eq("restaurant_id", restaurant.id).order("order_index", { ascending: true }),
    supabase.from("restaurant_links").select("*").eq("restaurant_id", restaurant.id).order("order_index", { ascending: true }),
    supabase.from("feedback").select("id, star_rating, platform, created_at", { count: "exact" }).eq("restaurant_id", restaurant.id).order("created_at", { ascending: false }).limit(5),
    supabase
      .from("game_leaderboard")
      .select("id, player_name, score, created_at", { count: "exact" })
      .eq("restaurant_id", restaurant.id)
      .order("score", { ascending: false })
      .limit(5)
  ]);

  const firstError = [
    categoriesResult.error,
    productsResult.error,
    linksResult.error,
    feedbackResult.error,
    leaderboardResult.error
  ].find(Boolean);

  if (firstError) {
    throw firstError;
  }

  return {
    restaurant,
    categories: categoriesResult.data || [],
    products: productsResult.data || [],
    links: linksResult.data || [],
    feedback: {
      total: feedbackResult.count || 0,
      latest: feedbackResult.data || []
    },
    leaderboard: {
      total: leaderboardResult.count || 0,
      latest: leaderboardResult.data || []
    }
  };
}

export async function updateRestaurantProfile(restaurantId, patch) {
  ensureSupabase();
  const { data, error } = await supabase.from("restaurants").update(patch).eq("id", restaurantId).select("*").single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateCategory(categoryId, patch) {
  ensureSupabase();
  const { data, error } = await supabase.from("categories").update(patch).eq("id", categoryId).select("*").single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateProduct(productId, patch) {
  ensureSupabase();
  const { data, error } = await supabase.from("products").update(patch).eq("id", productId).select("*").single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateRestaurantLink(linkId, patch) {
  ensureSupabase();
  const { data, error } = await supabase
    .from("restaurant_links")
    .update(patch)
    .eq("id", linkId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
