/**
 * Enhanced Employees Store
 * Complete state management for Employee module
 * Includes CRUD operations, filtering, pagination, and soft delete
 */

import { writable, derived, get, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import type {
	Employee,
	EmployeeFormData,
	EmployeeFilters,
	PaginationState,
	EmployeeDocument,
	CSVImportResult,
	CSVPreviewRow
} from '$lib/types/employee';
import { generateId, DEPARTMENTS } from '$lib/types/employee';
import { getInitialEmployees } from '$lib/data/employees';

// ============================
// STORAGE KEY
// ============================

const STORAGE_KEY = 'hr_employees_data';

// ============================
// INITIAL STATE
// ============================

const initialFilters: EmployeeFilters = {
	searchQuery: '',
	department: 'all',
	status: 'all',
	showDeleted: false
};

const initialPagination: PaginationState = {
	currentPage: 1,
	pageSize: 10,
	totalItems: 0,
	totalPages: 0
};

// ============================
// HELPER FUNCTIONS
// ============================

/**
 * Load employees from localStorage or use initial data
 */
const loadEmployees = (): Employee[] => {
	if (browser) {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch {
				localStorage.removeItem(STORAGE_KEY);
			}
		}
	}
	return getInitialEmployees();
};

/**
 * Save employees to localStorage
 */
const saveEmployees = (employees: Employee[]): void => {
	if (browser) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
	}
};

/**
 * Simulate async API call
 */
const simulateDelay = (ms: number = 300): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

// ============================
// STORES
// ============================

// Main employees store
const employeesData: Writable<Employee[]> = writable(loadEmployees());

// Filters store
const filtersStore: Writable<EmployeeFilters> = writable(initialFilters);

// Pagination store
const paginationStore: Writable<PaginationState> = writable(initialPagination);

// Loading state
const loadingStore: Writable<boolean> = writable(false);

// Selected employee for detail view
const selectedEmployeeStore: Writable<Employee | null> = writable(null);

// ============================
// DERIVED STORES
// ============================

/**
 * Filtered employees (before pagination)
 * - Excludes soft-deleted unless showDeleted is true
 * - Applies search query
 * - Applies department filter
 * - Applies status filter
 */
export const filteredEmployees = derived(
	[employeesData, filtersStore],
	([$employees, $filters]) => {
		let result = $employees;

		// Filter out deleted employees unless showDeleted
		if (!$filters.showDeleted) {
			result = result.filter((emp) => !emp.isDeleted);
		}

		// Apply search filter
		if ($filters.searchQuery.trim()) {
			const query = $filters.searchQuery.toLowerCase();
			result = result.filter(
				(emp) =>
					emp.firstName.toLowerCase().includes(query) ||
					emp.lastName.toLowerCase().includes(query) ||
					emp.email.toLowerCase().includes(query) ||
					emp.jobTitle.toLowerCase().includes(query) ||
					emp.department.toLowerCase().includes(query)
			);
		}

		// Apply department filter
		if ($filters.department !== 'all') {
			result = result.filter((emp) => emp.department === $filters.department);
		}

		// Apply status filter
		if ($filters.status !== 'all') {
			result = result.filter((emp) => emp.status === $filters.status);
		}

		return result;
	}
);

/**
 * Paginated employees for display
 */
export const paginatedEmployees = derived(
	[filteredEmployees, paginationStore],
	([$filtered, $pagination]) => {
		const start = ($pagination.currentPage - 1) * $pagination.pageSize;
		const end = start + $pagination.pageSize;
		return $filtered.slice(start, end);
	}
);

/**
 * Active employees only (not deleted, not resigned)
 */
export const activeEmployees = derived(employeesData, ($employees) => {
	return $employees.filter((emp) => !emp.isDeleted && emp.status === 'active');
});

/**
 * Employee statistics
 */
export const employeeStats = derived(employeesData, ($employees) => {
	const nonDeleted = $employees.filter((e) => !e.isDeleted);
	return {
		total: nonDeleted.length,
		active: nonDeleted.filter((e) => e.status === 'active').length,
		onLeave: nonDeleted.filter((e) => e.status === 'on-leave').length,
		resigned: nonDeleted.filter((e) => e.status === 'resigned').length,
		deleted: $employees.filter((e) => e.isDeleted).length
	};
});

/**
 * Unique departments from employees
 */
export const uniqueDepartments = derived(employeesData, ($employees) => {
	const depts = new Set($employees.filter((e) => !e.isDeleted).map((e) => e.department));
	return Array.from(depts).sort();
});

// ============================
// STORE ACTIONS
// ============================

/**
 * Create the main employees store with actions
 */
