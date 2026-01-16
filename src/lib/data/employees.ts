/**
 * Enhanced Mock Employees Data
 * Comprehensive employee data with all required fields
 */

import type { Employee, EmployeeDocument } from '$lib/types/employee';
import { generateId } from '$lib/types/employee';

// ============================
// MOCK DOCUMENTS
// ============================

const createMockDocuments = (employeeId: string): EmployeeDocument[] => {
	const docs: EmployeeDocument[] = [];
	
	// Some employees have documents
	if (Math.random() > 0.3) {
		docs.push({
			id: `doc-${Date.now()}-1`,
			employeeId,
			name: 'Employment Contract.pdf',
			type: 'contract',
			url: '', // Would be base64 in real scenario
			uploadedAt: '2024-01-15T10:00:00Z',
			fileSize: 245000,
			mimeType: 'application/pdf'
		});
	}
	
	if (Math.random() > 0.5) {
		docs.push({
			id: `doc-${Date.now()}-2`,
			employeeId,
			name: 'ID Card.jpg',
			type: 'id',
			url: '',
			uploadedAt: '2024-02-20T14:30:00Z',
			fileSize: 125000,
			mimeType: 'image/jpeg'
		});
	}
	
	return docs;
};

// ============================
// MOCK EMPLOYEES DATA
// ============================

