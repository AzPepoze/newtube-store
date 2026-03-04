import { redirect } from '@sveltejs/kit';
import { getSessionId } from '$lib/auth';

export function load({ url }) {
    const sessionId = getSessionId() || url.searchParams.get('sessionId');
    if (!sessionId) {
        throw redirect(302, `/login?redirect=${encodeURIComponent('/themes/create')}`);
    }
}
