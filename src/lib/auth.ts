'use server';

import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create admin client with service role key for authentication
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
  // Simple hash for demo - in production use bcrypt
  // This is a simple simulation - in real app use proper bcrypt
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'refaadstack_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  try {
    // For demo, use simple password check without database
    // In production, query the admins table
    
    // Demo credentials - UPDATE THESE IN PRODUCTION
    const DEMO_ADMIN = {
      email: 'admin@refaadstack.dev',
      password: 'admin123', // Change this!
      name: 'Admin',
      id: 'demo-admin-id'
    };

    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      const user: AdminUser = {
        id: DEMO_ADMIN.id,
        email: DEMO_ADMIN.email,
        name: DEMO_ADMIN.name,
        role: 'admin'
      };

      // Set session cookie
      const cookieStore = await cookies();
      const sessionData = JSON.stringify(user);
      cookieStore.set(ADMIN_SESSION_COOKIE, sessionData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: ADMIN_SESSION_EXPIRY / 1000,
        path: '/',
      });

      return { success: true, user };
    }

    return { success: false, error: 'Invalid email or password' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An error occurred during login' };
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
