import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowRight, Check, X, Compass } from 'lucide-react';

export interface TourStep {
  targetSelector: string;
  title: string;
  content?: string;
  description?: string;
  badge?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
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
  onFinish?: () => void;
  onComplete?: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  steps = DEFAULT_STEPS,
  isOpenOverride,
  onCloseOverride,
  onFinish,
  onComplete,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const isOpen = isOpenOverride !== undefined ? isOpenOverride : internalOpen;
  const isTransitioningRef = useRef(false);

  // 1. Kiểm tra khách truy cập lần đầu
  useEffect(() => {
    if (isOpenOverride !== undefined) return;
    try {
      const isCompleted = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (!isCompleted) {
        const timer = setTimeout(() => {
          setCurrentStep(0);
          setInternalOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('Cannot read localStorage', e);
    }
  }, [isOpenOverride]);

  // 2. Khi mở lại tour (bằng nút hoặc override), luôn đặt lại bước 0
  useEffect(() => {
    if (isOpenOverride) {
      setCurrentStep(0);
    }
  }, [isOpenOverride]);

  // 3. Đo đạc toạ độ phần tử mục tiêu (0% layout thrashing)
  const measureTarget = useCallback(() => {
    if (!isOpen || currentStep >= steps.length) {
      setTargetRect(null);
      return;
    }

    const currentSelector = steps[currentStep]?.targetSelector;
    const element = currentSelector ? document.querySelector(currentSelector) : null;

    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    } else {
      setTargetRect(null);
    }
  }, [isOpen, currentStep, steps]);

  // 4. Cuộn mượt đến phần tử mục tiêu khi đổi bước
  useEffect(() => {
    if (!isOpen) return;

    isTransitioningRef.current = true;
    const currentSelector = steps[currentStep]?.targetSelector;
    const element = currentSelector ? document.querySelector(currentSelector) : null;

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Đợi hoàn tất cuộn (350ms) rồi đo toạ độ chính xác
      const timer = setTimeout(() => {
        measureTarget();
        isTransitioningRef.current = false;
      }, 350);

      return () => clearTimeout(timer);
    } else {
      measureTarget();
      isTransitioningRef.current = false;
    }
  }, [isOpen, currentStep, steps, measureTarget]);

  // 5. Lắng nghe Scroll & Resize bằng requestAnimationFrame (Không đệ quy scroll, 0% CPU, 60fps)
  useEffect(() => {
    if (!isOpen) return;

    let ticking = false;
    const handleScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          measureTarget();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, measureTarget]);

  // 6. Hoàn tất hoặc Bỏ qua hướng dẫn
  const handleFinish = useCallback(() => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch (e) {
      console.warn('Cannot write localStorage', e);
    }
    setInternalOpen(false);
    if (onCloseOverride) onCloseOverride();
    if (onFinish) onFinish();
    if (onComplete) onComplete();
  }, [onCloseOverride, onFinish, onComplete]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  }, [currentStep, steps.length, handleFinish]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // 7. Bàn phím trợ năng (Escape để thoát, Phím Mũi Tên Trái/Phải để chuyển bước)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleFinish();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleFinish, handleNext, handlePrev]);

  if (!isOpen) return null;

  const step = steps[currentStep] || steps[0];
  const stepText = step.content || step.description || '';

  // Tính vị trí hiển thị Tooltip an toàn, tuyệt đối không bị tràn ra ngoài màn hình
  const DIALOG_MAX_H = 320;
  const DIALOG_W = Math.min(380, typeof window !== 'undefined' ? window.innerWidth - 32 : 360);
  const PADDING = 16;
  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 800;
  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1200;

  let tooltipTop = Math.max(PADDING, (viewportH - DIALOG_MAX_H) / 2);
  let tooltipLeft = Math.max(PADDING, (viewportW - DIALOG_W) / 2);

  if (targetRect) {
    const spaceBelow = viewportH - (targetRect.top + targetRect.height);
    const spaceAbove = targetRect.top;

    if (spaceBelow >= DIALOG_MAX_H + 20) {
      // Đặt phía dưới phần tử
      tooltipTop = targetRect.top + targetRect.height + 12;
    } else if (spaceAbove >= DIALOG_MAX_H + 20) {
      // Đặt phía trên phần tử
      tooltipTop = targetRect.top - DIALOG_MAX_H - 12;
    } else {
      // Nếu cả hai phía đều hẹp, neo ở vị trí an toàn trong viewport
      tooltipTop = Math.max(PADDING, viewportH - DIALOG_MAX_H - PADDING);
    }

    // Căn giữa theo chiều ngang của phần tử mục tiêu
    tooltipLeft = Math.max(
      PADDING,
      Math.min(viewportW - DIALOG_W - PADDING, targetRect.left + (targetRect.width - DIALOG_W) / 2)
    );
  }

