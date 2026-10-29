import { useState, useEffect } from 'react';
import { DetectiveCase, UserStats } from './cases/types';
import { allCases } from './cases';
import { progressService } from './services/progressService';
import { Navbar } from './components/Navbar';
import { CaseList } from './components/CaseList';
import { CaseSolver } from './components/CaseSolver';
import { Shield, Heart } from 'lucide-react';
import { startViewTransition } from './utils/transition';

export function App() {
  const [stats, setStats] = useState<UserStats>(() => progressService.getStats());
  const [activeCase, setActiveCase] = useState<DetectiveCase | null>(null);

  useEffect(() => {
    // Keep stats in sync
    setStats(progressService.getStats());
  }, []);

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

  const handleResetStats = () => {
    progressService.resetProgress();
    setStats(progressService.getStats());
  };

  return (
    <div className="min-h-screen bg-noir-950 flex flex-col justify-between selection:bg-noir-accent/30 selection:text-noir-gold">
      <div>
        <Navbar
          stats={stats}
          currentCaseTitle={activeCase ? activeCase.title : undefined}
          onBackToCases={handleBackToCases}
          onResetStats={handleResetStats}
        />

        <main>
          {activeCase ? (
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
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-12 sm:mt-16 border-t border-noir-800 bg-noir-900/60 py-8 text-center text-xs text-slate-500 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center space-x-2 text-slate-400 font-cinzel">
            <Shield className="w-4 h-4 text-noir-accent" />
            <span className="font-bold tracking-wider">SQL THÁM TỬ VN</span>
          </div>
          <p className="max-w-md mx-auto text-slate-400">
            Học và nâng cao tư duy truy vấn cơ sở dữ liệu qua các bài tập điều tra phá án thực tế. Toàn bộ câu lệnh được thực thi trực tiếp trên trình duyệt của bạn với SQLite WebAssembly.
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
