const API_BASE = import.meta.env.VITE_API_BASE || '/api';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getMe: () => request('/auth/me'),

  // Dashboard
  getDashboard: () => request('/dashboard'),

  // Students
  getStudents: (params = '') => request(`/students${params ? '?' + params : ''}`),
  getStudent: (id) => request(`/students/${id}`),
  getStudentStats: () => request('/students/stats'),
  addStudent: (data) => request('/students', { method: 'POST', body: JSON.stringify(data) }),
  updateStudent: (id, data) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStudent: (id) => request(`/students/${id}`, { method: 'DELETE' }),

  // Attendance
  markAttendance: (data) => request('/attendance', { method: 'POST', body: JSON.stringify(data) }),
  getAttendanceByDate: (date, classBatch) => request(`/attendance/date/${date}${classBatch ? '?class_batch=' + classBatch : ''}`),
  getStudentAttendance: (id, month, year) => request(`/attendance/student/${id}?month=${month}&year=${year}`),
  getAttendanceReport: (month, year, classBatch) => {
    let params = `month=${month}&year=${year}`;
    if (classBatch) params += `&class_batch=${classBatch}`;
    return request(`/attendance/report?${params}`);
  },

  // Fees
  getFees: (params = '') => request(`/fees${params ? '?' + params : ''}`),
  getPendingFees: () => request('/fees/pending'),
  getFeeReport: (year) => request(`/fees/report?year=${year}`),
  createFees: (data) => request('/fees', { method: 'POST', body: JSON.stringify(data) }),
  updateFee: (id, data) => request(`/fees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  sendFeeReminders: (data) => request('/fees/remind', { method: 'POST', body: JSON.stringify(data) }),

  // Marks
  getSubjects: () => request('/marks/subjects'),
  addSubject: (data) => request('/marks/subjects', { method: 'POST', body: JSON.stringify(data) }),
  updateSubject: (id, data) => request(`/marks/subjects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSubject: (id) => request(`/marks/subjects/${id}`, { method: 'DELETE' }),
  enterMarks: (data) => request('/marks', { method: 'POST', body: JSON.stringify(data) }),
  getSubjectResults: (subjectId) => request(`/marks/subject/${subjectId}`),
  deleteMark: (subjectId, studentId) => request(`/marks/subject/${subjectId}/student/${studentId}`, { method: 'DELETE' }),
  getStudentMarks: (id) => request(`/marks/student/${id}`),
  getStudentProfile: (id) => request(`/students/${id}/profile`),

  // Notifications
  logNotification: (data) => request('/notifications/log', { method: 'POST', body: JSON.stringify(data) }),
  getNotificationHistory: (params = '') => request(`/notifications/history${params ? '?' + params : ''}`)
};

export default api;
