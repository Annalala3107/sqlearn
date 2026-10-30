import { UserStats } from '../cases/types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'learner';
  provider: 'supabase' | 'google' | 'guest';
  lastLogin: string;
}

const AUTH_STORAGE_KEY = 'sqlearn_auth_user';
const USERS_REGISTRY_KEY = 'sqlearn_users_registry';

class AuthService {
  private currentUser: AuthUser | null = null;
  private listeners: ((user: AuthUser | null) => void)[] = [];

  constructor() {
    this.loadUserFromStorage();
    this.initSupabaseListener();
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

  private initSupabaseListener(): void {
    if (!isSupabaseConfigured()) return;

    try {
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await this.syncUserFromSupabase(session.user);
        } else if (event === 'SIGNED_OUT') {
          this.currentUser = null;
          localStorage.removeItem(AUTH_STORAGE_KEY);
          this.notify();
        }
      });
    } catch (e) {
      console.warn('Supabase auth state listener error:', e);
    }
  }

  /**
   * Đồng bộ profile từ bảng `profiles` của Supabase
   */
  private async syncUserFromSupabase(sbUser: any): Promise<AuthUser> {
    const email = sbUser.email || '';
    let name = sbUser.user_metadata?.name || email.split('@')[0];
    let role: 'admin' | 'learner' = this.checkIsAdminEmail(email) ? 'admin' : 'learner';
    let avatar =
      sbUser.user_metadata?.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e5a93c&color=0b0c10&bold=true`;

    try {
      if (isSupabaseConfigured()) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, role, avatar_url')
          .eq('id', sbUser.id)
          .single();

        if (profile) {
          if (profile.name) name = profile.name;
          if (profile.role === 'admin' || role === 'admin') role = 'admin';
          if (profile.avatar_url) avatar = profile.avatar_url;
        }
      }
    } catch (err) {
      console.warn('Could not fetch profiles table, fallback to metadata', err);
    }

    const authUser: AuthUser = {
      id: sbUser.id,
      name,
      email,
      avatar,
      role,
      provider: sbUser.app_metadata?.provider === 'google' ? 'google' : 'supabase',
      lastLogin: new Date().toISOString(),
    };

    this.currentUser = authUser;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    this.recordUserInRegistry(authUser);
    this.notify();
    return authUser;
  }

  public getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  public isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
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
   * ĐĂNG KÝ TÀI KHOẢN MỚI BẰNG EMAIL & MẬT KHẨU (SUPABASE AUTH)
   */
  public async signUpWithEmail(email: string, password: string, name: string): Promise<AuthUser> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || cleanEmail.split('@')[0];

    if (!cleanEmail || !password) {
      throw new Error('Vui lòng điền đầy đủ Email và Mật khẩu.');
    }
    if (password.length < 6) {
      throw new Error('Mật khẩu bảo mật phải có ít nhất 6 ký tự.');
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: cleanName,
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error('Email này đã được đăng ký. Vui lòng chuyển sang tab Đăng Nhập.');
        }
        throw new Error(error.message);
      }

      if (data.user) {
        return await this.syncUserFromSupabase(data.user);
      }
    }

    // Fallback nếu chưa điền key Supabase (Local Prototype Mode)
    const role: 'admin' | 'learner' = this.checkIsAdminEmail(cleanEmail) ? 'admin' : 'learner';
    const fallbackUser: AuthUser = {
      id: `usr_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=e5a93c&color=0b0c10&bold=true`,
      role,
      provider: 'supabase',
      lastLogin: new Date().toISOString(),
    };

    this.currentUser = fallbackUser;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fallbackUser));
    this.recordUserInRegistry(fallbackUser);
    this.notify();
    return fallbackUser;
  }

  /**
   * ĐĂNG NHẬP BẰNG EMAIL & MẬT KHẨU (SUPABASE AUTH)
   */
  public async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      throw new Error('Vui lòng điền đầy đủ Email và Mật khẩu.');
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!');
        }
        throw new Error(error.message);
      }

      if (data.user) {
        return await this.syncUserFromSupabase(data.user);
      }
    }

    // Fallback nếu chưa điền key Supabase
    const role: 'admin' | 'learner' = this.checkIsAdminEmail(cleanEmail) ? 'admin' : 'learner';
    const fallbackUser: AuthUser = {
      id: `usr_${Date.now()}`,
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanEmail)}&background=e5a93c&color=0b0c10&bold=true`,
      role,
      provider: 'supabase',
      lastLogin: new Date().toISOString(),
    };

    this.currentUser = fallbackUser;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fallbackUser));
    this.recordUserInRegistry(fallbackUser);
    this.notify();
    return fallbackUser;
  }

  /**
   * ĐĂNG NHẬP CHÍNH THỨC VỚI GOOGLE QUA SUPABASE OAUTH
   */
  public async signInWithGoogleOAuth(): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return;
    }

    // Fallback simulation
    await this.signInWithGoogle();
  }

  /**
   * Fallback tương thích mock đăng nhập nhanh
   */
  public async signInWithGoogle(options?: {
    email?: string;
    name?: string;
    avatar?: string;
    role?: 'admin' | 'learner';
  }): Promise<AuthUser> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const email = options?.email || (options?.role === 'admin' ? 'admin.nam@sqlearn.vn' : 'thamtuhocvien@gmail.com');
    const role = options?.role || (this.checkIsAdminEmail(email) ? 'admin' : 'learner');
    const name = options?.name || (role === 'admin' ? 'Nguyễn Hải Nam (Admin)' : 'Thám Tử Học Viên');
    const avatar =
      options?.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e5a93c&color=0b0c10&bold=true`;

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
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Supabase signOut error', e);
    }
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

  private recordUserInRegistry(user: AuthUser): void {
    try {
      const raw = localStorage.getItem(USERS_REGISTRY_KEY);
      let registry: AuthUser[] = raw ? JSON.parse(raw) : [];
      const index = registry.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
      if (index >= 0) {
        registry[index] = { ...registry[index], lastLogin: user.lastLogin, avatar: user.avatar, name: user.name, role: user.role };
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
        provider: 'supabase',
        lastLogin: new Date().toISOString(),
      },
    ];
  }
}

export const authService = new AuthService();
