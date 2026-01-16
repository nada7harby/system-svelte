<!--
  Attendance Page
  Main attendance dashboard with today's overview, check-in/out, and employee list
-->
<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/stores/auth';
	import {
		attendanceStore,
		todayAttendance,
		todayStats,
		formatTime,
		formatDuration
	} from '$lib/stores/attendanceStore';
	import type { AttendanceRecord, AttendanceStatus, AttendanceOverrideData } from '$lib/types/attendance';
	import { ATTENDANCE_STATUSES, getDateString } from '$lib/types/attendance';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import CheckInOutCard from '$lib/components/attendance/CheckInOutCard.svelte';
	import AttendanceOverrideModal from '$lib/components/attendance/AttendanceOverrideModal.svelte';

	// Local state
	let searchQuery = $state('');
	let statusFilter = $state<AttendanceStatus | 'all'>('all');
	let selectedDate = $state(getDateString());

	// Modal states
	let showOverrideModal = $state(false);
	let overrideRecord = $state<AttendanceRecord | null>(null);

	// Permission check
	const canOverride = $derived($currentUser?.role === 'admin' || $currentUser?.role === 'manager');

	// Current user's attendance
	const myAttendance = $derived(
		$todayAttendance.find(r => r.employeeId === $currentUser?.id) || null
	);

	// Filtered attendance
	const filteredAttendance = $derived(() => {
		let result = $todayAttendance;

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(r =>
				r.employeeName?.toLowerCase().includes(query)
			);
		}

		if (statusFilter !== 'all') {
			result = result.filter(r => r.status === statusFilter);
		}

		return result;
	});

	// Get status badge color
	const getStatusColor = (status: AttendanceStatus): 'success' | 'warning' | 'danger' | 'info' | 'secondary' => {
		const colorMap: Record<AttendanceStatus, 'success' | 'warning' | 'danger' | 'info' | 'secondary'> = {
			'present': 'success',
			'late': 'warning',
			'absent': 'danger',
			'early-leave': 'info',
			'half-day': 'secondary'
		};
		return colorMap[status];
	};

	// Handle check-in
	const handleCheckIn = async () => {
		if (!$currentUser) return;
		await attendanceStore.checkIn($currentUser.id, $currentUser.name);
	};

	// Handle check-out
	const handleCheckOut = async () => {
		if (!$currentUser) return;
		await attendanceStore.checkOut($currentUser.id);
	};

	// Handle override
	const handleOpenOverride = (record: AttendanceRecord) => {
		overrideRecord = record;
		showOverrideModal = true;
	};

	const handleSaveOverride = async (data: AttendanceOverrideData) => {
		await attendanceStore.overrideAttendance(data);
		showOverrideModal = false;
		overrideRecord = null;
	};

	// Navigate to employee attendance
	const viewEmployeeAttendance = (employeeId: string) => {
		goto(`/attendance/${employeeId}`);
	};

	// Export attendance
	const handleExport = (format: 'csv' | 'pdf') => {
		// Simulated export
		alert(`Exporting attendance as ${format.toUpperCase()}...`);
	};
</script>

<svelte:head>
	<title>Attendance | HR Management System</title>
	<meta name="description" content="Track employee attendance and time management" />
</svelte:head>

