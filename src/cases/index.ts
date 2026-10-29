import { DetectiveCase } from './types';
import { level1Cases } from './level1';
import { level2Cases } from './level2';
import { level3Cases } from './level3';

// Re-export individual levels if needed
export { level1Cases, level2Cases, level3Cases };

// Toàn bộ 30 vụ án trinh thám SQL
export const allCases: DetectiveCase[] = [
  ...level1Cases,
  ...level2Cases,
  ...level3Cases,
];

export function getRankFromXp(xp: number): { title: string; badge: string; nextXp: number } {
  if (xp >= 8000) {
    return { title: 'Thần Thám Tối Thượng (Master Noir)', badge: '🔥', nextXp: 10000 };
  } else if (xp >= 5000) {
    return { title: 'Thần Thám Huyền Thoại', badge: '👑', nextXp: 8000 };
  } else if (xp >= 2500) {
    return { title: 'Đại Thám Tử Khét Tiếng', badge: '⭐⭐⭐', nextXp: 5000 };
  } else if (xp >= 1000) {
    return { title: 'Thám Tử Điều Tra Cao Cấp', badge: '⭐⭐', nextXp: 2500 };
  } else if (xp >= 300) {
    return { title: 'Thám Tử Chính Thức', badge: '⭐', nextXp: 1000 };
  } else {
    return { title: 'Thám Tử Tập Sự', badge: '🔍', nextXp: 300 };
  }
}
