import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../Navbar';
import { UserStats } from '../../cases/types';

const mockStats: UserStats = {
  xp: 1250,
  rank: 'Tập Sự',
  notes: {},
  completedCases: {
    'case-01': { completed: true },
    'case-02': { completed: true },
  },
};

describe('Navbar Component', () => {
  it('renders brand title and user stats with tabular numbers', () => {
    render(
      <Navbar
        stats={mockStats}
        currentMode="cases"
        onChangeMode={() => {}}
        onBackToHome={() => {}}
        onResetStats={() => {}}
        onOpenGuide={() => {}}
        currentUser={null}
        onOpenAuth={() => {}}
        onLogout={() => {}}
        onSyncCloud={() => {}}
        onOpenBackupRestore={() => {}}
      />
    );

    expect(screen.getByText('SQL THÁM TỬ')).toBeDefined();
    expect(screen.getByText('1250 XP')).toBeDefined();
  });

  it('triggers onChangeMode when clicking mode switcher', () => {
    const handleChangeMode = vi.fn();
    render(
      <Navbar
        stats={mockStats}
        currentMode="cases"
        onChangeMode={handleChangeMode}
        onBackToHome={() => {}}
        onResetStats={() => {}}
        onOpenGuide={() => {}}
        currentUser={null}
        onOpenAuth={() => {}}
        onLogout={() => {}}
        onSyncCloud={() => {}}
        onOpenBackupRestore={() => {}}
      />
    );

    const academyBtn = screen.getByRole('button', { name: 'Chuyển sang chế độ Học Viện SQL' });
    fireEvent.click(academyBtn);
    expect(handleChangeMode).toHaveBeenCalledWith('academy');
  });

  it('opens guide when clicking Hướng Dẫn button', () => {
    const handleOpenGuide = vi.fn();
    render(
      <Navbar
        stats={mockStats}
        currentMode="cases"
        onChangeMode={() => {}}
        onBackToHome={() => {}}
        onResetStats={() => {}}
        onOpenGuide={handleOpenGuide}
        currentUser={null}
        onOpenAuth={() => {}}
        onLogout={() => {}}
        onSyncCloud={() => {}}
        onOpenBackupRestore={() => {}}
      />
    );

    const guideBtn = screen.getByRole('button', { name: /Hướng Dẫn/i });
    fireEvent.click(guideBtn);
    expect(handleOpenGuide).toHaveBeenCalled();
  });
});
