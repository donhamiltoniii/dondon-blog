export const TARGETS = { calories: 2900, protein: 200, fat: 83, carbs: 312 };

// ─────────────────────────────────────────────
// THIS WEEK — update every Sunday
// ─────────────────────────────────────────────
export const thisWeek: {
  lunch: LunchId;
  dinner: DinnerId;
  lunchActual: { calories: number; protein: number; fat: number; carbs: number } | null;
  dinnerActual: { calories: number; protein: number; fat: number; carbs: number } | null;
} = {
  lunch: 'burrito-bowls', // change to any lunch id below
  dinner: 'tikka-masala', // change to any dinner id below
  lunchActual: null, // set once you've calculated per-serving macros
  dinnerActual: null,
};

// ─────────────────────────────────────────────
// PANTRY STAPLES — items you usually keep stocked
// ─────────────────────────────────────────────
export const pantryStaples = [
  'Olive oil',
  'Neutral oil (avocado or vegetable)',
  'Soy sauce / tamari',
  'Fish sauce',
  'Oyster sauce',
  'Gochujang',
  "Hot sauce (Frank's RedHot)",
  'BBQ sauce',
  'Raw honey',
  'PB powder',
  'Jasmine rice (bulk)',
  'Basmati rice',
  'Dried pasta (penne)',
  'Orzo',
  'Canned crushed tomatoes',
  'Dried chiles (ancho, guajillo)',
  'Spices: cumin, paprika, garam masala, oregano, coriander, chili powder',
  'Kosher salt & black pepper',
  'Butter / ghee',
  'Capers',
  'Kalamata olives',
];

// ─────────────────────────────────────────────
// LUNCH ROTATION
// ─────────────────────────────────────────────
export type LunchId =
  | 'burrito-bowls'
  | 'dakgalbi'
  | 'greek-chicken-orzo'
  | 'bbq-chicken-sweet-potato';

export interface PrepDish {
  id: string;
  recipeUrl: `/food/meal-prep/${string}`;
  label: string;
  cuisine: string;
  emoji: string;
  description: string;
  target: { calories: number; protein: number; fat: number; carbs: number };
  components: { role: string; description: string }[];
  prepNote: string;
  // Costco-first shopping list for 2 people × 5 days = 10 portions
  shoppingList: { item: string; qty: string; costco: boolean }[];
}

