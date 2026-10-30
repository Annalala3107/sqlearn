import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthModal } from '../AuthModal';

describe('AuthModal Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <AuthModal isOpen={false} onClose={() => {}} onLoginSuccess={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders quick entrance buttons and custom form when open', () => {
    render(
      <AuthModal isOpen={true} onClose={() => {}} onLoginSuccess={() => {}} />
    );

    expect(screen.getByText('Đăng nhập tài khoản')).toBeDefined();
    expect(screen.getByText(/Tiếp tục với Google \(Cổng Học Viên\)/i)).toBeDefined();
    expect(screen.getByText(/Đăng nhập Cổng Quản Trị/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/your_email@gmail.com/i)).toBeDefined();
  });

  it('handles 1-click login for learner', async () => {
    const handleLoginSuccess = vi.fn();
    render(
      <AuthModal isOpen={true} onClose={() => {}} onLoginSuccess={handleLoginSuccess} />
    );

    const learnerBtn = screen.getByText(/Tiếp tục với Google \(Cổng Học Viên\)/i);
    fireEvent.click(learnerBtn);

    await waitFor(() => {
      expect(handleLoginSuccess).toHaveBeenCalled();
      const user = handleLoginSuccess.mock.calls[0][0];
      expect(user.role).toBe('learner');
    });
  });

  it('handles 1-click login for admin', async () => {
    const handleLoginSuccess = vi.fn();
    render(
      <AuthModal isOpen={true} onClose={() => {}} onLoginSuccess={handleLoginSuccess} />
    );

    const adminBtn = screen.getByText(/Đăng nhập Cổng Quản Trị/i);
    fireEvent.click(adminBtn);

    await waitFor(() => {
      expect(handleLoginSuccess).toHaveBeenCalled();
      const user = handleLoginSuccess.mock.calls[0][0];
      expect(user.role).toBe('admin');
    });
  });

  it('handles custom email and admin role selection', async () => {
    const handleLoginSuccess = vi.fn();
    render(
      <AuthModal isOpen={true} onClose={() => {}} onLoginSuccess={handleLoginSuccess} />
    );

    const emailInput = screen.getByPlaceholderText(/your_email@gmail.com/i);
    const nameInput = screen.getByPlaceholderText(/Thám tử Conan/i);

    fireEvent.change(nameInput, { target: { value: 'Thám Tử Lừng Danh' } });
    fireEvent.change(emailInput, { target: { value: 'detective_pro@gmail.com' } });

    // Click Admin role toggle button
    const adminRoleBtn = screen.getByRole('button', { name: /Quản Trị Viên/i });
    fireEvent.click(adminRoleBtn);

    const submitBtn = screen.getByText(/Xác Nhận Đăng Nhập Tài Khoản Này/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleLoginSuccess).toHaveBeenCalled();
      const user = handleLoginSuccess.mock.calls[0][0];
      expect(user.name).toBe('Thám Tử Lừng Danh');
      expect(user.email).toBe('detective_pro@gmail.com');
      expect(user.role).toBe('admin');
    });
  });
});
