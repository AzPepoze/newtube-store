import type { User } from './types';
import { PUBLIC_API_URL } from './constants';

export function getUserId(): string {
	if (typeof document === 'undefined') return '';
	const match = document.cookie.match(/(?:^|;\s*)userId=([^;]*)/);
	return match ? decodeURIComponent(match[1]) : '';
}

export async function getCurrentUser(): Promise<User | null> {
	try {
		const response = await fetch(`${PUBLIC_API_URL}/users/me`, {
			credentials: 'include',
		});
		if (!response.ok) return null;
		return await response.json();
	} catch {
		return null;
	}
}

export function clearUserId() {
	document.cookie = 'userId=; Path=/; Max-Age=0';
}
