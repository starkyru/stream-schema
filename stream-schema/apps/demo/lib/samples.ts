import type { StreamKey } from './types';

export const SAMPLES: Record<StreamKey, string> = {
  meal: JSON.stringify(
    {
      title: 'Mediterranean Monday',
      description:
        'Light, heart-healthy meals inspired by the coastal cuisines of Greece and Southern Italy.',
      items: [
        {
          meal: 'Breakfast',
          name: 'Greek yogurt with thyme honey, crushed walnuts & pomegranate',
          calories: 340,
          emoji: '🫙',
        },
        {
          meal: 'Lunch',
          name: 'Grilled halloumi & roasted pepper salad with lemon vinaigrette',
          calories: 490,
          emoji: '🥗',
        },
        {
          meal: 'Dinner',
          name: 'Baked sea bass with capers, olives & cherry tomatoes',
          calories: 560,
          emoji: '🐟',
        },
        {
          meal: 'Snack',
          name: 'Hummus with warm pita, cucumber & kalamata olives',
          calories: 210,
          emoji: '🫓',
        },
      ],
      totalCalories: 1600,
      tags: ['Mediterranean', 'Heart-healthy', 'High protein', 'Anti-inflammatory'],
    },
    null,
    2
  ),

  startup: JSON.stringify(
    {
      name: 'Orbital',
      tagline: 'The async task manager built for distributed teams',
      problem:
        'Remote engineering teams waste 4+ hours weekly on status meetings that could be fully async.',
      features: [
        {
          title: 'Async standups',
          description: 'Record a 90-second video or text update on your own schedule',
        },
        {
          title: 'AI summaries',
          description: 'Get distilled team progress each morning without reading every update',
        },
        {
          title: 'Smart nudges',
          description: 'Gentle reminders based on blocking dependencies, not arbitrary calendars',
        },
        {
          title: 'Timeline view',
          description: 'See exactly when each piece lands so nothing ships in the dark',
        },
      ],
      targetMarket: 'Startups and scale-ups with distributed engineering teams of 10-200 people',
      pricing: '$14 per seat / month, free for teams under 5',
    },
    null,
    2
  ),

  travel: JSON.stringify(
    {
      destination: 'Kyoto, Japan',
      theme: 'Temples, matcha, and hidden gardens off the tourist trail',
      morning: {
        activity: 'Fushimi Inari Taisha at sunrise - hike the upper torii path',
        tip: 'Arrive before 6:30am. The lower gates are photographed to death; the upper mountain is almost always empty.',
      },
      afternoon: {
        activity: "Arashiyama bamboo grove, then Tenryu-ji's moss garden",
        tip: 'Skip the main bamboo path. Buy a garden ticket through Tenryu-ji - it leads to a quieter, better-maintained grove entrance.',
      },
      evening: {
        activity: 'Dinner in Pontocho alley, then Gion corner walk',
        tip: 'Look for restaurants where staff are setting up by 5pm - early tables avoid the rush and get more attentive service.',
      },
      tips: [
        'Get a Suica IC card at Kyoto Station - works on all buses and trains',
        'Nishiki Market is best before 9am, unbearable after noon',
        'Most temples are cash-only for entry',
      ],
    },
    null,
    2
  ),
};
