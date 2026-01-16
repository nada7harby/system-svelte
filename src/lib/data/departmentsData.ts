/**
 * Mock Departments Data
 * Contains sample department and position data for the HR Management System
 */

import type { Department, Position } from '$lib/types/department';

// ============================
// MOCK POSITIONS
// ============================

export const mockPositions: Position[] = [
	// Engineering Positions
	{
		id: 'pos-1',
		departmentId: 'dept-1',
		title: 'Software Engineer',
		level: 'mid',
		baseSalary: 75000,
		description: 'Develop and maintain software applications',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: 'pos-2',
		departmentId: 'dept-1',
		title: 'Senior Software Engineer',
		level: 'senior',
		baseSalary: 95000,
		description: 'Lead development efforts and mentor junior developers',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: 'pos-3',
		departmentId: 'dept-1',
		title: 'Tech Lead',
		level: 'lead',
		baseSalary: 120000,
		description: 'Technical leadership and architecture decisions',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: 'pos-4',
		departmentId: 'dept-1',
		title: 'Junior Developer',
		level: 'junior',
		baseSalary: 55000,
		description: 'Entry-level software development',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	// HR Positions
	{
		id: 'pos-5',
		departmentId: 'dept-2',
		title: 'HR Manager',
		level: 'manager',
		baseSalary: 85000,
		description: 'Oversee HR operations and team',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: 'pos-6',
		departmentId: 'dept-2',
		title: 'HR Specialist',
		level: 'mid',
		baseSalary: 55000,
		description: 'Handle recruitment and employee relations',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: 'pos-7',
		departmentId: 'dept-2',
		title: 'Recruiter',
		level: 'junior',
		baseSalary: 45000,
		description: 'Source and screen candidates',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	// Marketing Positions
	{
		id: 'pos-8',
		departmentId: 'dept-3',
		title: 'Marketing Manager',
		level: 'manager',
		baseSalary: 90000,
		description: 'Lead marketing strategy and campaigns',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: 'pos-9',
		departmentId: 'dept-3',
		title: 'Content Strategist',
		level: 'mid',
		baseSalary: 65000,
		description: 'Develop content marketing strategies',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: 'pos-10',
		departmentId: 'dept-3',
		title: 'Social Media Specialist',
		level: 'junior',
		baseSalary: 48000,
		description: 'Manage social media presence',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	// Finance Positions
	{
		id: 'pos-11',
		departmentId: 'dept-4',
		title: 'Finance Director',
		level: 'manager',
		baseSalary: 130000,
		description: 'Oversee financial operations',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: 'pos-12',
		departmentId: 'dept-4',
		title: 'Senior Accountant',
		level: 'senior',
		baseSalary: 75000,
		description: 'Handle complex accounting tasks',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: 'pos-13',
		departmentId: 'dept-4',
		title: 'Financial Analyst',
		level: 'mid',
		baseSalary: 68000,
		description: 'Analyze financial data and create reports',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	// Sales Positions
	{
		id: 'pos-14',
		departmentId: 'dept-5',
		title: 'Sales Director',
		level: 'manager',
		baseSalary: 110000,
		description: 'Lead sales team and strategy',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: 'pos-15',
		departmentId: 'dept-5',
		title: 'Account Executive',
		level: 'mid',
		baseSalary: 70000,
		description: 'Manage client accounts and sales',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: 'pos-16',
		departmentId: 'dept-5',
		title: 'Sales Representative',
		level: 'junior',
		baseSalary: 50000,
		description: 'Handle sales inquiries and leads',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	// Operations Positions
	{
		id: 'pos-17',
		departmentId: 'dept-6',
		title: 'Operations Manager',
		level: 'manager',
		baseSalary: 95000,
		description: 'Oversee daily operations',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: 'pos-18',
		departmentId: 'dept-6',
		title: 'Operations Coordinator',
		level: 'mid',
		baseSalary: 52000,
		description: 'Coordinate operational activities',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	}
];

// ============================
// MOCK DEPARTMENTS
// ============================

export const mockDepartmentsData: Department[] = [
	{
		id: 'dept-1',
		name: 'Engineering',
		description: 'Software development, infrastructure, and technical operations. Responsible for building and maintaining all technology products.',
		status: 'active',
		managerId: 'emp-1',
		managerName: 'Michael Chen',
		location: 'Building A, Floor 3',
		budget: 2500000,
		positions: mockPositions.filter(p => p.departmentId === 'dept-1'),
		employeeCount: 25,
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: 'dept-2',
		name: 'Human Resources',
		description: 'Employee relations, recruitment, benefits administration, and workplace culture. Supporting our people-first approach.',
		status: 'active',
		managerId: 'emp-3',
		managerName: 'Sarah Johnson',
		location: 'Building A, Floor 1',
		budget: 500000,
		positions: mockPositions.filter(p => p.departmentId === 'dept-2'),
		employeeCount: 8,
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: 'dept-3',
		name: 'Marketing',
		description: 'Brand management, digital marketing, content creation, and market research. Driving growth through strategic campaigns.',
		status: 'active',
		managerId: 'emp-4',
		managerName: 'Emily Davis',
		location: 'Building B, Floor 2',
		budget: 800000,
		positions: mockPositions.filter(p => p.departmentId === 'dept-3'),
		employeeCount: 12,
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: 'dept-4',
		name: 'Finance',
		description: 'Financial planning, accounting, budgeting, and reporting. Ensuring fiscal responsibility and strategic financial management.',
		status: 'active',
		managerId: 'emp-5',
		managerName: 'Robert Wilson',
		location: 'Building A, Floor 2',
		budget: 600000,
		positions: mockPositions.filter(p => p.departmentId === 'dept-4'),
		employeeCount: 10,
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: 'dept-5',
		name: 'Sales',
		description: 'Client acquisition, account management, and revenue generation. Building lasting relationships with our customers.',
		status: 'active',
		managerId: 'emp-6',
		managerName: 'Jessica Martinez',
		location: 'Building B, Floor 1',
		budget: 1200000,
		positions: mockPositions.filter(p => p.departmentId === 'dept-5'),
		employeeCount: 18,
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: 'dept-6',
		name: 'Operations',
		description: 'Day-to-day business operations, logistics, and process optimization. Ensuring smooth business continuity.',
		status: 'active',
		managerId: 'emp-8',
		managerName: 'David Brown',
		location: 'Building C, Floor 1',
		budget: 700000,
		positions: mockPositions.filter(p => p.departmentId === 'dept-6'),
		employeeCount: 15,
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	},
	{
		id: 'dept-7',
		name: 'Research & Development',
		description: 'Innovation, product research, and experimental projects. Shaping the future of our products.',
		status: 'inactive',
		managerName: 'Pending Assignment',
		location: 'Building D, Floor 2',
		budget: 400000,
		positions: [],
		employeeCount: 0,
		createdAt: '2024-01-10T00:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	}
];

/**
 * Get all departments
 */
export const getDepartments = (): Department[] => {
	return [...mockDepartmentsData];
};

/**
 * Get department by ID
 */
export const getDepartmentById = (id: string): Department | undefined => {
	return mockDepartmentsData.find(d => d.id === id);
};

/**
 * Get positions by department ID
 */
export const getPositionsByDepartment = (departmentId: string): Position[] => {
	return mockPositions.filter(p => p.departmentId === departmentId);
};

/**
 * Get all positions
 */
export const getAllPositions = (): Position[] => {
	return [...mockPositions];
};
