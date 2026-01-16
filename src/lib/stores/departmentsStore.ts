/**
 * Departments Store (Enhanced)
 * Complete state management for Departments & Positions module
 * Includes CRUD operations, positions management, and employee assignment
 */

import { writable, derived, get, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import type {
	Department,
	Position,
	DepartmentFormData,
	PositionFormData,
	DepartmentStatus
} from '$lib/types/department';
import { generateDepartmentId, generatePositionId } from '$lib/types/department';
import { mockDepartmentsData, mockPositions } from '$lib/data/departmentsData';

// ============================
// STORAGE KEY
// ============================

const STORAGE_KEY = 'hr_departments_data';
const POSITIONS_STORAGE_KEY = 'hr_positions_data';

// ============================
// TYPES
// ============================

export interface DepartmentsState {
	departments: Department[];
	positions: Position[];
	isLoading: boolean;
	searchQuery: string;
	statusFilter: DepartmentStatus | 'all';
	selectedDepartmentId: string | null;
}

// ============================
// INITIAL STATE
// ============================

const initialState: DepartmentsState = {
	departments: [],
	positions: [],
	isLoading: false,
	searchQuery: '',
	statusFilter: 'all',
	selectedDepartmentId: null
};

// ============================
// HELPER FUNCTIONS
// ============================

/**
 * Load departments from localStorage or use initial data
 */
const loadDepartments = (): Department[] => {
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
	return mockDepartmentsData;
};

/**
 * Load positions from localStorage or use initial data
 */
const loadPositions = (): Position[] => {
	if (browser) {
		const stored = localStorage.getItem(POSITIONS_STORAGE_KEY);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch {
				localStorage.removeItem(POSITIONS_STORAGE_KEY);
			}
		}
	}
	return mockPositions;
};

/**
 * Save departments to localStorage
 */
const saveDepartments = (departments: Department[]): void => {
	if (browser) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(departments));
	}
};

/**
 * Save positions to localStorage
 */
const savePositions = (positions: Position[]): void => {
	if (browser) {
		localStorage.setItem(POSITIONS_STORAGE_KEY, JSON.stringify(positions));
	}
};

/**
 * Simulate async API call
 */
const simulateDelay = (ms: number = 300): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

// ============================
// STORE CREATION
// ============================

function createDepartmentsStore() {
	const store: Writable<DepartmentsState> = writable({
		...initialState,
		departments: loadDepartments(),
		positions: loadPositions()
	});

	const { subscribe, update, set } = store;

	return {
		subscribe,

		// ============================
		// DEPARTMENT CRUD
		// ============================

		/**
		 * Create new department
		 */
		createDepartment: async (data: DepartmentFormData): Promise<Department> => {
			update(s => ({ ...s, isLoading: true }));
			await simulateDelay(500);

			const now = new Date().toISOString();
			const newDepartment: Department = {
				id: generateDepartmentId(),
				...data,
				positions: [],
				employeeCount: 0,
				createdAt: now,
				updatedAt: now
			};

			update(s => {
				const departments = [...s.departments, newDepartment];
				saveDepartments(departments);
				return { ...s, departments, isLoading: false };
			});

			return newDepartment;
		},

		/**
		 * Update existing department
		 */
		updateDepartment: async (id: string, data: Partial<DepartmentFormData>): Promise<Department | null> => {
			update(s => ({ ...s, isLoading: true }));
			await simulateDelay(500);

			let updatedDepartment: Department | null = null;

			update(s => {
				const index = s.departments.findIndex(d => d.id === id);
				if (index === -1) return { ...s, isLoading: false };

				updatedDepartment = {
					...s.departments[index],
					...data,
					updatedAt: new Date().toISOString()
				};

				const departments = [...s.departments];
				departments[index] = updatedDepartment;
				saveDepartments(departments);

				return { ...s, departments, isLoading: false };
			});

			return updatedDepartment;
		},

		/**
		 * Delete department
		 */
		deleteDepartment: async (id: string): Promise<boolean> => {
			update(s => ({ ...s, isLoading: true }));
			await simulateDelay(300);

			update(s => {
				const departments = s.departments.filter(d => d.id !== id);
				const positions = s.positions.filter(p => p.departmentId !== id);
				saveDepartments(departments);
				savePositions(positions);
				return { ...s, departments, positions, isLoading: false };
			});

			return true;
		},

		/**
		 * Get department by ID
		 */
		getDepartmentById: (id: string): Department | undefined => {
			const state = get(store);
			return state.departments.find(d => d.id === id);
		},

		// ============================
		// POSITION CRUD
		// ============================

		/**
		 * Create new position in a department
		 */
		createPosition: async (departmentId: string, data: PositionFormData): Promise<Position> => {
			update(s => ({ ...s, isLoading: true }));
			await simulateDelay(500);

			const now = new Date().toISOString();
			const newPosition: Position = {
				id: generatePositionId(),
				departmentId,
				...data,
				createdAt: now,
				updatedAt: now
			};

			update(s => {
				const positions = [...s.positions, newPosition];
				
				// Update department's positions array
				const deptIndex = s.departments.findIndex(d => d.id === departmentId);
				if (deptIndex !== -1) {
					const departments = [...s.departments];
					departments[deptIndex] = {
						...departments[deptIndex],
						positions: positions.filter(p => p.departmentId === departmentId),
						updatedAt: now
					};
					saveDepartments(departments);
				}
				
				savePositions(positions);
				return { ...s, positions, isLoading: false };
			});

			return newPosition;
		},

		/**
		 * Update existing position
		 */
		updatePosition: async (id: string, data: Partial<PositionFormData>): Promise<Position | null> => {
			update(s => ({ ...s, isLoading: true }));
			await simulateDelay(500);

			let updatedPosition: Position | null = null;

			update(s => {
				const index = s.positions.findIndex(p => p.id === id);
				if (index === -1) return { ...s, isLoading: false };

				const now = new Date().toISOString();
				updatedPosition = {
					...s.positions[index],
					...data,
					updatedAt: now
				};

				const positions = [...s.positions];
				positions[index] = updatedPosition;
				savePositions(positions);

				// Update department's positions array
				const deptId = updatedPosition.departmentId;
				const deptIndex = s.departments.findIndex(d => d.id === deptId);
				if (deptIndex !== -1) {
					const departments = [...s.departments];
					departments[deptIndex] = {
						...departments[deptIndex],
						positions: positions.filter(p => p.departmentId === deptId),
						updatedAt: now
					};
					saveDepartments(departments);
				}

				return { ...s, positions, isLoading: false };
			});

			return updatedPosition;
		},

		/**
		 * Delete position
		 */
		deletePosition: async (id: string): Promise<boolean> => {
			update(s => ({ ...s, isLoading: true }));
			await simulateDelay(300);

			update(s => {
				const position = s.positions.find(p => p.id === id);
				const positions = s.positions.filter(p => p.id !== id);
				savePositions(positions);

				// Update department's positions array
				if (position) {
					const deptIndex = s.departments.findIndex(d => d.id === position.departmentId);
					if (deptIndex !== -1) {
						const departments = [...s.departments];
						departments[deptIndex] = {
							...departments[deptIndex],
							positions: positions.filter(p => p.departmentId === position.departmentId),
							updatedAt: new Date().toISOString()
						};
						saveDepartments(departments);
						return { ...s, departments, positions, isLoading: false };
					}
				}

				return { ...s, positions, isLoading: false };
			});

			return true;
		},

		/**
		 * Get positions by department ID
		 */
		getPositionsByDepartment: (departmentId: string): Position[] => {
			const state = get(store);
			return state.positions.filter(p => p.departmentId === departmentId);
		},

		// ============================
		// FILTERS & SEARCH
		// ============================

		setSearchQuery: (query: string) => {
			update(s => ({ ...s, searchQuery: query }));
		},

		setStatusFilter: (status: DepartmentStatus | 'all') => {
			update(s => ({ ...s, statusFilter: status }));
		},

		clearFilters: () => {
			update(s => ({ ...s, searchQuery: '', statusFilter: 'all' }));
		},

		setSelectedDepartment: (id: string | null) => {
			update(s => ({ ...s, selectedDepartmentId: id }));
		},

		// ============================
		// DATA MANAGEMENT
		// ============================

		/**
		 * Refresh data from storage
		 */
		refresh: async () => {
			update(s => ({ ...s, isLoading: true }));
			await simulateDelay(300);

			update(s => ({
				...s,
				departments: loadDepartments(),
				positions: loadPositions(),
				isLoading: false
			}));
		},

		/**
		 * Reset to initial mock data
		 */
		reset: () => {
			saveDepartments(mockDepartmentsData);
			savePositions(mockPositions);
			set({
				...initialState,
				departments: mockDepartmentsData,
				positions: mockPositions
			});
		}
	};
}

