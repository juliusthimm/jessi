
export const WELLBEING_TOPICS = {
  LEADERSHIP: {
    id: 'leadership',
    title: 'Leadership',
    description: 'Evaluation of leadership skills, communication effectiveness, and ability to guide and inspire others.'
  },
  PERSONAL_GROWTH: {
    id: 'personal_growth',
    title: 'Personal Growth',
    description: 'Assessment of self-development, learning opportunities, and career progression aspirations.'
  },
  FEEDBACK: {
    id: 'feedback',
    title: 'Feedback',
    description: 'Analysis of feedback reception and delivery, openness to criticism, and improvement suggestions.'
  },
  TEAMWORK: {
    id: 'teamwork',
    title: 'Teamwork',
    description: 'Evaluation of collaboration skills, team dynamics, and contribution to group objectives.'
  },
  MOTIVATION: {
    id: 'motivation',
    title: 'Motivation',
    description: 'Assessment of drive, engagement levels, and factors affecting work enthusiasm.'
  },
  PSYCHOLOGICAL_SAFETY: {
    id: 'psychological_safety',
    title: 'Psychological Safety',
    description: 'Analysis of workplace comfort, ability to express opinions, and feeling of security.'
  },
  COMPANY_CULTURE: {
    id: 'company_culture',
    title: 'Company Culture & Practices',
    description: 'Evaluation of organizational values alignment, workplace practices, and cultural fit.'
  }
} as const;

export type WellbeingTopic = keyof typeof WELLBEING_TOPICS;
