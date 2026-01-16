/**
 * Department & Position Types & Interfaces
 * Comprehensive type definitions for the Department & Positions module
 */

// ============================
// ENUMS
// ============================

export type DepartmentStatus = 'active' | 'inactive';
export type PositionLevel = 'junior' | 'mid' | 'senior' | 'lead' | 'manager';

// ============================
// INTERFACES
// ============================

/**
 * Position - A role within a department
 */
export interface Position {
	id: string;
	departmentId: string;
	title: string;
	level: PositionLevel;
	baseSalary?: number;
	description?: string;
	createdAt: string;
	updatedAt: string;
}

/**
 * Department - Organization unit with positions
 */
export interface Department {
	id: string;
	name: string;
	description: string;
	status: DepartmentStatus;
	managerId?: string;
	managerName?: string;
	location?: string;
	budget?: number;
	positions: Position[];
	employeeCount: number;
	createdAt: string;
	updatedAt: string;
}

/**
 * Department Form Data - For create/update operations
 */
export interface DepartmentFormData {
	name: string;
	description: string;
	status: DepartmentStatus;
	managerId?: string;
	location?: string;
	budget?: number;
}

/**
 * Position Form Data - For create/update operations
 */
export interface PositionFormData {
	title: string;
	level: PositionLevel;
	baseSalary?: number;
	description?: string;
}

/**
 * Employee Assignment Data
 */
export interface EmployeeAssignment {
	employeeId: string;
	departmentId: string;
	positionId: string;
	assignedAt: string;
}

// ============================
// CONSTANTS
// ============================

export const POSITION_LEVELS: { value: PositionLevel; label: string; color: string }[] = [
	{ value: 'junior', label: 'Junior', color: 'info' },
	{ value: 'mid', label: 'Mid-Level', color: 'primary' },
	{ value: 'senior', label: 'Senior', color: 'success' },
	{ value: 'lead', label: 'Lead', color: 'warning' },
	{ value: 'manager', label: 'Manager', color: 'secondary' }
];

export const DEPARTMENT_STATUSES: { value: DepartmentStatus; label: string; color: string }[] = [
	{ value: 'active', label: 'Active', color: 'success' },
	{ value: 'inactive', label: 'Inactive', color: 'danger' }
];

// ============================
// HELPER FUNCTIONS
// ============================

/**
 * Generate unique ID for departments
 */
export const generateDepartmentId = (): string => {
	return `dept-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate unique ID for positions
 */
export const generatePositionId = (): string => {
	return `pos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get position level display info
 */
export const getPositionLevelInfo = (level: PositionLevel) => {
	return POSITION_LEVELS.find((l) => l.value === level) || POSITION_LEVELS[0];
};

/**
 * Get department status display info
 */
export const getDepartmentStatusInfo = (status: DepartmentStatus) => {
	return DEPARTMENT_STATUSES.find((s) => s.value === status) || DEPARTMENT_STATUSES[0];
};

/**
 * Format salary for display
 */
export const formatPositionSalary = (salary?: number): string => {
	if (!salary) return 'Not specified';
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(salary);
};
