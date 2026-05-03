export function formatMoney(value, currency = "EUR", language = "es") {
  const locale = language === "en" ? "en-US" : language === "es" ? "es-ES" : "tr-TR";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency
  }).format(value);
}

export function formatMenuPrice(value, language = "es") {
  const locale = language === "en" ? "en-US" : language === "es" ? "es-ES" : "tr-TR";

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}
