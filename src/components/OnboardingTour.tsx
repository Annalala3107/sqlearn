import React, { useState, useEffect, useCallback, useRef } from 'react';
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
        // Trì hoãn 500ms để DOM ổn định hoàn toàn
        const timer = setTimeout(() => {
          setInternalOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('Cannot read localStorage', e);
    }
  }, [isOpenOverride]);

  // 2. Đo đạc toạ độ phần tử mục tiêu (Tuyệt đối KHÔNG gọi scrollIntoView trong hàm này)
  const measureTarget = useCallback(() => {
    if (!isOpen || currentStep >= steps.length) {
      setTargetRect(null);
      return;
    }

    const currentSelector = steps[currentStep].targetSelector;
    const element = document.querySelector(currentSelector);

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

  // 3. Cuộn mượt đến phần tử mục tiêu CHỈ MỘT LẦN khi đổi bước
  useEffect(() => {
    if (!isOpen) return;

    isTransitioningRef.current = true;
    const currentSelector = steps[currentStep]?.targetSelector;
    const element = currentSelector ? document.querySelector(currentSelector) : null;

    if (element) {
      // Cuộn mượt chỉ 1 lần duy nhất khi đổi step
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Đợi hiệu ứng cuộn dừng (khoảng 350ms) rồi đo toạ độ chính xác
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

  // 4. Lắng nghe Resize màn hình với Debounce nhẹ (KHÔNG lắng nghe scroll để tránh vòng lặp giật lag)
  useEffect(() => {
    if (!isOpen) return;

    let resizeTimer: any;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        measureTarget();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, measureTarget]);

  // 5. Khóa cuộn trang khi tour đang hoạt động để tránh Layout Thrashing và tăng hiệu năng 60fps
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // 6. Hoàn tất hoặc Bỏ qua hướng dẫn
  const handleFinish = () => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch (e) {
      console.warn('Cannot write localStorage', e);
    }
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

  if (!isOpen) return null;

  const step = steps[currentStep];

  // Tính vị trí hiển thị Tooltip an toàn, không bị tràn màn hình
  let tooltipTop = 120;
  let tooltipLeft = 20;

  if (targetRect) {
    const spaceBelow = window.innerHeight - (targetRect.top + targetRect.height);
    const spaceAbove = targetRect.top;

    if (spaceBelow >= 220 || spaceBelow > spaceAbove) {
      tooltipTop = Math.min(window.innerHeight - 250, targetRect.top + targetRect.height + 16);
    } else {
      tooltipTop = Math.max(16, targetRect.top - 240);
    }

    tooltipLeft = Math.max(
      16,
      Math.min(window.innerWidth - 376, targetRect.left + targetRect.width / 2 - 180)
    );
  } else {
    tooltipTop = Math.max(40, window.innerHeight / 2 - 120);
    tooltipLeft = Math.max(16, window.innerWidth / 2 - 180);
  }

  const padding = 8;
  const maskX = targetRect ? Math.max(0, targetRect.left - padding) : 0;
  const maskY = targetRect ? Math.max(0, targetRect.top - padding) : 0;
  const maskW = targetRect ? targetRect.width + padding * 2 : 0;
  const maskH = targetRect ? targetRect.height + padding * 2 : 0;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto select-none overflow-hidden animate-in fade-in duration-200">
      {/* SVG MASK CUTOUT: Thay thế hoàn toàn box-shadow 9999px nặng nề. Chạy 100% trên phần cứng đồ họa GPU, 0% CPU! */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none z-40 transition-all duration-300"
        style={{ width: '100vw', height: '100vh' }}
      >
        <defs>
          <mask id="onboarding-spotlight-mask">
            {/* Lớp nền trắng cho phép ánh sáng đi qua (làm tối) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Vùng màu đen khoét lỗ rọi sáng vào phần tử mục tiêu */}
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

        {/* Lớp phủ làm tối toàn bộ hậu cảnh, ngoại trừ lỗ khoét của mask */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(11, 12, 16, 0.85)"
          mask="url(#onboarding-spotlight-mask)"
        />
      </svg>

      {/* Khung viền màu vàng hổ phách bao quanh phần tử mục tiêu */}
      {targetRect && (
        <div
          style={{
            top: `${maskY}px`,
            left: `${maskX}px`,
            width: `${maskW}px`,
            height: `${maskH}px`,
          }}
          className="fixed z-45 rounded-2xl border-2 border-noir-accent pointer-events-none transition-all duration-300 ring-4 ring-noir-accent/20"
        />
      )}

      {/* Tooltip Dialog hướng dẫn nghiệp vụ */}
      <div
        style={{
          top: `${tooltipTop}px`,
          left: `${tooltipLeft}px`,
        }}
        className="fixed z-50 w-[calc(100vw-32px)] sm:w-[360px] p-5 rounded-2xl bg-noir-900 border border-noir-700 shadow-2xl transition-all duration-200 ring-1 ring-noir-accent/30 flex flex-col space-y-3.5"
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
              onClick={handleFinish}
              className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-noir-800 transition-colors ml-1 cursor-pointer"
              title="Đóng hướng dẫn"
            >
              <X className="w-4 h-4" />
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
            onClick={handleFinish}
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
