/**
 * Attendance & Time Tracking Types & Interfaces
 * Comprehensive type definitions for the Attendance module
 */

// ============================
// ENUMS
// ============================

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'early-leave' | 'half-day';
export type OverrideReason = 'correction' | 'emergency' | 'approved-leave' | 'system-error' | 'other';

// ============================
// INTERFACES
// ============================

/**
 * Attendance Record - Daily attendance for an employee
 */
export interface AttendanceRecord {
	id: string;
	employeeId: string;
	employeeName?: string;
	date: string; // YYYY-MM-DD format
	checkIn?: string; // ISO timestamp
	checkOut?: string; // ISO timestamp
	status: AttendanceStatus;
	workingHours: number; // in minutes
	lateMinutes: number;
	earlyLeaveMinutes: number;
	notes?: string;
	isOverridden: boolean;
	overrideBy?: string;
	overrideReason?: OverrideReason;
	overrideNotes?: string;
	overrideAt?: string;
	createdAt: string;
	updatedAt: string;
}

/**
 * Attendance Configuration - Work time settings
 */
export interface AttendanceConfig {
	workStartTime: string; // HH:mm format (e.g., "09:00")
	workEndTime: string; // HH:mm format (e.g., "17:00")
	lateThresholdMinutes: number; // Grace period before marking late
	earlyLeaveThresholdMinutes: number; // Threshold for early leave
	minWorkingHours: number; // Minimum hours for half-day
	breakDurationMinutes: number; // Lunch/break time to subtract
}

/**
 * Check-in/Check-out Request Data
 */
export interface CheckInOutData {
	employeeId: string;
	timestamp: string;
	notes?: string;
}

/**
 * Manual Override Data
 */
export interface AttendanceOverrideData {
	attendanceId: string;
	checkIn?: string;
	checkOut?: string;
	status?: AttendanceStatus;
	reason: OverrideReason;
	notes: string;
	overrideBy: string;
}

/**
 * Monthly Attendance Summary
 */
export interface MonthlyAttendanceSummary {
	employeeId: string;
	employeeName: string;
	month: string; // YYYY-MM format
	totalDays: number;
	presentDays: number;
	lateDays: number;
	absentDays: number;
	earlyLeaveDays: number;
	halfDays: number;
	totalWorkingHours: number;
	totalLateMinutes: number;
	totalEarlyLeaveMinutes: number;
	averageWorkingHours: number;
	attendancePercentage: number;
}

/**
 * Daily Attendance List Item
 */
export interface DailyAttendanceItem {
	employeeId: string;
	employeeName: string;
	department: string;
	position: string;
	checkIn?: string;
	checkOut?: string;
	status: AttendanceStatus;
	workingHours: number;
	lateMinutes: number;
}

/**
 * Calendar Day Data
 */
export interface CalendarDay {
	date: string;
	dayOfMonth: number;
	isCurrentMonth: boolean;
	isToday: boolean;
	isWeekend: boolean;
	attendance?: AttendanceRecord;
}

/**
 * Export Options
 */
export interface AttendanceExportOptions {
	format: 'csv' | 'pdf';
	employeeId?: string;
	startDate: string;
	endDate: string;
	includeOverrides: boolean;
}

// ============================
// CONSTANTS
// ============================

export const ATTENDANCE_STATUSES: { value: AttendanceStatus; label: string; color: string; icon: string }[] = [
	{ value: 'present', label: 'Present', color: 'success', icon: 'check' },
	{ value: 'late', label: 'Late', color: 'warning', icon: 'clock' },
	{ value: 'absent', label: 'Absent', color: 'danger', icon: 'x' },
	{ value: 'early-leave', label: 'Early Leave', color: 'info', icon: 'arrow-left' },
	{ value: 'half-day', label: 'Half Day', color: 'secondary', icon: 'minus' }
];

export const OVERRIDE_REASONS: { value: OverrideReason; label: string }[] = [
	{ value: 'correction', label: 'Time Correction' },
	{ value: 'emergency', label: 'Emergency Situation' },
	{ value: 'approved-leave', label: 'Approved Leave' },
	{ value: 'system-error', label: 'System Error' },
	{ value: 'other', label: 'Other' }
];

export const DEFAULT_ATTENDANCE_CONFIG: AttendanceConfig = {
	workStartTime: '09:00',
	workEndTime: '17:00',
	lateThresholdMinutes: 15,
	earlyLeaveThresholdMinutes: 30,
	minWorkingHours: 4,
	breakDurationMinutes: 60
};