export const lunchDishes: Record<LunchId, PrepDish> = {
  'burrito-bowls': {
    id: 'burrito-bowls',
    recipeUrl: '/food/meal-prep/chicken-burrito-bowls',
    label: 'Chicken burrito bowls',
    cuisine: 'Mexican',
    emoji: '🌮',
    description:
      'Cumin-lime marinated rotisserie chicken over cilantro rice with roasted corn, pico de gallo, and Greek yogurt as sour cream.',
    target: { calories: 630, protein: 62, fat: 14, carbs: 65 },
    components: [
      { role: 'Protein', description: 'Rotisserie chicken breast 200g' },
      { role: 'Carbs', description: 'Cilantro-lime rice 150g cooked + roasted corn 80g' },
      { role: 'Finish', description: 'Non-fat Greek yogurt 50g + salsa + lime' },
    ],
    prepNote:
      'Pull chicken from rotisserie, shred or slice. Cook rice with lime zest and cilantro stirred in at the end. Roast corn at 425°F for 15 min. Portion into 10 containers cold — reheats well.',
    shoppingList: [
      { item: 'Kirkland rotisserie chicken (2)', qty: '2 birds', costco: true },
      { item: 'Jasmine rice', qty: '1.5 kg bag', costco: true },
      { item: 'Frozen roasted corn', qty: '1 bag (1.36 kg)', costco: true },
      { item: 'Kirkland non-fat Greek yogurt', qty: '1 large tub', costco: true },
      { item: 'Fresh salsa / pico de gallo', qty: '1 tub', costco: true },
      { item: 'Limes', qty: '1 bag', costco: true },
      { item: 'Fresh cilantro', qty: '1 bunch', costco: false },
    ],
  },
  dakgalbi: {
    id: 'dakgalbi',
    recipeUrl: '/food/meal-prep/dakgalbi-rice-bowls',
    label: 'Dakgalbi rice bowls',
    cuisine: 'Korean',
    emoji: '🍚',
    description:
      'Gochujang-marinated chicken thigh strips stir-fried with sweet potato and scallions over steamed rice. Bold, slightly spicy, deeply savory.',
    target: { calories: 615, protein: 63, fat: 13, carbs: 63 },
    components: [
      { role: 'Protein', description: 'Boneless chicken thighs 180g' },
      { role: 'Carbs', description: 'Jasmine rice 130g cooked + sweet potato 100g' },
      { role: 'Finish', description: 'Gochujang sauce: sesame oil, soy sauce, gochujang, garlic' },
    ],
    prepNote:
      'Marinate thighs in gochujang sauce 1hr+. Cube sweet potato and roast at 400°F 25 min. Stir-fry chicken in batches over high heat. Combine with potato and scallions, portion over rice.',
    shoppingList: [
      { item: 'Kirkland boneless skinless chicken thighs', qty: '2 kg bag', costco: true },
      { item: 'Jasmine rice', qty: '1.5 kg bag', costco: true },
      { item: 'Sweet potatoes', qty: '5 lbs', costco: true },
      { item: 'Scallions / green onions', qty: '1 bunch', costco: false },
      { item: 'Garlic (minced jar)', qty: '1 jar', costco: true },
      { item: 'Sesame oil', qty: 'Small bottle', costco: false },
    ],
  },
  'greek-chicken-orzo': {
    id: 'greek-chicken-orzo',
    recipeUrl: '/food/meal-prep/greek-chicken-orzo',
    label: 'Greek chicken & orzo',
    cuisine: 'Mediterranean',
    emoji: '🫒',
    description:
      'Lemon-oregano chicken breast over orzo with roasted red pepper, Kalamata olives, and a small amount of feta. Bright and satisfying.',
    target: { calories: 620, protein: 61, fat: 16, carbs: 61 },
    components: [
      { role: 'Protein', description: 'Chicken breast 200g + feta 20g' },
      { role: 'Carbs', description: 'Orzo 120g cooked + roasted red pepper 80g' },
      { role: 'Finish', description: 'Olive oil 8g + Kalamata olives 20g + lemon' },
    ],
    prepNote:
      'Marinate chicken in lemon, olive oil, oregano, garlic. Grill or bake at 425°F 20 min. Cook orzo al dente, toss warm with olive oil, roasted peppers, olives. Slice chicken over top, crumble feta, finish with lemon.',
    shoppingList: [
      { item: 'Kirkland chicken breasts', qty: '2 kg bag', costco: true },
      { item: 'Orzo pasta', qty: '1 bag (900g)', costco: false },
      { item: 'Roasted red peppers (jarred)', qty: '1 large jar', costco: true },
      { item: 'Kalamata olives', qty: '1 jar', costco: true },
      { item: 'Feta cheese (crumbled)', qty: '1 tub', costco: true },
      { item: 'Lemons', qty: '1 bag', costco: true },
    ],
  },
  'bbq-chicken-sweet-potato': {
    id: 'bbq-chicken-sweet-potato',
    recipeUrl: '/food/meal-prep/bbq-chicken-and-sweet-potato',
    label: 'BBQ chicken & sweet potato',
    cuisine: 'American',
    emoji: '🍗',
    description:
      'Smoky BBQ-glazed chicken breast with roasted sweet potato wedges and corn. A crowd-pleaser with no exotic ingredients.',
    target: { calories: 625, protein: 60, fat: 12, carbs: 68 },
    components: [
      { role: 'Protein', description: 'Chicken breast 200g' },
      { role: 'Carbs', description: 'Sweet potato 200g + corn 80g' },
      { role: 'Finish', description: 'BBQ sauce 30g + olive oil 5g' },
    ],
    prepNote:
      'Coat chicken in BBQ sauce, bake at 400°F 25 min basting once. Roast sweet potato wedges with olive oil and salt same oven. Add corn last 10 min. Everything comes out together — simplest prep on the list.',
    shoppingList: [
      { item: 'Kirkland chicken breasts', qty: '2 kg bag', costco: true },
      { item: 'Sweet potatoes', qty: '5 lbs', costco: true },
      { item: 'Frozen roasted corn', qty: '1 bag (1.36 kg)', costco: true },
      { item: 'BBQ sauce (Kirkland or preferred)', qty: '1 bottle', costco: true },
    ],
  },
};

