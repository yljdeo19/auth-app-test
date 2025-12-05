export interface UserProfile {
  id: number;
  email: string;
}

export async function apiLogin(email: string, password: string): Promise<void> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message = (data && data.message) || 'Login failed';
    throw new Error(message);
  }
}

export async function apiLogout(): Promise<void> {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });
}

export async function apiProfile(): Promise<UserProfile | null> {
  const res = await fetch('/api/profile', {
    method: 'GET',
    credentials: 'include'
  });

  if (res.status === 401) {
    return null;
  }

  if (!res.ok) {
    throw new Error('Failed to fetch profile');
  }

  return res.json();
}
