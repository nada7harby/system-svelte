<!--
  Employee Attendance Detail Page
  Shows individual employee attendance with calendar view and monthly summary
-->
<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';
	import { currentUser } from '$lib/stores/auth';
	import { employees } from '$lib/stores/employeesStore';
	import {
		attendanceStore,
		selectedEmployeeAttendance,
		monthlyAttendanceSummary,
		calendarDays,
		formatTime,
		formatDuration
	} from '$lib/stores/attendanceStore';
	import type { AttendanceRecord, CalendarDay, AttendanceOverrideData } from '$lib/types/attendance';
	import { ATTENDANCE_STATUSES, getMonthString, getDateString } from '$lib/types/attendance';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import AttendanceCalendar from '$lib/components/attendance/AttendanceCalendar.svelte';
	import AttendanceSummaryCard from '$lib/components/attendance/AttendanceSummaryCard.svelte';
	import AttendanceOverrideModal from '$lib/components/attendance/AttendanceOverrideModal.svelte';

	// Get employee ID from URL
	const employeeId = $derived($page.params.employeeId);

	// Set selected employee in store
	$effect(() => {
		if (employeeId) {
			attendanceStore.setSelectedEmployee(employeeId);
		}
	});

	// Get employee data
	const employee = $derived(() => {
		const state = employees;
		if (!employeeId) return null;
		// Access via get() or find in store
		let foundEmployee = null;
		state.subscribe(emps => {
			foundEmployee = emps.find(e => e.id === employeeId);
		})();
		return foundEmployee;
	});

	// Selected month for calendar
	let selectedMonth = $state(getMonthString());

	$effect(() => {
		attendanceStore.setSelectedMonth(selectedMonth);
	});

	// Modal states
	let showDayModal = $state(false);
	let selectedDay = $state<CalendarDay | null>(null);
	let showOverrideModal = $state(false);
	let overrideRecord = $state<AttendanceRecord | null>(null);

	// Permission check
	const canOverride = $derived($currentUser?.role === 'admin' || $currentUser?.role === 'manager');

	// Get status badge color
	const getStatusColor = (status: string): 'success' | 'warning' | 'danger' | 'info' | 'secondary' => {
		const colorMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'secondary'> = {
			'present': 'success',
			'late': 'warning',
			'absent': 'danger',
			'early-leave': 'info',
			'half-day': 'secondary'
		};
		return colorMap[status] || 'secondary';
	};

	// Navigate months
	const handlePrevMonth = () => {
		const [year, month] = selectedMonth.split('-').map(Number);
		const prevMonth = month === 1 ? 12 : month - 1;
		const prevYear = month === 1 ? year - 1 : year;
		selectedMonth = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
	};

	const handleNextMonth = () => {
		const [year, month] = selectedMonth.split('-').map(Number);
		const nextMonth = month === 12 ? 1 : month + 1;
		const nextYear = month === 12 ? year + 1 : year;
		selectedMonth = `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
	};

	// Handle day click
	const handleDayClick = (day: CalendarDay) => {
		selectedDay = day;
		showDayModal = true;
	};

	// Handle override
	const handleOpenOverride = (record: AttendanceRecord) => {
		overrideRecord = record;
		showOverrideModal = true;
		showDayModal = false;
	};

	const handleSaveOverride = async (data: AttendanceOverrideData) => {
		await attendanceStore.overrideAttendance(data);
		showOverrideModal = false;
		overrideRecord = null;
	};

	// Navigate back
	const goBack = () => {
		goto('/attendance');
	};

	// Export employee attendance
	const handleExport = (format: 'csv' | 'pdf') => {
		alert(`Exporting ${employee()?.firstName}'s attendance as ${format.toUpperCase()}...`);
	};
</script>

<svelte:head>
	<title>{employee()?.firstName} {employee()?.lastName} - Attendance | HR Management System</title>
</svelte:head>

