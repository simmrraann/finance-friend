/**
 * User-scoped storage utilities
 * All data is keyed by user email to ensure proper isolation
 */

const STORAGE_PREFIX = 'simplify';

/**
 * Get storage key for user-specific data
 */
function getUserKey(email: string, key: string): string {
  // Sanitize email for use as storage key
  const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
  return `${STORAGE_PREFIX}:user:${sanitizedEmail}:${key}`;
}

/**
 * Get storage key for global data (not user-specific)
 */
function getGlobalKey(key: string): string {
  return `${STORAGE_PREFIX}:${key}`;
}

/**
 * User profile storage (keyed by email)
 */
export const userStorage = {
  getProfile: (email: string) => {
    try {
      const stored = localStorage.getItem(getUserKey(email, 'profile'));
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setProfile: (email: string, profile: any) => {
    try {
      localStorage.setItem(getUserKey(email, 'profile'), JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save user profile:', error);
    }
  },

  removeProfile: (email: string) => {
    localStorage.removeItem(getUserKey(email, 'profile'));
  },
};

/**
 * User transactions storage (keyed by email)
 */
export const transactionStorage = {
  getTransactions: (email: string) => {
    try {
      const stored = localStorage.getItem(getUserKey(email, 'transactions'));
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  setTransactions: (email: string, transactions: any[]) => {
    try {
      localStorage.setItem(getUserKey(email, 'transactions'), JSON.stringify(transactions));
    } catch (error) {
      console.error('Failed to save transactions:', error);
    }
  },

  removeTransactions: (email: string) => {
    localStorage.removeItem(getUserKey(email, 'transactions'));
  },
};

/**
 * Session storage (current logged-in user)
 */
export const sessionStorage = {
  getCurrentUserEmail: (): string | null => {
    try {
      return localStorage.getItem(getGlobalKey('currentUserEmail'));
    } catch {
      return null;
    }
  },

  setCurrentUserEmail: (email: string | null) => {
    if (email) {
      localStorage.setItem(getGlobalKey('currentUserEmail'), email);
    } else {
      localStorage.removeItem(getGlobalKey('currentUserEmail'));
    }
  },

  clear: () => {
    localStorage.removeItem(getGlobalKey('currentUserEmail'));
  },
};

/**
 * Clear all data for a specific user
 */
export function clearUserData(email: string) {
  userStorage.removeProfile(email);
  transactionStorage.removeTransactions(email);
}

/**
 * Clear all app data (for logout)
 */
export function clearAllData() {
  const currentEmail = sessionStorage.getCurrentUserEmail();
  if (currentEmail) {
    clearUserData(currentEmail);
  }
  sessionStorage.clear();
}