  // Khóa cứng toạ độ: Đảm bảo 100% không bao giờ bị cắt mép dưới hay mép trên
  tooltipTop = Math.max(PADDING, Math.min(viewportH - DIALOG_MAX_H - PADDING, tooltipTop));
  tooltipLeft = Math.max(PADDING, Math.min(viewportW - DIALOG_W - PADDING, tooltipLeft));

  const pad = 8;
  const maskX = targetRect ? Math.max(0, targetRect.left - pad) : 0;
  const maskY = targetRect ? Math.max(0, targetRect.top - pad) : 0;
  const maskW = targetRect ? targetRect.width + pad * 2 : 0;
  const maskH = targetRect ? targetRect.height + pad * 2 : 0;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-auto select-none overflow-hidden animate-in fade-in duration-200 motion-reduce:animate-none"
      aria-live="polite"
    >
      {/* SVG MASK CUTOUT: Hardware accelerated GPU, 0% CPU */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none z-40 transition-all duration-300 motion-reduce:transition-none"
        style={{ width: '100vw', height: '100vh' }}
        aria-hidden="true"
      >
        <defs>
          <mask id="onboarding-spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={maskX}
                y={maskY}
                width={maskW}
                height={maskH}
                rx="16"
                ry="16"
                fill="black"
              />
            )}
          </mask>
        </defs>

        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(11, 12, 16, 0.85)"
          mask="url(#onboarding-spotlight-mask)"
        />
      </svg>

      {/* Spotlight border */}
      {targetRect && (
        <div
          style={{
            top: `${maskY}px`,
            left: `${maskX}px`,
            width: `${maskW}px`,
            height: `${maskH}px`,
          }}
          className="fixed z-45 rounded-2xl border-2 border-noir-accent pointer-events-none transition-all duration-300 motion-reduce:transition-none ring-4 ring-noir-accent/20"
          aria-hidden="true"
        />
      )}

      {/* Tooltip Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Hướng dẫn người dùng mới"
        aria-describedby="onboarding-step-desc"
        style={{
          top: `${tooltipTop}px`,
          left: `${tooltipLeft}px`,
        }}
        className="fixed z-50 w-[calc(100vw-32px)] sm:w-[380px] max-h-[min(380px,85vh)] p-5 rounded-2xl bg-noir-900 border border-noir-700 shadow-2xl transition-all duration-200 motion-reduce:transition-none ring-1 ring-noir-accent/30 flex flex-col justify-between space-y-3.5 focus-ring overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-noir-800 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span
              className="w-6 h-6 rounded-lg bg-noir-accent/20 border border-noir-accent/40 flex items-center justify-center text-noir-gold"
              aria-hidden="true"
            >
              <Compass className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-mono tabular-nums font-bold text-noir-gold uppercase tracking-wider">
              {step.badge || `Bước ${currentStep + 1} / ${steps.length}`}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Dots Indicator */}
            <div
              className="flex items-center space-x-1.5"
              role="group"
              aria-label="Tiến trình hướng dẫn"
            >
              {steps.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                    idx === currentStep
                      ? 'w-4 bg-noir-accent shadow-sm shadow-amber-500/50'
                      : 'w-1.5 bg-noir-800'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>

            <button
              onClick={handleFinish}
              className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-noir-800 transition-colors ml-1 cursor-pointer focus-ring"
              title="Đóng hướng dẫn (Esc)"
              aria-label="Đóng hướng dẫn"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1.5 flex-1">
          <h3 className="text-base font-extrabold text-slate-100 font-sans tracking-normal leading-snug">
            {step.title}
          </h3>
          <p
            id="onboarding-step-desc"
            className="text-xs text-slate-300 leading-relaxed font-sans text-pretty"
          >
            {stepText}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between gap-2 flex-shrink-0 border-t border-noir-800/60">
          <button
            onClick={handleFinish}
            className="text-[11px] text-slate-400 hover:text-slate-200 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-noir-800 transition-colors cursor-pointer focus-ring"
            aria-label="Bỏ qua phần hướng dẫn"
          >
            Bỏ qua
          </button>

          <button
            onClick={handleNext}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-noir-accent to-amber-600 hover:from-amber-400 hover:to-amber-500 text-noir-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-950/40 hover:shadow-noir-accent/30 transition-transform active:scale-95 cursor-pointer flex-shrink-0 focus-ring"
            aria-label={currentStep === steps.length - 1 ? 'Hoàn tất hướng dẫn' : 'Bước tiếp theo'}
          >
            <span>{currentStep === steps.length - 1 ? 'Hoàn tất' : 'Tiếp tục'}</span>
            {currentStep === steps.length - 1 ? (
              <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
