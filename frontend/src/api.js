// API Configuration
const API_BASE = 'https://skillbridge-backend-4n6f.onrender.com/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(data?.message || 'Request failed');
  }

  return data;
}

export const api = {
  health: () => request('/health'),

  register: (body) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body)
  }),

  login: (body) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body)
  }),

  questions: (skill) => request(`/assessments/${encodeURIComponent(skill)}`),

  roadmap: (role) => request(`/roadmaps?role=${encodeURIComponent(role)}`),

  submitAssessment: (body) => request('/assessments/submit', {
    method: 'POST',
    body: JSON.stringify(body)
  }),

  latestAssessment: (userId, skill) => request(`/assessments/latest?userId=${userId}&skill=${encodeURIComponent(skill)}`),

  progress: (userId) => request(`/progress/${userId}`),

  updateProgress: (userId, skill, topic, percent) => request('/progress', {
    method: 'PUT',
    body: JSON.stringify({ userId, skill, topic, percent })
  }),

  skills: () => request('/skills'),

  createSkill: (body) => request('/skills', {
    method: 'POST',
    body: JSON.stringify(body)
  })
};

// Session management
export function saveSessionUser(user) {
  localStorage.setItem('skillbridge_user', JSON.stringify(user));
}

export function getSessionUser() {
  try {
    return JSON.parse(localStorage.getItem('skillbridge_user'));
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem('skillbridge_user');
}
