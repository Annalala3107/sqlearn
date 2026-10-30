import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Check, X, Compass } from 'lucide-react';

export interface TourStep {
  targetSelector: string;
  title: string;
  content: string;
  badge?: string;
}

export const ONBOARDING_STORAGE_KEY = 'sql_detective_onboarding_v1';

const DEFAULT_STEPS: TourStep[] = [
  {
    targetSelector: '#hero-welcome-banner',
    badge: 'Bước 1 / 4',
    title: 'Chào mừng bạn đến với SQL Thám Tử!',
    content: 'Nền tảng luyện tập SQL đầu tiên tại Việt Nam qua hình thức phá án. Bạn sẽ vào vai thám tử, viết các câu lệnh truy vấn để khám nghiệm hiện trường và vạch mặt kẻ thủ ác.',
  },
  {
    targetSelector: '#beginner-callout',
    badge: 'Bước 2 / 4',
    title: 'Khởi đầu vững chắc cùng Học Viện',
    content: 'Nếu bạn chưa quen với SELECT, WHERE hay JOIN, đừng lo! Hãy bắt đầu từ 20 bài học tương tác có máy chấm tự động tại Học Viện SQL trước khi phá án.',
  },
  {
    targetSelector: '#difficulty-filters',
    badge: 'Bước 3 / 4',
    title: 'Phân loại 30 chuyên án hình sự',
    content: 'Hệ thống được chia làm 3 cấp độ: Cấp 1 (Tập Sự - 10 vụ), Cấp 2 (Trung Bình - 10 vụ), Cấp 3 (Nâng Cao - 10 vụ) từ truy vấn đơn giản đến CTEs và Window Functions.',
  },
  {
    targetSelector: '#first-case-card',
    badge: 'Bước 4 / 4',
    title: 'Hiện trường đầu tiên đã sẵn sàng!',
    content: 'Bấm vào thẻ vụ án hoặc nhấn "Bắt Đầu Điều Tra" để bước vào hiện trường, soi dữ liệu chứng cứ và bắt đầu hành trình phá án ngay!',
  },
];

interface OnboardingTourProps {
  steps?: TourStep[];
  isOpenOverride?: boolean;
  onCloseOverride?: () => void;
  onComplete?: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  steps = DEFAULT_STEPS,
  isOpenOverride,
  onCloseOverride,
  onComplete,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const isOpen = isOpenOverride !== undefined ? isOpenOverride : internalOpen;

