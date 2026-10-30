import { render, screen, fireEvent } from '@testing-library/react';
import { CaseList } from '../CaseList';
import { DetectiveCase, UserStats } from '../../cases/types';

const mockCases: DetectiveCase[] = [
  {
    id: 'case-01',
    title: 'Vụ án 01: Chiếc Cặp Mất Tích',
    slug: 'chiec-cap-mat-tich',
    difficulty: 'dễ',
    category: 'Cơ Bản: SELECT, WHERE',
    location: 'Quán bar Đêm Không Ngủ, Quận 1',
    date: '20/11/1988',
    timeEstimate: '10-15 phút',
    xpReward: 100,
    brief: 'Đêm 20/11/1988, tại quán bar Đêm Không Ngủ, chiếc cặp da đen biến mất.',
    clues: [],
    solution: {
      culprit: '1',
      successTitle: 'Phá án thành công',
      successMessage: 'Đã tìm ra thủ phạm',
      explanation: 'Thủ phạm là người pha chế.',
      referenceQuery: 'SELECT * FROM crime_scene;',
    },
    schemas: [],
    seedSql: ['SELECT 1;'],
    objectives: [
      { id: 1, text: 'Tìm danh sách nhân chứng' },
    ],
  },
  {
    id: 'case-02',
    title: 'Vụ án 02: Vòng Ngọc Bích',
    slug: 'vong-ngoc-bich',
    difficulty: 'trung bình',
    category: 'So Sánh: AND, OR',
    location: 'Khách Sạn Caravelle',
    date: '18/11/1988',
    timeEstimate: '15-20 phút',
    xpReward: 150,
    brief: 'Chiếc vòng ngọc bích gia bảo trị giá hàng trăm lượng vàng biến mất.',
    clues: [],
    solution: {
      culprit: '2',
      successTitle: 'Phá án thành công',
      successMessage: 'Đã tìm ra thủ phạm',
      explanation: 'Thủ phạm là khách VIP.',
      referenceQuery: 'SELECT * FROM hotel_guests;',
    },
    schemas: [],
    seedSql: ['SELECT 1;'],
    objectives: [
      { id: 1, text: 'Liệt kê khách lưu trú' },
    ],
  },
];

const mockStats: UserStats = {
  xp: 100,
  rank: 'Tập Sự',
  notes: {},
  completedCases: {
    'case-01': { completed: true },
  },
};

describe('CaseList Component', () => {
  it('renders cases with titles and difficulty badges', () => {
    render(
      <CaseList
        cases={mockCases}
        stats={mockStats}
        onSelectCase={() => {}}
      />
    );

    expect(screen.getByText('Vụ án 01: Chiếc Cặp Mất Tích')).toBeDefined();
    expect(screen.getByText('Vụ án 02: Vòng Ngọc Bích')).toBeDefined();
    expect(screen.getByText('ĐÃ PHÁ ÁN')).toBeDefined();
  });

  it('filters cases when user searches by keyword', () => {
    render(
      <CaseList
        cases={mockCases}
        stats={mockStats}
        onSelectCase={() => {}}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Tìm theo tên vụ án/i);
    fireEvent.change(searchInput, { target: { value: 'Ngọc Bích' } });

    expect(screen.queryByText('Vụ án 01: Chiếc Cặp Mất Tích')).toBeNull();
    expect(screen.getByText('Vụ án 02: Vòng Ngọc Bích')).toBeDefined();
  });

  it('calls onSelectCase when clicking on a case card or investigate button', () => {
    const handleSelectCase = vi.fn();
    render(
      <CaseList
        cases={mockCases}
        stats={mockStats}
        onSelectCase={handleSelectCase}
      />
    );

    const startBtn = screen.getByText('Bắt Đầu Điều Tra');
    fireEvent.click(startBtn);

    expect(handleSelectCase).toHaveBeenCalledWith(mockCases[1]);
  });
});
