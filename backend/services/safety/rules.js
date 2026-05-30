// services/safety/rules.js
// Curated rule library - v1 is rules-only. Each rule has a stable ID for telemetry.
// Languages covered: English, Roman-Urdu (Latin-script Urdu), Urdu (Arabic script).
//
// To add a new category or language: append a rule object with a unique id.
// To tune: adjust patterns or move between hard/soft tiers.
//
// IMPORTANT: regex patterns must NOT capture the user's text into telemetry.
// Only rule IDs propagate forward.

// Negation tokens - if any appears within NEGATION_WINDOW tokens BEFORE a hard
// pattern, the rule is suppressed. Prevents "I'd never kill myself" misfires.
const NEGATION_TOKENS_EN = [
  "never", "wouldn't", "would not", "won't", "will not",
  "don't", "do not", "didn't", "did not", "not",
  "no",
];
const NEGATION_TOKENS_UR_ROMAN = [
  "nahi", "nahin", "kabhi nahi", "mat",
];
const NEGATION_TOKENS_UR = [
  "نہیں", "کبھی نہیں", "مت",
];
const NEGATION_TOKENS = [
  ...NEGATION_TOKENS_EN,
  ...NEGATION_TOKENS_UR_ROMAN,
  ...NEGATION_TOKENS_UR,
];
const NEGATION_WINDOW = 4; // tokens

// Third-person / hypothetical markers - if present anywhere near a hard
// pattern, downgrade severity. Cheap, conservative.
const THIRD_PERSON_MARKERS = [
  /\bmy (friend|sister|cousin|aunt|mom|mother|wife|husband)\b/i,
  /\bsomeone (i know|else)\b/i,
  /\bshe (said|told|wrote)\b/i,
  /\bhe (said|told|wrote)\b/i,
];
const HYPOTHETICAL_MARKERS = [
  /\bwhat if\b/i,
  /\bimagine if\b/i,
  /\bhypothetically\b/i,
  /\bin a (book|movie|story|song)\b/i,
];

