import type { Situation } from '@/types';

export const situations: Situation[] = [
  {
    slug: 'work',
    name: 'Work & Office',
    description: 'Vocabulary and phrases for the German workplace — meetings, tasks, and office communication.',
    icon: 'briefcase',
    color: 'var(--color-terracotta)',
  },
  {
    slug: 'smalltalk',
    name: 'Small Talk',
    description: 'Casual conversation starters, weather talk, weekend plans, and social chitchat.',
    icon: 'chat',
    color: 'var(--color-sage)',
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    description: 'Navigating doctors, pharmacies, insurance, and describing symptoms in German.',
    icon: 'heart',
    color: 'var(--color-info)',
  },
  {
    slug: 'meetings',
    name: 'Meetings',
    description: 'Leading and participating in meetings — agendas, opinions, and decisions.',
    icon: 'users',
    color: '#8B6F5E',
  },
  {
    slug: 'emails',
    name: 'Emails',
    description: 'Writing professional emails — greetings, requests, and formal closings.',
    icon: 'mail',
    color: '#7B8FA1',
  },
  {
    slug: 'travel',
    name: 'Travel',
    description: 'Getting around Germany — trains, hotels, directions, and travel planning.',
    icon: 'map',
    color: '#A07855',
  },
  {
    slug: 'shopping',
    name: 'Shopping',
    description: 'Buying groceries, clothing, and navigating German stores and markets.',
    icon: 'shopping-bag',
    color: '#9B7EBD',
  },
  {
    slug: 'bureaucracy',
    name: 'Bureaucracy',
    description: 'Dealing with German authorities — registration, documents, and official processes.',
    icon: 'file-text',
    color: '#6B8E8E',
  },
  {
    slug: 'phone',
    name: 'Phone Calls',
    description: 'Making and receiving calls — appointments, inquiries, and phone etiquette.',
    icon: 'phone',
    color: '#B5835A',
  },
  {
    slug: 'housing',
    name: 'Housing',
    description: 'Finding and managing apartments — listings, contracts, and communicating with landlords.',
    icon: 'home',
    color: '#7EA87E',
  },
];

export function getSituationBySlug(slug: string): Situation | undefined {
  return situations.find((s) => s.slug === slug);
}