<div class="attendance-page" in:fade={{ duration: 200 }}>
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<h1>Attendance</h1>
			<p>Track employee attendance and time management</p>
		</div>
		<div class="header-actions">
			{#if canOverride}
				<div class="export-dropdown">
					<Button variant="outline" onclick={() => handleExport('csv')}>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;">
							<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
						</svg>
						Export CSV
					</Button>
				</div>
			{/if}
		</div>
	</div>

	<div class="main-layout">
		<!-- Left Column -->
		<div class="left-column">
			<!-- My Attendance Card -->
			<section class="my-attendance" in:fly={{ y: 20, delay: 100, duration: 300 }}>
				<h2>My Attendance Today</h2>
				<CheckInOutCard
					isCheckedIn={!!myAttendance?.checkIn}
					isCheckedOut={!!myAttendance?.checkOut}
					checkInTime={myAttendance?.checkIn}
					checkOutTime={myAttendance?.checkOut}
					workingHours={myAttendance?.workingHours || 0}
					lateMinutes={myAttendance?.lateMinutes || 0}
					oncheckin={handleCheckIn}
					oncheckout={handleCheckOut}
				/>
			</section>
		</div>

		<!-- Right Column -->
		<div class="right-column">
			<!-- Today's Stats -->
			<div class="stats-grid" in:fly={{ y: 20, delay: 150, duration: 300 }}>
				<div class="stat-card present">
					<div class="stat-icon">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<polyline points="22,4 12,14.01 9,11.01" />
						</svg>
					</div>
					<div class="stat-content">
						<span class="stat-value">{$todayStats.present}</span>
						<span class="stat-label">Present</span>
					</div>
				</div>

				<div class="stat-card late">
					<div class="stat-icon">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="10" />
							<polyline points="12,6 12,12 16,14" />
						</svg>
					</div>
					<div class="stat-content">
						<span class="stat-value">{$todayStats.late}</span>
						<span class="stat-label">Late</span>
					</div>
				</div>

				<div class="stat-card absent">
					<div class="stat-icon">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="10" />
							<path d="M15 9l-6 6M9 9l6 6" />
						</svg>
					</div>
					<div class="stat-content">
						<span class="stat-value">{$todayStats.absent}</span>
						<span class="stat-label">Absent</span>
					</div>
				</div>

				<div class="stat-card working">
					<div class="stat-icon">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
						</svg>
					</div>
					<div class="stat-content">
						<span class="stat-value">{$todayStats.checkedIn}</span>
						<span class="stat-label">Working Now</span>
					</div>
				</div>
			</div>

			<!-- Attendance List -->
			<section class="attendance-list-section" in:fly={{ y: 20, delay: 200, duration: 300 }}>
				<div class="section-header">
					<h2>Today's Attendance</h2>
					<div class="filter-row">
						<div class="search-wrapper">
							<Input
								type="search"
								name="search"
								placeholder="Search employees..."
								bind:value={searchQuery}
							>
								{#snippet icon()}
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<circle cx="11" cy="11" r="8" />
										<path d="M21 21l-4.35-4.35" />
									</svg>
								{/snippet}
							</Input>
						</div>
						<div class="status-filters">
							<button
								class="filter-btn"
								class:active={statusFilter === 'all'}
								onclick={() => statusFilter = 'all'}
							>All</button>
							{#each ATTENDANCE_STATUSES as status}
								<button
									class="filter-btn status-{status.value}"
									class:active={statusFilter === status.value}
									onclick={() => statusFilter = status.value}
								>
									<span class="dot"></span>
									{status.label}
								</button>
							{/each}
						</div>
					</div>
				</div>

				<div class="attendance-table">
					<div class="table-header">
						<span class="col-employee">Employee</span>
						<span class="col-checkin">Check In</span>
						<span class="col-checkout">Check Out</span>
						<span class="col-hours">Hours</span>
						<span class="col-status">Status</span>
						{#if canOverride}
							<span class="col-actions">Actions</span>
						{/if}
					</div>

					<div class="table-body">
						{#if filteredAttendance().length === 0}
							<div class="empty-state">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
									<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
									<line x1="16" y1="2" x2="16" y2="6" />
									<line x1="8" y1="2" x2="8" y2="6" />
									<line x1="3" y1="10" x2="21" y2="10" />
								</svg>
								<p>No attendance records found</p>
							</div>
						{:else}
							{#each filteredAttendance() as record (record.id)}
								<div
									class="table-row"
									in:fade
									onclick={() => viewEmployeeAttendance(record.employeeId)}
									role="button"
									tabindex="0"
								>
									<div class="col-employee">
										<div class="employee-avatar">
											{record.employeeName?.charAt(0) || '?'}
										</div>
										<div class="employee-info">
											<span class="employee-name">{record.employeeName}</span>
											{#if record.isOverridden}
												<span class="override-badge">Modified</span>
											{/if}
										</div>
									</div>
									<div class="col-checkin">
										{#if record.checkIn}
											<span class="time">{formatTime(record.checkIn)}</span>
											{#if record.lateMinutes > 0}
												<span class="late-badge">+{record.lateMinutes}m</span>
											{/if}
										{:else}
											<span class="no-time">--:--</span>
										{/if}
									</div>
									<div class="col-checkout">
										{#if record.checkOut}
											<span class="time">{formatTime(record.checkOut)}</span>
											{#if record.earlyLeaveMinutes > 0}
												<span class="early-badge">-{record.earlyLeaveMinutes}m</span>
											{/if}
										{:else}
											<span class="no-time">--:--</span>
										{/if}
									</div>
									<div class="col-hours">
										{#if record.workingHours > 0}
											<span class="hours">{formatDuration(record.workingHours)}</span>
										{:else}
											<span class="no-hours">--</span>
										{/if}
									</div>
									<div class="col-status">
										<Badge variant={getStatusColor(record.status)} size="sm">
											{ATTENDANCE_STATUSES.find(s => s.value === record.status)?.label}
										</Badge>
									</div>
									{#if canOverride}
										<div class="col-actions" onclick={(e) => e.stopPropagation()}>
											<button
												class="action-btn"
												onclick={() => handleOpenOverride(record)}
												title="Override"
											>
												<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
													<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
													<path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
												</svg>
											</button>
										</div>
									{/if}
								</div>
							{/each}
						{/if}
					</div>
				</div>
			</section>
		</div>
	</div>
</div>

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

	.attendance-page {
		max-width: $content-max-width;
		margin: 0 auto;
	}

	// Page Header
	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: $spacing-8;
		gap: $spacing-4;
		flex-wrap: wrap;

		.header-content {
			h1 {
				font-size: $font-size-3xl;
				color: $neutral-900;
				margin: 0 0 $spacing-1 0;
			}

			p {
				color: $neutral-500;
				margin: 0;
			}
		}

		.header-actions {
			display: flex;
			gap: $spacing-2;
		}
	}

	// Main Layout
	.main-layout {
		display: grid;
		grid-template-columns: 380px 1fr;
		gap: $spacing-6;

		@media (max-width: $breakpoint-lg) {
			grid-template-columns: 1fr;
		}
	}

	.left-column {
		display: flex;
		flex-direction: column;
		gap: $spacing-6;
	}

	.right-column {
		display: flex;
		flex-direction: column;
		gap: $spacing-6;
	}

	// My Attendance Section
	.my-attendance {
		h2 {
			margin: 0 0 $spacing-4 0;
			font-size: $font-size-lg;
			font-weight: $font-weight-semibold;
			color: $neutral-800;
		}
	}

	// Stats Grid
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: $spacing-4;

		@media (max-width: $breakpoint-xl) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: $spacing-3;
		background: white;
		padding: $spacing-4;
		border-radius: $radius-xl;
		box-shadow: $shadow-md;
		border: 1px solid $neutral-100;

		&.present {
			.stat-icon { background: rgba($success-500, 0.1); color: $success-500; }
			.stat-value { color: $success-600; }
		}

		&.late {
			.stat-icon { background: rgba($warning-500, 0.1); color: $warning-500; }
			.stat-value { color: $warning-600; }
		}

		&.absent {
			.stat-icon { background: rgba($danger-500, 0.1); color: $danger-500; }
			.stat-value { color: $danger-600; }
		}

		&.working {
			.stat-icon { background: rgba($primary-500, 0.1); color: $primary-500; }
			.stat-value { color: $primary-600; }
		}
	}

	.stat-icon {
		width: 48px;
		height: 48px;
		border-radius: $radius-xl;
		display: flex;
		align-items: center;
		justify-content: center;

		svg {
			width: 24px;
			height: 24px;
		}
	}

	.stat-content {
		display: flex;
		flex-direction: column;
	}

	.stat-value {
		font-size: $font-size-2xl;
		font-weight: $font-weight-bold;
		line-height: 1;
	}

	.stat-label {
		font-size: $font-size-sm;
		color: $neutral-500;
		margin-top: 2px;
	}

	// Attendance List Section
	.attendance-list-section {
		background: white;
		border-radius: $radius-xl;
		padding: $spacing-6;
		box-shadow: $shadow-md;
		border: 1px solid $neutral-100;
	}

	.section-header {
		margin-bottom: $spacing-5;

		h2 {
			margin: 0 0 $spacing-4 0;
			font-size: $font-size-xl;
			font-weight: $font-weight-semibold;
			color: $neutral-800;
		}
	}

	.filter-row {
		display: flex;
		gap: $spacing-4;
		flex-wrap: wrap;
	}

	.search-wrapper {
		flex: 1;
		min-width: 200px;
	}

	.status-filters {
		display: flex;
		gap: $spacing-2;
		flex-wrap: wrap;
	}

	.filter-btn {
		display: flex;
		align-items: center;
		gap: $spacing-1;
		padding: $spacing-2 $spacing-3;
		border: 1px solid $neutral-200;
		border-radius: $radius-lg;
		background: white;
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
		color: $neutral-600;
		cursor: pointer;
		transition: all $transition-fast;

		.dot {
			width: 6px;
			height: 6px;
			border-radius: 50%;
			background: $neutral-400;
		}

		&:hover {
			border-color: $neutral-300;
			background: $neutral-50;
		}

		&.active {
			border-color: $primary-500;
			background: $primary-50;
			color: $primary-700;
		}

		&.status-present .dot { background: $success-500; }
		&.status-late .dot { background: $warning-500; }
		&.status-absent .dot { background: $danger-500; }
		&.status-early-leave .dot { background: $info-500; }
		&.status-half-day .dot { background: $secondary-500; }
	}

	// Table
	.attendance-table {
		overflow: hidden;
	}

	.table-header {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr 100px 60px;
		gap: $spacing-4;
		padding: $spacing-3 $spacing-4;
		background: $neutral-50;
		border-radius: $radius-lg;
		font-size: $font-size-xs;
		font-weight: $font-weight-semibold;
		color: $neutral-500;
		text-transform: uppercase;
		letter-spacing: 0.05em;

		@media (max-width: $breakpoint-md) {
			display: none;
		}
	}

	.table-body {
		display: flex;
		flex-direction: column;
	}

	.table-row {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr 100px 60px;
		gap: $spacing-4;
		padding: $spacing-4;
		align-items: center;
		border-bottom: 1px solid $neutral-100;
		cursor: pointer;
		transition: background $transition-fast;

		&:hover {
			background: $neutral-50;
		}

		&:last-child {
			border-bottom: none;
		}

		@media (max-width: $breakpoint-md) {
			grid-template-columns: 1fr;
			gap: $spacing-2;
		}
	}

	.col-employee {
		display: flex;
		align-items: center;
		gap: $spacing-3;
	}

	.employee-avatar {
		width: 40px;
		height: 40px;
		background: linear-gradient(135deg, $primary-400 0%, $primary-600 100%);
		border-radius: $radius-lg;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: $font-weight-semibold;
		font-size: $font-size-sm;
		flex-shrink: 0;
	}

	.employee-info {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.employee-name {
		font-weight: $font-weight-medium;
		color: $neutral-800;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.override-badge {
		font-size: $font-size-xs;
		color: $warning-600;
		font-weight: $font-weight-medium;
	}

	.time {
		font-weight: $font-weight-medium;
		color: $neutral-800;
		font-variant-numeric: tabular-nums;
	}

	.no-time,
	.no-hours {
		color: $neutral-400;
	}

	.late-badge {
		display: inline-block;
		margin-left: $spacing-1;
		padding: 1px 4px;
		background: $warning-100;
		color: $warning-700;
		border-radius: $radius-sm;
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
	}

	.early-badge {
		display: inline-block;
		margin-left: $spacing-1;
		padding: 1px 4px;
		background: $info-100;
		color: $info-700;
		border-radius: $radius-sm;
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
	}

	.hours {
		font-weight: $font-weight-medium;
		color: $neutral-700;
	}

	.col-actions {
		display: flex;
		justify-content: flex-end;
	}

	.action-btn {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: transparent;
		border-radius: $radius-md;
		cursor: pointer;
		color: $neutral-500;
		transition: all $transition-fast;

		svg {
			width: 16px;
			height: 16px;
		}

		&:hover {
			background: $primary-50;
			color: $primary-600;
		}
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: $spacing-12;
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
