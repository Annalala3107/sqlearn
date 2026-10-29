import { UserStats } from '../cases/types';

const STORAGE_KEY = 'sql_tham_tu_user_stats_v1';

const DEFAULT_STATS: UserStats = {
  xp: 0,
  rank: 'Thám Tử Tập Sự',
  completedCases: {},
  notes: {},
};

export const progressService = {
  getStats(): UserStats {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return DEFAULT_STATS;
      return { ...DEFAULT_STATS, ...JSON.parse(data) };
    } catch (e) {
      console.warn('Lỗi đọc tiến độ từ localStorage:', e);
      return DEFAULT_STATS;
    }
  },

  saveStats(stats: UserStats): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.warn('Lỗi ghi tiến độ vào localStorage:', e);
    }
  },

  recordCaseCompletion(caseId: string, xpReward: number, bestQuery?: string): UserStats {
    const current = this.getStats();
    const alreadyCompleted = !!current.completedCases[caseId]?.completed;

    const newXp = alreadyCompleted ? current.xp : current.xp + xpReward;

    const updated: UserStats = {
      ...current,
      xp: newXp,
      completedCases: {
        ...current.completedCases,
        [caseId]: {
          completed: true,
          completedAt: new Date().toISOString(),
          bestQuery: bestQuery || current.completedCases[caseId]?.bestQuery,
        },
      },
    };

    this.saveStats(updated);
    return updated;
  },

  saveCaseNote(caseId: string, note: string): void {
    const current = this.getStats();
    current.notes[caseId] = note;
    this.saveStats(current);
  },

  getCaseNote(caseId: string): string {
    const current = this.getStats();
    return current.notes[caseId] || '';
  },

  resetProgress(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  },
};
