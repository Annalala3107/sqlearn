import { allLessons } from './lessons';

export * from './types';
export * from './stages';
export * from './lessons';

export function getLessonById(id: string) {
  return allLessons.find((l) => l.id === id);
}

export function getLessonsByStage(stageId: string) {
  return allLessons.filter((l) => l.stage === stageId);
}