// ============================
// HELPER FUNCTIONS
// ============================

/**
 * Generate unique ID for attendance records
 */
export const generateAttendanceId = (): string => {
	return `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get attendance status display info
 */
export const getAttendanceStatusInfo = (status: AttendanceStatus) => {
	return ATTENDANCE_STATUSES.find((s) => s.value === status) || ATTENDANCE_STATUSES[0];
};

/**
 * Format time from ISO timestamp to HH:mm
 */
export const formatTime = (timestamp?: string): string => {
	if (!timestamp) return '--:--';
	const date = new Date(timestamp);
	return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

/**
 * Format duration in minutes to readable string
 */
export const formatDuration = (minutes: number): string => {
	if (minutes === 0) return '0m';
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	if (hours === 0) return `${mins}m`;
	if (mins === 0) return `${hours}h`;
	return `${hours}h ${mins}m`;
};

/**
 * Calculate working hours between two timestamps
 */
export const calculateWorkingHours = (checkIn?: string, checkOut?: string, breakMinutes: number = 60): number => {
	if (!checkIn || !checkOut) return 0;
	const start = new Date(checkIn);
	const end = new Date(checkOut);
	const diffMs = end.getTime() - start.getTime();
	const diffMinutes = Math.max(0, Math.floor(diffMs / 1000 / 60) - breakMinutes);
	return diffMinutes;
};

/**
 * Calculate late minutes based on check-in time and config
 * @param checkIn - Check-in timestamp
 * @param config - Attendance configuration
 * @returns Late minutes (0 if on time or early)
 */
export const calculateLateMinutes = (checkIn: string, config: AttendanceConfig): number => {
	const checkInDate = new Date(checkIn);
	const [hours, minutes] = config.workStartTime.split(':').map(Number);
	
	const scheduledStart = new Date(checkInDate);
	scheduledStart.setHours(hours, minutes, 0, 0);
	
	// Add grace period
	scheduledStart.setMinutes(scheduledStart.getMinutes() + config.lateThresholdMinutes);
	
	if (checkInDate > scheduledStart) {
		const diffMs = checkInDate.getTime() - scheduledStart.getTime();
		return Math.floor(diffMs / 1000 / 60);
	}
	return 0;
};

/**
 * Calculate early leave minutes based on check-out time and config
 * @param checkOut - Check-out timestamp
 * @param config - Attendance configuration
 * @returns Early leave minutes (0 if on time or late)
 */
export const calculateEarlyLeaveMinutes = (checkOut: string, config: AttendanceConfig): number => {
	const checkOutDate = new Date(checkOut);
	const [hours, minutes] = config.workEndTime.split(':').map(Number);
	
	const scheduledEnd = new Date(checkOutDate);
	scheduledEnd.setHours(hours, minutes, 0, 0);
	
	// Subtract threshold
	scheduledEnd.setMinutes(scheduledEnd.getMinutes() - config.earlyLeaveThresholdMinutes);
	
	if (checkOutDate < scheduledEnd) {
		const diffMs = scheduledEnd.getTime() - checkOutDate.getTime();
		return Math.floor(diffMs / 1000 / 60);
	}
	return 0;
};

/**
 * Determine attendance status based on check-in/out times
 */
export const determineAttendanceStatus = (
	checkIn?: string,
	checkOut?: string,
	config: AttendanceConfig = DEFAULT_ATTENDANCE_CONFIG
): AttendanceStatus => {
	if (!checkIn && !checkOut) return 'absent';
	if (!checkIn || !checkOut) return 'half-day';
	
	const lateMinutes = calculateLateMinutes(checkIn, config);
	const earlyLeaveMinutes = calculateEarlyLeaveMinutes(checkOut, config);
	const workingHours = calculateWorkingHours(checkIn, checkOut, config.breakDurationMinutes);
	
	if (workingHours < config.minWorkingHours * 60) return 'half-day';
	if (earlyLeaveMinutes > 0) return 'early-leave';
	if (lateMinutes > 0) return 'late';
	return 'present';
};

/**
 * Get date string in YYYY-MM-DD format
 */
export const getDateString = (date: Date = new Date()): string => {
	return date.toISOString().split('T')[0];
};

/**
 * Get month string in YYYY-MM format
 */
export const getMonthString = (date: Date = new Date()): string => {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};