// ─────────────────────────────────────────────
// DINNER ROTATION
// ─────────────────────────────────────────────
export type DinnerId = 'chicken-piccata' | 'tikka-masala' | 'thai-basil-chicken' | 'birria-tacos';

export const dinnerDishes: Record<DinnerId, PrepDish> = {
  'chicken-piccata': {
    id: 'chicken-piccata',
    recipeUrl: '/food/meal-prep/chicken-piccata-with-pasta',
    label: 'Chicken piccata with pasta',
    cuisine: 'Italian',
    emoji: '🍝',
    description:
      'Pan-seared chicken breast in a lemon-caper-butter sauce over penne. Feels restaurant-quality, preps in 45 minutes for the week.',
    target: { calories: 710, protein: 55, fat: 24, carbs: 72 },
    components: [
      { role: 'Protein', description: 'Chicken breast 180g' },
      { role: 'Carbs', description: 'Penne pasta 100g dry + capers + lemon' },
      { role: 'Finish', description: 'Butter 12g + olive oil 8g + parmesan 15g' },
    ],
    prepNote:
      'Pound chicken thin, dredge lightly in flour, sear in olive oil 3 min per side. Remove, make pan sauce with butter, lemon juice, capers, and a splash of chicken broth. Cook pasta, toss with sauce. Portion chicken over pasta, spoon sauce over top. Parmesan goes on at reheating.',
    shoppingList: [
      { item: 'Kirkland chicken breasts', qty: '2 kg bag', costco: true },
      { item: 'Penne pasta', qty: '1 large bag', costco: true },
      { item: 'Capers', qty: '1 jar', costco: false },
      { item: 'Lemons', qty: '1 bag', costco: true },
      { item: 'Kirkland parmesan (shredded)', qty: '1 bag', costco: true },
      { item: 'Kirkland chicken broth', qty: '1 carton', costco: true },
    ],
  },
  'tikka-masala': {
    id: 'tikka-masala',
    recipeUrl: '/food/meal-prep/chicken-tikka-masala',
    label: 'Chicken tikka masala & rice',
    cuisine: 'Indian',
    emoji: '🍛',
    description:
      'Marinated chicken thighs in a tomato-cream masala sauce over basmati rice. Reheats exceptionally well — arguably better day 3 than day 1.',
    target: { calories: 695, protein: 57, fat: 22, carbs: 74 },
    components: [
      { role: 'Protein', description: 'Chicken thighs 180g' },
      { role: 'Carbs', description: 'Basmati rice 150g cooked + tomato base' },
      { role: 'Finish', description: 'Heavy cream 30g + ghee 10g + spice blend' },
    ],
    prepNote:
      'Marinate thighs in yogurt + garam masala + turmeric overnight or 1hr min. Broil or sear until charred at edges. Make masala: sauté onion, garlic, ginger, add crushed tomatoes + spices, simmer 20 min, stir in cream. Add chicken, simmer 10 more min. Serve over basmati.',
    shoppingList: [
      { item: 'Kirkland boneless skinless chicken thighs', qty: '2 kg bag', costco: true },
      { item: 'Basmati rice', qty: '1 bag (2 kg)', costco: true },
      { item: 'Kirkland crushed tomatoes (canned)', qty: '2 large cans', costco: true },
      { item: 'Heavy cream', qty: '1 carton', costco: true },
      { item: 'Kirkland non-fat Greek yogurt (marinade)', qty: '1 large tub', costco: true },
      { item: 'Fresh ginger', qty: '1 knob', costco: false },
      { item: 'Garlic (minced jar)', qty: '1 jar', costco: true },
      { item: 'Yellow onions', qty: '3 lb bag', costco: true },
    ],
  },
  'thai-basil-chicken': {
    id: 'thai-basil-chicken',
    recipeUrl: '/food/meal-prep/thai-basil-chicken',
    label: 'Thai basil chicken (pad kra pao)',
    cuisine: 'Thai',
    emoji: '🌿',
    description:
      'Ground chicken stir-fried with Thai basil, oyster sauce, fish sauce, and chili over jasmine rice with a fried egg on top.',
    target: { calories: 700, protein: 58, fat: 21, carbs: 71 },
    components: [
      { role: 'Protein', description: 'Ground chicken 200g + egg x1' },
      { role: 'Carbs', description: 'Jasmine rice 150g cooked + oyster sauce' },
      { role: 'Finish', description: 'Neutral oil 12g + fish sauce + Thai basil' },
    ],
    prepNote:
      'Fastest prep on the list. Brown ground chicken over high heat, add garlic and chili, sauce with oyster sauce + fish sauce + a pinch of sugar. Toss in Thai basil at the end. Fry eggs separately — store them on top of portions or fry fresh each morning. Rice cooks in parallel.',
    shoppingList: [
      { item: 'Ground chicken', qty: '2 kg', costco: true },
      { item: 'Jasmine rice', qty: '1.5 kg bag', costco: true },
      { item: 'Kirkland large eggs', qty: '2 dozen', costco: true },
      { item: 'Thai basil', qty: '1–2 bunches', costco: false },
      { item: 'Fresh chili or chili paste', qty: 'Small jar', costco: false },
      { item: 'Garlic (minced jar)', qty: '1 jar', costco: true },
    ],
  },
  'birria-tacos': {
    id: 'birria-tacos',
    recipeUrl: '/food/meal-prep/birria-style-chicken-tacos',
    label: 'Birria-style chicken tacos',
    cuisine: 'Mexican',
    emoji: '🌮',
    description:
      'Slow-braised chicken in ancho-guajillo consommé, shredded and crisped in corn tortillas with cheese, onion, cilantro, and a cup of broth for dipping.',
    target: { calories: 705, protein: 54, fat: 26, carbs: 70 },
    components: [
      { role: 'Protein', description: 'Chicken thighs 200g braised' },
      { role: 'Carbs', description: 'Corn tortillas x3 (75g) + dried chiles' },
      { role: 'Finish', description: 'Cheese 20g + braising fat from consommé' },
    ],
    prepNote:
      'Toast and rehydrate ancho + guajillo chiles, blend with tomato, garlic, cumin, oregano, and chicken broth. Braise thighs in consommé 2hrs low. Shred chicken. To serve: dip tortillas in consommé fat, griddle until crispy, fill with chicken and cheese. Weekend project — freeze extra consommé.',
    shoppingList: [
      { item: 'Kirkland boneless skinless chicken thighs', qty: '2 kg bag', costco: true },
      { item: 'Corn tortillas', qty: '1 large pack', costco: true },
      { item: 'Kirkland chicken broth', qty: '2 cartons', costco: true },
      { item: 'Mexican blend shredded cheese', qty: '1 bag', costco: true },
      { item: 'White onion', qty: '1', costco: false },
      { item: 'Fresh cilantro', qty: '1 bunch', costco: false },
      { item: 'Limes', qty: '1 bag', costco: true },
    ],
  },
};