// ============================
// EXPORT STORES
// ============================

export const departmentsStoreNew = createDepartmentsStore();

// ============================
// DERIVED STORES
// ============================

/**
 * Filtered departments based on search and status
 */
export const filteredDepartmentsNew = derived(departmentsStoreNew, ($store) => {
	let result = $store.departments;

	// Apply status filter
	if ($store.statusFilter !== 'all') {
		result = result.filter(d => d.status === $store.statusFilter);
	}

	// Apply search filter
	if ($store.searchQuery.trim()) {
		const query = $store.searchQuery.toLowerCase();
		result = result.filter(
			d =>
				d.name.toLowerCase().includes(query) ||
				d.description.toLowerCase().includes(query) ||
				(d.managerName && d.managerName.toLowerCase().includes(query)) ||
				(d.location && d.location.toLowerCase().includes(query))
		);
	}

	return result;
});

/**
 * Active departments only
 */
export const activeDepartments = derived(departmentsStoreNew, ($store) => {
	return $store.departments.filter(d => d.status === 'active');
});

/**
 * Department statistics
 */
export const departmentStatsNew = derived(departmentsStoreNew, ($store) => {
	const departments = $store.departments;
	const activeDepts = departments.filter(d => d.status === 'active');

	return {
		total: departments.length,
		active: activeDepts.length,
		inactive: departments.length - activeDepts.length,
		totalEmployees: departments.reduce((acc, d) => acc + d.employeeCount, 0),
		totalBudget: departments.reduce((acc, d) => acc + (d.budget || 0), 0),
		totalPositions: $store.positions.length
	};
});

/**
 * Currently selected department
 */
export const selectedDepartment = derived(departmentsStoreNew, ($store) => {
	if (!$store.selectedDepartmentId) return null;
	return $store.departments.find(d => d.id === $store.selectedDepartmentId) || null;
});

/**
 * Positions for selected department
 */
export const selectedDepartmentPositions = derived(departmentsStoreNew, ($store) => {
	if (!$store.selectedDepartmentId) return [];
	return $store.positions.filter(p => p.departmentId === $store.selectedDepartmentId);
});

/**
 * Get department name by ID (utility)
 */
export const getDepartmentName = (departmentId: string): string => {
	const state = get(departmentsStoreNew);
	const dept = state.departments.find(d => d.id === departmentId);
	return dept?.name || 'Unknown';
};

/**
 * Get position title by ID (utility)
 */
export const getPositionTitle = (positionId: string): string => {
	const state = get(departmentsStoreNew);
	const pos = state.positions.find(p => p.id === positionId);
	return pos?.title || 'Unknown';
};
