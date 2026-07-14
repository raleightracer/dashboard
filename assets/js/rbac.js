/**
 * rbac.js
 * Responsibilities:
 *   1. Role-to-route mapping (single source of truth for all page paths).
 *   2. Page guard — enforces session + role authorisation on every dashboard page.
 *   3. Application shell rendering — sidebar nav, top bar, logout.
 *   4. Shared UI utilities — badge, formatDate, formatCurrency, toast, modal.
 *
 * Depends on: auth.js (getSession, destroySession), mockData.js (MOCK_DATA)
 * auth.js calls redirectToRole() defined here — loaded after auth.js on login page.
 */

'use strict';

/* ─────────────────────────────────────────────────────────────────────────────
 * ROUTING TABLE
 * Maps each role to its canonical page path (relative to project root).
 * This is the ONLY place page paths are defined — auth.js never touches paths.
 * ──────────────────────────────────────────────────────────────────────────── */
const ROLE_ROUTES = Object.freeze({
  executive:   'executive.html',
  enrollment:  'enrollment.html',
  procurement: 'procurement.html',
  hr:          'hr.html',
  teacher:     'teacher.html',
});

/* ─────────────────────────────────────────────────────────────────────────────
 * ACCESS CONTROL MATRIX
 * Maps each page filename to the roles permitted to view it.
 * executive has read access to all operational pages (cross-department visibility).
 * ──────────────────────────────────────────────────────────────────────────── */
const PAGE_ROLES = Object.freeze({
  'executive.html':   ['executive'],
  'enrollment.html':  ['enrollment',  'executive'],
  'procurement.html': ['procurement', 'executive'],
  'hr.html':          ['hr',          'executive'],
  'teacher.html':     ['teacher'],
});

/* ─────────────────────────────────────────────────────────────────────────────
 * NAV CONFIGURATION
 * Defines sidebar links per role. Anchor hrefs (#) scroll within the page;
 * filename hrefs navigate between pages.
 * ──────────────────────────────────────────────────────────────────────────── */
const NAV_CONFIG = Object.freeze({
  executive: [
    { label: 'Executive Summary', icon: 'ti-layout-dashboard', href: 'executive.html'   },
    { label: 'Enrollment',        icon: 'ti-school',           href: 'enrollment.html'  },
    { label: 'Procurement',       icon: 'ti-shopping-cart',    href: 'procurement.html' },
    { label: 'HR Staff',          icon: 'ti-users',            href: 'hr.html'          },
  ],
  enrollment:  [{ label: 'Enrollment',  icon: 'ti-school',        href: 'enrollment.html'  }],
  procurement: [{ label: 'Procurement', icon: 'ti-shopping-cart', href: 'procurement.html' }],
  hr:          [{ label: 'HR Staff',    icon: 'ti-users',         href: 'hr.html'          }],
  teacher: [
    { label: 'My Students',    icon: 'ti-users-group', href: '#section-students'   },
    { label: 'Curriculum',     icon: 'ti-calendar',    href: '#section-curriculum' },
    { label: 'Certifications', icon: 'ti-certificate', href: '#section-certs'      },
  ],
});

const ROLE_LABELS = Object.freeze({
  executive:   'Executive Assistant',
  enrollment:  'Enrollment Specialist',
  procurement: 'Procurement Officer',
  hr:          'HR Staff',
  teacher:     'Daycare Teacher',
});

/* ─────────────────────────────────────────────────────────────────────────────
 * ROUTING
 * Called by auth.js after successful credential validation.
 * Resolves role → canonical path and redirects.
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Redirects the browser to the dashboard page for the given role.
 * Called from auth.js — the two modules co-operate through this function.
 * @param {string} role
 */
function redirectToRole(role) {
  const target = ROLE_ROUTES[role];
  if (!target) {
    console.error(`[rbac] Unknown role "${role}" — cannot redirect.`);
    return;
  }
  window.location.replace('pages/' + target);
}

/* ─────────────────────────────────────────────────────────────────────────────
 * PAGE GUARD
 * Must be called at the top of every dashboard page's <script>.
 * Validates session exists and that the session role is permitted on this page.
 * Returns the session object on success; otherwise redirects and returns null.
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * @returns {{ id: string, name: string, role: string, avatar: string } | null}
 */
