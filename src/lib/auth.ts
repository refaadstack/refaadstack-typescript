'use server';

import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey);

const ADMIN_SESSION_COOKIE = 'admin_session';
const ADMIN_SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'refaadstack_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
    return bcrypt.compare(password, hash);
  }

  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('id, email, password_hash, name, role')
      .eq('email', normalizedEmail)
      .single();

    if (error || !admin) {
      return { success: false, error: 'Email atau password tidak cocok' };
    }

    const validPassword = await verifyPassword(password, admin.password_hash);

    if (!validPassword) {
      return { success: false, error: 'Email atau password tidak cocok' };
    }

    const user: AdminUser = {
      id: String(admin.id),
      email: String(admin.email),
      name: String(admin.name),
      role: String(admin.role || 'admin'),
    };

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ADMIN_SESSION_EXPIRY / 1000,
      path: '/',
    });

    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login gagal. Pastikan tabel admins sudah tersedia.' };
  }
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function getAdminSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE);

    if (!sessionCookie?.value) {
      return null;
    }

    const user = JSON.parse(sessionCookie.value) as AdminUser;
    return user;
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminSession();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