// ─────────────────────────────────────────────
// FIXED MEALS — same every day
// ─────────────────────────────────────────────
export const fixedMeals = [
  {
    id: 'breakfast',
    time: 'Morning',
    name: 'Breakfast',
    emoji: '🍳',
    items: [
      { name: 'Whole eggs x6 (300g)', calories: 420, protein: 36, fat: 30, carbs: 2 },
      { name: 'Banana, medium (120g)', calories: 107, protein: 1, fat: 0, carbs: 27 },
      { name: 'Seasonal fruit (100–120g)', calories: 85, protein: 1, fat: 0, carbs: 21 },
    ],
    note: 'Fry or scramble 6 eggs with cooking spray — done in 5 min, no other cooking needed. Banana + seasonal fruit on the side. Swap the fruit week to week: an orange (~85 cal/21c), a medium apple (~95 cal/25c), or a cup of mixed berries (~85 cal/20c) all land in the same range.',
    shoppingList: [
      { item: 'Kirkland large eggs', qty: '3 dozen', costco: true },
      { item: 'Bananas', qty: '1 bunch (10+)', costco: true },
      { item: 'Seasonal fruit (oranges, apples, or berries)', qty: 'Weekly', costco: false },
    ],
  },
  {
    id: 'shake',
    time: 'Post-workout',
    name: 'Protein shake',
    emoji: '🥤',
    items: [{ name: 'Protein shake x1', calories: 180, protein: 30, fat: 3, carbs: 8 }],
    note: 'One shake post-workout only. Timed for when you need fast protein without cooking.',
    shoppingList: [{ item: 'Kirkland whey protein', qty: '1 bag', costco: true }],
  },
  {
    id: 'yogurt',
    time: 'Night',
    name: 'Yogurt bowl',
    emoji: '🍒',
    items: [
      { name: '2% Greek yogurt (170g)', calories: 130, protein: 17, fat: 4, carbs: 7 },
      { name: 'Nut-based granola (50g)', calories: 230, protein: 6, fat: 11, carbs: 28 },
      { name: 'Frozen cherries (150g)', calories: 75, protein: 1, fat: 0, carbs: 19 },
      { name: 'PB powder (32g)', calories: 120, protein: 8, fat: 2, carbs: 10 },
      { name: 'Raw honey (21g)', calories: 64, protein: 0, fat: 0, carbs: 17 },
      { name: 'Banana, medium (120g)', calories: 107, protein: 1, fat: 0, carbs: 27 },
    ],
    note: 'PB powder mixed into yogurt becomes a peanut butter sauce. Granola adds crunch and fat. Banana rounds out the carbs. This is your largest meal — good for overnight recovery.',
    shoppingList: [
      { item: 'Kirkland 2% Greek yogurt', qty: '1 large tub', costco: true },
      { item: 'Nut-based granola', qty: '1 bag', costco: true },
      { item: 'Kirkland frozen dark cherries', qty: '1 bag', costco: true },
      { item: 'PB powder', qty: '1 bag', costco: true },
      { item: 'Raw honey', qty: '1 bottle', costco: true },
      { item: 'Bananas', qty: '1 bunch (10+)', costco: true },
    ],
  },
];

