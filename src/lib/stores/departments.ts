/**
 * Departments Store
 * Manages departments data with filtering capabilities
 */

import { writable, derived, type Writable } from 'svelte/store';
import { mockDepartments, type Department } from '$lib/data/mockData';

// ============================
// TYPES
// ============================

export interface DepartmentsState {
	departments: Department[];
	searchQuery: string;
	isLoading: boolean;
}

// ============================
// INITIAL STATE
// ============================

const initialState: DepartmentsState = {
	departments: mockDepartments,
	searchQuery: '',
	isLoading: false
};

// ============================
// STORE CREATION
// ============================

function createDepartmentsStore() {
	const { subscribe, update }: Writable<DepartmentsState> = writable(initialState);

	return {
		subscribe,

		/**
		 * Set the search query for filtering departments
		 * @param query - Search string
		 */
		setSearchQuery: (query: string) => {
			update((state) => ({
				...state,
				searchQuery: query
			}));
		},

		/**
		 * Clear search query
		 */
		clearSearch: () => {
			update((state) => ({
				...state,
				searchQuery: ''
			}));
		},

		/**
		 * Reload departments from mock data
		 */
		refresh: async () => {
			update((state) => ({ ...state, isLoading: true }));

			await new Promise((resolve) => setTimeout(resolve, 500));

			update((state) => ({
				...state,
				departments: mockDepartments,
				isLoading: false
			}));
		}
	};
}

// ============================
// EXPORT STORES
// ============================

export const departmentsStore = createDepartmentsStore();

/**
 * Derived store for filtered departments based on search query
 */
export const filteredDepartments = derived(departmentsStore, ($store) => {
	if (!$store.searchQuery.trim()) {
		return $store.departments;
	}

	const query = $store.searchQuery.toLowerCase();
	return $store.departments.filter(
		(dept) =>
			dept.name.toLowerCase().includes(query) ||
			dept.description.toLowerCase().includes(query) ||
			dept.manager.toLowerCase().includes(query)
	);
});

/**
 * Derived store for department statistics
 */
export const departmentStats = derived(departmentsStore, ($store) => {
	const departments = $store.departments;

	return {
		total: departments.length,
		totalEmployees: departments.reduce((acc, d) => acc + d.employeeCount, 0),
		totalBudget: departments.reduce((acc, d) => acc + d.budget, 0)
	};
});
