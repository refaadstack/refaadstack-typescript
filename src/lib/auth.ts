'use server';

import crypto from 'crypto';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const JWT_SECRET = process.env.JWT_SECRET || 'refaadstack-default-jwt-secret-change-me';

const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey);

const ADMIN_SESSION_COOKIE = 'admin_session';
const ADMIN_SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000;

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

function base64urlEncode(data: Buffer | string): string {
  return Buffer.from(data)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64urlDecode(str: string): Buffer {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4 !== 0) str += '=';
  return Buffer.from(str, 'base64');
}

function signJWT(payload: Record<string, unknown>): string {
  const header = base64urlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64urlEncode(JSON.stringify(payload));
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyJWT(token: string): Record<string, unknown> | null {
  try {
    const [headerB64, bodyB64, sigB64] = token.split('.');
    if (!headerB64 || !bodyB64 || !sigB64) return null;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${headerB64}.${bodyB64}`).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(sigB64), Buffer.from(expectedSig))) return null;
    const payload = JSON.parse(base64urlDecode(bodyB64).toString('utf-8'));
    if (payload.exp && Date.now() > payload.exp * 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'refaadstack_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
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

    if (error) {
      return { success: false, error: 'Gagal mengakses database. Hubungi administrator.' };
    }

    if (!admin) {
      return { success: false, error: 'Email tidak terdaftar.' };
    }

    const validPassword = await verifyPassword(password, admin.password_hash);

    if (!validPassword) {
      return { success: false, error: 'Password salah.' };
    }

    const user: AdminUser = {
      id: String(admin.id),
      email: String(admin.email),
      name: String(admin.name),
      role: String(admin.role || 'admin'),
    };

    const sessionToken = signJWT({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Math.floor((Date.now() + ADMIN_SESSION_EXPIRY) / 1000),
    });

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ADMIN_SESSION_EXPIRY / 1000,
      path: '/',
    });

    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Terjadi kesalahan server.' };
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
    if (!sessionCookie?.value) return null;

    const payload = verifyJWT(sessionCookie.value);
    if (!payload) return null;

    return {
      id: String(payload.sub || ''),
      email: String(payload.email || ''),
      name: String(payload.name || ''),
      role: String(payload.role || 'admin'),
    };
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
