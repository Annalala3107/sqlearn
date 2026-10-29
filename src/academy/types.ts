import { TableSchema } from '../cases/types';

export type StageId = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface LessonQuiz {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface LessonExercise {
  goal: string;
  taskDescription: string;
  starterQuery: string;
  expectedQuery: string;
  hints: string[];
  explanation: string;
}

export interface Lesson {
  id: string;
  order: number;
  stage: StageId;
  stageTitle: string;
  title: string;
  subtitle: string;
  category: string;
  timeEstimate: string;
  xpReward: number;
  iconName?: string;
  concept: string; // Markdown / formatted explanation
  syntaxExample: string;
  schemas: TableSchema[];
  seedSql: string[];
  exercise: LessonExercise;
  quizzes?: LessonQuiz[];
  isCapstoneProject?: boolean;
}

export interface StageMeta {
  id: StageId;
  order: number;
  title: string;
  badge: string;
  color: string;
  tagline: string;
  description: string;
  targetSkill: string;
}