<div class="employee-attendance" in:fade={{ duration: 200 }}>
	{#if !employee()}
		<div class="error-state">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<circle cx="12" cy="12" r="10" />
				<path d="M12 8v4M12 16h.01" />
			</svg>
			<h2>Employee Not Found</h2>
			<p>The employee you're looking for doesn't exist.</p>
			<Button variant="primary" onclick={goBack}>
				Back to Attendance
			</Button>
		</div>
	{:else}
		<!-- Header -->
		<div class="page-header">
			<button class="back-btn" onclick={goBack}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M19 12H5M12 19l-7-7 7-7" />
				</svg>
			</button>
			<div class="header-content">
				<div class="employee-header">
					<div class="employee-avatar">
						{employee()?.firstName?.charAt(0)}{employee()?.lastName?.charAt(0)}
					</div>
					<div class="employee-info">
						<h1>{employee()?.firstName} {employee()?.lastName}</h1>
						<div class="employee-meta">
							<span>{employee()?.jobTitle}</span>
							<span class="separator">•</span>
							<span>{employee()?.department}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="header-actions">
				{#if canOverride}
					<Button variant="outline" onclick={() => handleExport('csv')}>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;">
							<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
						</svg>
						Export
					</Button>
				{/if}
			</div>
		</div>

		<div class="main-layout">
			<!-- Calendar Section -->
			<section class="calendar-section" in:fly={{ y: 20, delay: 100, duration: 300 }}>
				<AttendanceCalendar
					days={$calendarDays}
					selectedMonth={selectedMonth}
					onprevmonth={handlePrevMonth}
					onnextmonth={handleNextMonth}
					ondayclick={handleDayClick}
				/>
			</section>

			<!-- Summary Section -->
			<section class="summary-section" in:fly={{ y: 20, delay: 200, duration: 300 }}>
				<AttendanceSummaryCard summary={$monthlyAttendanceSummary} />

				<!-- Recent Records -->
				<div class="recent-records">
					<h3>Recent Attendance</h3>
					<div class="records-list">
						{#each $selectedEmployeeAttendance.slice(0, 10) as record (record.id)}
							<div class="record-item" in:fade>
								<div class="record-date">
									<span class="day">
										{new Date(record.date).getDate()}
									</span>
									<span class="month">
										{new Date(record.date).toLocaleDateString('en-US', { month: 'short' })}
									</span>
								</div>
								<div class="record-times">
									<div class="time-row">
										<span class="label">In</span>
										<span class="value">{formatTime(record.checkIn)}</span>
									</div>
									<div class="time-row">
										<span class="label">Out</span>
										<span class="value">{formatTime(record.checkOut)}</span>
									</div>
								</div>
								<div class="record-hours">
									{formatDuration(record.workingHours)}
								</div>
								<Badge variant={getStatusColor(record.status)} size="sm">
									{ATTENDANCE_STATUSES.find(s => s.value === record.status)?.label}
								</Badge>
								{#if canOverride}
									<button
										class="edit-btn"
										onclick={() => handleOpenOverride(record)}
										title="Override"
									>
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
											<path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
										</svg>
									</button>
								{/if}
							</div>
						{/each}
						{#if $selectedEmployeeAttendance.length === 0}
							<div class="no-records">
								<p>No attendance records for this period</p>
							</div>
						{/if}
					</div>
				</div>
			</section>
		</div>
	{/if}
</div>

<!-- Day Detail Modal -->
<Modal isOpen={showDayModal} title="Attendance Details" size="md" onclose={() => { showDayModal = false; selectedDay = null; }}>
	{#if selectedDay}
		<div class="day-detail">
			<div class="day-header">
				<span class="date">
					{new Date(selectedDay.date).toLocaleDateString('en-US', {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</span>
				{#if selectedDay.attendance}
					<Badge variant={getStatusColor(selectedDay.attendance.status)}>
						{ATTENDANCE_STATUSES.find(s => s.value === selectedDay.attendance?.status)?.label}
					</Badge>
				{:else if !selectedDay.isWeekend}
					<Badge variant="secondary">No Record</Badge>
				{:else}
					<Badge variant="secondary">Weekend</Badge>
				{/if}
			</div>

			{#if selectedDay.attendance}
				<div class="day-times">
					<div class="time-card">
						<span class="time-label">Check In</span>
						<span class="time-value">{formatTime(selectedDay.attendance.checkIn)}</span>
						{#if selectedDay.attendance.lateMinutes > 0}
							<span class="time-note late">+{selectedDay.attendance.lateMinutes} min late</span>
						{/if}
					</div>
					<div class="time-card">
						<span class="time-label">Check Out</span>
						<span class="time-value">{formatTime(selectedDay.attendance.checkOut)}</span>
						{#if selectedDay.attendance.earlyLeaveMinutes > 0}
							<span class="time-note early">{selectedDay.attendance.earlyLeaveMinutes} min early</span>
						{/if}
					</div>
					<div class="time-card">
						<span class="time-label">Working Hours</span>
						<span class="time-value">{formatDuration(selectedDay.attendance.workingHours)}</span>
					</div>
				</div>

				{#if selectedDay.attendance.isOverridden}
					<div class="override-info">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
						</svg>
						<div>
							<span class="override-label">Modified by {selectedDay.attendance.overrideBy}</span>
							{#if selectedDay.attendance.overrideNotes}
								<span class="override-notes">{selectedDay.attendance.overrideNotes}</span>
							{/if}
						</div>
					</div>
				{/if}
			{:else if !selectedDay.isWeekend && selectedDay.isCurrentMonth}
				<div class="no-attendance">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<circle cx="12" cy="12" r="10" />
						<path d="M12 8v4M12 16h.01" />
					</svg>
					<p>No attendance record for this day</p>
				</div>
			{/if}
		</div>
	{/if}

	{#snippet footer()}
		<Button variant="ghost" onclick={() => { showDayModal = false; selectedDay = null; }}>
			Close
		</Button>
		{#if canOverride && selectedDay?.attendance}
			<Button variant="warning" onclick={() => handleOpenOverride(selectedDay!.attendance!)}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-right: 6px;">
					<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
					<path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
				</svg>
				Override
			</Button>
		{/if}
	{/snippet}
</Modal>

<!-- Override Modal -->
<AttendanceOverrideModal
	isOpen={showOverrideModal}
	record={overrideRecord}
	overrideBy={$currentUser?.name || ''}
	onclose={() => { showOverrideModal = false; overrideRecord = null; }}
	onsave={handleSaveOverride}
/>

<style lang="scss">
	@use '$styles/variables' as *;

	.employee-attendance {
		max-width: $content-max-width;
		margin: 0 auto;
	}

	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: $spacing-16;
		text-align: center;

		svg {
			width: 64px;
			height: 64px;
			color: $neutral-300;
			margin-bottom: $spacing-4;
		}

		h2 {
			margin: 0 0 $spacing-2 0;
			color: $neutral-700;
		}

		p {
			margin: 0 0 $spacing-6 0;
			color: $neutral-500;
		}
	}

	// Header
	.page-header {
		display: flex;
		align-items: center;
		gap: $spacing-4;
		margin-bottom: $spacing-8;
		flex-wrap: wrap;
	}

	.back-btn {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid $neutral-200;
		background: white;
		border-radius: $radius-xl;
		cursor: pointer;
		color: $neutral-600;
		transition: all $transition-fast;
		flex-shrink: 0;

		svg {
			width: 24px;
			height: 24px;
		}

		&:hover {
			background: $neutral-50;
			border-color: $neutral-300;
		}
	}

	.header-content {
		flex: 1;
	}

	.employee-header {
		display: flex;
		align-items: center;
		gap: $spacing-4;
	}

	.employee-avatar {
		width: 56px;
		height: 56px;
		background: linear-gradient(135deg, $primary-400 0%, $primary-600 100%);
		border-radius: $radius-xl;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: $font-weight-bold;
		font-size: $font-size-xl;
	}

	.employee-info {
		h1 {
			margin: 0;
			font-size: $font-size-2xl;
			color: $neutral-900;
		}
	}

	.employee-meta {
		display: flex;
		align-items: center;
		gap: $spacing-2;
		font-size: $font-size-sm;
		color: $neutral-500;

		.separator {
			color: $neutral-300;
		}
	}

	// Main Layout
	.main-layout {
		display: grid;
		grid-template-columns: 1fr 400px;
		gap: $spacing-6;

		@media (max-width: $breakpoint-lg) {
			grid-template-columns: 1fr;
		}
	}

	.calendar-section {
		@media (max-width: $breakpoint-lg) {
			order: 2;
		}
	}

	.summary-section {
		display: flex;
		flex-direction: column;
		gap: $spacing-6;

		@media (max-width: $breakpoint-lg) {
			order: 1;
		}
	}

	// Recent Records
	.recent-records {
		background: white;
		border-radius: $radius-xl;
		padding: $spacing-6;
		box-shadow: $shadow-md;
		border: 1px solid $neutral-100;

		h3 {
			margin: 0 0 $spacing-4 0;
			font-size: $font-size-lg;
			font-weight: $font-weight-semibold;
			color: $neutral-800;
		}
	}

	.records-list {
		display: flex;
		flex-direction: column;
	}

	.record-item {
		display: flex;
		align-items: center;
		gap: $spacing-4;
		padding: $spacing-3 0;
		border-bottom: 1px solid $neutral-100;

		&:last-child {
			border-bottom: none;
		}
	}

	.record-date {
		width: 48px;
		text-align: center;

		.day {
			display: block;
			font-size: $font-size-xl;
			font-weight: $font-weight-bold;
			color: $neutral-800;
			line-height: 1;
		}

		.month {
			display: block;
			font-size: $font-size-xs;
			color: $neutral-500;
			text-transform: uppercase;
		}
	}

	.record-times {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.time-row {
		display: flex;
		gap: $spacing-2;
		font-size: $font-size-sm;

		.label {
			color: $neutral-400;
			width: 30px;
		}

		.value {
			color: $neutral-700;
			font-weight: $font-weight-medium;
			font-variant-numeric: tabular-nums;
		}
	}

	.record-hours {
		font-weight: $font-weight-semibold;
		color: $neutral-700;
		font-size: $font-size-sm;
	}

	.edit-btn {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: transparent;
		border-radius: $radius-md;
		cursor: pointer;
		color: $neutral-400;
		transition: all $transition-fast;
		opacity: 0;

		svg {
			width: 14px;
			height: 14px;
		}

		&:hover {
			background: $primary-50;
			color: $primary-600;
		}
	}

	.record-item:hover .edit-btn {
		opacity: 1;
	}

	.no-records {
		padding: $spacing-8;
		text-align: center;
		color: $neutral-400;
	}

	// Day Detail Modal
	.day-detail {
		display: flex;
		flex-direction: column;
		gap: $spacing-5;
	}

	.day-header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.date {
			font-weight: $font-weight-medium;
			color: $neutral-700;
		}
	}

	.day-times {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: $spacing-4;
	}

	.time-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: $spacing-4;
		background: $neutral-50;
		border-radius: $radius-lg;
		text-align: center;
	}

	.time-label {
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
		color: $neutral-500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: $spacing-1;
	}

	.time-value {
		font-size: $font-size-xl;
		font-weight: $font-weight-bold;
		color: $neutral-800;
		font-variant-numeric: tabular-nums;
	}

	.time-note {
		font-size: $font-size-xs;
		margin-top: $spacing-1;

		&.late {
			color: $warning-600;
		}

		&.early {
			color: $info-600;
		}
	}

	.override-info {
		display: flex;
		gap: $spacing-3;
		padding: $spacing-3;
		background: rgba($warning-500, 0.1);
		border: 1px solid $warning-200;
		border-radius: $radius-lg;

		svg {
			width: 18px;
			height: 18px;
			color: $warning-600;
			flex-shrink: 0;
		}

		.override-label {
			display: block;
			font-size: $font-size-sm;
			font-weight: $font-weight-medium;
			color: $warning-700;
		}

		.override-notes {
			display: block;
			font-size: $font-size-sm;
			color: $warning-600;
			margin-top: 2px;
		}
	}

	.no-attendance {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: $spacing-8;
		text-align: center;
		color: $neutral-400;

		svg {
			width: 48px;
			height: 48px;
			margin-bottom: $spacing-3;
			opacity: 0.5;
		}

		p {
			margin: 0;
		}
	}
</style>
