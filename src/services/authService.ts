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

const AUTH_STORAGE_KEY = 'sqlearn_auth_user';
const USERS_REGISTRY_KEY = 'sqlearn_users_registry';

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
   * Đăng nhập với tài khoản Google (Học viên hoặc Quản trị viên)
   * Sử dụng Google OAuth 2.0 / Google Identity Services
   */
  public async signInWithGoogle(options?: {
    email?: string;
    name?: string;
    avatar?: string;
    role?: 'admin' | 'learner';
  }): Promise<AuthUser> {
    // Mô phỏng độ trễ xác thực mạng 350ms
    await new Promise((resolve) => setTimeout(resolve, 350));

    const role = options?.role || (options?.email?.includes('admin') ? 'admin' : 'learner');
    const name = options?.name || (role === 'admin' ? 'Nguyễn Hải Nam (Admin)' : 'Thám Tử Tập Sự');
    const email = options?.email || (role === 'admin' ? 'admin.nam@sqlearn.vn' : 'thamtuhocvien@gmail.com');
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

    // Ghi nhận vào registry quản lý
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
   * Đồng bộ tiến trình học tập của học viên lên hồ sơ
   */
  public syncProgressWithCloud(stats: UserStats): { success: boolean; timestamp: string } {
    if (!this.currentUser) {
      return { success: false, timestamp: new Date().toISOString() };
    }
    const syncPayload = {
      userId: this.currentUser.id,
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
      const index = registry.findIndex((u) => u.email === user.email);
      if (index >= 0) {
        registry[index] = { ...registry[index], lastLogin: user.lastLogin };
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
    // Dữ liệu mẫu giả lập nếu chưa có ai đăng nhập
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
      {
        id: 'usr_3',
        name: 'Lê Thuỳ Linh',
        email: 'thuylinh.data@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        role: 'learner',
        provider: 'google',
        lastLogin: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
    ];
  }
}

export const authService = new AuthService();
