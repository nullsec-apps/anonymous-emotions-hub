import { HeartCrack, Sun, Waves, Smile, Moon, type LucideIcon } from 'lucide-react';

export interface Identity { alias: string; aura: string[]; auraName: string }
export interface Feeling { id: string; author: string; aura: string[]; emotion: string; intensity: number; text: string; time: number; reactions: { hold: number; feel: number; alone: number }; open: boolean }
export interface Bond { id: string; alias: string; aura: string[]; emotion: string }

export const EMOTIONS = [
  { id: 'heartbreak', label: 'Heartbreak', color: '#F472B6' },
  { id: 'hope', label: 'Hope', color: '#5EEAD4' },
  { id: 'overwhelm', label: 'Overwhelm', color: '#FB923C' },
  { id: 'joy', label: 'Quiet Joy', color: '#FCD34D' },
  { id: 'lonely', label: 'Lonely', color: '#818CF8' },
  { id: 'numb', label: 'Numb', color: '#94A3B8' },
];

export const AURAS: { name: string; colors: string[] }[] = [
  { name: 'Lavender', colors: ['#A78BFA', '#7C3AED'] },
  { name: 'Aurora', colors: ['#5EEAD4', '#A78BFA'] },
  { name: 'Rose', colors: ['#F472B6', '#BE185D'] },
  { name: 'Ember', colors: ['#FB923C', '#F472B6'] },
  { name: 'Twilight', colors: ['#818CF8', '#5EEAD4'] },
  { name: 'Honey', colors: ['#FCD34D', '#FB923C'] },
  { name: 'Moonstone', colors: ['#94A3B8', '#A78BFA'] },
  { name: 'Cyan', colors: ['#22D3EE', '#5EEAD4'] },
];

const ADJ = ['Quiet', 'Velvet', 'Drifting', 'Hidden', 'Soft', 'Lunar', 'Fading', 'Tender', 'Silent', 'Wandering', 'Hollow', 'Gentle', 'Distant', 'Weary', 'Glowing'];
const NOUN = ['Ember', 'Tide', 'Echo', 'Willow', 'Cinder', 'Halcyon', 'Lantern', 'Mirage', 'Solace', 'Vellum', 'Aether', 'Hollow', 'Petal', 'Static', 'Dusk'];

export function generateIdentity(): Identity {
  const aura = AURAS[Math.floor(Math.random() * AURAS.length)];
  return { alias: `${ADJ[Math.floor(Math.random() * ADJ.length)]} ${NOUN[Math.floor(Math.random() * NOUN.length)]}`, aura: aura.colors, auraName: aura.name };
}

function ri(arr: any[]) { return arr[Math.floor(Math.random() * arr.length)]; }

const TEXTS = [
  "I keep smiling at work so no one asks. The mask is getting heavier.",
  "Today I noticed the light hitting the kitchen wall and for one second everything felt okay.",
  "I miss someone who stopped missing me a long time ago.",
  "Everyone thinks I'm strong. I'm just good at hiding how close I am to breaking.",
  "I made it out of bed today. I know that's small but it felt like climbing a mountain.",
  "Why does silence feel so loud at 3am?",
  "I think I'm finally starting to forgive myself. Slowly. Quietly.",
  "The loneliest moments are the ones in a crowded room.",
  "I cried in the shower again so no one would hear. The water helps.",
  "Someone smiled at me on the train and I almost teared up. I needed that more than I knew.",
  "I'm tired in a way that sleep doesn't fix.",
  "There's a version of me I keep promising I'll become. Today I took one step toward her.",
];

export const seedFeelings: Feeling[] = Array.from({ length: 9 }, (_, i) => {
  const id = generateIdentity();
  return { id: 'seed' + i, author: id.alias, aura: id.aura, emotion: ri(EMOTIONS).id, intensity: 40 + Math.floor(Math.random() * 55), text: TEXTS[i], time: Date.now() - (i + 1) * 1000 * 60 * (5 + Math.floor(Math.random() * 40)), reactions: { hold: Math.floor(Math.random() * 18), feel: Math.floor(Math.random() * 22), alone: Math.floor(Math.random() * 12) }, open: true };
});

export const seedBonds: Bond[] = Array.from({ length: 4 }, (_, i) => {
  const id = generateIdentity();
  return { id: 'bond' + i, alias: id.alias, aura: id.aura, emotion: ri(EMOTIONS).label.toLowerCase() };
});

export const seedRooms = [
  { name: 'Heartbreak Harbor', desc: 'For the ache of loving and losing.', color: '#F472B6', icon: HeartCrack, occupants: 47 },
  { name: 'Hope Garden', desc: 'Where small lights are kept alive.', color: '#5EEAD4', icon: Sun, occupants: 62 },
  { name: 'The Overwhelm', desc: 'When it all becomes too much.', color: '#FB923C', icon: Waves, occupants: 38 },
  { name: 'Quiet Joy', desc: 'Tiny moments worth holding onto.', color: '#FCD34D', icon: Smile, occupants: 29 },
  { name: 'Lonely Nights', desc: 'For the company of fellow night-wanderers.', color: '#818CF8', icon: Moon, occupants: 84 },
] as { name: string; desc: string; color: string; icon: LucideIcon; occupants: number }[];

export function resonance(emotion: string, feelings: Feeling[]): number {
  const matching = feelings.filter(f => f.emotion === emotion || emotion.includes(f.emotion)).length;
  return Math.min(98, 55 + matching * 6 + Math.floor(Math.random() * 15));
}
