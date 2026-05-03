const MOJIBAKE_PATTERN = /[\u00C3\u00C4\u00C5\u00E2\uFFFD]/;

export function repairMojibake(value) {
  if (typeof value !== "string" || !MOJIBAKE_PATTERN.test(value)) {
    return value;
  }

  try {
    const bytes = Uint8Array.from(value, (char) => char.charCodeAt(0) & 0xff);
    const repaired = new TextDecoder("utf-8").decode(bytes);
    return repaired || value;
  } catch {
    return value;
  }
}

export function repairDeep(value) {
  if (Array.isArray(value)) {
    return value.map(repairDeep);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, repairDeep(item)]));
  }

  return repairMojibake(value);
}
