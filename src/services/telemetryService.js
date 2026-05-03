import { hasSupabaseConfig, supabase } from "./supabaseClient.js";

export async function createGuestSession({ restaurantSlug, tableCode, language }) {
  if (!hasSupabaseConfig) {
    return `demo-session-${Date.now()}`;
  }

  const { data, error } = await supabase.rpc("create_guest_session", {
    p_restaurant_slug: restaurantSlug,
    p_table_code: tableCode,
    p_language: language,
    p_user_agent: navigator.userAgent
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function trackEvent({ sessionId, eventName, metadata = {} }) {
  if (!sessionId || !hasSupabaseConfig) {
    return;
  }

  try {
    await supabase.rpc("track_session_event", {
      p_session_id: sessionId,
      p_event_name: eventName,
      p_metadata: metadata
    });
  } catch {
    return;
  }
}
