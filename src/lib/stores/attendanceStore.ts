/**
 * Attendance Store
 * Complete state management for Attendance & Time Tracking module
 * Includes check-in/out, attendance records, overrides, and exports
 */

import { writable, derived, get, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import type {
	AttendanceRecord,
	AttendanceConfig,
	AttendanceOverrideData,
	AttendanceStatus,
	MonthlyAttendanceSummary,
	CalendarDay
} from '$lib/types/attendance';
import {
	generateAttendanceId,
	DEFAULT_ATTENDANCE_CONFIG,
	calculateWorkingHours,
	calculateLateMinutes,
	calculateEarlyLeaveMinutes,
	determineAttendanceStatus,
	getDateString,
	getMonthString,
	formatTime,
	formatDuration
} from '$lib/types/attendance';
import { getAttendanceRecords, getAttendanceConfig } from '$lib/data/attendanceData';

// ============================
// STORAGE KEYS
// ============================

const STORAGE_KEY = 'hr_attendance_data';
const CONFIG_STORAGE_KEY = 'hr_attendance_config';

// ============================
// TYPES
// ============================

export interface AttendanceState {
	records: AttendanceRecord[];
	config: AttendanceConfig;
	isLoading: boolean;
	selectedDate: string;
	selectedEmployeeId: string | null;
	selectedMonth: string;
}

// ============================
// INITIAL STATE
// ============================

const initialState: AttendanceState = {
	records: [],
	config: DEFAULT_ATTENDANCE_CONFIG,
	isLoading: false,
	selectedDate: getDateString(),
	selectedEmployeeId: null,
	selectedMonth: getMonthString()
};

// ============================
// HELPER FUNCTIONS
// ============================

/**
 * Load attendance records from localStorage or use initial data
 */
const loadAttendanceRecords = (): AttendanceRecord[] => {
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
	return getAttendanceRecords();
};

/**
 * Load attendance config from localStorage or use default
 */
const loadAttendanceConfig = (): AttendanceConfig => {
	if (browser) {
		const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch {
				localStorage.removeItem(CONFIG_STORAGE_KEY);
			}
		}
	}
	return getAttendanceConfig();
};

/**
 * Save attendance records to localStorage
 */
const saveAttendanceRecords = (records: AttendanceRecord[]): void => {
	if (browser) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
	}
};

/**
 * Save attendance config to localStorage
 */