// ─────────────────────────────────────────────
// DERIVED — selected this week's dishes
// ─────────────────────────────────────────────
export const selectedLunch = lunchDishes[thisWeek.lunch];
export const selectedDinner = dinnerDishes[thisWeek.dinner];

const lunchMacros = thisWeek.lunchActual ?? selectedLunch.target;
const dinnerMacros = thisWeek.dinnerActual ?? selectedDinner.target;

export const meals = [
  fixedMeals[0], // breakfast
  {
    id: 'lunch',
    time: 'Midday',
    name: selectedLunch.label,
    emoji: selectedLunch.emoji,
    items: [
      {
        name: `1 of 10 portions ${thisWeek.lunchActual ? '(actual)' : '(target)'}`,
        ...lunchMacros,
      },
    ],
    note: selectedLunch.prepNote,
  },
  fixedMeals[1], // shake
  {
    id: 'dinner',
    time: 'Evening',
    name: selectedDinner.label,
    emoji: selectedDinner.emoji,
    items: [
      {
        name: `1 of 10 portions ${thisWeek.dinnerActual ? '(actual)' : '(target)'}`,
        ...dinnerMacros,
      },
    ],
    note: selectedDinner.prepNote,
  },
  fixedMeals[2], // yogurt bowl
];

export const totals = meals.reduce(
  (acc, meal) => {
    meal.items.forEach(item => {
      acc.calories += item.calories;
      acc.protein += item.protein;
      acc.fat += item.fat;
      acc.carbs += item.carbs;
    });
    return acc;
  },
  { calories: 0, protein: 0, fat: 0, carbs: 0 }
);

export function mealTotals(meal: {
  items: { calories: number; carbs: number; fat: number; protein: number }[];
}) {
  return meal.items.reduce(
    (a, i) => ({
      calories: a.calories + i.calories,
      protein: a.protein + i.protein,
      fat: a.fat + i.fat,
      carbs: a.carbs + i.carbs,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );
}
