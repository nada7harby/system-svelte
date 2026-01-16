/**
 * Mock Attendance Data
 * Contains sample attendance records for the HR Management System
 */

import type { AttendanceRecord, AttendanceConfig } from '$lib/types/attendance';
import { DEFAULT_ATTENDANCE_CONFIG, generateAttendanceId } from '$lib/types/attendance';

// ============================
// HELPER FUNCTIONS
// ============================

/**
 * Generate a random time within a range
 */
const randomTime = (baseHour: number, variance: number): string => {
	const hour = baseHour + Math.floor(Math.random() * variance * 2) - variance;
	const minute = Math.floor(Math.random() * 60);
	return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

/**
 * Create ISO timestamp from date and time
 */
const createTimestamp = (dateStr: string, time: string): string => {
	return `${dateStr}T${time}:00.000Z`;
};

/**
 * Generate attendance records for an employee for a month
 */
const generateEmployeeAttendance = (
	employeeId: string,
	employeeName: string,
	year: number,
	month: number
): AttendanceRecord[] => {
	const records: AttendanceRecord[] = [];
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	
	for (let day = 1; day <= daysInMonth; day++) {
		const date = new Date(year, month, day);
		const dayOfWeek = date.getDay();
		
		// Skip weekends
		if (dayOfWeek === 0 || dayOfWeek === 6) continue;
		
		// Skip future dates
		const today = new Date();
		if (date > today) continue;
		
		const dateStr = date.toISOString().split('T')[0];
		
		// Random attendance pattern (90% present, 5% late, 3% absent, 2% early leave)
		const rand = Math.random();
		let status: AttendanceRecord['status'];
		let checkIn: string | undefined;
		let checkOut: string | undefined;
		let lateMinutes = 0;
		let earlyLeaveMinutes = 0;
		let workingHours = 0;
		
		if (rand < 0.03) {
			// Absent
			status = 'absent';
		} else if (rand < 0.08) {
			// Late
			status = 'late';
			const lateTime = randomTime(9, 1); // Between 8:00 and 10:00
			checkIn = createTimestamp(dateStr, lateTime);
			checkOut = createTimestamp(dateStr, randomTime(17, 1));
			lateMinutes = Math.floor(Math.random() * 60) + 15;
			workingHours = 420 + Math.floor(Math.random() * 60);
		} else if (rand < 0.10) {
			// Early leave
			status = 'early-leave';
			checkIn = createTimestamp(dateStr, randomTime(9, 0));
			const earlyTime = randomTime(15, 1); // Between 14:00 and 16:00
			checkOut = createTimestamp(dateStr, earlyTime);
			earlyLeaveMinutes = Math.floor(Math.random() * 90) + 30;
			workingHours = 360 + Math.floor(Math.random() * 60);
		} else {
			// Present
			status = 'present';
			checkIn = createTimestamp(dateStr, randomTime(9, 0));
			checkOut = createTimestamp(dateStr, randomTime(17, 0));
			workingHours = 480 + Math.floor(Math.random() * 30) - 15;
		}
		
		records.push({
			id: generateAttendanceId(),
			employeeId,
			employeeName,
			date: dateStr,
			checkIn,
			checkOut,
			status,
			workingHours,
			lateMinutes,
			earlyLeaveMinutes,
			isOverridden: false,
			createdAt: createTimestamp(dateStr, '09:00'),
			updatedAt: createTimestamp(dateStr, '17:00')
		});
	}
	
	return records;
};

// ============================
// MOCK ATTENDANCE DATA
// ============================

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

// Employees data for attendance generation
const employeesForAttendance = [
	{ id: 'emp-1', name: 'Alice Thompson' },
	{ id: 'emp-2', name: 'Bob Martinez' },
	{ id: 'emp-3', name: 'Carol Williams' },
	{ id: 'emp-4', name: 'Daniel Lee' },
	{ id: 'emp-5', name: 'Eva Rodriguez' },
	{ id: 'emp-6', name: 'Frank Anderson' },
	{ id: 'emp-7', name: 'Grace Kim' },
	{ id: 'emp-8', name: 'Henry Taylor' },
	{ id: 'emp-9', name: 'Isabella Garcia' },
	{ id: 'emp-10', name: 'James Wilson' },
	{ id: 'emp-11', name: 'Karen White' },
	{ id: 'emp-12', name: 'Liam Johnson' },
	{ id: 'emp-13', name: 'Mia Brown' },
	{ id: 'emp-14', name: 'Noah Davis' },
	{ id: 'emp-15', name: 'Olivia Moore' }
];

// Generate attendance for current and previous month
export const mockAttendanceRecords: AttendanceRecord[] = employeesForAttendance.flatMap(emp => [
	...generateEmployeeAttendance(emp.id, emp.name, currentYear, currentMonth),
	...generateEmployeeAttendance(emp.id, emp.name, currentYear, currentMonth - 1)
]);

// ============================
// TODAY'S ATTENDANCE (for demo)
// ============================

const todayStr = now.toISOString().split('T')[0];

export const mockTodayAttendance: AttendanceRecord[] = employeesForAttendance.map((emp, index) => {
	// Vary the statuses for demo
	let status: AttendanceRecord['status'];
	let checkIn: string | undefined;
	let checkOut: string | undefined;
	let lateMinutes = 0;
	let earlyLeaveMinutes = 0;
	let workingHours = 0;
	
	if (index < 10) {
		status = 'present';
		checkIn = createTimestamp(todayStr, '08:55');
		checkOut = index < 5 ? createTimestamp(todayStr, '17:05') : undefined;
		workingHours = index < 5 ? 485 : 0;
	} else if (index < 12) {
		status = 'late';
		checkIn = createTimestamp(todayStr, '09:35');
		lateMinutes = 20;
		workingHours = 0;
	} else if (index < 14) {
		status = 'absent';
	} else {
		status = 'early-leave';
		checkIn = createTimestamp(todayStr, '08:50');
		checkOut = createTimestamp(todayStr, '15:30');
		earlyLeaveMinutes = 90;
		workingHours = 340;
	}
	
	return {
		id: `att-today-${emp.id}`,
		employeeId: emp.id,
		employeeName: emp.name,
		date: todayStr,
		checkIn,
		checkOut,
		status,
		workingHours,
		lateMinutes,
		earlyLeaveMinutes,
		isOverridden: false,
		createdAt: createTimestamp(todayStr, '08:00'),
		updatedAt: createTimestamp(todayStr, '17:00')
	};
});

// ============================
// EXPORT FUNCTIONS
// ============================

/**
 * Get attendance configuration
 */
export const getAttendanceConfig = (): AttendanceConfig => {
	return { ...DEFAULT_ATTENDANCE_CONFIG };
};

/**
 * Get all attendance records
 */
export const getAttendanceRecords = (): AttendanceRecord[] => {
	return [...mockAttendanceRecords, ...mockTodayAttendance];
};

/**
 * Get attendance records for a specific employee
 */
export const getEmployeeAttendance = (employeeId: string): AttendanceRecord[] => {
	return getAttendanceRecords().filter(r => r.employeeId === employeeId);
};

/**
 * Get attendance records for a specific date
 */
export const getAttendanceByDate = (date: string): AttendanceRecord[] => {
	return getAttendanceRecords().filter(r => r.date === date);
};

/**
 * Get today's attendance
 */
export const getTodayAttendance = (): AttendanceRecord[] => {
	return [...mockTodayAttendance];
};