const saveAttendanceConfig = (config: AttendanceConfig): void => {
	if (browser) {
		localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
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

function createAttendanceStore() {
	const store: Writable<AttendanceState> = writable({
		...initialState,
		records: loadAttendanceRecords(),
		config: loadAttendanceConfig()
	});

	const { subscribe, update, set } = store;

	return {
		subscribe,

		// ============================
		// CHECK-IN / CHECK-OUT
		// ============================

		/**
		 * Check in employee for today
		 * Prevents duplicate check-ins
		 */
		checkIn: async (employeeId: string, employeeName: string, notes?: string): Promise<AttendanceRecord | null> => {
			update(s => ({ ...s, isLoading: true }));
			await simulateDelay(500);

			const today = getDateString();
			const now = new Date().toISOString();
			const state = get(store);

			// Check if already checked in today
			const existingRecord = state.records.find(
				r => r.employeeId === employeeId && r.date === today
			);

			if (existingRecord?.checkIn) {
				update(s => ({ ...s, isLoading: false }));
				return null; // Already checked in
			}

			let record: AttendanceRecord;

			if (existingRecord) {
				// Update existing record with check-in
				record = {
					...existingRecord,
					checkIn: now,
					status: 'present',
					lateMinutes: calculateLateMinutes(now, state.config),
					updatedAt: now,
					notes: notes || existingRecord.notes
				};

				// Update status based on late minutes
				if (record.lateMinutes > 0) {
					record.status = 'late';
				}
			} else {
				// Create new record
				const lateMinutes = calculateLateMinutes(now, state.config);
				record = {
					id: generateAttendanceId(),
					employeeId,
					employeeName,
					date: today,
					checkIn: now,
					status: lateMinutes > 0 ? 'late' : 'present',
					workingHours: 0,
					lateMinutes,
					earlyLeaveMinutes: 0,
					notes,
					isOverridden: false,
					createdAt: now,
					updatedAt: now
				};
			}

			update(s => {
				const records = existingRecord
					? s.records.map(r => r.id === existingRecord.id ? record : r)
					: [...s.records, record];
				saveAttendanceRecords(records);
				return { ...s, records, isLoading: false };
			});

			return record;
		},

		/**
		 * Check out employee for today
		 * Prevents duplicate check-outs
		 */
		checkOut: async (employeeId: string, notes?: string): Promise<AttendanceRecord | null> => {
			update(s => ({ ...s, isLoading: true }));
			await simulateDelay(500);

			const today = getDateString();
			const now = new Date().toISOString();
			const state = get(store);

			// Find today's record
			const existingRecord = state.records.find(
				r => r.employeeId === employeeId && r.date === today
			);

			if (!existingRecord || !existingRecord.checkIn) {
				update(s => ({ ...s, isLoading: false }));
				return null; // No check-in or no record
			}

			if (existingRecord.checkOut) {
				update(s => ({ ...s, isLoading: false }));
				return null; // Already checked out
			}

			const earlyLeaveMinutes = calculateEarlyLeaveMinutes(now, state.config);
			const workingHours = calculateWorkingHours(existingRecord.checkIn, now, state.config.breakDurationMinutes);
			
			// Determine final status
			let status: AttendanceStatus = existingRecord.status;
			if (earlyLeaveMinutes > 0) {
				status = 'early-leave';
			} else if (workingHours < state.config.minWorkingHours * 60) {
				status = 'half-day';
			}

			const record: AttendanceRecord = {
				...existingRecord,
				checkOut: now,
				status,
				workingHours,
				earlyLeaveMinutes,
				updatedAt: now,
				notes: notes ? `${existingRecord.notes || ''} ${notes}`.trim() : existingRecord.notes
			};

			update(s => {
				const records = s.records.map(r => r.id === existingRecord.id ? record : r);
				saveAttendanceRecords(records);
				return { ...s, records, isLoading: false };
			});

			return record;
		},

		// ============================
		// MANUAL OVERRIDE (HR ONLY)
		// ============================

		/**
		 * Override attendance record (HR/Admin only)
		 */
		overrideAttendance: async (data: AttendanceOverrideData): Promise<AttendanceRecord | null> => {
			update(s => ({ ...s, isLoading: true }));
			await simulateDelay(500);

			const state = get(store);
			const existingRecord = state.records.find(r => r.id === data.attendanceId);

			if (!existingRecord) {
				update(s => ({ ...s, isLoading: false }));
				return null;
			}

			const now = new Date().toISOString();
			const checkIn = data.checkIn || existingRecord.checkIn;
			const checkOut = data.checkOut || existingRecord.checkOut;

			// Recalculate values if times changed
			let workingHours = existingRecord.workingHours;
			let lateMinutes = existingRecord.lateMinutes;
			let earlyLeaveMinutes = existingRecord.earlyLeaveMinutes;
			let status = data.status || existingRecord.status;

			if (checkIn && checkOut) {
				workingHours = calculateWorkingHours(checkIn, checkOut, state.config.breakDurationMinutes);
				lateMinutes = calculateLateMinutes(checkIn, state.config);
				earlyLeaveMinutes = calculateEarlyLeaveMinutes(checkOut, state.config);
				
				if (!data.status) {
					status = determineAttendanceStatus(checkIn, checkOut, state.config);
				}
			}

			const record: AttendanceRecord = {
				...existingRecord,
				checkIn,
				checkOut,
				status,
				workingHours,
				lateMinutes,
				earlyLeaveMinutes,
				isOverridden: true,
				overrideBy: data.overrideBy,
				overrideReason: data.reason,
				overrideNotes: data.notes,
				overrideAt: now,
				updatedAt: now
			};

			update(s => {
				const records = s.records.map(r => r.id === data.attendanceId ? record : r);
				saveAttendanceRecords(records);
				return { ...s, records, isLoading: false };
			});

			return record;
		},

		/**
		 * Create manual attendance record (HR/Admin only)
		 */
		createManualRecord: async (
			employeeId: string,
			employeeName: string,
			date: string,
			checkIn?: string,
			checkOut?: string,
			status?: AttendanceStatus,
			notes?: string,
			overrideBy?: string
		): Promise<AttendanceRecord> => {
			update(s => ({ ...s, isLoading: true }));
			await simulateDelay(500);

			const now = new Date().toISOString();
			const state = get(store);

			// Calculate values
			let workingHours = 0;
			let lateMinutes = 0;
			let earlyLeaveMinutes = 0;
			let finalStatus: AttendanceStatus = status || 'absent';

			if (checkIn && checkOut) {
				workingHours = calculateWorkingHours(checkIn, checkOut, state.config.breakDurationMinutes);
				lateMinutes = calculateLateMinutes(checkIn, state.config);
				earlyLeaveMinutes = calculateEarlyLeaveMinutes(checkOut, state.config);
				if (!status) {
					finalStatus = determineAttendanceStatus(checkIn, checkOut, state.config);
				}
			}

			const record: AttendanceRecord = {
				id: generateAttendanceId(),
				employeeId,
				employeeName,
				date,
				checkIn,
				checkOut,
				status: finalStatus,
				workingHours,
				lateMinutes,
				earlyLeaveMinutes,
				notes,
				isOverridden: true,
				overrideBy,
				overrideReason: 'correction',
				overrideNotes: 'Manual entry by HR',
				overrideAt: now,
				createdAt: now,
				updatedAt: now
			};

			update(s => {
				const records = [...s.records, record];
				saveAttendanceRecords(records);
				return { ...s, records, isLoading: false };
			});

			return record;
		},

		// ============================
		// CONFIGURATION
		// ============================

		/**
		 * Update attendance configuration
		 */
		updateConfig: async (config: Partial<AttendanceConfig>): Promise<AttendanceConfig> => {
			update(s => ({ ...s, isLoading: true }));
			await simulateDelay(300);

			const state = get(store);
			const newConfig = { ...state.config, ...config };

			saveAttendanceConfig(newConfig);
			update(s => ({ ...s, config: newConfig, isLoading: false }));

			return newConfig;
		},

		// ============================
		// FILTERS & SELECTION
		// ============================

		setSelectedDate: (date: string) => {
			update(s => ({ ...s, selectedDate: date }));
		},

		setSelectedEmployee: (employeeId: string | null) => {
			update(s => ({ ...s, selectedEmployeeId: employeeId }));
		},

		setSelectedMonth: (month: string) => {
			update(s => ({ ...s, selectedMonth: month }));
		},

		// ============================
		// DATA MANAGEMENT
		// ============================

		/**
		 * Get attendance record by employee and date
		 */
		getRecordByEmployeeAndDate: (employeeId: string, date: string): AttendanceRecord | undefined => {
			const state = get(store);
			return state.records.find(r => r.employeeId === employeeId && r.date === date);
		},

		/**
		 * Check if employee is checked in today
		 */
		isCheckedIn: (employeeId: string): boolean => {
			const today = getDateString();
			const state = get(store);
			const record = state.records.find(r => r.employeeId === employeeId && r.date === today);
			return !!record?.checkIn;
		},

		/**
		 * Check if employee is checked out today
		 */
		isCheckedOut: (employeeId: string): boolean => {
			const today = getDateString();
			const state = get(store);
			const record = state.records.find(r => r.employeeId === employeeId && r.date === today);
			return !!record?.checkOut;
		},

		/**
		 * Refresh data from storage
		 */
		refresh: async () => {
			update(s => ({ ...s, isLoading: true }));
			await simulateDelay(300);

			update(s => ({
				...s,
				records: loadAttendanceRecords(),
				config: loadAttendanceConfig(),
				isLoading: false
			}));
		},

		/**
		 * Reset to initial mock data
		 */
		reset: () => {
			saveAttendanceRecords(getAttendanceRecords());
			saveAttendanceConfig(DEFAULT_ATTENDANCE_CONFIG);
			set({
				...initialState,
				records: getAttendanceRecords(),
				config: DEFAULT_ATTENDANCE_CONFIG
			});
		}
	};
}

// ============================
// EXPORT STORES
// ============================

export const attendanceStore = createAttendanceStore();

// ============================
// DERIVED STORES
// ============================

/**
 * Today's attendance records
 */
export const todayAttendance = derived(attendanceStore, ($store) => {
	const today = getDateString();
	return $store.records.filter(r => r.date === today);
});

/**
 * Attendance records for selected date
 */
export const selectedDateAttendance = derived(attendanceStore, ($store) => {
	return $store.records.filter(r => r.date === $store.selectedDate);
});

/**
 * Attendance records for selected employee
 */
export const selectedEmployeeAttendance = derived(attendanceStore, ($store) => {
	if (!$store.selectedEmployeeId) return [];
	return $store.records
		.filter(r => r.employeeId === $store.selectedEmployeeId)
		.sort((a, b) => b.date.localeCompare(a.date));
});

/**
 * Monthly attendance for selected employee and month
 */
export const selectedMonthAttendance = derived(attendanceStore, ($store) => {
	if (!$store.selectedEmployeeId) return [];
	return $store.records.filter(
		r => r.employeeId === $store.selectedEmployeeId && r.date.startsWith($store.selectedMonth)
	);
});

/**
 * Monthly attendance summary for selected employee
 */
export const monthlyAttendanceSummary = derived(attendanceStore, ($store): MonthlyAttendanceSummary | null => {
	if (!$store.selectedEmployeeId) return null;

	const monthRecords = $store.records.filter(
		r => r.employeeId === $store.selectedEmployeeId && r.date.startsWith($store.selectedMonth)
	);

	if (monthRecords.length === 0) return null;

	const employeeName = monthRecords[0]?.employeeName || 'Unknown';

	return {
		employeeId: $store.selectedEmployeeId,
		employeeName,
		month: $store.selectedMonth,
		totalDays: monthRecords.length,
		presentDays: monthRecords.filter(r => r.status === 'present').length,
		lateDays: monthRecords.filter(r => r.status === 'late').length,
		absentDays: monthRecords.filter(r => r.status === 'absent').length,
		earlyLeaveDays: monthRecords.filter(r => r.status === 'early-leave').length,
		halfDays: monthRecords.filter(r => r.status === 'half-day').length,
		totalWorkingHours: monthRecords.reduce((acc, r) => acc + r.workingHours, 0),
		totalLateMinutes: monthRecords.reduce((acc, r) => acc + r.lateMinutes, 0),
		totalEarlyLeaveMinutes: monthRecords.reduce((acc, r) => acc + r.earlyLeaveMinutes, 0),
		averageWorkingHours: monthRecords.length > 0
			? monthRecords.reduce((acc, r) => acc + r.workingHours, 0) / monthRecords.length
			: 0,
		attendancePercentage: monthRecords.length > 0
			? ((monthRecords.filter(r => r.status !== 'absent').length / monthRecords.length) * 100)
			: 0
	};
});

/**
 * Today's attendance statistics
 */
export const todayStats = derived(todayAttendance, ($today) => {
	return {
		total: $today.length,
		present: $today.filter(r => r.status === 'present').length,
		late: $today.filter(r => r.status === 'late').length,
		absent: $today.filter(r => r.status === 'absent').length,
		earlyLeave: $today.filter(r => r.status === 'early-leave').length,
		halfDay: $today.filter(r => r.status === 'half-day').length,
		checkedIn: $today.filter(r => r.checkIn && !r.checkOut).length,
		checkedOut: $today.filter(r => r.checkIn && r.checkOut).length
	};
});

/**
 * Calendar days for selected month with attendance data
 */
export const calendarDays = derived(attendanceStore, ($store): CalendarDay[] => {
	const [year, month] = $store.selectedMonth.split('-').map(Number);
	const firstDay = new Date(year, month - 1, 1);
	const lastDay = new Date(year, month, 0);
	const today = new Date();
	
	const days: CalendarDay[] = [];

	// Get the day of week for the first day (0 = Sunday)
	const startDayOfWeek = firstDay.getDay();

	// Add days from previous month
	const prevMonthLastDay = new Date(year, month - 1, 0);
	for (let i = startDayOfWeek - 1; i >= 0; i--) {
		const dayNum = prevMonthLastDay.getDate() - i;
		const date = new Date(year, month - 2, dayNum);
		const dateStr = date.toISOString().split('T')[0];
		const dayOfWeek = date.getDay();

		days.push({
			date: dateStr,
			dayOfMonth: dayNum,
			isCurrentMonth: false,
			isToday: false,
			isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
			attendance: $store.selectedEmployeeId
				? $store.records.find(r => r.employeeId === $store.selectedEmployeeId && r.date === dateStr)
				: undefined
		});
	}

	// Add days of current month
	for (let day = 1; day <= lastDay.getDate(); day++) {
		const date = new Date(year, month - 1, day);
		const dateStr = date.toISOString().split('T')[0];
		const dayOfWeek = date.getDay();
		const isToday = date.toDateString() === today.toDateString();

		days.push({
			date: dateStr,
			dayOfMonth: day,
			isCurrentMonth: true,
			isToday,
			isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
			attendance: $store.selectedEmployeeId
				? $store.records.find(r => r.employeeId === $store.selectedEmployeeId && r.date === dateStr)
				: undefined
		});
	}

	// Add days from next month to complete the grid (6 rows of 7 days = 42 days)
	const remainingDays = 42 - days.length;
	for (let day = 1; day <= remainingDays; day++) {
		const date = new Date(year, month, day);
		const dateStr = date.toISOString().split('T')[0];
		const dayOfWeek = date.getDay();

		days.push({
			date: dateStr,
			dayOfMonth: day,
			isCurrentMonth: false,
			isToday: false,
			isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
			attendance: $store.selectedEmployeeId
				? $store.records.find(r => r.employeeId === $store.selectedEmployeeId && r.date === dateStr)
				: undefined
		});
	}

	return days;
});

// ============================
// EXPORT UTILITIES
// ============================

export { formatTime, formatDuration };
