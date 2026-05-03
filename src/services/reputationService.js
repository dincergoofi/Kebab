export function buildGoogleReviewUrl(restaurant) {
  if (restaurant.google_review_url) {
    return restaurant.google_review_url;
  }

  if (restaurant.google_place_id) {
    return `https://search.google.com/local/writereview?placeid=${restaurant.google_place_id}`;
  }

  return "https://www.google.com/search?q=Real+Kebab+Istanbul+reviews";
}

export function buildWhatsAppUrl(restaurant, message) {
  const number = restaurant.whatsapp_number || "";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getReputationAction(stars, restaurant, message) {
  return {
    primary: stars >= 4 ? "google" : "whatsapp",
    googleUrl: buildGoogleReviewUrl(restaurant),
    whatsappUrl: buildWhatsAppUrl(restaurant, message)
  };
}
