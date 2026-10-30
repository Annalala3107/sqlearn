import { render, screen, fireEvent } from '@testing-library/react';
import { OnboardingTour, TourStep, ONBOARDING_STORAGE_KEY } from '../OnboardingTour';

const mockSteps: TourStep[] = [
  {
    targetSelector: '#step-1',
    title: 'Bước 1: Giới thiệu',
    description: 'Mô tả bước 1',
    position: 'bottom',
  },
  {
    targetSelector: '#step-2',
    title: 'Bước 2: Tìm kiếm',
    description: 'Mô tả bước 2',
    position: 'top',
  },
];

describe('OnboardingTour Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders correctly with accessible dialog role and title', () => {
    render(<OnboardingTour steps={mockSteps} isOpenOverride={true} />);
    
    // Check dialog role and title
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeDefined();
    expect(screen.getByText('Bước 1: Giới thiệu')).toBeDefined();
    expect(screen.getByText('Mô tả bước 1')).toBeDefined();
  });

  it('navigates to next step on Next button click', () => {
    render(<OnboardingTour steps={mockSteps} isOpenOverride={true} />);
    
    const nextBtn = screen.getByText('Tiếp tục');
    fireEvent.click(nextBtn);

    expect(screen.getByText('Bước 2: Tìm kiếm')).toBeDefined();
    expect(screen.getByText('Hoàn tất')).toBeDefined();
  });

  it('saves to localStorage and calls onFinish on Skip click', () => {
    const handleFinish = vi.fn();
    render(
      <OnboardingTour
        steps={mockSteps}
        isOpenOverride={true}
        onFinish={handleFinish}
      />
    );

    const skipBtn = screen.getByText('Bỏ qua');
    fireEvent.click(skipBtn);

    expect(localStorage.getItem(ONBOARDING_STORAGE_KEY)).toBe('true');
    expect(handleFinish).toHaveBeenCalled();
  });

  it('closes and saves to localStorage when Escape key is pressed', () => {
    const handleFinish = vi.fn();
    render(
      <OnboardingTour
        steps={mockSteps}
        isOpenOverride={true}
        onFinish={handleFinish}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(localStorage.getItem(ONBOARDING_STORAGE_KEY)).toBe('true');
    expect(handleFinish).toHaveBeenCalled();
  });

  it('navigates with ArrowRight and ArrowLeft keys', () => {
    render(<OnboardingTour steps={mockSteps} isOpenOverride={true} />);
    
    // Initial step 1
    expect(screen.getByText('Bước 1: Giới thiệu')).toBeDefined();

    // Arrow Right -> step 2
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText('Bước 2: Tìm kiếm')).toBeDefined();

    // Arrow Left -> step 1
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByText('Bước 1: Giới thiệu')).toBeDefined();
  });
});
