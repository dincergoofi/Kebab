import { DEFAULT_RESTAURANT_SLUG, DEFAULT_TABLE_CODE } from "../config/appConfig.js";

export function parseEntryPoint(pathname) {
  const parts = pathname
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);

  const isAdminMode = parts.includes("admin");
  const restaurantSlug =
    parts.find((part) => part !== "admin" && !part.startsWith("masa-")) || DEFAULT_RESTAURANT_SLUG;
  const tableCode = parts.find((part) => part.startsWith("masa-")) || DEFAULT_TABLE_CODE;

  return {
    restaurantSlug,
    tableCode,
    isAdminMode
  };
}