function createEmployeesStore() {
	const { subscribe, set, update } = employeesData;

	return {
		subscribe,

		/**
		 * Initialize store (load from storage)
		 */
		init: () => {
			const data = loadEmployees();
			set(data);
			// Update pagination
			updatePagination();
		},

		/**
		 * Get employee by ID
		 */
		getById: async (id: string): Promise<Employee | null> => {
			loadingStore.set(true);
			await simulateDelay();

			const employees = get(employeesData);
			const employee = employees.find((e) => e.id === id) || null;

			selectedEmployeeStore.set(employee);
			loadingStore.set(false);

			return employee;
		},

		/**
		 * Create new employee
		 */
		create: async (data: EmployeeFormData): Promise<Employee> => {
			loadingStore.set(true);
			await simulateDelay(500);

			const now = new Date().toISOString();
			const newEmployee: Employee = {
				id: generateId(),
				...data,
				createdAt: now,
				updatedAt: now,
				isDeleted: false,
				documents: []
			};

			update((employees) => {
				const updated = [...employees, newEmployee];
				saveEmployees(updated);
				return updated;
			});

			updatePagination();
			loadingStore.set(false);

			return newEmployee;
		},

		/**
		 * Update existing employee
		 */
		update: async (id: string, data: Partial<EmployeeFormData>): Promise<Employee | null> => {
			loadingStore.set(true);
			await simulateDelay(500);

			let updatedEmployee: Employee | null = null;

			update((employees) => {
				const index = employees.findIndex((e) => e.id === id);
				if (index === -1) return employees;

				updatedEmployee = {
					...employees[index],
					...data,
					updatedAt: new Date().toISOString()
				};

				const updated = [...employees];
				updated[index] = updatedEmployee;
				saveEmployees(updated);
				return updated;
			});

			if (updatedEmployee) {
				selectedEmployeeStore.set(updatedEmployee);
			}

			loadingStore.set(false);
			return updatedEmployee;
		},

		/**
		 * Soft delete employee
		 */
		softDelete: async (id: string): Promise<boolean> => {
			loadingStore.set(true);
			await simulateDelay(300);

			let success = false;

			update((employees) => {
				const index = employees.findIndex((e) => e.id === id);
				if (index === -1) return employees;

				const updated = [...employees];
				updated[index] = {
					...updated[index],
					isDeleted: true,
					deletedAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				};

				saveEmployees(updated);
				success = true;
				return updated;
			});

			updatePagination();
			loadingStore.set(false);
			return success;
		},

		/**
		 * Restore soft-deleted employee
		 */
		restore: async (id: string): Promise<boolean> => {
			loadingStore.set(true);
			await simulateDelay(300);

			let success = false;

			update((employees) => {
				const index = employees.findIndex((e) => e.id === id);
				if (index === -1) return employees;

				const updated = [...employees];
				updated[index] = {
					...updated[index],
					isDeleted: false,
					deletedAt: undefined,
					updatedAt: new Date().toISOString()
				};

				saveEmployees(updated);
				success = true;
				return updated;
			});

			updatePagination();
			loadingStore.set(false);
			return success;
		},

		/**
		 * Permanently delete employee
		 */
		permanentDelete: async (id: string): Promise<boolean> => {
			loadingStore.set(true);
			await simulateDelay(300);

			update((employees) => {
				const updated = employees.filter((e) => e.id !== id);
				saveEmployees(updated);
				return updated;
			});

			updatePagination();
			loadingStore.set(false);
			return true;
		},

		/**
		 * Add document to employee
		 */
		addDocument: async (employeeId: string, document: Omit<EmployeeDocument, 'id' | 'employeeId' | 'uploadedAt'>): Promise<EmployeeDocument | null> => {
			loadingStore.set(true);
			await simulateDelay(500);

			const newDoc: EmployeeDocument = {
				id: `doc-${Date.now()}`,
				employeeId,
				...document,
				uploadedAt: new Date().toISOString()
			};

			let addedDoc: EmployeeDocument | null = null;

			update((employees) => {
				const index = employees.findIndex((e) => e.id === employeeId);
				if (index === -1) return employees;

				const updated = [...employees];
				updated[index] = {
					...updated[index],
					documents: [...updated[index].documents, newDoc],
					updatedAt: new Date().toISOString()
				};

				saveEmployees(updated);
				addedDoc = newDoc;
				return updated;
			});

			loadingStore.set(false);
			return addedDoc;
		},

		/**
		 * Remove document from employee
		 */
		removeDocument: async (employeeId: string, documentId: string): Promise<boolean> => {
			loadingStore.set(true);
			await simulateDelay(300);

			let success = false;

			update((employees) => {
				const empIndex = employees.findIndex((e) => e.id === employeeId);
				if (empIndex === -1) return employees;

				const updated = [...employees];
				updated[empIndex] = {
					...updated[empIndex],
					documents: updated[empIndex].documents.filter((d) => d.id !== documentId),
					updatedAt: new Date().toISOString()
				};

				saveEmployees(updated);
				success = true;
				return updated;
			});

			loadingStore.set(false);
			return success;
		},

		/**
		 * Update profile picture
		 */
		updateProfilePicture: async (employeeId: string, pictureData: string): Promise<boolean> => {
			loadingStore.set(true);
			await simulateDelay(500);

			let success = false;

			update((employees) => {
				const index = employees.findIndex((e) => e.id === employeeId);
				if (index === -1) return employees;

				const updated = [...employees];
				updated[index] = {
					...updated[index],
					profilePicture: pictureData,
					updatedAt: new Date().toISOString()
				};

				saveEmployees(updated);
				success = true;
				return updated;
			});

			loadingStore.set(false);
			return success;
		},

		/**
		 * Bulk import from CSV
		 */
		bulkImport: async (employees: EmployeeFormData[]): Promise<CSVImportResult> => {
			loadingStore.set(true);
			await simulateDelay(1000);

			const result: CSVImportResult = {
				success: 0,
				failed: 0,
				errors: [],
				importedEmployees: []
			};

			const now = new Date().toISOString();
			const newEmployees: Employee[] = [];

			employees.forEach((data, index) => {
				try {
					const newEmployee: Employee = {
						id: generateId(),
						...data,
						createdAt: now,
						updatedAt: now,
						isDeleted: false,
						documents: []
					};
					newEmployees.push(newEmployee);
					result.importedEmployees.push(newEmployee);
					result.success++;
				} catch (error) {
					result.failed++;
					result.errors.push({
						row: index + 2, // +2 for header row and 0-index
						message: error instanceof Error ? error.message : 'Unknown error'
					});
				}
			});

			if (newEmployees.length > 0) {
				update((current) => {
					const updated = [...current, ...newEmployees];
					saveEmployees(updated);
					return updated;
				});
				updatePagination();
			}

			loadingStore.set(false);
			return result;
		},

		/**
		 * Reset to initial data
		 */
		reset: () => {
			const initial = getInitialEmployees();
			set(initial);
			saveEmployees(initial);
			filtersStore.set(initialFilters);
			updatePagination();
		}
	};
}

