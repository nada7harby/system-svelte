/**
 * Library Central Exports
 * Re-export all stores, components, utils, and types for easy importing
 */

// ============================
// TYPES
// ============================
export * from './types/employee';
export * from './types/department';
export * from './types/attendance';

// ============================
// STORES
// ============================
export { auth, currentUser, isAuthenticated, isAuthLoading } from './stores/auth';
export {
	employees,
	employeeFilters,
	pagination,
	filteredEmployees,
	paginatedEmployees,
	activeEmployees,
	employeeStats,
	uniqueDepartments,
	isLoading,
	selectedEmployee
} from './stores/employeesStore';
export {
	departmentsStore,
	filteredDepartments,
	departmentStats
} from './stores/departments';
export {
	departmentsStoreNew,
	filteredDepartmentsNew,
	departmentStatsNew,
	activeDepartments,
	selectedDepartment,
	selectedDepartmentPositions,
	getDepartmentName,
	getPositionTitle
} from './stores/departmentsStore';
export {
	attendanceStore,
	todayAttendance,
	selectedDateAttendance,
	selectedEmployeeAttendance,
	selectedMonthAttendance,
	monthlyAttendanceSummary,
	todayStats,
	calendarDays,
	formatTime,
	formatDuration
} from './stores/attendanceStore';

// ============================
// UI COMPONENTS
// ============================
export { default as Button } from './components/ui/Button.svelte';
export { default as Input } from './components/ui/Input.svelte';
export { default as Table } from './components/ui/Table.svelte';
export { default as Modal } from './components/ui/Modal.svelte';
export { default as Badge } from './components/ui/Badge.svelte';
export { default as Avatar } from './components/ui/Avatar.svelte';
export { default as Tabs } from './components/ui/Tabs.svelte';
export { default as Pagination } from './components/ui/Pagination.svelte';
export { default as FormField } from './components/ui/FormField.svelte';

// ============================
// LAYOUT COMPONENTS
// ============================
export { default as Sidebar } from './components/layout/Sidebar.svelte';
export { default as Navbar } from './components/layout/Navbar.svelte';

// ============================
// EMPLOYEE COMPONENTS
// ============================
export { default as EmployeeForm } from './components/employees/EmployeeForm.svelte';
export { default as ProfilePictureUpload } from './components/employees/ProfilePictureUpload.svelte';
export { default as DocumentUpload } from './components/employees/DocumentUpload.svelte';
export { default as CSVImport } from './components/employees/CSVImport.svelte';

// ============================
// DEPARTMENT COMPONENTS
// ============================
export { default as DepartmentModal } from './components/departments/DepartmentModal.svelte';
export { default as PositionModal } from './components/departments/PositionModal.svelte';
export { default as PositionsList } from './components/departments/PositionsList.svelte';

// ============================
// ATTENDANCE COMPONENTS
// ============================
export { default as AttendanceCalendar } from './components/attendance/AttendanceCalendar.svelte';
export { default as CheckInOutCard } from './components/attendance/CheckInOutCard.svelte';
export { default as AttendanceOverrideModal } from './components/attendance/AttendanceOverrideModal.svelte';
export { default as AttendanceSummaryCard } from './components/attendance/AttendanceSummaryCard.svelte';

// ============================
// DATA
// ============================
export { mockEmployeesData, getInitialEmployees } from './data/employees';
export { mockDepartments, mockEmployees } from './data/mockData';
export { mockDepartmentsData, mockPositions, getDepartments, getDepartmentById, getPositionsByDepartment, getAllPositions } from './data/departmentsData';
export { mockAttendanceRecords, mockTodayAttendance, getAttendanceConfig, getAttendanceRecords, getEmployeeAttendance, getAttendanceByDate, getTodayAttendance } from './data/attendanceData';

