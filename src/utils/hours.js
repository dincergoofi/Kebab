import { repairMojibake } from "./text.js";

const DAY_MAP = {
  lun: 1,
  mar: 2,
  mie: 3,
  jue: 4,
  vie: 5,
  sab: 6,
  dom: 0,
  pzt: 1,
  sal: 2,
  car: 3,
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

const CLOSED_WORDS = ["cerrado", "kapali", "closed", "ferme"];

function cleanText(value) {
  return repairMojibake(String(value || ""))
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeCompare(value) {
  return cleanText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i");
}

function splitSegments(hoursString) {
  return cleanText(hoursString)
    .split(/\s*(?:·|•)\s*/)
    .map((segment) => cleanText(segment))
    .filter(Boolean);
}

function parseDay(token) {
  return DAY_MAP[normalizeCompare(token)] ?? null;
}

function parseTime(token) {
  const match = cleanText(token).match(/^(\d{1,2}):(\d{2})$/);
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

function parseHoursEntries(hoursString) {
  const segments = splitSegments(hoursString);
  const parsed = [];
  let lastDays = null;
  let lastLabel = null;

  for (const segment of segments) {
    const tokens = segment.split(/\s+/);
    const firstToken = tokens[0] || "";
    const dayParts = firstToken.split("-");
    const startDay = parseDay(dayParts[0]);

    let days = null;
    let label = null;
    let ruleText = "";

    if (startDay !== null) {
      const endDay = dayParts.length > 1 ? parseDay(dayParts[1]) ?? startDay : startDay;
      days = expandDayRange(startDay, endDay);
      label = cleanText(firstToken).replace(/\s*-\s*/g, " - ");
      ruleText = cleanText(tokens.slice(1).join(" "));
      lastDays = days;
      lastLabel = label;
    } else if (lastDays && lastLabel) {
      days = lastDays;
      label = lastLabel;
      ruleText = cleanText(segment);
    }

    if (days && label && ruleText) {
      parsed.push({ days, label, rule: ruleText });
    }
  }

  return parsed;
}

export function getHoursRows(hoursString, now = new Date()) {
  const parsed = parseHoursEntries(hoursString);
  const todayDow = now.getDay();
  const rows = [];

  for (const entry of parsed) {
    const previous = rows.at(-1);
    const sameGroup = previous && previous.label === entry.label && previous.days.join(",") === entry.days.join(",");

    if (sameGroup) {
      previous.parts.push(entry.rule);
      continue;
    }

    rows.push({
      label: entry.label,
      days: entry.days,
      parts: [entry.rule],
      isToday: entry.days.includes(todayDow)
    });
  }

  return rows.map((row) => ({
    label: row.label,
    detail: row.parts.join(" / "),
    isToday: row.isToday
  }));
}

export function getOpenStatus(hoursString, now = new Date()) {
  if (!hoursString || typeof hoursString !== "string") {
    return "unknown";
  }

  const todayDow = now.getDay();
  const current = minutesNow(now);
  const todayRules = parseHoursEntries(hoursString).filter((entry) => entry.days.includes(todayDow));

  if (!todayRules.length) {
    return "unknown";
  }

  for (const { rule } of todayRules) {
    const normalizedRule = normalizeCompare(rule);

    if (CLOSED_WORDS.some((word) => normalizedRule.includes(word))) {
      return "closed";
    }

    const untilMatch = normalizedRule.match(/(?:hasta|kadar|until)\s+(\d{1,2}:\d{2})/i);
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

    const rangeMatches = normalizedRule.match(/\d{1,2}:\d{2}-\d{1,2}:\d{2}/g);
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
