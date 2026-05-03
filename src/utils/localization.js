import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "../config/appConfig.js";
import { repairMojibake } from "./text.js";

export function detectLanguage(defaultLanguage = DEFAULT_LANGUAGE) {
  const queryLanguage = new URLSearchParams(window.location.search).get("lang");
  if (SUPPORTED_LANGUAGES.includes(queryLanguage)) {
    try {
      localStorage.setItem("realKebabLanguage", queryLanguage);
    } catch {
      // Language still applies for the current visit.
    }
    return queryLanguage;
  }

  try {
    const savedLanguage = localStorage.getItem("realKebabLanguage");
    if (SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      return savedLanguage;
    }
  } catch {
    // Default language is enough when storage is unavailable.
  }

  return SUPPORTED_LANGUAGES.includes(defaultLanguage) ? defaultLanguage : DEFAULT_LANGUAGE;
}

export function localized(record, field, language) {
  if (!record || !record[field]) {
    return "";
  }

  return repairMojibake(record[field][language] || record[field].es || record[field].tr || record[field].en || "");
}
