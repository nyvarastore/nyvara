'use server';

import { cookies } from 'next/headers';

export async function loginAction(formData: FormData) {
  const password = formData.get('password');
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: 'Admin password not configured on server.' };
  }

  if (password === adminPassword) {
    // Set a cookie that expires in 7 days
    cookies().set('nyvara_admin_auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    return { success: true };
  } else {
    return { error: 'Mot de passe incorrect.' };
  }
}

export async function logoutAction() {
  cookies().delete('nyvara_admin_auth');
}
