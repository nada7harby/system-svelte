<!--
  AttendanceCalendar Component
  Monthly calendar view with color-coded attendance statuses
-->
<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { CalendarDay, AttendanceStatus } from '$lib/types/attendance';
	import { ATTENDANCE_STATUSES, formatTime, formatDuration } from '$lib/types/attendance';
	import Badge from '$lib/components/ui/Badge.svelte';

	interface Props {
		days: CalendarDay[];
		selectedMonth: string;
		onprevmonth?: () => void;
		onnextmonth?: () => void;
		ondayclick?: (day: CalendarDay) => void;
	}

	let { days = [], selectedMonth = '', onprevmonth, onnextmonth, ondayclick }: Props = $props();

	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	// Format month for display
	const formatMonth = (monthStr: string): string => {
		const [year, month] = monthStr.split('-').map(Number);
		const date = new Date(year, month - 1, 1);
		return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
	};

	// Get status color class
	const getStatusClass = (status?: AttendanceStatus): string => {
		if (!status) return '';
		const statusMap: Record<AttendanceStatus, string> = {
			'present': 'status-present',
			'late': 'status-late',
			'absent': 'status-absent',
			'early-leave': 'status-early-leave',
			'half-day': 'status-half-day'
		};
		return statusMap[status] || '';
	};

	// Get status info for tooltip
	const getStatusInfo = (status?: AttendanceStatus) => {
		if (!status) return null;
		return ATTENDANCE_STATUSES.find(s => s.value === status);
	};
</script>

<div class="calendar-container">
	<div class="calendar-header">
		<button class="nav-btn" onclick={onprevmonth} title="Previous month">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M15 18l-6-6 6-6" />
			</svg>
		</button>
		<h3 class="month-title">{formatMonth(selectedMonth)}</h3>
		<button class="nav-btn" onclick={onnextmonth} title="Next month">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M9 18l6-6-6-6" />
			</svg>
		</button>
	</div>

	<div class="calendar-grid">
		<!-- Week day headers -->
		{#each weekDays as day}
			<div class="weekday-header" class:weekend={day === 'Sun' || day === 'Sat'}>
				{day}
			</div>
		{/each}

		<!-- Calendar days -->
		{#each days as day, index (day.date)}
			<button
				class="calendar-day {getStatusClass(day.attendance?.status)}"
				class:other-month={!day.isCurrentMonth}
				class:today={day.isToday}
				class:weekend={day.isWeekend}
				class:has-attendance={!!day.attendance}
				onclick={() => ondayclick?.(day)}
				in:fade={{ delay: index * 10, duration: 100 }}
			>
				<span class="day-number">{day.dayOfMonth}</span>
				{#if day.attendance}
					<span class="status-dot" title={getStatusInfo(day.attendance.status)?.label}></span>
				{/if}
				{#if day.isCurrentMonth && day.attendance}
					<div class="day-details">
						{#if day.attendance.checkIn}
							<span class="time-badge in">{formatTime(day.attendance.checkIn)}</span>
						{/if}
					</div>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Legend -->
	<div class="calendar-legend">
		{#each ATTENDANCE_STATUSES as status}
			<div class="legend-item">
				<span class="legend-dot {getStatusClass(status.value)}"></span>
				<span class="legend-label">{status.label}</span>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	@use '$styles/variables' as *;

	.calendar-container {
		background: white;
		border-radius: $radius-xl;
		padding: $spacing-6;
		box-shadow: $shadow-md;
		border: 1px solid $neutral-100;
	}

	.calendar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: $spacing-6;
	}

	.nav-btn {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid $neutral-200;
		background: white;
		border-radius: $radius-lg;
		cursor: pointer;
		color: $neutral-600;
		transition: all $transition-fast;

		svg {
			width: 20px;
			height: 20px;
		}

		&:hover {
			background: $neutral-50;
			border-color: $neutral-300;
			color: $neutral-800;
		}
	}

	.month-title {
		margin: 0;
		font-size: $font-size-xl;
		font-weight: $font-weight-semibold;
		color: $neutral-900;
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: $spacing-1;
	}

	.weekday-header {
		padding: $spacing-2;
		text-align: center;
		font-size: $font-size-sm;
		font-weight: $font-weight-semibold;
		color: $neutral-600;

		&.weekend {
			color: $neutral-400;
		}
	}

	.calendar-day {
		position: relative;
		aspect-ratio: 1;
		min-height: 60px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		padding: $spacing-2;
		border: 1px solid $neutral-100;
		background: white;
		border-radius: $radius-md;
		cursor: pointer;
		transition: all $transition-fast;

		&:hover {
			background: $neutral-50;
			border-color: $neutral-300;
			transform: scale(1.02);
			z-index: 1;
		}

		&.other-month {
			opacity: 0.4;
			background: $neutral-50;
		}

		&.today {
			border-color: $primary-400;
			border-width: 2px;
			background: $primary-50;

			.day-number {
				background: $primary-500;
				color: white;
			}
		}

		&.weekend {
			background: $neutral-50;
		}

		&.has-attendance {
			padding-bottom: $spacing-1;
		}

		// Status colors
		&.status-present {
			border-left: 3px solid $success-500;
			background: rgba($success-500, 0.05);
		}

		&.status-late {
			border-left: 3px solid $warning-500;
			background: rgba($warning-500, 0.05);
		}

		&.status-absent {
			border-left: 3px solid $danger-500;
			background: rgba($danger-500, 0.05);
		}

		&.status-early-leave {
			border-left: 3px solid $info-500;
			background: rgba($info-500, 0.05);
		}

		&.status-half-day {
			border-left: 3px solid $secondary-500;
			background: rgba($secondary-500, 0.05);
		}
	}

	.day-number {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		color: $neutral-700;
	}

	.status-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		margin-top: $spacing-1;
	}

	.status-present .status-dot { background: $success-500; }
	.status-late .status-dot { background: $warning-500; }
	.status-absent .status-dot { background: $danger-500; }
	.status-early-leave .status-dot { background: $info-500; }
	.status-half-day .status-dot { background: $secondary-500; }

	.day-details {
		margin-top: auto;
		text-align: center;
	}

	.time-badge {
		display: inline-block;
		padding: 1px 4px;
		font-size: 9px;
		font-weight: $font-weight-medium;
		border-radius: $radius-sm;

		&.in {
			background: $success-100;
			color: $success-700;
		}
	}

	.calendar-legend {
		display: flex;
		flex-wrap: wrap;
		gap: $spacing-4;
		margin-top: $spacing-6;
		padding-top: $spacing-4;
		border-top: 1px solid $neutral-100;
		justify-content: center;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: $spacing-2;
	}

	.legend-dot {
		width: 12px;
		height: 12px;
		border-radius: $radius-sm;
		border: 1px solid $neutral-200;

		&.status-present { background: $success-500; border-color: $success-500; }
		&.status-late { background: $warning-500; border-color: $warning-500; }
		&.status-absent { background: $danger-500; border-color: $danger-500; }
		&.status-early-leave { background: $info-500; border-color: $info-500; }
		&.status-half-day { background: $secondary-500; border-color: $secondary-500; }
	}

	.legend-label {
		font-size: $font-size-xs;
		color: $neutral-600;
	}
</style>
