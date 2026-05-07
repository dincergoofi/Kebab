/**
 * Parses free-text restaurant hours strings and determines open/closed status.
 *
 * Handles formats like:
 *   "Mar-Jue 13:00-16:00 · 20:00-00:00 · Vie-Sab hasta 00:30 · Dom hasta 00:00 · Lun cerrado"
 *   "Pzt-Cum 11:00-23:00 · Cmt-Paz 12:00-00:00"
 *   "Mon-Fri 11:00-22:00 · Sat-Sun 12:00-23:00"
 *
 * Returns: "open" | "closed" | "unknown"
 */

const DAY_MAP = {
  lun: 1,
  mar: 2,
  mie: 3,
  "mié": 3,
  jue: 4,
  vie: 5,
  sab: 6,
  "sáb": 6,
  dom: 0,
  pzt: 1,
  sal: 2,
  car: 3,
  "çar": 3,
  per: 4,
  cum: 5,
  cmt: 6,
  paz: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
  sun: 0
};

const CLOSED_WORDS = ["cerrado", "kapali", "kapalı", "closed", "ferme", "fermé"];

function parseDay(token) {
  return DAY_MAP[token.toLowerCase().trim()] ?? null;
}

function parseTime(token) {
  const match = (token || "").trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    return null;
  }

  return Number.parseInt(match[1], 10) * 60 + Number.parseInt(match[2], 10);
}

function expandDayRange(start, end) {
  const days = [];
  let current = start;

  while (current !== end) {
    days.push(current);
    current = (current + 1) % 7;
  }

  days.push(end);
  return days;
}

function minutesNow(now) {
  return now.getHours() * 60 + now.getMinutes();
}

function timeRangeCoversNow(fromMin, toMin, current) {
  if (toMin === 0) {
    return current >= fromMin;
  }

  if (toMin < fromMin) {
    return current >= fromMin || current < toMin;
  }

  return current >= fromMin && current < toMin;
}

export function getOpenStatus(hoursString, now = new Date()) {
  if (!hoursString || typeof hoursString !== "string") {
    return "unknown";
  }

  const todayDow = now.getDay();
  const current = minutesNow(now);
  const segments = hoursString
    .split("·")
    .map((segment) => segment.trim())
    .filter(Boolean);

  const parsed = [];
  let lastDays = null;

  for (const segment of segments) {
    const tokens = segment.split(/\s+/);
    const firstToken = tokens[0];
    const dayParts = firstToken.split("-");
    const startDay = parseDay(dayParts[0]);

    let days;
    let ruleText;

    if (startDay !== null) {
      const endDay = dayParts.length > 1 ? parseDay(dayParts[1]) ?? startDay : startDay;
      days = expandDayRange(startDay, endDay);
      ruleText = tokens.slice(1).join(" ").trim().toLowerCase();
      lastDays = days;
    } else {
      days = lastDays || null;
      ruleText = segment.trim().toLowerCase();
    }

    if (days) {
      parsed.push({ days, rule: ruleText });
    }
  }

  if (!parsed.length) {
    return "unknown";
  }

  const todayRules = parsed.filter((entry) => entry.days.includes(todayDow));

  if (!todayRules.length) {
    return "unknown";
  }

  for (const { rule } of todayRules) {
    if (CLOSED_WORDS.some((word) => rule.includes(word))) {
      return "closed";
    }

    const untilMatch = rule.match(/hasta\s+(\d{1,2}:\d{2})/i);
    if (untilMatch) {
      const until = parseTime(untilMatch[1]);
      if (until !== null) {
        const isEarlyMorning = until <= 3 * 60;
        const covers = isEarlyMorning ? current >= 18 * 60 || current < until : current < until;
        if (covers) {
          return "open";
        }
      }
      continue;
    }

    const rangeMatches = rule.match(/\d{1,2}:\d{2}-\d{1,2}:\d{2}/g);
    if (rangeMatches) {
      for (const range of rangeMatches) {
        const [fromStr, toStr] = range.split("-");
        const from = parseTime(fromStr);
        const to = parseTime(toStr);

        if (from !== null && to !== null && timeRangeCoversNow(from, to, current)) {
          return "open";
        }
      }
    }
  }

  return "closed";
}
