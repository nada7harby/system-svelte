/**
 * Employee Types & Interfaces
 * Comprehensive type definitions for the Employee Management module
 */

// ============================
// ENUMS
// ============================

export type EmployeeStatus = 'active' | 'on-leave' | 'resigned';
export type EmploymentType = 'full-time' | 'part-time' | 'contract';
export type DocumentType = 'id' | 'contract' | 'certificate' | 'other';

// ============================
// INTERFACES
// ============================

/**
 * Employee Document - Files attached to employee profile
 */
export interface EmployeeDocument {
	id: string;
	employeeId: string;
	name: string;
	type: DocumentType;
	url: string; // Base64 or blob URL for mock
	uploadedAt: string;
	fileSize: number; // in bytes
	mimeType: string;
}

/**
 * Employee - Complete employee record
 */
export interface Employee {
	id: string;
	// Personal Information
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
	dateOfBirth: string;
	profilePicture?: string; // Base64 or URL
	
	// Job Information
	department: string;
	jobTitle: string;
	employmentType: EmploymentType;
	startDate: string;
	salary: number;
	status: EmployeeStatus;
	
	// Metadata
	createdAt: string;
	updatedAt: string;
	deletedAt?: string; // For soft delete
	isDeleted: boolean;
	
	// Related data
	documents: EmployeeDocument[];
}

/**
 * Employee Form Data - For create/update operations
 */
export interface EmployeeFormData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
	dateOfBirth: string;
	profilePicture?: string;
	department: string;
	jobTitle: string;
	employmentType: EmploymentType;
	startDate: string;
	salary: number;
	status: EmployeeStatus;
}

/**
 * Form validation errors
 */
export interface EmployeeFormErrors {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	address?: string;
	dateOfBirth?: string;
	department?: string;
	jobTitle?: string;
	employmentType?: string;
	startDate?: string;
	salary?: string;
	status?: string;
}

/**
 * Employee Filters for list view
 */
export interface EmployeeFilters {
	searchQuery: string;
	department: string;
	status: string;
	showDeleted: boolean;
}

/**
 * Pagination state
 */
export interface PaginationState {
	currentPage: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
}

/**
 * CSV Import Result
 */
export interface CSVImportResult {
	success: number;
	failed: number;
	errors: Array<{
		row: number;
		message: string;
	}>;
	importedEmployees: Employee[];
}

/**
 * CSV Preview Row
 */
export interface CSVPreviewRow {
	rowNumber: number;
	data: Partial<EmployeeFormData>;
	isValid: boolean;
	errors: string[];
}

// ============================
// CONSTANTS
// ============================

export const DEPARTMENTS = [
	'Engineering',
	'Human Resources',
	'Marketing',
	'Finance',
	'Sales',
	'Operations',
	'Product',
	'Design',
	'Legal',
	'Customer Support'
] as const;

export const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
	{ value: 'full-time', label: 'Full-time' },
	{ value: 'part-time', label: 'Part-time' },
	{ value: 'contract', label: 'Contract' }
];

export const EMPLOYEE_STATUSES: { value: EmployeeStatus; label: string }[] = [
	{ value: 'active', label: 'Active' },
	{ value: 'on-leave', label: 'On Leave' },
	{ value: 'resigned', label: 'Resigned' }
];

export const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
	{ value: 'id', label: 'ID Document' },
	{ value: 'contract', label: 'Employment Contract' },
	{ value: 'certificate', label: 'Certificate' },
	{ value: 'other', label: 'Other' }
];

export const PAGE_SIZES = [10, 25, 50, 100] as const;

// ============================
// HELPER FUNCTIONS
// ============================

/**
 * Get full name from employee
 */
export const getFullName = (employee: Employee): string => {
	return `${employee.firstName} ${employee.lastName}`;
};

/**
 * Format salary for display
 */
export const formatSalary = (salary: number): string => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(salary);
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
	if (!dateString) return '';
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
};

/**
 * Get initials from name
 */
export const getInitials = (firstName: string, lastName: string): string => {
	return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
	return `emp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
