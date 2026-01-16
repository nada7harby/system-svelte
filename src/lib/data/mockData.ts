/**
 * Mock Employees Data
 * Contains sample employee data for the HR Management System
 */

export interface Employee {
	id: string;
	name: string;
	email: string;
	jobTitle: string;
	department: string;
	status: 'active' | 'inactive' | 'on-leave';
	avatar?: string;
	phone: string;
	hireDate: string;
	salary: number;
}

export interface Department {
	id: string;
	name: string;
	description: string;
	manager: string;
	employeeCount: number;
	budget: number;
	location: string;
}

// ============================
// MOCK DEPARTMENTS
// ============================

export const mockDepartments: Department[] = [
	{
		id: 'dept-1',
		name: 'Engineering',
		description: 'Software development and technical operations',
		manager: 'Michael Chen',
		employeeCount: 25,
		budget: 2500000,
		location: 'Building A, Floor 3'
	},
	{
		id: 'dept-2',
		name: 'Human Resources',
		description: 'Employee relations, recruitment, and benefits',
		manager: 'Sarah Johnson',
		employeeCount: 8,
		budget: 500000,
		location: 'Building A, Floor 1'
	},
	{
		id: 'dept-3',
		name: 'Marketing',
		description: 'Brand management and market outreach',
		manager: 'Emily Davis',
		employeeCount: 12,
		budget: 800000,
		location: 'Building B, Floor 2'
	},
	{
		id: 'dept-4',
		name: 'Finance',
		description: 'Financial planning, accounting, and reporting',
		manager: 'Robert Wilson',
		employeeCount: 10,
		budget: 600000,
		location: 'Building A, Floor 2'
	},
	{
		id: 'dept-5',
		name: 'Sales',
		description: 'Client acquisition and revenue generation',
		manager: 'Jessica Martinez',
		employeeCount: 18,
		budget: 1200000,
		location: 'Building B, Floor 1'
	},
	{
		id: 'dept-6',
		name: 'Operations',
		description: 'Day-to-day business operations and logistics',
		manager: 'David Brown',
		employeeCount: 15,
		budget: 700000,
		location: 'Building C, Floor 1'
	}
];

// ============================
// MOCK EMPLOYEES
// ============================

export const mockEmployees: Employee[] = [
	{
		id: 'emp-1',
		name: 'Alice Thompson',
		email: 'alice.thompson@company.com',
		jobTitle: 'Senior Software Engineer',
		department: 'Engineering',
		status: 'active',
		phone: '+1 (555) 123-4567',
		hireDate: '2021-03-15',
		salary: 95000
	},
	{
		id: 'emp-2',
		name: 'Bob Martinez',
		email: 'bob.martinez@company.com',
		jobTitle: 'Product Designer',
		department: 'Engineering',
		status: 'active',
		phone: '+1 (555) 234-5678',
		hireDate: '2022-01-10',
		salary: 78000
	},
	{
		id: 'emp-3',
		name: 'Carol Williams',
		email: 'carol.williams@company.com',
		jobTitle: 'HR Specialist',
		department: 'Human Resources',
		status: 'active',
		phone: '+1 (555) 345-6789',
		hireDate: '2020-06-22',
		salary: 62000
	},
	{
		id: 'emp-4',
		name: 'Daniel Lee',
		email: 'daniel.lee@company.com',
		jobTitle: 'Marketing Manager',
		department: 'Marketing',
		status: 'on-leave',
		phone: '+1 (555) 456-7890',
		hireDate: '2019-11-05',
		salary: 88000
	},
	{
		id: 'emp-5',
		name: 'Eva Rodriguez',
		email: 'eva.rodriguez@company.com',
		jobTitle: 'Financial Analyst',
		department: 'Finance',
		status: 'active',
		phone: '+1 (555) 567-8901',
		hireDate: '2021-08-14',
		salary: 72000
	},
	{
		id: 'emp-6',
		name: 'Frank Anderson',
		email: 'frank.anderson@company.com',
		jobTitle: 'Sales Representative',
		department: 'Sales',
		status: 'active',
		phone: '+1 (555) 678-9012',
		hireDate: '2022-04-03',
		salary: 65000
	},
	{
		id: 'emp-7',
		name: 'Grace Kim',
		email: 'grace.kim@company.com',
		jobTitle: 'DevOps Engineer',
		department: 'Engineering',
		status: 'active',
		phone: '+1 (555) 789-0123',
		hireDate: '2020-09-18',
		salary: 92000
	},
	{
		id: 'emp-8',
		name: 'Henry Taylor',
		email: 'henry.taylor@company.com',
		jobTitle: 'Operations Manager',
		department: 'Operations',
		status: 'inactive',
		phone: '+1 (555) 890-1234',
		hireDate: '2018-12-01',
		salary: 85000
	},
	{
		id: 'emp-9',
		name: 'Isabella Garcia',
		email: 'isabella.garcia@company.com',
		jobTitle: 'Content Strategist',
		department: 'Marketing',
		status: 'active',
		phone: '+1 (555) 901-2345',
		hireDate: '2021-05-27',
		salary: 68000
	},
	{
		id: 'emp-10',
		name: 'James Wilson',
		email: 'james.wilson@company.com',
		jobTitle: 'Frontend Developer',
		department: 'Engineering',
		status: 'active',
		phone: '+1 (555) 012-3456',
		hireDate: '2022-02-14',
		salary: 82000
	},
	{
		id: 'emp-11',
		name: 'Karen White',
		email: 'karen.white@company.com',
		jobTitle: 'Recruitment Lead',
		department: 'Human Resources',
		status: 'on-leave',
		phone: '+1 (555) 112-2334',
		hireDate: '2019-07-15',
		salary: 71000
	},
	{
		id: 'emp-12',
		name: 'Liam Johnson',
		email: 'liam.johnson@company.com',
		jobTitle: 'Account Executive',
		department: 'Sales',
		status: 'active',
		phone: '+1 (555) 223-3445',
		hireDate: '2021-10-08',
		salary: 75000
	},
	{
		id: 'emp-13',
		name: 'Mia Brown',
		email: 'mia.brown@company.com',
		jobTitle: 'Backend Developer',
		department: 'Engineering',
		status: 'active',
		phone: '+1 (555) 334-4556',
		hireDate: '2020-03-22',
		salary: 89000
	},
	{
		id: 'emp-14',
		name: 'Noah Davis',
		email: 'noah.davis@company.com',
		jobTitle: 'Data Analyst',
		department: 'Finance',
		status: 'active',
		phone: '+1 (555) 445-5667',
		hireDate: '2022-06-01',
		salary: 70000
	},
	{
		id: 'emp-15',
		name: 'Olivia Moore',
		email: 'olivia.moore@company.com',
		jobTitle: 'Operations Coordinator',
		department: 'Operations',
		status: 'active',
		phone: '+1 (555) 556-6778',
		hireDate: '2021-11-20',
		salary: 58000
	}
];

// Helper to get unique departments from employees
export const getUniqueDepartments = (): string[] => {
	return [...new Set(mockEmployees.map((emp) => emp.department))];
};

// Helper to get status options
export const statusOptions = ['active', 'inactive', 'on-leave'] as const;
