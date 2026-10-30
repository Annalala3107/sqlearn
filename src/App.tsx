import { useState, useEffect, lazy, Suspense } from 'react';
import { DetectiveCase, UserStats } from './cases/types';
import { allCases } from './cases';
import { Lesson } from './academy/types';
import { allLessons } from './academy';
import { progressService } from './services/progressService';
import { authService, AuthUser } from './services/authService';
import { Navbar } from './components/Navbar';
import { CaseList } from './components/CaseList';
import { CaseSolver } from './components/CaseSolver';
import { AcademyLessonList } from './components/AcademyLessonList';
import { AcademyLessonPlayer } from './components/AcademyLessonPlayer';
import { OnboardingTour } from './components/OnboardingTour';
import { CheckCircle2 } from 'lucide-react';
import { startViewTransition } from './utils/transition';

// NHÓM 4: CODE-SPLITTING BẰNG REACT.LAZY ĐỂ GIẢM KÍCH THƯỚC BUNDLE CHÍNH
const AdminDashboard = lazy(() =>
  import('./components/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const AuthModal = lazy(() =>
  import('./components/AuthModal').then((m) => ({ default: m.AuthModal }))
);
const GuideModal = lazy(() =>
  import('./components/GuideModal').then((m) => ({ default: m.GuideModal }))
);
const BackupRestoreModal = lazy(() =>
  import('./components/BackupRestoreModal').then((m) => ({ default: m.BackupRestoreModal }))
);

export function App() {
  const [stats, setStats] = useState<UserStats>(() => progressService.getStats());
  const [currentMode, setCurrentMode] = useState<'cases' | 'academy' | 'admin'>('cases');
  const [activeCase, setActiveCase] = useState<DetectiveCase | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Keep stats in sync
    setStats(progressService.getStats());

    // Subscribe to auth state changes
    const unsubscribeAuth = authService.subscribe((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribeAuth();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenGuide = () => setIsGuideOpen(true);
  const handleCloseGuide = () => setIsGuideOpen(false);

  const handleChangeMode = (mode: 'cases' | 'academy' | 'admin') => {
    startViewTransition(() => {
      setCurrentMode(mode);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  // ----------------------------------------------------
  // NHÓM 3: CẦU NỐI ĐIỀU HƯỚNG LIÊN MÔN (DUAL-TRACK BRIDGES)
  // ----------------------------------------------------
  const handleNavigateToCase = (caseId: string) => {
    const found = allCases.find((c) => c.id === caseId);
    if (found) {
      startViewTransition(() => {
        setActiveLesson(null);
        setActiveCase(found);
        setCurrentMode('cases');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      showToast(`Đã chuyển sang ${found.title}! 🕵️`);
    }
  };

  const handleNavigateToLesson = (lessonId: string) => {
    const found = allLessons.find((l) => l.id === lessonId);
    if (found) {
      startViewTransition(() => {
        setActiveCase(null);
        setActiveLesson(found);
        setCurrentMode('academy');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      showToast(`Đã mở bài học: ${found.title}! 🎓`);
    }
  };

  // ----------------------------------------------------
  // AUTH & PROGRESS HANDLERS
  // ----------------------------------------------------
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    showToast(`Xin chào ${user.name}! Đăng nhập Google thành công.`);
    if (user.role === 'admin') {
      setTimeout(() => {
        if (window.confirm('Tài khoản của bạn có quyền Quản trị viên (Admin). Bạn có muốn mở ngay Cổng Quản Trị?')) {
          handleChangeMode('admin');
        }
      }, 400);
    }
  };

  const handleLogout = async () => {
    await authService.signOut();
    setCurrentUser(null);
    if (currentMode === 'admin') {
      handleChangeMode('cases');
    }
    showToast('Đã đăng xuất an toàn khỏi tài khoản Google.');
  };

  const handleSyncCloud = () => {
    const res = authService.syncProgressWithCloud(stats);
    if (res.success) {
      showToast('Tiến trình học tập đã được đồng bộ an toàn lên Cloud!');
    }
  };

  const handleStatsRestored = (newStats: UserStats) => {
    setStats(newStats);
    showToast(`Khôi phục thành công! Điểm hiện tại: ${newStats.xp} XP`);
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
    if (currentUser) {
      authService.syncProgressWithCloud(updatedStats);
    }
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
    if (currentUser) {
      authService.syncProgressWithCloud(updatedStats);
    }
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
      if (currentMode === 'admin') {
        setCurrentMode('cases');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  // RENDER: Nếu đang ở CỔNG QUẢN TRỊ ADMIN DASHBOARD (Bước 2)
  if (currentMode === 'admin') {
    return (
      <div className="min-h-screen bg-noir-950">
        <Suspense fallback={<div className="p-12 text-center text-slate-400 font-mono text-sm">Đang tải Cổng Quản Trị...</div>}>
          <AdminDashboard
            currentUser={currentUser}
            onBackToApp={() => handleChangeMode('cases')}
            onLogout={handleLogout}
            onSelectCase={(caseId) => {
              const found = allCases.find((c) => c.id === caseId);
              if (found) {
                handleSelectCase(found);
                handleChangeMode('cases');
              }
            }}
            onSelectLesson={(lessonId) => {
              const found = allLessons.find((l) => l.id === lessonId);
              if (found) {
                handleSelectLesson(found);
                handleChangeMode('academy');
              }
            }}
          />
        </Suspense>
      </div>
    );
  }

  // RENDER: CỔNG HỌC VIÊN & THÁM TỬ CHÍNH
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
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          onSyncCloud={handleSyncCloud}
          onOpenBackupRestore={() => setIsBackupModalOpen(true)}
        />

        <main>
          {currentMode === 'cases' ? (
            activeCase ? (
              <CaseSolver
                caseData={activeCase}
                progress={stats.completedCases[activeCase.id]}
                onBack={handleBackToCases}
                onCaseSolved={handleCaseSolved}
                onNavigateToLesson={handleNavigateToLesson}
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
              onNavigateToCase={handleNavigateToCase}
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

      {/* Lazy Modals with Suspense (Nhóm 4 Code-Splitting) */}
      <Suspense fallback={null}>
        {/* Auth Modal with Mobile-First Google SSO */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Beginner Onboarding & User Guide Modal */}
        <GuideModal
          isOpen={isGuideOpen}
          onClose={handleCloseGuide}
          onNavigateToAcademy={() => handleChangeMode('academy')}
          onNavigateToCases={() => handleChangeMode('cases')}
          onRestartTour={() => {
            handleChangeMode('cases');
            setIsTourOpen(true);
          }}
        />

        {/* NHÓM 4: Backup & Restore JSON Modal */}
        <BackupRestoreModal
          isOpen={isBackupModalOpen}
          onClose={() => setIsBackupModalOpen(false)}
          onStatsRestored={handleStatsRestored}
        />
      </Suspense>

      {/* Onboarding Interactive Tour (Tự động kích hoạt cho khách mới hoặc mở từ sổ tay) */}
      <OnboardingTour
        isOpenOverride={isTourOpen ? true : undefined}
        onCloseOverride={() => setIsTourOpen(false)}
        onComplete={() => {
          setIsTourOpen(false);
          showToast('Hoàn tất hướng dẫn tân thủ! Chúc bạn phá án thành công 🕵️✨');
        }}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-noir-900 border border-noir-700 text-slate-100 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Bottom padding for safe area */}
      <div className="pb-10 sm:pb-12" />
    </div>
  );
}

export default App;
