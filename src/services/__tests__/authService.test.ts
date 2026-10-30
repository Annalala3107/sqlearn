import { authService, decodeGoogleJwt } from '../authService';

describe('AuthService & Google JWT Decoder', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('correctly decodes a Google JWT token payload', () => {
    const payload = {
      sub: 'google_123456789',
      email: 'thamtuhocvien@gmail.com',
      name: 'Nguyễn Văn Thám Tử',
      picture: 'https://lh3.googleusercontent.com/avatar123',
    };

    // Construct mock JWT (header.payload.signature)
    const base64Payload = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const mockToken = `header.${base64Payload}.signature`;

    const decoded = decodeGoogleJwt(mockToken);
    expect(decoded).not.toBeNull();
    expect(decoded?.email).toBe('thamtuhocvien@gmail.com');
    expect(decoded?.name).toBe('Nguyễn Văn Thám Tử');
    expect(decoded?.sub).toBe('google_123456789');
  });

  it('signs in with decoded Google credential and assigns learner role by default', async () => {
    const payload = {
      sub: 'google_999',
      email: 'student@gmail.com',
      name: 'Học Viên Mới',
      picture: 'https://avatar.url',
    };
    const base64Payload = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const mockToken = `header.${base64Payload}.signature`;

    const user = await authService.signInWithGoogleCredential(mockToken);

    expect(user.email).toBe('student@gmail.com');
    expect(user.name).toBe('Học Viên Mới');
    expect(user.role).toBe('learner');
    expect(user.provider).toBe('google');

    // Persisted in localStorage
    expect(authService.getCurrentUser()?.email).toBe('student@gmail.com');
  });

  it('signs out and clears user state', async () => {
    await authService.signOut();
    expect(authService.getCurrentUser()).toBeNull();
  });
});
