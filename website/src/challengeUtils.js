export function getCompletedChallenges() {
  try {
    const stored = JSON.parse(localStorage.getItem('devsprint.completed') || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export function saveCompletedChallenges(ids) {
  try {
    localStorage.setItem('devsprint.completed', JSON.stringify(ids));
  } catch {
    // Progress persistence is optional. The current session can continue safely.
  }
}
