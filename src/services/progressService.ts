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

  recordLessonCompletion(lessonId: string, xpReward: number): UserStats {
    const current = this.getStats();
    const alreadyCompleted = !!current.completedLessons?.[lessonId]?.completed;

    const newXp = alreadyCompleted ? current.xp : current.xp + xpReward;

    const updated: UserStats = {
      ...current,
      xp: newXp,
      completedLessons: {
        ...(current.completedLessons || {}),
        [lessonId]: {
          completed: true,
          completedAt: new Date().toISOString(),
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

  /**
   * NHÓM 4: BẢO TOÀN DỮ LIỆU - Xuất file sao lưu JSON
   */
  exportProgressJson(): string {
    const stats = this.getStats();
    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      appName: 'SQL Thám Tử / SQLearn VN',
      stats,
    };
    return JSON.stringify(backup, null, 2);
  },

  /**
   * NHÓM 4: BẢO TOÀN DỮ LIỆU - Nạp khôi phục từ file JSON
   */
  importProgressJson(jsonStr: string): { success: boolean; message: string; updatedStats?: UserStats } {
    try {
      const parsed = JSON.parse(jsonStr);
      const incomingStats: UserStats = parsed.stats || parsed;

      if (typeof incomingStats.xp !== 'number' || typeof incomingStats.completedCases !== 'object') {
        return {
          success: false,
          message: 'Tệp tin không đúng định dạng sao lưu của SQL Thám Tử.',
        };
      }

      const merged: UserStats = {
        ...DEFAULT_STATS,
        ...incomingStats,
      };

      this.saveStats(merged);
      return {
        success: true,
        message: `Đã khôi phục thành công! (${merged.xp} XP, ${Object.keys(merged.completedCases).length} vụ án, ${Object.keys(merged.completedLessons || {}).length} bài học).`,
        updatedStats: merged,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Lỗi đọc file JSON: ${err?.message || 'Tệp tin bị hỏng'}`,
      };
    }
  },
};