// ---------------------------------------------------------------------------
// Rule definitions
// Each rule: { id, category, tier, lang, pattern, requiresFirstPerson? }
//   tier: "hard" → severity high; "soft" → severity medium
// ---------------------------------------------------------------------------
const RULES = [
  // ── SELF-HARM / SUICIDE IDEATION ───────────────────────────────────────
  {
    id: "sh.en.explicit.kill_myself",
    category: "self_harm",
    tier: "hard",
    lang: "en",
    pattern: /\b(kill|hurt|harm|end)\s+myself\b/i,
    requiresFirstPerson: true,
  },
  {
    id: "sh.en.explicit.end_my_life",
    category: "self_harm",
    tier: "hard",
    lang: "en",
    pattern: /\b(end|take)\s+(my|my own)\s+life\b/i,
    requiresFirstPerson: true,
  },
  {
    id: "sh.en.explicit.suicide_ideation",
    category: "self_harm",
    tier: "hard",
    lang: "en",
    pattern: /\b(commit\s+suicide|suicidal|want\s+to\s+die|wanna\s+die)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "sh.en.passive.dont_want_to_wake",
    category: "self_harm",
    tier: "hard",
    lang: "en",
    pattern: /\b(don't|do not|dont)\s+want\s+to\s+wake\s+up\b/i,
    requiresFirstPerson: true,
  },
  {
    id: "sh.en.passive.disappear",
    category: "self_harm",
    tier: "soft",
    lang: "en",
    pattern: /\b(better off (without|if i was|dead)|disappear forever|not be here)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "sh.ur.roman.khudkushi",
    category: "self_harm",
    tier: "hard",
    lang: "ur-roman",
    pattern: /\bkhudkushi\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "sh.ur.roman.mar_jaun",
    category: "self_harm",
    tier: "hard",
    lang: "ur-roman",
    pattern: /\b(mar\s*jaun|mar\s*jaaun|marna\s*chahti|marna\s*chahta)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "sh.ur.script.khudkushi",
    category: "self_harm",
    tier: "hard",
    lang: "ur",
    pattern: /خودکشی/,
    requiresFirstPerson: false,
  },
  {
    id: "sh.ur.script.mar_jaun",
    category: "self_harm",
    tier: "hard",
    lang: "ur",
    pattern: /(مر\s*جاؤں|مرنا\s*چاہتی|مرنا\s*چاہتا)/,
    requiresFirstPerson: false,
  },

  // ── OBSTETRIC EMERGENCY (ACOG red flags) ───────────────────────────────
  {
    id: "obs.en.heavy_bleeding",
    category: "obstetric_emergency",
    tier: "hard",
    lang: "en",
    pattern: /\b(heavy\s+bleeding|bleeding\s+(heavily|a\s+lot)|hemorrhag\w*|soaking\s+(a\s+)?pad)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.en.severe_headache_vision",
    category: "obstetric_emergency",
    tier: "hard",
    lang: "en",
    pattern: /\b(severe|bad|terrible|worst)\s+(headache|migraine)\b.*\b(vision|seeing\s+spots|blurry|blurred)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.en.no_fetal_movement",
    category: "obstetric_emergency",
    tier: "hard",
    lang: "en",
    pattern: /\b(baby|fetus)\s+(isn't|is\s+not|not|stopped)\s+(moving|kicking)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.en.water_broke_early",
    category: "obstetric_emergency",
    tier: "hard",
    lang: "en",
    pattern: /\b(water\s+broke|waters\s+broke|membranes\s+ruptured)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.en.severe_abdominal_pain",
    category: "obstetric_emergency",
    tier: "hard",
    lang: "en",
    pattern: /\b(severe|crushing|unbearable)\s+(abdominal|stomach|belly)\s+pain\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.ur.roman.bleeding",
    category: "obstetric_emergency",
    tier: "hard",
    lang: "ur-roman",
    pattern: /\b(khoon\s+bohat|zyada\s+khoon|bleeding\s+bohat)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.ur.script.bleeding",
    category: "obstetric_emergency",
    tier: "hard",
    lang: "ur",
    pattern: /(زیادہ\s*خون|بہت\s*خون)/,
    requiresFirstPerson: false,
  },

  // ── INFANT DISTRESS (WHO IMCI red signs) ───────────────────────────────
  {
    id: "inf.en.not_breathing",
    category: "infant_distress",
    tier: "hard",
    lang: "en",
    pattern: /\b(baby|infant|newborn|toddler|child)\s+(isn't|is\s+not|not|stopped|wasn't)\s+breathing\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "inf.en.vomiting_blood",
    category: "infant_distress",
    tier: "hard",
    lang: "en",
    // "my toddler is vomiting blood" / "baby threw up blood" / "spitting up blood"
    pattern: /\b(baby|infant|newborn|toddler|child|son|daughter)\b[\s\S]{0,40}\b(vomit\w*|throw\w*\s+up|threw\s+up|spitt\w*\s+up)\b[\s\S]{0,20}\bblood/i,
    requiresFirstPerson: false,
  },
  {
    id: "inf.en.bleeding",
    category: "infant_distress",
    tier: "hard",
    lang: "en",
    pattern: /\b(baby|infant|newborn|toddler|child|son|daughter)\b[\s\S]{0,40}\b(bleeding\s+(heavily|a\s+lot|badly|nonstop|won't\s+stop)|hemorrhag\w+)/i,
    requiresFirstPerson: false,
  },
  {
    id: "inf.en.severe_dehydration",
    category: "infant_distress",
    tier: "hard",
    lang: "en",
    pattern: /\b(baby|infant|newborn|toddler|child)\b[\s\S]{0,30}\b(severely\s+dehydrated|hasn't\s+(eaten|drunk|peed)\s+(in|for)\s+\w+|won't\s+wake\s+(up|to\s+feed))/i,
    requiresFirstPerson: false,
  },
  {
    id: "inf.en.blue_lips",
    category: "infant_distress",
    tier: "hard",
    lang: "en",
    pattern: /\b(blue|bluish|purple)\s+(lips|skin|face)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "inf.en.unresponsive",
    category: "infant_distress",
    tier: "hard",
    lang: "en",
    pattern: /\b(baby|infant)\s+(unresponsive|won't\s+wake|wont\s+wake|limp)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "inf.en.seizure",
    category: "infant_distress",
    tier: "hard",
    lang: "en",
    pattern: /\b(baby|infant|child)\b.*\b(seizure|convulsion|fit|shaking\s+uncontrollabl)/i,
    requiresFirstPerson: false,
  },
  {
    id: "inf.ur.roman.saans",
    category: "infant_distress",
    tier: "hard",
    lang: "ur-roman",
    pattern: /\b(bachi|bacha|baby)\b.*\b(saans\s+nahi|saans\s+nai|saans\s+nahin)\b/i,
    requiresFirstPerson: false,
  },

  // ── DOMESTIC VIOLENCE ──────────────────────────────────────────────────
  // Single broad pattern for present/past/progressive verb forms of hitting.
  // Covers: "he hit me", "my husband beats me", "he is beating me", "punched me".
  {
    id: "dv.en.physical_violence",
    category: "domestic_violence",
    tier: "hard",
    lang: "en",
    pattern: /\b(he|she|they|husband|wife|partner|boyfriend|girlfriend|mother[-\s]?in[-\s]?law|father[-\s]?in[-\s]?law)\b[\s\S]{0,20}\b(is\s+|just\s+|keeps?\s+|always\s+)?(hit\w*|beat\w*|punch\w*|slap\w*|kick\w*|strangl\w*|chok\w*|hurt\w*|throw\w*\s+(things\s+)?at)\b[\s\S]{0,10}\bme\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "dv.en.afraid_of_him",
    category: "domestic_violence",
    tier: "hard",
    lang: "en",
    pattern: /\b(scared|afraid|terrified)\s+of\s+(him|her|my\s+(husband|wife|partner|boyfriend|girlfriend))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "dv.en.threatening",
    category: "domestic_violence",
    tier: "hard",
    lang: "en",
    pattern: /\b(threatened|threatening|threatens)\s+(to\s+kill|to\s+hurt|to\s+beat)\s+me\b/i,
    requiresFirstPerson: false,
  },
  // Imminent-threat patterns - "HE IS COMING WITH A BELT", "he has a knife"
  {
    id: "dv.en.weapon_imminent",
    category: "domestic_violence",
    tier: "hard",
    lang: "en",
    pattern: /\b(coming|chasing|after|approaching|charging)\s+(at\s+me|after\s+me|towards\s+me|with(\s+a)?)\b[\s\S]{0,30}\b(belt|knife|gun|stick|weapon|bat|hammer|rod|iron|chain|wire)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "dv.en.weapon_present",
    category: "domestic_violence",
    tier: "hard",
    lang: "en",
    // Requires a violent-actor pronoun nearby so "I'm cooking with a knife" doesn't fire.
    pattern: /\b(he|she|husband|wife|partner|boyfriend|girlfriend)\b[\s\S]{0,30}\b(has|holding|grabbed|picked\s+up|got)\s+(a\s+)?(belt|knife|gun|stick|weapon|bat|hammer|rod|chain)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "dv.en.locked_in_trapped",
    category: "domestic_violence",
    tier: "hard",
    lang: "en",
    pattern: /\b(locked\s+(me\s+)?in|won't\s+let\s+me\s+(leave|out)|trapped\s+(in\s+the\s+house|here))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "dv.en.abuse_general",
    category: "domestic_violence",
    tier: "soft",
    lang: "en",
    pattern: /\b(domestic\s+(abuse|violence)|abuse(d|s|ing)?\s+me|abusive\s+(husband|partner|relationship))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "dv.ur.roman.maara",
    category: "domestic_violence",
    tier: "hard",
    lang: "ur-roman",
    pattern: /\b(shohar|husband|partner)\s+(ne|nay)\s+(maara|maar\s*diya|maarta)\b/i,
    requiresFirstPerson: false,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Tiebreak order when multiple categories have equal hit counts.
// Earlier = wins. Rationale in comment above the aggregator.
const CATEGORY_TIEBREAK = [
  "infant_distress",
  "domestic_violence",
  "self_harm",
  "obstetric_emergency",
  "other_crisis",
];

function tokenize(text) {
  // Cheap whitespace + punctuation split. Good enough for negation windows.
  return text.toLowerCase().split(/[\s.,!?;:'"()\[\]/\\]+/).filter(Boolean);
}

function findNegationBefore(text, matchIndex) {
  // Look at the N tokens immediately preceding matchIndex.
  const lower = text.toLowerCase();
  const before = lower.substring(0, matchIndex);
  const beforeTokens = tokenize(before).slice(-NEGATION_WINDOW);
  for (const token of beforeTokens) {
    if (NEGATION_TOKENS.includes(token)) return true;
  }
  // Also check multi-word negations
  const tail = before.slice(-50); // last 50 chars
  for (const neg of NEGATION_TOKENS) {
    if (neg.includes(" ") && tail.includes(neg)) return true;
  }
  return false;
}

function hasThirdPersonMarker(text) {
  return THIRD_PERSON_MARKERS.some((re) => re.test(text));
}

function hasHypotheticalMarker(text) {
  return HYPOTHETICAL_MARKERS.some((re) => re.test(text));
}

function hasFirstPersonContext(text) {
  // Cheap heuristic: presence of first-person pronouns near the match.
  // For Urdu: مجھے / میں. For Roman-Urdu: main / mein / mujhe.
  return /\b(i|i'm|im|i've|ive|i'd|id|me|my|myself|main|mein|mujhe)\b/i.test(text)
    || /(میں|مجھے)/.test(text);
}

// ---------------------------------------------------------------------------
// Public: evaluate a window of conversation turns.
// ---------------------------------------------------------------------------

/**
 * @param {string} windowText - concatenated last-N user turns
 * @returns {{
 *   severity: "none"|"low"|"medium"|"high",
 *   category: string,
 *   confidence: number,
 *   triggeringRuleIds: string[],
 *   actionRecommended: "none"|"soft_resource"|"confirm_then_offer_call"|"immediate_offer_call"
 * }}
 */
function evaluateWindow(windowText) {
  if (!windowText || typeof windowText !== "string") {
    return emptyResult();
  }

  const fired = [];
  const thirdPerson = hasThirdPersonMarker(windowText);
  const hypothetical = hasHypotheticalMarker(windowText);
  const firstPerson = hasFirstPersonContext(windowText);

  for (const rule of RULES) {
    // Reset regex lastIndex (in case any global flag sneaks in)
    rule.pattern.lastIndex = 0;
    const match = rule.pattern.exec(windowText);
    if (!match) continue;

    // Negation suppression - only for first-person rules
    if (rule.requiresFirstPerson && findNegationBefore(windowText, match.index)) {
      continue;
    }

    // First-person requirement
    if (rule.requiresFirstPerson && !firstPerson) {
      continue;
    }

    // Downgrade hard rules to soft if obviously third-person or hypothetical.
    // EXCEPTION: domestic_violence rules inherently match a third-party actor
    // ("he hit me", "my husband beats me") - the third-person marker IS the
    // abuser, not a separate person the user is reporting about. Never
    // downgrade DV.
    let effectiveTier = rule.tier;
    if (
      effectiveTier === "hard" &&
      rule.category !== "domestic_violence" &&
      (thirdPerson || hypothetical)
    ) {
      effectiveTier = "soft";
    }

    fired.push({ rule, effectiveTier });
  }

  if (fired.length === 0) return emptyResult();

  // Aggregate: take highest-tier hit; if tie, take first by index.
  const hardHits = fired.filter((f) => f.effectiveTier === "hard");
  const useHits = hardHits.length > 0 ? hardHits : fired;

  // Category: dominant by hit-count. On a tie, prefer the more SPECIFIC
  // category - patterns that require a specific subject (baby, attacker) beat
  // generic ones. Example: "my baby is bleeding heavily" matches both the
  // infant_distress rule (subject = baby) and the generic obstetric bleeding
  // rule; the tie-break correctly picks infant.
  const categoryCounts = {};
  for (const f of useHits) {
    categoryCounts[f.rule.category] = (categoryCounts[f.rule.category] || 0) + 1;
  }
  const category = Object.entries(categoryCounts).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return CATEGORY_TIEBREAK.indexOf(a[0]) - CATEGORY_TIEBREAK.indexOf(b[0]);
  })[0][0];

  const severity = hardHits.length > 0 ? "high" : "medium";
  const actionRecommended =
    severity === "high"
      ? (category === "infant_distress" || category === "obstetric_emergency"
          ? "immediate_offer_call"
          : "confirm_then_offer_call")
      : "soft_resource";

  // Confidence: rough proxy - 0.9 for hard, 0.55 for soft, +0.05 per extra hit (cap 0.99)
  let confidence = hardHits.length > 0 ? 0.9 : 0.55;
  confidence = Math.min(0.99, confidence + Math.max(0, useHits.length - 1) * 0.05);

  return {
    severity,
    category,
    confidence,
    triggeringRuleIds: fired.map((f) => f.rule.id),
    actionRecommended,
  };
}

function emptyResult() {
  return {
    severity: "none",
    category: "none",
    confidence: 0,
    triggeringRuleIds: [],
    actionRecommended: "none",
  };
}

module.exports = {
  evaluateWindow,
  RULES, // exported for test introspection only - do not mutate
  NEGATION_WINDOW,
};
