// services/safety/rules.js
// Comprehensive emergency rule library for Wombly maternal-health app.
// Languages: English, Roman-Urdu, Urdu (Arabic script).
//
// Categories:
//   self_harm          – suicide/self-injury ideation
//   obstetric_emergency – pregnancy/birth crisis (maternal)
//   infant_distress    – baby/toddler medical emergency
//   domestic_violence  – abuse, threats, physical danger
//
// Tiers:
//   hard → severity "high"  → immediate_offer_call  (obstetric/infant)
//                           → confirm_then_offer_call (self_harm / DV)
//   soft → severity "medium" → soft_resource (empathetic check-in only)

const NEGATION_TOKENS_EN = [
  "never", "wouldn't", "would not", "won't", "will not",
  "don't", "do not", "didn't", "did not", "not", "no",
  // Apostrophe-free informal spellings common in this user base (Roman Urdu + casual typing)
  "dont", "wont", "didnt", "wouldnt", "cant", "shouldnt",
];
const NEGATION_TOKENS_UR_ROMAN = ["nahi", "nahin", "kabhi nahi", "mat"];
const NEGATION_TOKENS_UR   = ["نہیں", "کبھی نہیں", "مت"];
const NEGATION_TOKENS = [
  ...NEGATION_TOKENS_EN,
  ...NEGATION_TOKENS_UR_ROMAN,
  ...NEGATION_TOKENS_UR,
];
const NEGATION_WINDOW = 4; // tokens before the match to check

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
// RULES
// ---------------------------------------------------------------------------
const RULES = [

  // ══════════════════════════════════════════════════════════════════════════
  // SELF-HARM / SUICIDE IDEATION
  // ══════════════════════════════════════════════════════════════════════════

  // -- English hard rules --
  {
    id: "sh.en.kill_myself",
    category: "self_harm", tier: "hard", lang: "en",
    pattern: /\b(kill|hurt|harm|end)\s+myself\b/i,
    requiresFirstPerson: true,
  },
  {
    id: "sh.en.end_my_life",
    category: "self_harm", tier: "hard", lang: "en",
    pattern: /\b(end|take)\s+(my|my own)\s+life\b/i,
    requiresFirstPerson: true,
  },
  {
    id: "sh.en.suicide_ideation",
    category: "self_harm", tier: "hard", lang: "en",
    // commit suicide / suicidal / want to die / wanna die / planning to die
    pattern: /\b(commit\s+suicide|suicidal|want\s+to\s+die|wanna\s+die|planning\s+to\s+(kill|end|take)\s+(my|myself))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "sh.en.end_it_all",
    category: "self_harm", tier: "hard", lang: "en",
    // "end it all", "end everything", "make it all stop"
    pattern: /\b(end|finish|stop)\s+it\s+all\b|\bend\s+everything\b|\bmake\s+it\s+all\s+(stop|go\s+away)\b/i,
    requiresFirstPerson: true,
  },
  {
    id: "sh.en.overdose",
    category: "self_harm", tier: "hard", lang: "en",
    // "take all my pills/tablets/medicine", "overdose on", "going to overdose"
    pattern: /\b(take|took|swallow)\s+all\s+(my|the)\s+(pills?|tablets?|medicines?|meds?)\b|\boverdose\b/i,
    requiresFirstPerson: true,
  },
  {
    id: "sh.en.cutting",
    category: "self_harm", tier: "hard", lang: "en",
    // "cut myself", "been cutting", "self-harm", "self harm"
    pattern: /\b(cut(ting)?\s+myself|been\s+cutting|self[-\s]harm(ing)?)\b/i,
    requiresFirstPerson: true,
  },
  {
    id: "sh.en.dont_want_to_wake",
    category: "self_harm", tier: "hard", lang: "en",
    pattern: /\b(don'?t|do\s+not|dont)\s+want\s+to\s+wake\s+up\b/i,
    requiresFirstPerson: true,
  },
  {
    id: "sh.en.no_reason_to_live",
    category: "self_harm", tier: "hard", lang: "en",
    // "no reason to live", "nothing to live for", "can't go on", "can't do this anymore" + life
    pattern: /\b(no\s+reason\s+to\s+live|nothing\s+to\s+live\s+for|can'?t\s+go\s+on\b.*\b(life|living)|can'?t\s+(do|face)\s+this\s+anymore)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "sh.en.wish_dead",
    category: "self_harm", tier: "hard", lang: "en",
    // "wish I was dead", "wish I were dead", "wish I could die"
    pattern: /\bwish\s+i\s+(was|were|could\s+be)\s+dead\b/i,
    requiresFirstPerson: true,
  },
  {
    id: "sh.en.method_hang",
    category: "self_harm", tier: "hard", lang: "en",
    pattern: /\b(hang\s+myself|hanging\s+myself|going\s+to\s+hang|plan\s+(to\s+)?hang\s+myself)\b/i,
    requiresFirstPerson: true,
  },
  {
    id: "sh.en.method_jump",
    category: "self_harm", tier: "hard", lang: "en",
    pattern: /\b(jump\s+off\b[\s\S]{0,30}\b(roof|building|bridge|window|balcony|cliff|ledge)|going\s+to\s+jump\s+(off|from)\b|plan\s+(to\s+)?jump\s+(off|from)\b)\b/i,
    requiresFirstPerson: true,
  },
  {
    id: "sh.en.nobody_miss_me",
    category: "self_harm", tier: "hard", lang: "en",
    // "no one would miss me", "world would be better without me", "everyone better off without me"
    pattern: /\b(no\s+one\s+(would|will)\s+(miss|care)\s+(me\s+)?(if\s+i|about\s+me)|nobody\s+(would|will)\s+(miss|care)\s+(me\s+)?(if\s+i|about\s+me)|world\s+would\s+be\s+better\s+without\s+me|everyone\s+(would\s+be\s+better\s+off|is\s+better\s+off)\s+(without\s+me|if\s+i\s+(was|were|am)\s+(gone|dead)))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "sh.en.harm_baby_thoughts",
    category: "self_harm", tier: "hard", lang: "en",
    // Postpartum psychosis intrusive thoughts – routes to mental-health resources, not infant emergency.
    pattern: /\b(want\s+to\s+(hurt|harm|kill|shake|drop)\s+(my\s+)?(baby|infant|newborn)|thoughts?\s+(of|about)\s+(hurting|harming|killing|shaking)\s+(my\s+)?(baby|infant|newborn)|scared\s+(i'?ll|i\s+will|i\s+might|to)\s+(hurt|harm|drop|shake)\s+(my\s+)?(baby|infant|newborn)|afraid\s+(i'?ll|i\s+will|i\s+might)\s+(hurt|harm|drop)\s+(my\s+)?(baby|infant|newborn))\b/i,
    requiresFirstPerson: true,
  },

  // -- English soft rules --
  {
    id: "sh.en.passive.disappear",
    category: "self_harm", tier: "soft", lang: "en",
    pattern: /\b(better\s+off\s+(without\s+me|if\s+i\s+was\s+gone|dead)|disappear\s+forever|not\s+be\s+here\s+anymore|wish\s+i\s+was\s+never\s+born)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "sh.en.passive.tired_of_living",
    category: "self_harm", tier: "soft", lang: "en",
    // "tired of living", "tired of life", "so tired of everything"
    pattern: /\b(tired\s+of\s+(living|life|being\s+alive)|living\s+is\s+(pointless|hopeless|too\s+hard))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "sh.en.passive.cant_take_anymore",
    category: "self_harm", tier: "soft", lang: "en",
    pattern: /\b(can'?t\s+take\s+(it|this|life|everything)\s+anymore|can'?t\s+handle\s+(it|this|life)\s+anymore|just\s+want\s+(it\s+all|everything)\s+to\s+end|don'?t\s+see\s+the\s+point\s+(of\s+)?(anymore|living|going\s+on)|no\s+point\s+(in\s+going\s+on|going\s+on\s+anymore))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "sh.en.passive.giving_up",
    category: "self_harm", tier: "soft", lang: "en",
    pattern: /\b(giving\s+up\s+on\s+(life|everything|living)|given\s+up\s+on\s+(life|everything|living)|feel\s+like\s+giving\s+up\s+on\s+(life|everything)|thought\s+about\s+(giving\s+up\s+on\s+life|ending\s+it)|can'?t\s+(keep|go)\s+(going|on)\s+(like\s+this|anymore)\b.{0,30}\b(life|living))\b/i,
    requiresFirstPerson: false,
  },

  // -- Roman Urdu rules --
  {
    id: "sh.ur.roman.khudkushi",
    category: "self_harm", tier: "hard", lang: "ur-roman",
    pattern: /\bkhudkushi\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "sh.ur.roman.mar_jaun",
    category: "self_harm", tier: "hard", lang: "ur-roman",
    pattern: /\b(mar\s*jaun|mar\s*jaaun|marna\s*chahti|marna\s*chahta|marna\s*chahti\s*hoon|marna\s*chahta\s*hoon)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "sh.ur.roman.zindagi_se_tang",
    category: "self_harm", tier: "hard", lang: "ur-roman",
    // "zindagi se tang", "jina nahi chahta/chahti", "zindagi khatam karna"
    pattern: /\b(zindagi\s+se\s+(tang|thak|bor)|jina\s+nahi\s+(chahta|chahti)|zindagi\s+khatam\s+(karna|kar))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "sh.ur.roman.apne_aap",
    category: "self_harm", tier: "hard", lang: "ur-roman",
    // "apne aap ko hurt karna", "apne aap ko nuksaan"
    pattern: /\bapne\s+aap\s+ko\s+(hurt|nuksaan|takleef|zakhm|maar)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "sh.ur.roman.jeena_nahi2",
    category: "self_harm", tier: "hard", lang: "ur-roman",
    // Alternate spellings / extensions not covered by sh.ur.roman.zindagi_se_tang
    pattern: /\b(jeena\s+nahi\s+(chahti|chahta|chaahti|chaahta)|jina\s+nahi\s+(chahti\s+hoon|chahta\s+hoon)|apni\s+jaan\s+(lena|khatam|dena)\s+(chahti|chahta)|khud\s+ko\s+khatam\s+(karna|kar)\s+(chahti|chahta))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "sh.ur.roman.koi_miss_nahi",
    category: "self_harm", tier: "hard", lang: "ur-roman",
    // "koi miss nahi karega", "sabke liye behtar hoga agar main na rahun"
    pattern: /\b(koi\s+(miss\s+nahi|yaad\s+nahi)\s+karega|sabke\s+liye\s+behtar\s+hoga\s+(agar\s+)?main\s+(na\s+rahu|nahi\s+rahu|chali\s+jaon|chala\s+jaon))\b/i,
    requiresFirstPerson: false,
  },

  // -- Urdu script rules --
  {
    id: "sh.ur.script.khudkushi",
    category: "self_harm", tier: "hard", lang: "ur",
    pattern: /خودکشی/,
    requiresFirstPerson: false,
  },
  {
    id: "sh.ur.script.mar_jaun",
    category: "self_harm", tier: "hard", lang: "ur",
    pattern: /(مر\s*جاؤں|مرنا\s*چاہتی|مرنا\s*چاہتا)/,
    requiresFirstPerson: false,
  },
  {
    id: "sh.ur.script.zindagi",
    category: "self_harm", tier: "hard", lang: "ur",
    // زندگی سے تنگ / جینا نہیں چاہتی / زندگی ختم کرنا
    pattern: /(زندگی\s*سے\s*تنگ|جینا\s*نہیں\s*چاہت|زندگی\s*ختم\s*کرنا)/,
    requiresFirstPerson: false,
  },
  {
    id: "sh.ur.script.method",
    category: "self_harm", tier: "hard", lang: "ur",
    // پھانسی لگانا (hanging) / چھت سے کودنا (jump from roof) / خود کو ختم کرنا
    pattern: /(پھانسی\s*لگانا|پھانسی\s*لگا|چھت\s*سے\s*کودنا|خود\s*کو\s*ختم\s*کرنا|اپنی\s*جان\s*لینا)/,
    requiresFirstPerson: false,
  },


  // ══════════════════════════════════════════════════════════════════════════
  // OBSTETRIC EMERGENCY
  // ══════════════════════════════════════════════════════════════════════════

  // -- English hard rules --
  {
    id: "obs.en.heavy_bleeding",
    category: "obstetric_emergency", tier: "hard", lang: "en",
    // heavy bleeding, haemorrhage, soaking a pad, bleeding through clothes
    pattern: /\b(heavy\s+bleeding|bleeding\s+(heavily|a\s+lot|non.?stop|through\s+my)|hemorrhag\w*|haemorrhag\w*|soaking\s+(a\s+)?pad|blood\s+everywhere)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.en.severe_headache_vision",
    category: "obstetric_emergency", tier: "hard", lang: "en",
    pattern: /\b(severe|bad|terrible|worst)\s+(headache|migraine)\b[\s\S]{0,60}\b(vision|seeing\s+spots|blurry|blurred|can'?t\s+see)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.en.vision_spots",
    category: "obstetric_emergency", tier: "hard", lang: "en",
    // standalone vision disturbance is a preeclampsia sign
    pattern: /\b(seeing\s+(spots|flashes|stars)|blurry\s+vision|sudden\s+vision\s+(loss|change)|blind\s+(in\s+one\s+eye|suddenly))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.en.no_fetal_movement",
    category: "obstetric_emergency", tier: "hard", lang: "en",
    // "baby isn't moving", "baby has not moved in hours", "no fetal movement"
    pattern: /\b(baby|fetus|foetus)\b[\s\S]{0,15}\b(isn'?t|is\s+not|not|stopped|hasn'?t|has\s+not)\s+(moved?|moving|kicked?|kicking)\b|\bno\s+(fetal|foetal|baby)\s+movement\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.en.water_broke",
    category: "obstetric_emergency", tier: "hard", lang: "en",
    pattern: /\b(water\s+broke|waters\s+broke|membranes?\s+ruptured|bag\s+of\s+waters?\s+broke|fluid\s+(gushing|leaking|pouring))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.en.severe_abdominal_pain",
    category: "obstetric_emergency", tier: "hard", lang: "en",
    pattern: /\b(severe|crushing|unbearable|excruciating|intense)\s+(abdominal|stomach|belly|uterine)\s+pain\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.en.cord_prolapse",
    category: "obstetric_emergency", tier: "hard", lang: "en",
    // "cord is coming out", "cord prolapse", "umbilical cord falling out"
    pattern: /\b(cord\s+prolapse|umbilical\s+cord\s+(coming|hanging|sticking|falling|came)\s+out|cord\s+(is\s+)?(out|visible|hanging))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.en.seizure",
    category: "obstetric_emergency", tier: "hard", lang: "en",
    // "I had a seizure", "having a fit", "convulsions" – in this app these are obstetric
    pattern: /\b(seizure|convulsion|eclampsia|having\s+a\s+fit|fits\s+during\s+pregnancy|shaking\s+uncontrollably)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.en.preeclampsia",
    category: "obstetric_emergency", tier: "hard", lang: "en",
    // requiresFirstPerson: true so "what is preeclampsia" (no I/me/my) does NOT fire
    pattern: /\b(preeclampsia|pre.eclampsia|pre\s+eclampsia|eclampsia)\b/i,
    requiresFirstPerson: true,
  },
  {
    id: "obs.en.fainted",
    category: "obstetric_emergency", tier: "hard", lang: "en",
    // "I fainted", "I passed out", "I lost consciousness" – serious in pregnancy
    pattern: /\b(i\s+(fainted|passed\s+out|lost\s+consciousness|blacked\s+out|collapsed)|feel\s+like\s+i('?m|\s+am)\s+going\s+to\s+(faint|pass\s+out))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.en.extreme_face_swelling",
    category: "obstetric_emergency", tier: "hard", lang: "en",
    // "my face is suddenly extremely swollen", "hands severely swollen" — preeclampsia sign
    // allow the intensity and body-part words to appear in any order within 25 chars
    pattern: /\b(suddenly|severely|extremely|badly|very\s+)(swoll?en|puffy|puffed)\b[\s\S]{0,20}\b(face|hand|foot|feet|ankle)\b|\b(face|hand|foot|feet|ankle)\b[\s\S]{0,20}\b(suddenly|severely|extremely|badly)\b[\s\S]{0,20}\b(swoll?en|puffy)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.en.placental_abruption",
    category: "obstetric_emergency", tier: "hard", lang: "en",
    pattern: /\b(placent(a|al)\s+abruption|placenta\s+(came|coming|fell|detached|separating))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.en.labor_emergency",
    category: "obstetric_emergency", tier: "hard", lang: "en",
    // Rapid / unattended delivery — baby coming now
    pattern: /\b(baby\s+is\s+(coming|here)\s+(now|already|right\s+now|too\s+fast)|i\s+(can\s+feel|can\s+see)\s+the\s+(head|baby)\s+(coming|crowning|out)|need\s+to\s+push\s+(now|right\s+now)|baby\s+won'?t\s+wait|delivering\s+(alone|at\s+home|by\s+myself)|baby\s+is\s+crowning)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.en.high_bp_pregnancy",
    category: "obstetric_emergency", tier: "hard", lang: "en",
    // Hypertensive crisis / preeclampsia BP trigger
    pattern: /\b(blood\s+pressure\s+(is\s+)?(very|extremely|dangerously|really)\s+high|(blood\s+pressure|bp)\s+(of\s+|reading\s+|is\s+)?(1[6-9]\d|[2-9]\d{2})\s*\/|hypertensive\s+(crisis|emergency)|bp\s+(1[6-9]\d|[2-9]\d{2})\b)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.en.pprom",
    category: "obstetric_emergency", tier: "hard", lang: "en",
    // Premature rupture of membranes — slow leak or sudden gush
    pattern: /\b(fluid\s+(is\s+)?(gushing|leaking|dripping|pouring)\s+(out|from\s+me)|leaking\s+(amniotic\s+)?fluid|amniotic\s+fluid\s+(leaking|coming\s+out|gushing)|PPROM|premature\s+(membrane\s+)?rupture|watery\s+fluid\s+(coming\s+out|leaking)\s+(and\s+)?(won'?t\s+stop|non.?stop)|i\s+think\s+my\s+water\s+(is\s+)?(slowly\s+)?(leaking|breaking))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.en.postpartum_hemorrhage",
    category: "obstetric_emergency", tier: "hard", lang: "en",
    // Heavy bleeding after delivery
    pattern: /\b(bleeding\s+(heavily|a\s+lot|excessively|non.?stop|through\s+(my\s+)?pad)\s+(after|following|post)\s+(delivery|birth|giving\s+birth|c.?\s*section|cesarean)|postpartum\s+(hemorrhage|haemorrhage|bleeding)|soaking\s+pads?\s+(after|since)\s+(giving\s+birth|delivery|birth)|bleeding\s+after\s+(birth|delivery)\s+(won'?t\s+stop|is\s+(very\s+)?heavy))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.en.shoulder_tip_pain",
    category: "obstetric_emergency", tier: "soft", lang: "en",
    // Shoulder tip / right-upper-quadrant pain = ectopic / HELLP / ruptured organ sign
    pattern: /\b(shoulder\s+tip\s+pain|severe\s+shoulder\s+pain\b[\s\S]{0,40}\bpregnant|pain\s+(under|below)\s+(my\s+)?right\s+ribs?\b[\s\S]{0,40}\bpregnant|HELLP)\b/i,
    requiresFirstPerson: false,
  },

  // -- Roman Urdu rules --
  {
    id: "obs.ur.roman.bleeding",
    category: "obstetric_emergency", tier: "hard", lang: "ur-roman",
    pattern: /\b(khoon\s+bohat|zyada\s+khoon|bleeding\s+bohat|khoon\s+aa\s+raha|khoon\s+nikal\s+raha)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.ur.roman.behosh",
    category: "obstetric_emergency", tier: "hard", lang: "ur-roman",
    // "behosh ho gayi", "girne wali hoon"
    pattern: /\b(behosh\s+(ho\s+(gayi|gaya|rahi|raha)|ho\s+jaaun)|girne\s+wali\s+hoon|chakkar\s+aa\s+rahe\s+hain)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.ur.roman.dard",
    category: "obstetric_emergency", tier: "hard", lang: "ur-roman",
    // severe contraction-like pain expressions
    pattern: /\b(bohat\s+zyada\s+dard|pait\s+mein\s+bohat\s+dard|dard\s+barh\s+raha|dard\s+uthne\s+laga)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.ur.roman.pani_nikal",
    category: "obstetric_emergency", tier: "hard", lang: "ur-roman",
    // Water breaking / fluid leaking in Roman Urdu
    pattern: /\b(pani\s+(nikal\s+raha|aa\s+raha|gir\s+raha|tapak\s+raha)|jhilliyan\s+(phat\s+gayi|phat\s+rahi)|paani\s+(rishna|beh)\s+raha)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "obs.ur.roman.bp_zyada",
    category: "obstetric_emergency", tier: "hard", lang: "ur-roman",
    // Very high blood pressure in Roman Urdu pregnancy context
    pattern: /\b(blood\s+pressure\s+bohat\s+zyada|bp\s+(bohat\s+)?(zyada|high)\b|hamal\s+mein\s+bp\s+(zyada|high)|bp\s+ki\s+wajah\s+se\s+(sar\s+dard|nazar|aankhain))\b/i,
    requiresFirstPerson: false,
  },

  // -- Urdu script rules --
  {
    id: "obs.ur.script.bleeding",
    category: "obstetric_emergency", tier: "hard", lang: "ur",
    pattern: /(زیادہ\s*خون|بہت\s*خون|خون\s*آ\s*رہا)/,
    requiresFirstPerson: false,
  },
  {
    id: "obs.ur.script.behosh",
    category: "obstetric_emergency", tier: "hard", lang: "ur",
    pattern: /(بیہوش\s*ہو\s*گئی|بیہوش\s*ہو\s*رہی|گرنے\s*والی)/,
    requiresFirstPerson: false,
  },


  // ══════════════════════════════════════════════════════════════════════════
  // INFANT DISTRESS (WHO IMCI red signs + choking + trauma)
  // ══════════════════════════════════════════════════════════════════════════

  // -- Not breathing --
  {
    id: "inf.en.not_breathing",
    category: "infant_distress", tier: "hard", lang: "en",
    pattern: /\b(baby|infant|newborn|toddler|child)\s+(isn'?t|is\s+not|not|stopped|wasn'?t)\s+breathing\b/i,
    requiresFirstPerson: false,
  },

  // -- Choking (added in previous fix, expanded) --
  {
    id: "inf.en.choking",
    category: "infant_distress", tier: "hard", lang: "en",
    pattern: /\b(baby|infant|newborn|toddler|child|son|daughter|kid)\b[\s\S]{0,30}\b(is\s+|is\s+still\s+|was\s+|keeps?\s+)?(choking|choked|can'?t\s+(breathe|swallow)|food\s+(is\s+)?stuck|something\s+(is\s+)?stuck\s+in\s+(throat|airway))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "inf.en.choking_urgent",
    category: "infant_distress", tier: "hard", lang: "en",
    pattern: /\bchoking\b[\s\S]{0,25}\b(right\s+now|help|please|on\s+(food|something|milk|a\s+\w+))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "inf.en.cant_breathe_infant",
    category: "infant_distress", tier: "hard", lang: "en",
    pattern: /\b(baby|infant|newborn|toddler|child|son|daughter|kid)\b[\s\S]{0,30}\bcan'?t\s+(breathe|get\s+air)\b/i,
    requiresFirstPerson: false,
  },

  // -- Blue / purple discolouration --
  {
    id: "inf.en.blue_lips",
    category: "infant_distress", tier: "hard", lang: "en",
    pattern: /\b(blue|bluish|purple|purplish)\s+(lips|skin|face|tongue|fingernails?|nails?)\b/i,
    requiresFirstPerson: false,
  },

  // -- Unresponsive / limp --
  {
    id: "inf.en.unresponsive",
    category: "infant_distress", tier: "hard", lang: "en",
    pattern: /\b(baby|infant|toddler|child)\s+(unresponsive|won'?t\s+wake|wont\s+wake|limp|lifeless|not\s+responding)\b/i,
    requiresFirstPerson: false,
  },

  // -- Seizure / convulsion --
  {
    id: "inf.en.seizure",
    category: "infant_distress", tier: "hard", lang: "en",
    pattern: /\b(baby|infant|child|toddler)\b[\s\S]{0,30}\b(seizure|convulsion|fit|shaking\s+uncontrollabl|jerking)\b/i,
    requiresFirstPerson: false,
  },

  // -- Bleeding --
  {
    id: "inf.en.bleeding",
    category: "infant_distress", tier: "hard", lang: "en",
    pattern: /\b(baby|infant|newborn|toddler|child|son|daughter)\b[\s\S]{0,40}\b(bleeding\s+(heavily|a\s+lot|badly|nonstop|won'?t\s+stop|from\s+\w+)|hemorrhag\w+)\b/i,
    requiresFirstPerson: false,
  },

  // -- Vomiting blood --
  {
    id: "inf.en.vomiting_blood",
    category: "infant_distress", tier: "hard", lang: "en",
    pattern: /\b(baby|infant|newborn|toddler|child|son|daughter)\b[\s\S]{0,40}\b(vomit\w*|throw\w*\s+up|threw\s+up|spitt?\w*\s+up)\b[\s\S]{0,20}\bblood\b/i,
    requiresFirstPerson: false,
  },

  // -- Severe dehydration --
  {
    id: "inf.en.severe_dehydration",
    category: "infant_distress", tier: "hard", lang: "en",
    pattern: /\b(baby|infant|newborn|toddler|child)\b[\s\S]{0,30}\b(severely\s+dehydrated|hasn'?t\s+(eaten|drunk|peed|had\s+anything)\s+(in|for)\s+\w+|won'?t\s+wake\s+(up|to\s+feed)|sunken\s+(eyes|fontanelle|soft\s+spot))\b/i,
    requiresFirstPerson: false,
  },

  // -- Fell / head injury --
  {
    id: "inf.en.fell_head_injury",
    category: "infant_distress", tier: "hard", lang: "en",
    // "baby fell off", "baby dropped", "fell down the stairs", "hit their head", "baby has a head injury"
    pattern: /\b(baby|infant|toddler|child|son|daughter|kid)\b[\s\S]{0,30}\b(fell?\s+(off|down|from|out\s+of)|dropped?\s+(the\s+)?(baby|them|him|her)|hit\s+(their|his|her)\s+head|head\s+injury|head\s+trauma)\b/i,
    requiresFirstPerson: false,
  },

  // -- Swallowed something dangerous --
  {
    id: "inf.en.swallowed_danger",
    category: "infant_distress", tier: "hard", lang: "en",
    // "swallowed a battery", "drank bleach", "ate medicine", "ingested poison"
    pattern: /\b(baby|infant|toddler|child|son|daughter|kid)\b[\s\S]{0,40}\b(swallow(ed|ing)|ate|drank|ingested|put\s+in\s+(their|his|her)\s+mouth)\b[\s\S]{0,30}\b(battery|batteries|bleach|detergent|medicine|medication|pills?|tablets?|poison|coins?|needle|pin|button|magnet)\b/i,
    requiresFirstPerson: false,
  },

  // -- Stiff neck (meningitis sign) --
  {
    id: "inf.en.stiff_neck",
    category: "infant_distress", tier: "hard", lang: "en",
    // stiff neck + baby/child + fever (meningitis combo)
    pattern: /\b(baby|infant|toddler|child)\b[\s\S]{0,50}\bstiff\s+neck\b|\bstiff\s+neck\b[\s\S]{0,50}\b(baby|infant|toddler|child)\b/i,
    requiresFirstPerson: false,
  },

  // -- High fever (soft tier — urge doctor, not immediate call) --
  {
    id: "inf.en.high_fever",
    category: "infant_distress", tier: "soft", lang: "en",
    // "baby has a fever of 104", "temperature is 40", "very high fever"
    pattern: /\b(baby|infant|toddler|child|son|daughter)\b[\s\S]{0,30}\b(fever\s+of\s+(1[0-4][0-9]|4[0-2](\.\d)?)|temperature\s+(is\s+)?(4[0-2]|1[0-4][0-9])|very\s+high\s+fever|burning\s+up)\b/i,
    requiresFirstPerson: false,
  },

  // -- Roman Urdu --
  {
    id: "inf.ur.roman.saans",
    category: "infant_distress", tier: "hard", lang: "ur-roman",
    pattern: /\b(bachi|bacha|baby)\b[\s\S]{0,20}\b(saans\s+nahi|saans\s+nai|saans\s+nahin)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "inf.ur.roman.choking",
    category: "infant_distress", tier: "hard", lang: "ur-roman",
    // "bacha phans gaya" / "gala phans gaya" / "saans ruk gayi" / "dam ghut"
    pattern: /\b(bacha|bachi|baby|bachey)\b[\s\S]{0,30}\b(phans\s*(gaya|gayi|raha|rahi)|dam\s*(ghut|ghat)|saans\s*(ruk|band))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "inf.ur.roman.gir_gaya",
    category: "infant_distress", tier: "hard", lang: "ur-roman",
    // "bacha gir gaya" (baby fell), "sir lag gaya" (hit the head)
    pattern: /\b(bacha|bachi|baby)\b[\s\S]{0,20}\b(gir\s*(gaya|gayi|para|pari)|sir\s+(lag|laga|lagay|lagi|maar))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "inf.ur.roman.kuch_kha_gaya",
    category: "infant_distress", tier: "hard", lang: "ur-roman",
    // "kuch kha gaya" / "dawa kha gayi" (ate medicine)
    pattern: /\b(bacha|bachi|baby)\b[\s\S]{0,30}\b((kuch\s+(kha|khaaya|pi)\s+(gaya|gayi))|(dawa\s+(kha|khaaya|pi)\s+(gaya|gayi)))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "inf.ur.roman.behosh",
    category: "infant_distress", tier: "hard", lang: "ur-roman",
    // "bacha behosh ho gaya"
    pattern: /\b(bacha|bachi|baby)\b[\s\S]{0,20}\b(behosh|beshudh|hilna\s+band)\b/i,
    requiresFirstPerson: false,
  },

  // -- Urdu script --
  {
    id: "inf.ur.script.choking",
    category: "infant_distress", tier: "hard", lang: "ur",
    pattern: /(بچہ|بچی|بیبی)[\s\S]{0,20}(دم\s*گھٹ|گلا\s*پھنس|سانس\s*رک)/,
    requiresFirstPerson: false,
  },
  {
    id: "inf.ur.script.fell",
    category: "infant_distress", tier: "hard", lang: "ur",
    pattern: /(بچہ|بچی)[\s\S]{0,20}(گر\s*گیا|گر\s*گئی|سر\s*لگا)/,
    requiresFirstPerson: false,
  },
  {
    id: "inf.ur.script.behosh",
    category: "infant_distress", tier: "hard", lang: "ur",
    pattern: /(بچہ|بچی)[\s\S]{0,20}(بیہوش|سانس\s*نہیں)/,
    requiresFirstPerson: false,
  },


  // ══════════════════════════════════════════════════════════════════════════
  // DOMESTIC VIOLENCE
  // ══════════════════════════════════════════════════════════════════════════

  // -- Physical violence --
  {
    id: "dv.en.physical_violence",
    category: "domestic_violence", tier: "hard", lang: "en",
    // "he hit me", "my husband beats me", "she keeps slapping me"
    pattern: /\b(he|she|they|husband|wife|partner|boyfriend|girlfriend|mother[-\s]?in[-\s]?law|father[-\s]?in[-\s]?law|bhabhi|saas|susral)\b[\s\S]{0,20}\b(is\s+|just\s+|keeps?\s+|always\s+)?(hit\w*|beat\w*|punch\w*|slap\w*|kick\w*|strangl\w*|chok\w*\s+me|hurt\w*|throw\w*\s+(things\s+)?at)\b[\s\S]{0,10}\bme\b/i,
    requiresFirstPerson: false,
  },

  // -- Fear / threat from partner --
  {
    id: "dv.en.afraid_of_him",
    category: "domestic_violence", tier: "hard", lang: "en",
    pattern: /\b(scared|afraid|terrified|frightened|petrified)\s+of\s+(him|her|my\s+(husband|wife|partner|boyfriend|girlfriend|in[-\s]?laws?))\b/i,
    requiresFirstPerson: false,
  },

  // -- He is going to kill / hurt me --
  {
    id: "dv.en.going_to_kill_me",
    category: "domestic_violence", tier: "hard", lang: "en",
    // "he is going to kill me", "he wants to kill me", "he will kill me"
    pattern: /\b(he|she|husband|partner)\b[\s\S]{0,15}\b(is\s+going\s+to|will|wants?\s+to|threatened\s+to)\s+(kill|murder|hurt\s+badly|seriously\s+hurt)\s+me\b/i,
    requiresFirstPerson: false,
  },

  // -- Threatening --
  {
    id: "dv.en.threatening",
    category: "domestic_violence", tier: "hard", lang: "en",
    pattern: /\b(threatened|threatening|threatens)\s+(to\s+kill|to\s+hurt|to\s+beat|to\s+murder)\s+me\b/i,
    requiresFirstPerson: false,
  },

  // -- Weapons --
  {
    id: "dv.en.weapon_imminent",
    category: "domestic_violence", tier: "hard", lang: "en",
    pattern: /\b(coming|chasing|after|approaching|charging)\s+(at\s+me|after\s+me|towards?\s+me|with(\s+a)?)\b[\s\S]{0,30}\b(belt|knife|gun|pistol|stick|weapon|bat|hammer|rod|iron|chain|wire|axe)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "dv.en.weapon_present",
    category: "domestic_violence", tier: "hard", lang: "en",
    pattern: /\b(he|she|husband|wife|partner|boyfriend|girlfriend)\b[\s\S]{0,30}\b(has|holding|grabbed|picked\s+up|got|showing)\s+(a\s+)?(belt|knife|gun|pistol|stick|weapon|bat|hammer|rod|chain|axe)\b/i,
    requiresFirstPerson: false,
  },

  // -- Trapped / locked in --
  {
    id: "dv.en.locked_in_trapped",
    category: "domestic_violence", tier: "hard", lang: "en",
    pattern: /\b(locked\s+(me\s+)?in|won'?t\s+let\s+me\s+(leave|go|out|call)|trapped\s+(in|here|at\s+home)|won'?t\s+let\s+me\s+(use|have)\s+(my\s+)?phone)\b/i,
    requiresFirstPerson: false,
  },

  // -- Not safe / need help --
  {
    id: "dv.en.not_safe",
    category: "domestic_violence", tier: "hard", lang: "en",
    // "I am not safe", "I'm in danger", "help me I'm not safe", "please help I'm scared"
    pattern: /\b(i('?m|\s+am)\s+not\s+safe|i('?m|\s+am)\s+in\s+danger|please\s+help\s+(me\s+)?(i'?m|i\s+am)\s+(scared|not\s+safe|in\s+danger)|need\s+help\s+i('?m|\s+am)\s+(not\s+safe|in\s+danger))\b/i,
    requiresFirstPerson: false,
  },

  // -- Sexual violence --
  {
    id: "dv.en.sexual_violence",
    category: "domestic_violence", tier: "hard", lang: "en",
    pattern: /\b(he|she|husband|partner|boyfriend|father[-\s]?in[-\s]?law|brother[-\s]?in[-\s]?law)\b[\s\S]{0,30}\b(raped?\s+me|sexually\s+(assaulted?|abused?|harassed?)\s+me|forced\s+me\s+to\s+have\s+sex|molested?\s+me|forced\s+sex\s+on\s+me)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "dv.en.marital_coercion",
    category: "domestic_violence", tier: "hard", lang: "en",
    // "he forces me to have sex", "he won't take no for an answer"
    pattern: /\b(he|she|husband|partner)\b[\s\S]{0,30}\b(forces?\s+me\s+to\s+have\s+sex|makes?\s+me\s+have\s+sex|won'?t\s+take\s+no\s+for\s+an\s+answer|won'?t\s+let\s+me\s+say\s+no\s+to\s+sex)\b/i,
    requiresFirstPerson: false,
  },

  // -- Stalking --
  {
    id: "dv.en.stalking",
    category: "domestic_violence", tier: "hard", lang: "en",
    pattern: /\b(he|she|husband|partner|ex|boyfriend|girlfriend|mother[-\s]?in[-\s]?law|sasural)\b[\s\S]{0,30}\b(is\s+(following|stalking|tracking|monitoring)\s+me|follows?\s+me\s+everywhere|won'?t\s+leave\s+me\s+alone|outside\s+my\s+(house|home|door)\s+(right\s+now|again|and\s+won'?t\s+leave)|showing\s+up\s+(everywhere|uninvited|at\s+my\s+(work|school|home)))\b/i,
    requiresFirstPerson: false,
  },

  // -- Need to escape --
  {
    id: "dv.en.need_to_escape",
    category: "domestic_violence", tier: "hard", lang: "en",
    pattern: /\b(need\s+to\s+(escape|get\s+out|flee|run\s+away|leave\s+safely?)\s+(from\s+(him|her|my\s+(husband|partner|home|house|in.?laws?))|tonight|now|urgently)|how\s+(do|can|should)\s+i\s+(safely?\s+)?(leave|escape|get\s+out)\s+(from\s+)?(him|her|my\s+(husband|partner|home|abuser))|trying\s+to\s+safely?\s+leave\s+(him|her|my\s+husband))\b/i,
    requiresFirstPerson: false,
  },

  // -- Soft: general abuse --
  {
    id: "dv.en.abuse_general",
    category: "domestic_violence", tier: "soft", lang: "en",
    pattern: /\b(domestic\s+(abuse|violence)|abuse(d|s|ing)?\s+me|abusive\s+(husband|partner|relationship|home|environment))\b/i,
    requiresFirstPerson: false,
  },

  // -- Roman Urdu --
  {
    id: "dv.ur.roman.maara",
    category: "domestic_violence", tier: "hard", lang: "ur-roman",
    pattern: /\b(shohar|husband|partner|sasural|saas)\b[\s\S]{0,15}\b(ne|nay)\b[\s\S]{0,10}\b(maara|maar\s*diya|maarta|marti|mara)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "dv.ur.roman.maar_dega",
    category: "domestic_violence", tier: "hard", lang: "ur-roman",
    // "maar dega mujhe", "maar dalega", "jaan se maar dega"
    pattern: /\b(maar\s+(dega|dalega|dalay\s+ga|dala|dega\s+mujhe)|jaan\s+se\s+maar)\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "dv.ur.roman.mujhe_dar",
    category: "domestic_violence", tier: "hard", lang: "ur-roman",
    // "mujhe dar lag raha hai usse / shohar se" (I am afraid of him)
    pattern: /\b(mujhe\s+(shohar|usse|us\s+se|partner)\s+se\s+dar|mujhe\s+dar\s+(lag\s+raha|aa\s+raha))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "dv.ur.roman.zyadti",
    category: "domestic_violence", tier: "hard", lang: "ur-roman",
    // Sexual assault / rape in Roman Urdu
    pattern: /\b(zyadti|zyaadti|zor\s*aabari|jabri\s+(sambhog|taalluq|kaam)|rape\s+kiya|beizzati\s+(ki|karta|karti))\b/i,
    requiresFirstPerson: false,
  },
  {
    id: "dv.ur.roman.qaid",
    category: "domestic_violence", tier: "hard", lang: "ur-roman",
    // "qaid kar diya" (imprisoned me), "ghar se bhaagna chahti" (want to escape the house)
    pattern: /\b(qaid\s+(ho\s+gayi|kar\s+diya\s+mujhe|hai\s+mujhe)|ghar\s+se\s+(bhaagna|bhaag|nikalna)\s+(chahti|chahta)\s+hoon|bahar\s+nahi\s+nikalne\s+(deta|deti)|mujhe\s+(band|qaid)\s+kar\s+diya)\b/i,
    requiresFirstPerson: false,
  },

  // -- Urdu script --
  {
    id: "dv.ur.script.maara",
    category: "domestic_violence", tier: "hard", lang: "ur",
    pattern: /(شوہر|پارٹنر|ساس)[\s\S]{0,10}(نے|نے\s+مارا|مارتا\s+ہے|مار\s*دیا)/,
    requiresFirstPerson: false,
  },
  {
    id: "dv.ur.script.maar_dega",
    category: "domestic_violence", tier: "hard", lang: "ur",
    // مار دے گا / جان سے مار
    pattern: /(مار\s*دے\s*گا|مار\s*ڈالے\s*گا|جان\s*سے\s*مار)/,
    requiresFirstPerson: false,
  },
  {
    id: "dv.ur.script.zyadti",
    category: "domestic_violence", tier: "hard", lang: "ur",
    // زیادتی (sexual violence) / جبری تعلق (forced relations) in Urdu script
    pattern: /(زیادتی|جبری\s*تعلق|جبری\s*صنفی|بدفعلی|بے\s*عزتی\s*(کی|کرتا|کرتی))/,
    requiresFirstPerson: false,
  },
  {
    id: "dv.ur.script.qaid",
    category: "domestic_violence", tier: "hard", lang: "ur",
    // قید کر دیا (imprisoned) / گھر سے بھاگنا (want to flee the house)
    pattern: /(قید\s*کر\s*دیا|گھر\s*سے\s*نہیں\s*نکلنے\s*دیتا|بھاگنا\s*چاہتی|بھاگنا\s*چاہتا)/,
    requiresFirstPerson: false,
  },
];

// ---------------------------------------------------------------------------
// Category tiebreak (more specific category wins on equal hit counts)
// ---------------------------------------------------------------------------
const CATEGORY_TIEBREAK = [
  "infant_distress",
  "domestic_violence",
  "self_harm",
  "obstetric_emergency",
  "other_crisis",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function tokenize(text) {
  // Do NOT split on apostrophe so contractions like "don't"/"won't" stay intact
  // and match the NEGATION_TOKENS list entries.
  return text.toLowerCase().split(/[\s.,!?;:"()\[\]/\\]+/).filter(Boolean);
}

function findNegationBefore(text, matchIndex) {
  const lower = text.toLowerCase();
  const before = lower.substring(0, matchIndex);
  const beforeTokens = tokenize(before).slice(-NEGATION_WINDOW);
  for (const token of beforeTokens) {
    if (NEGATION_TOKENS.includes(token)) return true;
  }
  const tail = before.slice(-50);
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
  return /\b(i|i'm|im|i've|ive|i'd|id|me|my|myself|main|mein|mujhe)\b/i.test(text)
    || /(میں|مجھے)/.test(text);
}

// ---------------------------------------------------------------------------
// evaluateWindow – public API used by detectionService.js
// ---------------------------------------------------------------------------
/**
 * @param {string} windowText – the latest user message text
 * @returns {{
 *   severity: "none"|"low"|"medium"|"high",
 *   category: string,
 *   confidence: number,
 *   triggeringRuleIds: string[],
 *   actionRecommended: "none"|"soft_resource"|"confirm_then_offer_call"|"immediate_offer_call"
 * }}
 */
function evaluateWindow(windowText) {
  if (!windowText || typeof windowText !== "string") return emptyResult();

  const fired = [];
  const thirdPerson  = hasThirdPersonMarker(windowText);
  const hypothetical = hasHypotheticalMarker(windowText);
  const firstPerson  = hasFirstPersonContext(windowText);

  for (const rule of RULES) {
    rule.pattern.lastIndex = 0;
    const match = rule.pattern.exec(windowText);
    if (!match) continue;

    if (rule.requiresFirstPerson && findNegationBefore(windowText, match.index)) continue;
    if (rule.requiresFirstPerson && !firstPerson) continue;

    // Domestic violence rules inherently reference a third-party ACTOR ("he hit me"),
    // so never downgrade DV for third-person markers.
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

  const hardHits = fired.filter((f) => f.effectiveTier === "hard");
  const useHits  = hardHits.length > 0 ? hardHits : fired;

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
  RULES,
  NEGATION_WINDOW,
};
