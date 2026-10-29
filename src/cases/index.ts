import { DetectiveCase } from './types';
import { case001 } from './case-001';
import { case002 } from './case-002';
import { case003 } from './case-003';

export const allCases: DetectiveCase[] = [
  case001,
  case002,
  case003,
];

export function getRankFromXp(xp: number): { title: string; badge: string; nextXp: number } {
  if (xp >= 800) {
    return { title: 'Thần Thám Bậc Thầy', badge: '⭐⭐⭐', nextXp: 800 };
  } else if (xp >= 350) {
    return { title: 'Thám Tử Điều Tra Cao Cấp', badge: '⭐⭐', nextXp: 800 };
  } else if (xp >= 100) {
    return { title: 'Thám Tử Chính Thức', badge: '⭐', nextXp: 350 };
  } else {
    return { title: 'Thám Tử Tập Sự', badge: '🔍', nextXp: 100 };
  }
}