// ============================
// FILTER ACTIONS
// ============================

function createFiltersStore() {
	const { subscribe, set, update } = filtersStore;

	return {
		subscribe,

		setSearchQuery: (query: string) => {
			update((f) => ({ ...f, searchQuery: query }));
			paginationStore.update((p) => ({ ...p, currentPage: 1 }));
			updatePagination();
		},

		setDepartment: (department: string) => {
			update((f) => ({ ...f, department }));
			paginationStore.update((p) => ({ ...p, currentPage: 1 }));
			updatePagination();
		},

		setStatus: (status: string) => {
			update((f) => ({ ...f, status }));
			paginationStore.update((p) => ({ ...p, currentPage: 1 }));
			updatePagination();
		},

		toggleShowDeleted: () => {
			update((f) => ({ ...f, showDeleted: !f.showDeleted }));
			paginationStore.update((p) => ({ ...p, currentPage: 1 }));
			updatePagination();
		},

		reset: () => {
			set(initialFilters);
			paginationStore.update((p) => ({ ...p, currentPage: 1 }));
			updatePagination();
		}
	};
}

// ============================
// PAGINATION ACTIONS
// ============================

function updatePagination() {
	const filtered = get(filteredEmployees);
	const currentPagination = get(paginationStore);

	const totalItems = filtered.length;
	const totalPages = Math.ceil(totalItems / currentPagination.pageSize);
	const currentPage = Math.min(currentPagination.currentPage, totalPages || 1);

	paginationStore.set({
		...currentPagination,
		currentPage,
		totalItems,
		totalPages
	});
}

function createPaginationStore() {
	const { subscribe, update } = paginationStore;

	return {
		subscribe,

		setPage: (page: number) => {
			update((p) => ({
				...p,
				currentPage: Math.max(1, Math.min(page, p.totalPages))
			}));
		},

		setPageSize: (size: number) => {
			update((p) => ({
				...p,
				pageSize: size,
				currentPage: 1
			}));
			updatePagination();
		},

		nextPage: () => {
			update((p) => ({
				...p,
				currentPage: Math.min(p.currentPage + 1, p.totalPages)
			}));
		},

		prevPage: () => {
			update((p) => ({
				...p,
				currentPage: Math.max(p.currentPage - 1, 1)
			}));
		}
	};
}

// ============================
// EXPORTS
// ============================

export const employees = createEmployeesStore();
export const employeeFilters = createFiltersStore();
export const pagination = createPaginationStore();
export const isLoading = { subscribe: loadingStore.subscribe };
export const selectedEmployee = { subscribe: selectedEmployeeStore.subscribe };

// Export filters store for reading
export { filtersStore };
