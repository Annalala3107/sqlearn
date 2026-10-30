import { authService } from '../authService';

describe('AuthService with Supabase integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('signs up a new learner with email and password', async () => {
    const user = await authService.signUpWithEmail('detective1@gmail.com', 'secret123', 'Thám Tử Mới');

    expect(user.email).toBe('detective1@gmail.com');
    expect(user.name).toBe('Thám Tử Mới');
    expect(user.role).toBe('learner');
    expect(authService.getCurrentUser()?.email).toBe('detective1@gmail.com');
  });

  it('signs in with email and recognizes admin email whitelist', async () => {
    const user = await authService.signInWithEmail('admin.nam@sqlearn.vn', 'secret123');

    expect(user.email).toBe('admin.nam@sqlearn.vn');
    expect(user.role).toBe('admin');
    expect(authService.isAdmin()).toBe(true);
  });

  it('signs out and clears user state', async () => {
    await authService.signUpWithEmail('user@gmail.com', 'secret123', 'User');
    expect(authService.getCurrentUser()).not.toBeNull();

    await authService.signOut();
    expect(authService.getCurrentUser()).toBeNull();
  });
});
