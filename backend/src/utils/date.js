// src/utils/date.js
export function daysLeft(targetDate) {
    if (!targetDate) return null;
    const ms = new Date(targetDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}