function guardPage() {
  const session     = getSession();
  const currentPage = window.location.pathname.split('/').pop();

  // No session → back to login.
  if (!session) {
    window.location.replace('../index.html');
    return null;
  }

  const permittedRoles = PAGE_ROLES[currentPage] ?? [];

  // Role not authorised for this page → back to their own dashboard.
  if (!permittedRoles.includes(session.role)) {
    window.location.replace(ROLE_ROUTES[session.role] ?? '../index.html');
    return null;
  }

  return session;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * APPLICATION SHELL
 * Renders the persistent sidebar + top bar into document.body.
 * Injects an empty <main id="main-content"> for page scripts to populate.
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * @param {{ id: string, name: string, role: string, avatar: string }} session
 * @param {string} pageTitle  Displayed in the top bar.
 */
function renderShell(session, pageTitle) {
  const navItems = (NAV_CONFIG[session.role] ?? [])
    .map(item => {
      const isAnchor = item.href.startsWith('#');
      const isActive = !isAnchor && item.href === window.location.pathname.split('/').pop();
      return `
        <a href="${item.href}" class="nav-item${isActive ? ' active' : ''}">
          <i class="ti ${item.icon}" aria-hidden="true"></i>
          <span>${item.label}</span>
        </a>`;
    })
    .join('');

  document.body.innerHTML = `
    <div class="app-layout">

      <aside class="sidebar" role="navigation" aria-label="Main navigation">
        <div class="sidebar-brand">
          <div class="brand-icon"><i class="ti ti-building-school" aria-hidden="true"></i></div>
          <div>
            <div class="brand-name">Bright Minds</div>
            <div class="brand-sub">School Management</div>
          </div>
        </div>

        <nav class="sidebar-nav">
          ${navItems}
        </nav>

        <div class="sidebar-footer">
          <div class="user-card">
            <div class="user-avatar" aria-hidden="true">${session.avatar}</div>
            <div class="user-info">
              <div class="user-name">${session.name}</div>
              <div class="user-role">${ROLE_LABELS[session.role] ?? session.role}</div>
            </div>
          </div>
          <button class="logout-btn" onclick="destroySession()" aria-label="Log out" title="Log out">
            <i class="ti ti-logout" aria-hidden="true"></i>
          </button>
        </div>
      </aside>

      <div class="main-wrapper">
        <header class="top-bar">
          <h1 class="page-title">${pageTitle}</h1>
          <div class="top-bar-right">
            <span class="today-date" aria-label="Today's date">
              ${new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>
        <main class="main-content" id="main-content" role="main"></main>
      </div>

    </div>`;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SHARED UI UTILITIES
 * Stateless helpers used by all dashboard page scripts.
 * Defined here so they survive the innerHTML replacement in renderShell.
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Returns an accessible status badge HTML string.
 * @param {string} status
 * @returns {string}
 */
function badge(status) {
  const CLASS_MAP = {
    Pending:    'badge-warning',
    Approved:   'badge-success',
    Rejected:   'badge-danger',
    Active:     'badge-success',
    'On Leave': 'badge-warning',
    Inactive:   'badge-danger',
    Valid:      'badge-success',
    Expired:    'badge-danger',
  };
  return `<span class="badge ${CLASS_MAP[status] ?? 'badge-info'}">${status}</span>`;
}

/**
 * Formats a number as Philippine Peso.
 * @param {number} n
 * @returns {string}
 */
function formatCurrency(n) {
  return '₱' + Number(n).toLocaleString('en-PH');
}

/**
 * Formats a YYYY-MM-DD date string for display.
 * @param {string} str
 * @returns {string}
 */
function formatDate(str) {
  if (!str) return '—';
  return new Date(str + 'T00:00:00')
    .toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Displays a non-blocking toast notification.
 * @param {string}  message
 * @param {'success'|'danger'} type
 */
function showToast(message, type = 'success') {
  const ICON = { success: 'ti-circle-check', danger: 'ti-alert-circle' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `<i class="ti ${ICON[type] ?? 'ti-info-circle'}" aria-hidden="true"></i> ${message}`;
  document.body.appendChild(toast);

  // Trigger CSS transition on next frame.
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 3000);
}

/**
 * Opens a reusable confirmation modal.
 * @param {string}   title
 * @param {string}   bodyHTML   Arbitrary HTML for the modal body.
 * @param {Function} onConfirm  Called when the user clicks Confirm.
 */
function openModal(title, bodyHTML, onConfirm) {
  document.getElementById('app-modal')?.remove();

  const modal = document.createElement('div');
  modal.id        = 'app-modal';
  modal.className = 'modal-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'modal-title');

  modal.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <h2 id="modal-title">${title}</h2>
        <button class="modal-close" aria-label="Close dialog">&times;</button>
      </div>
      <div class="modal-body">${bodyHTML}</div>
      <div class="modal-footer">
        <button class="btn btn-secondary modal-cancel">Cancel</button>
        <button class="btn btn-primary"  id="modal-confirm-btn">Confirm</button>
      </div>
    </div>`;

  document.body.appendChild(modal);

  const close = () => modal.remove();
  modal.querySelector('.modal-close').addEventListener('click', close);
  modal.querySelector('.modal-cancel').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });

  document.getElementById('modal-confirm-btn').addEventListener('click', () => {
    onConfirm();
    close();
  });

  // Trap focus on the first focusable element inside the modal.
  modal.querySelector('button')?.focus();
}
