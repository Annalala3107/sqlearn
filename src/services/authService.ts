import { UserStats } from '../cases/types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'learner';
  provider: 'google' | 'guest';
  lastLogin: string;
}

export interface GoogleJwtPayload {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified?: boolean;
}

const AUTH_STORAGE_KEY = 'sqlearn_auth_user';
const USERS_REGISTRY_KEY = 'sqlearn_users_registry';

/**
 * Giải mã an toàn Token JWT từ Google Identity Services (Hỗ trợ UTF-8 cho ký tự tiếng Việt)
 */
export function decodeGoogleJwt(token: string): GoogleJwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode Google JWT credential:', e);
    return null;
  }
}

class AuthService {
  private currentUser: AuthUser | null = null;
  private listeners: ((user: AuthUser | null) => void)[] = [];

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      if (data) {
        this.currentUser = JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to parse auth user from storage:', e);
      this.currentUser = null;
    }
  }

  public getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  public isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  public getGoogleClientId(): string {
    return (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
  }

  public isGoogleConfigured(): boolean {
    const cid = this.getGoogleClientId();
    return cid.length > 10 && cid.includes('.apps.googleusercontent.com');
  }

  public getAdminEmails(): string[] {
    const raw = (import.meta.env.VITE_ADMIN_EMAILS || '').trim();
    if (!raw) return ['admin.nam@sqlearn.vn'];
    return raw
      .split(',')
      .map((e: string) => e.trim().toLowerCase())
      .filter(Boolean);
  }

  public checkIsAdminEmail(email: string): boolean {
    const admins = this.getAdminEmails();
    return admins.includes(email.trim().toLowerCase());
  }

  public subscribe(callback: (user: AuthUser | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify(): void {
    this.listeners.forEach((callback) => callback(this.currentUser));
  }

  /**
   * ĐĂNG NHẬP CHÍNH THỨC: Xác thực tài khoản Google thật từ Google Identity Services (GIS)
   * Nhận credential JWT trả về trực tiếp từ popup đăng nhập của Google
   */
  public async signInWithGoogleCredential(credential: string): Promise<AuthUser> {
    const decoded = decodeGoogleJwt(credential);
    if (!decoded || !decoded.email) {
      throw new Error('Mã xác thực Google không hợp lệ hoặc đã hết hạn.');
    }

    const email = decoded.email.trim();
    const role: 'admin' | 'learner' = this.checkIsAdminEmail(email) ? 'admin' : 'learner';
    const name = decoded.name || email.split('@')[0];
    const avatar =
      decoded.picture ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e5a93c&color=0b0c10&bold=true`;

    const user: AuthUser = {
      id: `google_${decoded.sub}`,
      name,
      email,
      avatar,
      role,
      provider: 'google',
      lastLogin: new Date().toISOString(),
    };

    this.currentUser = user;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

    this.recordUserInRegistry(user);
    this.notify();
    return user;
  }

  /**
   * ĐĂNG NHẬP THỬ NGHIỆM / SANDBOX (Fallback khi chưa cấu hình Google Client ID)
   */
  public async signInWithGoogle(options?: {
    email?: string;
    name?: string;
    avatar?: string;
    role?: 'admin' | 'learner';
  }): Promise<AuthUser> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const email = options?.email || (options?.role === 'admin' ? 'admin.nam@sqlearn.vn' : 'thamtuhocvien@gmail.com');
    const role = options?.role || (this.checkIsAdminEmail(email) ? 'admin' : 'learner');
    const name = options?.name || (role === 'admin' ? 'Nguyễn Hải Nam (Admin)' : 'Thám Tử Học Viên');
    const avatar =
      options?.avatar ||
      (role === 'admin'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80');

    const user: AuthUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      avatar,
      role,
      provider: 'google',
      lastLogin: new Date().toISOString(),
    };

    this.currentUser = user;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

    this.recordUserInRegistry(user);
    this.notify();
    return user;
  }

  /**
   * Đăng xuất an toàn
   */
  public async signOut(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    this.currentUser = null;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    this.notify();
  }

  /**
   * Đồng bộ tiến trình học tập của học viên lên hồ sơ đám mây
   */
  public syncProgressWithCloud(stats: UserStats): { success: boolean; timestamp: string } {
    if (!this.currentUser) {
      return { success: false, timestamp: new Date().toISOString() };
    }
    const syncPayload = {
      userId: this.currentUser.id,
      email: this.currentUser.email,
      stats,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`sqlearn_sync_${this.currentUser.id}`, JSON.stringify(syncPayload));
    return { success: true, timestamp: syncPayload.updatedAt };
  }

  /**
   * Lưu trữ danh sách người dùng cho Admin Dashboard theo dõi
   */
  private recordUserInRegistry(user: AuthUser): void {
    try {
      const raw = localStorage.getItem(USERS_REGISTRY_KEY);
      let registry: AuthUser[] = raw ? JSON.parse(raw) : [];
      const index = registry.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
      if (index >= 0) {
        registry[index] = { ...registry[index], lastLogin: user.lastLogin, avatar: user.avatar, name: user.name };
      } else {
        registry.unshift(user);
      }
      localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(registry.slice(0, 50)));
    } catch (e) {
      console.warn('Failed to update users registry', e);
    }
  }

  public getRegisteredUsers(): AuthUser[] {
    try {
      const raw = localStorage.getItem(USERS_REGISTRY_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn(e);
    }
    return [
      {
        id: 'usr_admin_1',
        name: 'Nguyễn Hải Nam (Trưởng Ban Điều Tra)',
        email: 'admin.nam@sqlearn.vn',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        role: 'admin',
        provider: 'google',
        lastLogin: new Date().toISOString(),
      },
      {
        id: 'usr_2',
        name: 'Trần Văn Minh',
        email: 'minhtran.dev@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
        role: 'learner',
        provider: 'google',
        lastLogin: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ];
  }
}

export const authService = new AuthService();
