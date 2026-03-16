// Hardcoded credentials (update as needed)
const USERS = { 'client': 'password123' };

function login(username, password) {
  if (USERS[username] && USERS[username] === password) {
    localStorage.setItem('auth', 'true');
    window.location.href = 'dashboard.html';
  } else {
    return false;
  }
  return true;
}

function logout() {
  localStorage.removeItem('auth');
  window.location.href = 'login.html';
}

function requireAuth() {
  if (localStorage.getItem('auth') !== 'true') {
    window.location.href = 'login.html';
  }
}
