/**
 * Employees Store
 * Manages employees data with filtering and search capabilities
 * Uses derived stores for reactive filtered data
 */

import { writable, derived, type Writable } from 'svelte/store';
import { mockEmployees, type Employee } from '$lib/data/mockData';

// ============================
// TYPES
// ============================

export interface EmployeeFilters {
	searchQuery: string;
	department: string;
	status: string;
}

export interface EmployeesState {
	employees: Employee[];
	filters: EmployeeFilters;
	isLoading: boolean;
}

// ============================
// INITIAL STATE
// ============================

const initialFilters: EmployeeFilters = {
	searchQuery: '',
	department: 'all',
	status: 'all'
};

const initialState: EmployeesState = {
	employees: mockEmployees,
	filters: initialFilters,
	isLoading: false
};

// ============================
// STORE CREATION
// ============================

function createEmployeesStore() {
	const { subscribe, set, update }: Writable<EmployeesState> = writable(initialState);

	return {
		subscribe,

		/**
		 * Set the search query for filtering employees
		 * @param query - Search string
		 */
		setSearchQuery: (query: string) => {
			update((state) => ({
				...state,
				filters: { ...state.filters, searchQuery: query }
			}));
		},

		/**
		 * Set the department filter
		 * @param department - Department name or 'all'
		 */
		setDepartmentFilter: (department: string) => {
			update((state) => ({
				...state,
				filters: { ...state.filters, department }
			}));
		},

		/**
		 * Set the status filter
		 * @param status - Status value or 'all'
		 */
		setStatusFilter: (status: string) => {
			update((state) => ({
				...state,
				filters: { ...state.filters, status }
			}));
		},

		/**
		 * Reset all filters to default values
		 */
		resetFilters: () => {
			update((state) => ({
				...state,
				filters: initialFilters
			}));
		},

		/**
		 * Reload employees from mock data (simulates API refresh)
		 */
		refresh: async () => {
			update((state) => ({ ...state, isLoading: true }));

			// Simulate network delay
			await new Promise((resolve) => setTimeout(resolve, 500));

			update((state) => ({
				...state,
				employees: mockEmployees,
				isLoading: false
			}));
		}
	};
}

// ============================
// EXPORT STORES
// ============================

export const employeesStore = createEmployeesStore();

/**
 * Derived store that returns filtered employees based on current filters
 * Automatically updates when source store or filters change
 */
export const filteredEmployees = derived(employeesStore, ($store) => {
	let result = $store.employees;

	// Apply search filter
	if ($store.filters.searchQuery.trim()) {
		const query = $store.filters.searchQuery.toLowerCase();
		result = result.filter(
			(emp) =>
				emp.name.toLowerCase().includes(query) ||
				emp.email.toLowerCase().includes(query) ||
				emp.jobTitle.toLowerCase().includes(query) ||
				emp.department.toLowerCase().includes(query)
		);
	}

	// Apply department filter
	if ($store.filters.department !== 'all') {
		result = result.filter((emp) => emp.department === $store.filters.department);
	}

	// Apply status filter
	if ($store.filters.status !== 'all') {
		result = result.filter((emp) => emp.status === $store.filters.status);
	}

	return result;
});

/**
 * Derived store for employee statistics
 */
export const employeeStats = derived(employeesStore, ($store) => {
	const employees = $store.employees;

	return {
		total: employees.length,
		active: employees.filter((e) => e.status === 'active').length,
		inactive: employees.filter((e) => e.status === 'inactive').length,
		onLeave: employees.filter((e) => e.status === 'on-leave').length
	};
});

/**
 * Derived store for unique departments (for filter dropdown)
 */
export const uniqueDepartments = derived(employeesStore, ($store) => {
	return [...new Set($store.employees.map((e) => e.department))].sort();
});
