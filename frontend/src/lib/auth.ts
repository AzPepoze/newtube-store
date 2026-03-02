export function getUserId(): string {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(/(?:^|;\s*)userId=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : '';
}

export function clearUserId() {
    document.cookie = 'userId=; Path=/; Max-Age=0';
}
