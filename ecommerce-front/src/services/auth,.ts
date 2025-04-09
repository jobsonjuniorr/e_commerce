export function isTokenExpired(): boolean {
    const createdAt = localStorage.getItem("token_created_at");
    if (!createdAt) return true;

    const now = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    return now - parseInt(createdAt) > ONE_DAY;
}