export const mockEmployeesData: Employee[] = [
	{
		id: 'emp-001',
		firstName: 'Alice',
		lastName: 'Thompson',
		email: 'alice.thompson@company.com',
		phone: '+1 (555) 123-4567',
		address: '123 Oak Street, San Francisco, CA 94102',
		dateOfBirth: '1990-05-15',
		profilePicture: '',
		department: 'Engineering',
		jobTitle: 'Senior Software Engineer',
		employmentType: 'full-time',
		startDate: '2021-03-15',
		salary: 95000,
		status: 'active',
		createdAt: '2021-03-15T09:00:00Z',
		updatedAt: '2024-01-10T14:30:00Z',
		isDeleted: false,
		documents: []
	},
	{
		id: 'emp-002',
		firstName: 'Bob',
		lastName: 'Martinez',
		email: 'bob.martinez@company.com',
		phone: '+1 (555) 234-5678',
		address: '456 Pine Avenue, San Francisco, CA 94103',
		dateOfBirth: '1988-11-22',
		profilePicture: '',
		department: 'Engineering',
		jobTitle: 'Product Designer',
		employmentType: 'full-time',
		startDate: '2022-01-10',
		salary: 78000,
		status: 'active',
		createdAt: '2022-01-10T09:00:00Z',
		updatedAt: '2024-02-15T11:00:00Z',
		isDeleted: false,
		documents: []
	},
	{
		id: 'emp-003',
		firstName: 'Carol',
		lastName: 'Williams',
		email: 'carol.williams@company.com',
		phone: '+1 (555) 345-6789',
		address: '789 Maple Drive, Oakland, CA 94612',
		dateOfBirth: '1992-03-08',
		profilePicture: '',
		department: 'Human Resources',
		jobTitle: 'HR Specialist',
		employmentType: 'full-time',
		startDate: '2020-06-22',
		salary: 62000,
		status: 'active',
		createdAt: '2020-06-22T09:00:00Z',
		updatedAt: '2023-12-01T16:45:00Z',
		isDeleted: false,
		documents: []
	},
	{
		id: 'emp-004',
		firstName: 'Daniel',
		lastName: 'Lee',
		email: 'daniel.lee@company.com',
		phone: '+1 (555) 456-7890',
		address: '321 Cedar Lane, Berkeley, CA 94704',
		dateOfBirth: '1985-09-30',
		profilePicture: '',
		department: 'Marketing',
		jobTitle: 'Marketing Manager',
		employmentType: 'full-time',
		startDate: '2019-11-05',
		salary: 88000,
		status: 'on-leave',
		createdAt: '2019-11-05T09:00:00Z',
		updatedAt: '2024-03-01T10:00:00Z',
		isDeleted: false,
		documents: []
	},
	{
		id: 'emp-005',
		firstName: 'Eva',
		lastName: 'Rodriguez',
		email: 'eva.rodriguez@company.com',
		phone: '+1 (555) 567-8901',
		address: '654 Birch Road, San Jose, CA 95112',
		dateOfBirth: '1993-07-14',
		profilePicture: '',
		department: 'Finance',
		jobTitle: 'Financial Analyst',
		employmentType: 'full-time',
		startDate: '2021-08-14',
		salary: 72000,
		status: 'active',
		createdAt: '2021-08-14T09:00:00Z',
		updatedAt: '2024-01-20T09:30:00Z',
		isDeleted: false,
		documents: []
	},
	{
		id: 'emp-006',
		firstName: 'Frank',
		lastName: 'Anderson',
		email: 'frank.anderson@company.com',
		phone: '+1 (555) 678-9012',
		address: '987 Elm Street, Palo Alto, CA 94301',
		dateOfBirth: '1991-12-03',
		profilePicture: '',
		department: 'Sales',
		jobTitle: 'Sales Representative',
		employmentType: 'full-time',
		startDate: '2022-04-03',
		salary: 65000,
		status: 'active',
		createdAt: '2022-04-03T09:00:00Z',
		updatedAt: '2024-02-28T15:00:00Z',
		isDeleted: false,
		documents: []
	},
	{
		id: 'emp-007',
		firstName: 'Grace',
		lastName: 'Kim',
		email: 'grace.kim@company.com',
		phone: '+1 (555) 789-0123',
		address: '147 Willow Way, Mountain View, CA 94043',
		dateOfBirth: '1989-04-25',
		profilePicture: '',
		department: 'Engineering',
		jobTitle: 'DevOps Engineer',
		employmentType: 'full-time',
		startDate: '2020-09-18',
		salary: 92000,
		status: 'active',
		createdAt: '2020-09-18T09:00:00Z',
		updatedAt: '2024-01-05T12:00:00Z',
		isDeleted: false,
		documents: []
	},
	{
		id: 'emp-008',
		firstName: 'Henry',
		lastName: 'Taylor',
		email: 'henry.taylor@company.com',
		phone: '+1 (555) 890-1234',
		address: '258 Spruce Court, Sunnyvale, CA 94086',
		dateOfBirth: '1984-01-17',
		profilePicture: '',
		department: 'Operations',
		jobTitle: 'Operations Manager',
		employmentType: 'full-time',
		startDate: '2018-12-01',
		salary: 85000,
		status: 'resigned',
		createdAt: '2018-12-01T09:00:00Z',
		updatedAt: '2024-02-01T10:00:00Z',
		isDeleted: false,
		documents: []
	},
	{
		id: 'emp-009',
		firstName: 'Isabella',
		lastName: 'Garcia',
		email: 'isabella.garcia@company.com',
		phone: '+1 (555) 901-2345',
		address: '369 Aspen Place, Santa Clara, CA 95050',
		dateOfBirth: '1994-08-19',
		profilePicture: '',
		department: 'Marketing',
		jobTitle: 'Content Strategist',
		employmentType: 'full-time',
		startDate: '2021-05-27',
		salary: 68000,
		status: 'active',
		createdAt: '2021-05-27T09:00:00Z',
		updatedAt: '2024-03-10T11:30:00Z',
		isDeleted: false,
		documents: []
	},
	{
		id: 'emp-010',
		firstName: 'James',
		lastName: 'Wilson',
		email: 'james.wilson@company.com',
		phone: '+1 (555) 012-3456',
		address: '741 Redwood Boulevard, Cupertino, CA 95014',
		dateOfBirth: '1996-02-28',
		profilePicture: '',
		department: 'Engineering',
		jobTitle: 'Frontend Developer',
		employmentType: 'full-time',
		startDate: '2022-02-14',
		salary: 82000,
		status: 'active',
		createdAt: '2022-02-14T09:00:00Z',
		updatedAt: '2024-01-25T14:00:00Z',
		isDeleted: false,
		documents: []
	},
	{
		id: 'emp-011',
		firstName: 'Karen',
		lastName: 'White',
		email: 'karen.white@company.com',
		phone: '+1 (555) 112-2334',
		address: '852 Sequoia Street, Fremont, CA 94538',
		dateOfBirth: '1987-06-11',
		profilePicture: '',
		department: 'Human Resources',
		jobTitle: 'Recruitment Lead',
		employmentType: 'full-time',
		startDate: '2019-07-15',
		salary: 71000,
		status: 'on-leave',
		createdAt: '2019-07-15T09:00:00Z',
		updatedAt: '2024-02-20T09:00:00Z',
		isDeleted: false,
		documents: []
	},
	{
		id: 'emp-012',
		firstName: 'Liam',
		lastName: 'Johnson',
		email: 'liam.johnson@company.com',
		phone: '+1 (555) 223-3445',
		address: '963 Palm Drive, Milpitas, CA 95035',
		dateOfBirth: '1995-10-07',
		profilePicture: '',
		department: 'Sales',
		jobTitle: 'Account Executive',
		employmentType: 'full-time',
		startDate: '2021-10-08',
		salary: 75000,
		status: 'active',
		createdAt: '2021-10-08T09:00:00Z',
		updatedAt: '2024-03-05T16:00:00Z',
		isDeleted: false,
		documents: []
	},
	{
		id: 'emp-013',
		firstName: 'Mia',
		lastName: 'Brown',
		email: 'mia.brown@company.com',
		phone: '+1 (555) 334-4556',
		address: '174 Cypress Lane, Newark, CA 94560',
		dateOfBirth: '1990-12-24',
		profilePicture: '',
		department: 'Engineering',
		jobTitle: 'Backend Developer',
		employmentType: 'full-time',
		startDate: '2020-03-22',
		salary: 89000,
		status: 'active',
		createdAt: '2020-03-22T09:00:00Z',
		updatedAt: '2024-01-15T10:30:00Z',
		isDeleted: false,
		documents: []
	},
	{
		id: 'emp-014',
		firstName: 'Noah',
		lastName: 'Davis',
		email: 'noah.davis@company.com',
		phone: '+1 (555) 445-5667',
		address: '285 Magnolia Circle, Union City, CA 94587',
		dateOfBirth: '1997-05-03',
		profilePicture: '',
		department: 'Finance',
		jobTitle: 'Data Analyst',
		employmentType: 'part-time',
		startDate: '2022-06-01',
		salary: 45000,
		status: 'active',
		createdAt: '2022-06-01T09:00:00Z',
		updatedAt: '2024-02-10T13:00:00Z',
		isDeleted: false,
		documents: []
	},
	{
		id: 'emp-015',
		firstName: 'Olivia',
		lastName: 'Moore',
		email: 'olivia.moore@company.com',
		phone: '+1 (555) 556-6778',
		address: '396 Laurel Avenue, Hayward, CA 94541',
		dateOfBirth: '1993-09-16',
		profilePicture: '',
		department: 'Operations',
		jobTitle: 'Operations Coordinator',
		employmentType: 'full-time',
		startDate: '2021-11-20',
		salary: 58000,
		status: 'active',
		createdAt: '2021-11-20T09:00:00Z',
		updatedAt: '2024-03-15T08:45:00Z',
		isDeleted: false,
		documents: []
	},
	{
		id: 'emp-016',
		firstName: 'Peter',
		lastName: 'Jackson',
		email: 'peter.jackson@company.com',
		phone: '+1 (555) 667-7889',
		address: '507 Hickory Street, Livermore, CA 94550',
		dateOfBirth: '1986-04-12',
		profilePicture: '',
		department: 'Product',
		jobTitle: 'Product Manager',
		employmentType: 'full-time',
		startDate: '2019-02-18',
		salary: 105000,
		status: 'active',
		createdAt: '2019-02-18T09:00:00Z',
		updatedAt: '2024-02-25T11:15:00Z',
		isDeleted: false,
		documents: []
	},
	{
		id: 'emp-017',
		firstName: 'Quinn',
		lastName: 'Harris',
		email: 'quinn.harris@company.com',
		phone: '+1 (555) 778-8990',
		address: '618 Walnut Road, Pleasanton, CA 94566',
		dateOfBirth: '1998-11-29',
		profilePicture: '',
		department: 'Design',
		jobTitle: 'UI Designer',
		employmentType: 'contract',
		startDate: '2023-01-15',
		salary: 55000,
		status: 'active',
		createdAt: '2023-01-15T09:00:00Z',
		updatedAt: '2024-01-30T14:20:00Z',
		isDeleted: false,
		documents: []
	},
	{
		id: 'emp-018',
		firstName: 'Rachel',
		lastName: 'Clark',
		email: 'rachel.clark@company.com',
		phone: '+1 (555) 889-9001',
		address: '729 Chestnut Way, Dublin, CA 94568',
		dateOfBirth: '1991-07-08',
		profilePicture: '',
		department: 'Legal',
		jobTitle: 'Legal Counsel',
		employmentType: 'full-time',
		startDate: '2020-08-10',
		salary: 115000,
		status: 'active',
		createdAt: '2020-08-10T09:00:00Z',
		updatedAt: '2024-03-01T09:30:00Z',
		isDeleted: false,
		documents: []
	},
	{
		id: 'emp-019',
		firstName: 'Samuel',
		lastName: 'Lewis',
		email: 'samuel.lewis@company.com',
		phone: '+1 (555) 990-0112',
		address: '840 Poplar Court, San Ramon, CA 94583',
		dateOfBirth: '1983-02-14',
		profilePicture: '',
		department: 'Customer Support',
		jobTitle: 'Support Team Lead',
		employmentType: 'full-time',
		startDate: '2018-05-21',
		salary: 67000,
		status: 'active',
		createdAt: '2018-05-21T09:00:00Z',
		updatedAt: '2024-02-05T15:45:00Z',
		isDeleted: false,
		documents: []
	},
	{
		id: 'emp-020',
		firstName: 'Tina',
		lastName: 'Young',
		email: 'tina.young@company.com',
		phone: '+1 (555) 001-1223',
		address: '951 Sycamore Drive, Danville, CA 94526',
		dateOfBirth: '1994-03-21',
		profilePicture: '',
		department: 'Customer Support',
		jobTitle: 'Support Specialist',
		employmentType: 'part-time',
		startDate: '2023-03-01',
		salary: 35000,
		status: 'active',
		createdAt: '2023-03-01T09:00:00Z',
		updatedAt: '2024-03-12T10:00:00Z',
		isDeleted: false,
		documents: []
	}
];

// Add mock documents to some employees
mockEmployeesData.forEach(emp => {
	emp.documents = createMockDocuments(emp.id);
});

/**
 * Get initial employees data
 * Returns a deep copy to prevent mutation
 */
export const getInitialEmployees = (): Employee[] => {
	return JSON.parse(JSON.stringify(mockEmployeesData));
};
