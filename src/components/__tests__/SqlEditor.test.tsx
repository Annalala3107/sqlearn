import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SqlEditor } from '../SqlEditor';

describe('SqlEditor Autocomplete & Navigation', () => {
  const schemas = [
    {
      name: 'products',
      description: 'Bảng sản phẩm',
      columns: [
        { name: 'id', type: 'INTEGER', description: 'ID' },
        { name: 'name', type: 'TEXT', description: 'Tên' },
        { name: 'price', type: 'INTEGER', description: 'Giá' },
      ],
    },
  ];

  it('renders correctly and opens autocomplete when typing a keyword prefix', () => {
    const handleChangeQuery = vi.fn();
    const handleExecute = vi.fn();

    render(
      <SqlEditor
        query=""
        onChangeQuery={handleChangeQuery}
        onExecute={handleExecute}
        queryHistory={[]}
        schemas={schemas}
      />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 's', selectionStart: 1 } });

    expect(handleChangeQuery).toHaveBeenCalledWith('s');
    expect(screen.getByText('GỢI Ý SQL & LƯỢC ĐỒ')).toBeDefined();
  });

  it('navigates through suggestions with ArrowDown and does not reset on keyUp', () => {
    let currentQuery = '';
    const handleChangeQuery = vi.fn((q) => {
      currentQuery = q;
    });

    const { rerender } = render(
      <SqlEditor
        query={currentQuery}
        onChangeQuery={handleChangeQuery}
        onExecute={vi.fn()}
        queryHistory={[]}
        schemas={schemas}
      />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 's', selectionStart: 1 } });
    rerender(
      <SqlEditor
        query="s"
        onChangeQuery={handleChangeQuery}
        onExecute={vi.fn()}
        queryHistory={[]}
        schemas={schemas}
      />
    );

    // Initial state: first item selected (SELECT)
    const selectBtn = screen.getByText('SELECT').closest('button');
    expect(selectBtn?.className).toContain('border-l-2');

    // Press ArrowDown
    fireEvent.keyDown(textarea, { key: 'ArrowDown' });
    // Release ArrowDown (keyUp)
    fireEvent.keyUp(textarea, { key: 'ArrowDown' });

    // Next item (SUM()) should now be selected
    const sumBtn = screen.getByText('SUM()').closest('button');
    expect(sumBtn?.className).toContain('border-l-2');
    expect(selectBtn?.className).not.toContain('border-l-2');

    // Press ArrowDown again + keyUp
    fireEvent.keyDown(textarea, { key: 'ArrowDown' });
    fireEvent.keyUp(textarea, { key: 'ArrowDown' });

    const substrBtn = screen.getByText('SUBSTR()').closest('button');
    expect(substrBtn?.className).toContain('border-l-2');
    expect(sumBtn?.className).not.toContain('border-l-2');

    // Press Enter to apply SUBSTR()
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(handleChangeQuery).toHaveBeenCalledWith('SUBSTR()');
  });

  it('closes suggestion dropdown on Escape', () => {
    render(
      <SqlEditor
        query=""
        onChangeQuery={vi.fn()}
        onExecute={vi.fn()}
        queryHistory={[]}
        schemas={schemas}
      />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 's', selectionStart: 1 } });
    expect(screen.queryByText('GỢI Ý SQL & LƯỢC ĐỒ')).not.toBeNull();

    fireEvent.keyDown(textarea, { key: 'Escape' });
    expect(screen.queryByText('GỢI Ý SQL & LƯỢC ĐỒ')).toBeNull();
  });
  it('supports Down/Up key codes and ignores stationary mouse moves', () => {
    let currentQuery = '';
    const handleChangeQuery = vi.fn((q) => { currentQuery = q; });
    const { rerender } = render(
      <SqlEditor
        query={currentQuery}
        onChangeQuery={handleChangeQuery}
        onExecute={vi.fn()}
        queryHistory={[]}
        schemas={schemas}
      />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 's', selectionStart: 1 } });
    rerender(
      <SqlEditor
        query="s"
        onChangeQuery={handleChangeQuery}
        onExecute={vi.fn()}
        queryHistory={[]}
        schemas={schemas}
      />
    );

    const selectBtn = screen.getByText('SELECT').closest('button');
    const sumBtn = screen.getByText('SUM()').closest('button');

    // Press Down key code
    fireEvent.keyDown(textarea, { key: 'Down' });
    fireEvent.keyUp(textarea, { key: 'Down' });
    expect(sumBtn?.className).toContain('border-l-2');

    // Stationary mouse move over selectBtn (movementX: 0, movementY: 0) should not reset selection
    fireEvent.mouseMove(selectBtn!, { movementX: 0, movementY: 0 });
    expect(sumBtn?.className).toContain('border-l-2');

    // Actual mouse move with movementX: 2 updates selection
    fireEvent.mouseMove(selectBtn!, { movementX: 2, movementY: 1 });
    expect(selectBtn?.className).toContain('border-l-2');
  });
});
