import { useState, useEffect } from 'react';
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
import { GuideModal } from './components/GuideModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Shield, Heart, CheckCircle2 } from 'lucide-react';
import { startViewTransition } from './utils/transition';

export function App() {
  const [stats, setStats] = useState<UserStats>(() => progressService.getStats());
  const [currentMode, setCurrentMode] = useState<'cases' | 'academy' | 'admin'>('cases');
  const [activeCase, setActiveCase] = useState<DetectiveCase | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Keep stats in sync
    setStats(progressService.getStats());

    // Subscribe to auth state changes
    const unsubscribeAuth = authService.subscribe((user) => {
      setCurrentUser(user);
    });

    // Auto-open guide for first-time visitors
    const hasSeenGuide = localStorage.getItem('sqlearn_guide_seen');
    if (!hasSeenGuide) {
      const timer = setTimeout(() => {
        setIsGuideOpen(true);
        localStorage.setItem('sqlearn_guide_seen', 'true');
      }, 700);
      return () => {
        clearTimeout(timer);
        unsubscribeAuth();
      };
    }

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

      {/* Auth Modal with Mobile-First Google SSO (Bước 1 & Bước 3) */}
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
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-noir-900 border border-noir-700 text-slate-100 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

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
