import { useState, useEffect } from 'react';
import { DetectiveCase, UserStats } from './cases/types';
import { allCases } from './cases';
import { Lesson } from './academy/types';
import { allLessons } from './academy';
import { progressService } from './services/progressService';
import { Navbar } from './components/Navbar';
import { CaseList } from './components/CaseList';
import { CaseSolver } from './components/CaseSolver';
import { AcademyLessonList } from './components/AcademyLessonList';
import { AcademyLessonPlayer } from './components/AcademyLessonPlayer';
import { GuideModal } from './components/GuideModal';
import { Shield, Heart } from 'lucide-react';
import { startViewTransition } from './utils/transition';

export function App() {
  const [stats, setStats] = useState<UserStats>(() => progressService.getStats());
  const [currentMode, setCurrentMode] = useState<'cases' | 'academy'>('cases');
  const [activeCase, setActiveCase] = useState<DetectiveCase | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    // Keep stats in sync
    setStats(progressService.getStats());

    // Auto-open guide for first-time visitors
    const hasSeenGuide = localStorage.getItem('sqlearn_guide_seen');
    if (!hasSeenGuide) {
      const timer = setTimeout(() => {
        setIsGuideOpen(true);
        localStorage.setItem('sqlearn_guide_seen', 'true');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleOpenGuide = () => setIsGuideOpen(true);
  const handleCloseGuide = () => setIsGuideOpen(false);

  const handleChangeMode = (mode: 'cases' | 'academy') => {
    startViewTransition(() => {
      setCurrentMode(mode);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  // ----------------------------------------------------
  // CASE SOLVER HANDLERS
  // ----------------------------------------------------
  const handleSelectCase = (c: DetectiveCase) => {
    startViewTransition(() => {
      setActiveCase(c);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleBackToCases = () => {
    startViewTransition(() => {
      setActiveCase(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleCaseSolved = (caseId: string, xpReward: number) => {
    const updatedStats = progressService.recordCaseCompletion(caseId, xpReward);
    setStats(updatedStats);
  };

  const handleNextCase = () => {
    if (!activeCase) return;
    const currentIndex = allCases.findIndex((c) => c.id === activeCase.id);
    if (currentIndex >= 0 && currentIndex < allCases.length - 1) {
      startViewTransition(() => {
        setActiveCase(allCases[currentIndex + 1]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } else {
      startViewTransition(() => {
        setActiveCase(null);
      });
    }
  };

  // ----------------------------------------------------
  // ACADEMY LESSON HANDLERS
  // ----------------------------------------------------
  const handleSelectLesson = (l: Lesson) => {
    startViewTransition(() => {
      setActiveLesson(l);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleBackFromLesson = () => {
    startViewTransition(() => {
      setActiveLesson(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleLessonCompleted = (lessonId: string, xpReward: number) => {
    const updatedStats = progressService.recordLessonCompletion(lessonId, xpReward);
    setStats(updatedStats);
  };

  const handleNextLesson = () => {
    if (!activeLesson) return;
    const currentIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      startViewTransition(() => {
        setActiveLesson(allLessons[currentIndex + 1]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } else {
      startViewTransition(() => {
        setActiveLesson(null);
      });
    }
  };

  const handleResetStats = () => {
    progressService.resetProgress();
    setStats(progressService.getStats());
  };

  const handleBackToHome = () => {
    startViewTransition(() => {
      setActiveCase(null);
      setActiveLesson(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  return (
    <div className="min-h-screen bg-noir-950 flex flex-col justify-between selection:bg-noir-accent/30 selection:text-noir-gold">
      <div>
        <Navbar
          stats={stats}
          currentMode={currentMode}
          onChangeMode={handleChangeMode}
          currentCaseTitle={activeCase ? activeCase.title : undefined}
          currentLessonTitle={activeLesson ? activeLesson.title : undefined}
          onBackToHome={handleBackToHome}
          onResetStats={handleResetStats}
          onOpenGuide={handleOpenGuide}
        />

        <main>
          {currentMode === 'cases' ? (
            activeCase ? (
              <CaseSolver
                caseData={activeCase}
                progress={stats.completedCases[activeCase.id]}
                onBack={handleBackToCases}
                onCaseSolved={handleCaseSolved}
                onNextCase={
                  allCases.findIndex((c) => c.id === activeCase.id) < allCases.length - 1
                    ? handleNextCase
                    : undefined
                }
              />
            ) : (
              <CaseList
                cases={allCases}
                stats={stats}
                onSelectCase={handleSelectCase}
                onNavigateToAcademy={() => handleChangeMode('academy')}
                onOpenGuide={handleOpenGuide}
              />
            )
          ) : activeLesson ? (
            <AcademyLessonPlayer
              lesson={activeLesson}
              isCompleted={!!stats.completedLessons?.[activeLesson.id]?.completed}
              onBack={handleBackFromLesson}
              onLessonCompleted={handleLessonCompleted}
              onNextLesson={
                allLessons.findIndex((l) => l.id === activeLesson.id) < allLessons.length - 1
                  ? handleNextLesson
                  : undefined
              }
            />
          ) : (
            <AcademyLessonList
              stats={stats}
              onSelectLesson={handleSelectLesson}
              onOpenGuide={handleOpenGuide}
            />
          )}
        </main>
      </div>

      {/* Beginner Onboarding & User Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={handleCloseGuide}
        onNavigateToAcademy={() => handleChangeMode('academy')}
        onNavigateToCases={() => handleChangeMode('cases')}
      />

      {/* Footer */}
      <footer className="mt-12 sm:mt-16 border-t border-noir-800 bg-noir-900/60 py-8 text-center text-xs text-slate-500 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center space-x-2 text-slate-400 font-cinzel">
            <Shield className="w-4 h-4 text-noir-accent" />
            <span className="font-bold tracking-wider">SQL THÁM TỬ VN • HỌC VIỆN SQL TƯƠNG TÁC</span>
          </div>
          <p className="max-w-md mx-auto text-slate-400">
            Học và nâng cao tư duy truy vấn cơ sở dữ liệu qua các bài tập điều tra phá án và giáo trình tương tác từ cơ bản đến nâng cao. Toàn bộ câu lệnh được thực thi trực tiếp trên trình duyệt với SQLite WebAssembly.
          </p>
          <div className="pt-2 flex items-center justify-center space-x-1 text-slate-400">
            <span>Xây dựng với</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>dành cho cộng đồng học SQL Việt Nam</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
