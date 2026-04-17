export type MealPlan = {
  title: string;
  description: string;
  items: Array<{ meal: string; name: string; calories: number; emoji: string }>;
  totalCalories: number;
  tags: string[];
};

export type Startup = {
  name: string;
  tagline: string;
  problem: string;
  features: Array<{ title: string; description: string }>;
  targetMarket: string;
  pricing: string;
};

export type Travel = {
  destination: string;
  theme: string;
  morning: { activity: string; tip: string };
  afternoon: { activity: string; tip: string };
  evening: { activity: string; tip: string };
  tips: string[];
};

export type StreamKey = 'meal' | 'startup' | 'travel';
export type TabKey = StreamKey | 'about';
export type DemoData = MealPlan | Startup | Travel;
