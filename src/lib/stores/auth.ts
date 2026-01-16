/**
 * Authentication Store
 * Manages user authentication state with mock implementation
 * Stores auth data in localStorage for persistence
 */

import { writable, derived, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

// ============================
// TYPES
// ============================

export interface User {
	id: string;
	email: string;
	name: string;
	role: 'admin' | 'manager' | 'employee';
	avatar?: string;
	department: string;
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

// ============================
// MOCK USER DATA
// ============================

const MOCK_USERS: Record<string, { password: string; user: User }> = {
	'admin@company.com': {
		password: 'admin123',
		user: {
			id: '1',
			email: 'admin@company.com',
			name: 'Nada Harby',
			role: 'admin',
			avatar: '',
			department: 'Management'
		}
	},
	'manager@company.com': {
		password: 'manager123',
		user: {
			id: '2',
			email: 'manager@company.com',
			name: 'Sarah Manager',
			role: 'manager',
			avatar: '',
			department: 'Human Resources'
		}
	}
};

// ============================
// INITIAL STATE
// ============================

const getInitialState = (): AuthState => {
	// Check localStorage for existing session (only in browser)
	if (browser) {
		const storedUser = localStorage.getItem('hr_user');
		if (storedUser) {
			try {
				const user = JSON.parse(storedUser);
				return {
					user,
					isAuthenticated: true,
					isLoading: false,
					error: null
				};
			} catch {
				localStorage.removeItem('hr_user');
			}
		}
	}

	return {
		user: null,
		isAuthenticated: false,
		isLoading: false,
		error: null
	};
};

// ============================
// STORE CREATION
// ============================

function createAuthStore() {
	const { subscribe, set, update }: Writable<AuthState> = writable(getInitialState());

	return {
		subscribe,

		/**
		 * Attempt to login with email and password
		 * @param email - User email
		 * @param password - User password
		 * @returns Promise<boolean> - Success status
		 */
		login: async (email: string, password: string): Promise<boolean> => {
			update((state) => ({ ...state, isLoading: true, error: null }));

			// Simulate network delay
			await new Promise((resolve) => setTimeout(resolve, 800));

			const mockUser = MOCK_USERS[email.toLowerCase()];

			if (mockUser && mockUser.password === password) {
				const authState: AuthState = {
					user: mockUser.user,
					isAuthenticated: true,
					isLoading: false,
					error: null
				};

				// Persist to localStorage
				if (browser) {
					localStorage.setItem('hr_user', JSON.stringify(mockUser.user));
				}

				set(authState);
				return true;
			} else {
				update((state) => ({
					...state,
					isLoading: false,
					error: 'Invalid email or password. Try admin@company.com / admin123'
				}));
				return false;
			}
		},

		/**
		 * Logout the current user
		 */
		logout: () => {
			if (browser) {
				localStorage.removeItem('hr_user');
			}
			set({
				user: null,
				isAuthenticated: false,
				isLoading: false,
				error: null
			});
		},

		/**
		 * Clear any existing error
		 */
		clearError: () => {
			update((state) => ({ ...state, error: null }));
		},

		/**
		 * Check and restore session from localStorage
		 */
		checkSession: () => {
			if (browser) {
				const storedUser = localStorage.getItem('hr_user');
				if (storedUser) {
					try {
						const user = JSON.parse(storedUser);
						set({
							user,
							isAuthenticated: true,
							isLoading: false,
							error: null
						});
					} catch {
						localStorage.removeItem('hr_user');
					}
				}
			}
		}
	};
}

// ============================
// EXPORT STORES
// ============================

export const auth = createAuthStore();

// Derived store for quick access to user info
export const currentUser = derived(auth, ($auth) => $auth.user);

// Derived store for authentication status
export const isAuthenticated = derived(auth, ($auth) => $auth.isAuthenticated);

// Derived store for loading state
export const isAuthLoading = derived(auth, ($auth) => $auth.isLoading);
