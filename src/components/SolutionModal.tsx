import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Award, CheckCircle, AlertCircle, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { DetectiveCase } from '../cases/types';

interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: DetectiveCase;
  isCompleted: boolean;
  onSuccess: (caseId: string, xpReward: number) => void;
  onNextCase?: () => void;
}

export const SolutionModal: React.FC<SolutionModalProps> = ({
  isOpen,
  onClose,
  caseData,
  isCompleted,
  onSuccess,
  onNextCase,
}) => {
  const [suspectInput, setSuspectInput] = useState('');
  const [isWrong, setIsWrong] = useState(false);
  const [solved, setSolved] = useState(isCompleted);

  if (!isOpen) return null;

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspectInput.trim()) return;

    const inputNorm = normalize(suspectInput);
    const answerNorm = normalize(caseData.solution.culprit);

    if (inputNorm.includes(answerNorm) || answerNorm.includes(inputNorm)) {
      setIsWrong(false);
      setSolved(true);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e5a93c', '#f3c766', '#ffffff', '#22c55e'],
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }

      onSuccess(caseData.id, caseData.xpReward);
    } else {
      setIsWrong(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-noir-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-noir-900 border border-noir-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-noir-accent/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 hover:bg-noir-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {solved ? (
          /* Victory Screen */
          <div className="space-y-5 text-center pt-2">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500/80 mx-auto flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/50">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-noir-accent/20 border border-noir-accent/40 text-noir-gold text-xs font-mono font-bold mb-2">
                <Award className="w-3.5 h-3.5 mr-1" />
                +{caseData.xpReward} XP ĐÃ ĐƯỢC CỘNG
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
                {caseData.solution.successTitle}
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {caseData.solution.successMessage}
            </p>

            {/* Explanation box */}
            <div className="text-left bg-noir-950/90 border border-noir-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-noir-gold">
                <BookOpen className="w-4 h-4 text-noir-accent" />
                <span>Báo Cáo Phá Án Chi Tiết</span>
              </div>
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                {caseData.solution.explanation}
              </p>

              <div className="pt-2 border-t border-noir-800/80">
                <span className="text-[11px] text-slate-400 font-mono block mb-1">
                  Truy vấn SQL tối ưu tham khảo:
                </span>
                <code className="block p-2.5 bg-noir-900 rounded-lg border border-noir-800 text-[11px] text-noir-gold font-mono overflow-x-auto">
                  {caseData.solution.referenceQuery}
                </code>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-noir-800 hover:bg-noir-750 text-slate-300 font-medium text-sm transition-colors cursor-pointer"
              >
                Đóng & Xem Lại Hiện Trường
              </button>
              {onNextCase && (
                <button
                  onClick={() => {
                    onClose();
                    onNextCase();
                  }}
                  className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-noir-accent to-amber-500 hover:from-amber-400 hover:to-amber-500 text-noir-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer"
                >
                  <span>Vụ Án Tiếp Theo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Accusation Form */
          <div className="space-y-4 pt-1">
            <div className="flex items-center space-x-2 text-noir-gold font-bold text-lg">
              <Sparkles className="w-5 h-5 text-noir-accent" />
              <h2>Lệnh Bắt Giữ & Buộc Tội</h2>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Dựa vào các kết quả truy vấn SQL bạn vừa thực hiện, hãy chỉ định đích danh tên của thủ phạm trong vụ án <strong className="text-slate-200">{caseData.title}</strong>:
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  Họ và tên thủ phạm:
                </label>
                <input
                  type="text"
                  value={suspectInput}
                  onChange={(e) => {
                    setSuspectInput(e.target.value);
                    if (isWrong) setIsWrong(false);
                  }}
                  placeholder="Ví dụ: Trần Mạnh Long"
                  className="w-full px-4 py-3 bg-noir-950 border border-noir-700 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-noir-accent font-sans text-sm"
                  autoFocus
                />
              </div>

              {isWrong && (
                <div className="flex items-start space-x-2 p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Chưa chính xác! Người này không khớp với các manh mối hoặc đã có chứng cứ ngoại phạm vững chắc. Hãy đối soát kỹ lại các bảng dữ liệu!
                  </span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-sm font-medium hover:bg-noir-850 transition-colors cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-noir-accent to-amber-500 hover:from-amber-400 hover:to-amber-500 text-noir-950 font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  Xác Nhận Buộc Tội
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
