export type Difficulty = 'dễ' | 'trung bình' | 'nâng cao';

export interface ColumnInfo {
  name: string;
  type: string;
  description: string;
}

export interface ForeignKeyInfo {
  fromColumn: string;
  toTable: string;
  toColumn: string;
}

export interface TableSchema {
  name: string;
  description?: string;
  columns: ColumnInfo[];
  foreignKeys?: ForeignKeyInfo[];
}

export interface CaseObjective {
  id: number;
  text: string;
  hint?: string;
}

export interface CaseSolution {
  culprit: string;
  successTitle: string;
  successMessage: string;
  explanation: string;
  referenceQuery: string;
}

export interface DetectiveCase {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: string;
  xpReward: number;
  timeEstimate: string;
  date: string;
  location: string;
  coverImage?: string;
  brief: string;
  clues: string[];
  objectives: CaseObjective[];
  schemas: TableSchema[];
  seedSql: string[];
  solution: CaseSolution;
  starterQuery?: string;
}

export interface CaseProgress {
  completed: boolean;
  completedAt?: string;
  bestQuery?: string;
}

export interface UserStats {
  xp: number;
  rank: string;
  completedCases: Record<string, CaseProgress>;
  completedLessons?: Record<string, { completed: boolean; completedAt: string }>;
  notes: Record<string, string>;
}
