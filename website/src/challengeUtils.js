export function getCompletedChallenges() {
  try {
    return JSON.parse(localStorage.getItem('devsprint.completed') || '[]');
  } catch {
    return [];
  }
}

export function saveCompletedChallenges(ids) {
  localStorage.setItem('devsprint.completed', JSON.stringify(ids));
}