  // 1. Tự động kiểm tra khách truy cập lần đầu
  useEffect(() => {
    if (isOpenOverride !== undefined) return;
    const isCompleted = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!isCompleted) {
      // Delay nhẹ 600ms để DOM và giao diện ổn định trước khi bật Spotlight
      const timer = setTimeout(() => {
        setInternalOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpenOverride]);

  // 2. Đo đạc toạ độ phần tử mục tiêu và cuộn êm ái
  const updateTargetPosition = useCallback(() => {
    if (!isOpen || currentStep >= steps.length) return;

    const currentSelector = steps[currentStep].targetSelector;
    const element = document.querySelector(currentSelector);

    if (element) {
      // Cuộn mượt để phần tử nằm ngay giữa màn hình
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Cập nhật toạ độ chuẩn
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }
  }, [isOpen, currentStep, steps]);

  // Cập nhật khi đổi bước hoặc resize/scroll
  useEffect(() => {
    if (!isOpen) return;

    // Đợi 1 frame sau khi đổi step để scroll ổn định
    const frameId = requestAnimationFrame(() => {
      updateTargetPosition();
    });

    const handleWindowChange = () => updateTargetPosition();
    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('scroll', handleWindowChange, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange);
    };
  }, [isOpen, currentStep, updateTargetPosition]);

  // 3. Hoàn tất hướng dẫn
  const handleFinish = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    setInternalOpen(false);
    if (onCloseOverride) onCloseOverride();
    if (onComplete) onComplete();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  if (!isOpen) return null;

  const step = steps[currentStep];

  // Tính toán vị trí Tooltip nổi (tránh tràn mép dưới/trên màn hình)
  let tooltipTop = 100;
  let tooltipLeft = 20;

  if (targetRect) {
    const spaceBelow = window.innerHeight - targetRect.bottom;
    const spaceAbove = targetRect.top;

    if (spaceBelow >= 220 || spaceBelow > spaceAbove) {
      tooltipTop = Math.min(window.innerHeight - 240, targetRect.bottom + 16);
    } else {
      tooltipTop = Math.max(16, targetRect.top - 230);
    }

    tooltipLeft = Math.max(
      16,
      Math.min(window.innerWidth - 360, targetRect.left + (targetRect.width / 2) - 175)
    );
  } else {
    tooltipTop = Math.max(40, window.innerHeight / 2 - 120);
    tooltipLeft = Math.max(16, window.innerWidth / 2 - 175);
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto select-none overflow-hidden">
      {/* Lớp phủ tối màu chặn toàn bộ tương tác ngoài lề */}
      <div className="absolute inset-0 bg-noir-950/40 backdrop-blur-[1px] transition-opacity duration-300" />

      {/* Đèn Spotlight khoét rọi sáng đối tượng với transition gia tốc mượt mà */}
      {targetRect && (
        <div
          style={{
            top: `${Math.max(0, targetRect.top - 6)}px`,
            left: `${Math.max(0, targetRect.left - 6)}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
          }}
          className="fixed z-50 rounded-2xl border-2 border-noir-accent shadow-[0_0_0_9999px_rgba(11,12,16,0.85)] transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none ring-4 ring-noir-accent/20"
        >
          {/* Hào quang nhịp thở nhẹ nhàng */}
          <div className="absolute inset-0 rounded-2xl bg-noir-accent/10 animate-pulse pointer-events-none" />
        </div>
      )}

      {/* Tooltip Dialog chỉ dẫn */}
      <div
        style={{
          top: `${tooltipTop}px`,
          left: `${tooltipLeft}px`,
        }}
        className="fixed z-50 w-[calc(100vw-32px)] sm:w-[360px] p-5 rounded-2xl bg-noir-900/98 backdrop-blur-md border border-noir-700 shadow-2xl transition-all duration-300 ease-out animate-in fade-in zoom-in-95 ring-1 ring-noir-accent/30 flex flex-col space-y-3.5"
      >
        {/* Header với Icon, Tiêu đề bước và Nút Bỏ qua */}
        <div className="flex items-center justify-between pb-2.5 border-b border-noir-800">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-noir-accent/20 border border-noir-accent/40 flex items-center justify-center text-noir-gold">
              <Compass className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-mono font-bold text-noir-gold uppercase tracking-wider">
              {step.badge || `Bước ${currentStep + 1} / ${steps.length}`}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Dots Indicator tiến trình */}
            <div className="flex items-center space-x-1.5">
              {steps.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentStep
                      ? 'w-4 bg-noir-accent shadow-sm shadow-amber-500/50'
                      : 'w-1.5 bg-noir-800'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleSkip}
              className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-noir-800 transition-colors ml-1"
              title="Đóng hướng dẫn"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Nội dung chỉ dẫn nghiệp vụ */}
        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-slate-100 font-sans tracking-normal leading-snug">
            {step.title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans text-pretty">
            {step.content}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-1 flex items-center justify-between gap-2">
          <button
            onClick={handleSkip}
            className="text-[11px] text-slate-400 hover:text-slate-200 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-noir-800 transition-colors cursor-pointer"
          >
            Bỏ qua
          </button>

          <button
            onClick={handleNext}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-noir-accent to-amber-600 hover:from-amber-400 hover:to-amber-500 text-noir-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-950/40 hover:shadow-noir-accent/30 transition-all active:scale-95 cursor-pointer flex-shrink-0"
          >
            <span>{currentStep === steps.length - 1 ? 'Sẵn Sàng Phá Án!' : 'Tiếp Theo'}</span>
            {currentStep === steps.length - 1 ? (
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
