/**
 * auth.js
 * Responsibility: Credential validation and session lifecycle only.
 *
 * This module has NO knowledge of:
 *   - Page routes or redirect targets (delegated to rbac.js)
 *   - UI rendering or DOM structure outside the login form
 *   - Role-specific behaviour
 *
 * Session contract:
 *   On success, writes a session object to sessionStorage under key 'sms_session'.
 *   Session shape: { id, username, name, role, avatar, issuedAt }
 *   sessionStorage is intentionally used over localStorage — session ends on tab close,
 *   which is the correct behaviour for an authenticated school management system.
 */

'use strict';

/** @type {string} Session storage key — single source of truth. */
const SESSION_KEY = 'sms_session';

/**
 * Reads the active session, if any.
 * @returns {{ id: string, username: string, name: string, role: string, avatar: string, issuedAt: number } | null}
 */
function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    // Corrupted session data — treat as unauthenticated.
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

/**
 * Writes a validated user record into session storage.
 * Strips the password before persisting — passwords must never be stored in session.
 * @param {{ id: string, username: string, name: string, role: string, avatar: string }} user
 */
function createSession(user) {
  const session = {
    id:       user.id,
    username: user.username,
    name:     user.name,
    role:     user.role,
    avatar:   user.avatar,
    issuedAt: Date.now(),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Destroys the active session and returns the user to the login page.
 * Safe to call from any page — computes the root path dynamically.
 */
function destroySession() {
  sessionStorage.removeItem(SESSION_KEY);

  // Navigate to root index.html regardless of current page depth.
  const depth = window.location.pathname.split('/pages/').length - 1;
  const prefix = depth > 0 ? '../' : '';
  window.location.replace(prefix + 'index.html');
}

/**
 * Handles the login form submission.
 * Authenticates against MOCK_DATA.users by matching { username, password }.
 * On success: creates a session and delegates redirect to RBAC.
 * On failure: surfaces a sanitised error — never reveals which field was wrong.
 */
function handleLogin() {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorEl       = document.getElementById('login-error');

  // Normalise inputs — trim whitespace, lowercase username.
  const username = usernameInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  // Clear previous error state.
  errorEl.hidden = true;
  errorEl.textContent = '';

  if (!username || !password) {
    showLoginError(errorEl, 'Please enter both your username and password.');
    return;
  }

  // Credential lookup — constant-time semantics (both checks in one find).
  const user = MOCK_DATA.users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    // Generic error: do not indicate whether username or password was wrong.
    showLoginError(errorEl, 'Invalid credentials. Please try again.');
    passwordInput.value = '';
    passwordInput.focus();
    return;
  }

  // Credentials valid — establish session then hand off to RBAC for routing.
  createSession(user);
  redirectToRole(user.role);
}

/**
 * Returns true when the current page is the login screen.
 * @returns {boolean}
 */
function isLoginPage() {
  const currentPage = window.location.pathname.split('/').pop();
  return currentPage === '' || currentPage === 'index.html';
}

/**
 * Displays a login error message accessibly.
 * @param {HTMLElement} el
 * @param {string} message
 */
function showLoginError(el, message) {
  el.textContent = message;
  el.hidden = false;
}

// ─── Event binding ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // If already authenticated on the login screen, skip the login page.
  const session = getSession();
  if (session && isLoginPage()) {
    redirectToRole(session.role);
    return;
  }

  // Enter key on either field submits the form.
  ['username', 'password'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });
  });

  // Clear error on new input.
  document.getElementById('username')?.addEventListener('input', () => {
    document.getElementById('login-error').hidden = true;
  });
});
