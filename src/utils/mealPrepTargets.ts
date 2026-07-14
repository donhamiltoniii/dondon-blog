// ─────────────────────────────────────────────
// DAILY MACRO TARGETS — cut protocol
// ─────────────────────────────────────────────
export const TARGETS = { calories: 2900, protein: 200, fat: 83, carbs: 312 };

// ─────────────────────────────────────────────
// THIS WEEK'S DINNER — update every Sunday
// Recipe library lives on /food/meal-prep
// ─────────────────────────────────────────────
export const thisWeekDinner = {
  label: 'BBQ chicken & sweet potato',
  emoji: '🍗',
  recipeUrl: '/food/meal-prep/bbq-chicken-and-sweet-potato',
  macros: { calories: 625, protein: 60, fat: 12, carbs: 68 },
};

// ─────────────────────────────────────────────
// HOW I ACTUALLY EAT — daily timeline
// ─────────────────────────────────────────────
export interface DayStop {
  time: string;
  label: string;
  emoji: string;
  detail: string;
  macros: { calories: number; protein: number; fat: number; carbs: number };
  href?: string;
}

export const dayTimeline: DayStop[] = [
  {
    time: 'Wake',
    label: 'Banana & supplements',
    emoji: '🍌',
    detail: 'One medium banana with morning supplements. Nothing else until 11–12.',
    macros: { calories: 107, protein: 1, fat: 0, carbs: 27 },
  },
  {
    time: '11–12',
    label: 'Eggs & salmon salad',
    emoji: '🍳',
    detail:
      '6 whole eggs scrambled, salt & pepper. One can Kirkland salmon (~142g drained) mixed with 220g Good Culture 2% cottage cheese, eaten with ~30g triscuits.',
    macros: { calories: 990, protein: 99, fat: 51, carbs: 33 },
  },
  {
    time: 'Evening',
    label: thisWeekDinner.label,
    emoji: thisWeekDinner.emoji,
    detail:
      "One portion of this week's meal prep. Usually around 550 cal, up to 700 on the high end.",
    macros: thisWeekDinner.macros,
    href: thisWeekDinner.recipeUrl,
  },
  {
    time: 'Night',
    label: 'Yogurt bowl',
    emoji: '🍒',
    detail:
      '170g 2% Greek yogurt + 50g nut granola + 150g frozen cherries + 32g PB powder + 21g honey. No banana — already had one this morning.',
    macros: { calories: 619, protein: 32, fat: 17, carbs: 81 },
  },
];

// Sum of named meals (does NOT include flex backfill or gym-day shake)
export const trackedTotals = dayTimeline.reduce(
  (acc, stop) => ({
    calories: acc.calories + stop.macros.calories,
    protein: acc.protein + stop.macros.protein,
    fat: acc.fat + stop.macros.fat,
    carbs: acc.carbs + stop.macros.carbs,
  }),
  { calories: 0, protein: 0, fat: 0, carbs: 0 }
);

// Flex room remaining after tracked meals, with a small buffer
export const flexBackfill = {
  calories: Math.max(0, TARGETS.calories - trackedTotals.calories - 100),
  detail:
    'Fruit and cheese sticks scattered through the day to hit ~2,800–2,900 cal. Lean fruit-heavy on days where fat is already near target.',
};
