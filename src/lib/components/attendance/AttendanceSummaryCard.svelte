<!--
  AttendanceSummaryCard Component
  Displays monthly attendance summary with visual stats
-->
<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { MonthlyAttendanceSummary } from '$lib/types/attendance';
	import { formatDuration } from '$lib/types/attendance';

	interface Props {
		summary: MonthlyAttendanceSummary | null;
	}

	let { summary = null }: Props = $props();

	// Calculate percentage for progress bar
	const getPercentage = (value: number, total: number): number => {
		if (total === 0) return 0;
		return Math.round((value / total) * 100);
	};
</script>

{#if summary}
	<div class="summary-card" in:fade={{ duration: 200 }}>
		<div class="card-header">
			<div class="employee-info">
				<h3>{summary.employeeName}</h3>
				<span class="month-label">
					{new Date(summary.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
				</span>
			</div>
			<div class="attendance-score" class:excellent={summary.attendancePercentage >= 95} class:good={summary.attendancePercentage >= 85 && summary.attendancePercentage < 95} class:fair={summary.attendancePercentage < 85}>
				<span class="score-value">{Math.round(summary.attendancePercentage)}%</span>
				<span class="score-label">Attendance</span>
			</div>
		</div>

		<div class="stats-grid">
			<div class="stat-item present" in:fly={{ y: 10, delay: 100 }}>
				<div class="stat-icon">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
						<polyline points="22,4 12,14.01 9,11.01" />
					</svg>
				</div>
				<div class="stat-content">
					<span class="stat-value">{summary.presentDays}</span>
					<span class="stat-label">Present</span>
				</div>
			</div>

			<div class="stat-item late" in:fly={{ y: 10, delay: 150 }}>
				<div class="stat-icon">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10" />
						<polyline points="12,6 12,12 16,14" />
					</svg>
				</div>
				<div class="stat-content">
					<span class="stat-value">{summary.lateDays}</span>
					<span class="stat-label">Late</span>
				</div>
			</div>

			<div class="stat-item absent" in:fly={{ y: 10, delay: 200 }}>
				<div class="stat-icon">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10" />
						<path d="M15 9l-6 6M9 9l6 6" />
					</svg>
				</div>
				<div class="stat-content">
					<span class="stat-value">{summary.absentDays}</span>
					<span class="stat-label">Absent</span>
				</div>
			</div>

			<div class="stat-item early-leave" in:fly={{ y: 10, delay: 250 }}>
				<div class="stat-icon">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
						<polyline points="16,17 21,12 16,7" />
						<line x1="21" y1="12" x2="9" y2="12" />
					</svg>
				</div>
				<div class="stat-content">
					<span class="stat-value">{summary.earlyLeaveDays}</span>
					<span class="stat-label">Early Leave</span>
				</div>
			</div>
		</div>

		<div class="progress-section">
			<div class="progress-label">
				<span>Attendance Rate</span>
				<span>{summary.presentDays + summary.lateDays} / {summary.totalDays} days</span>
			</div>
			<div class="progress-bar">
				<div
					class="progress-fill present"
					style="width: {getPercentage(summary.presentDays, summary.totalDays)}%"
				></div>
				<div
					class="progress-fill late"
					style="width: {getPercentage(summary.lateDays, summary.totalDays)}%"
				></div>
				<div
					class="progress-fill early-leave"
					style="width: {getPercentage(summary.earlyLeaveDays, summary.totalDays)}%"
				></div>
				<div
					class="progress-fill half-day"
					style="width: {getPercentage(summary.halfDays, summary.totalDays)}%"
				></div>
			</div>
		</div>

		<div class="time-stats">
			<div class="time-stat">
				<span class="time-label">Total Working Hours</span>
				<span class="time-value">{formatDuration(summary.totalWorkingHours)}</span>
			</div>
			<div class="time-divider"></div>
			<div class="time-stat">
				<span class="time-label">Avg. Daily Hours</span>
				<span class="time-value">{formatDuration(Math.round(summary.averageWorkingHours))}</span>
			</div>
			<div class="time-divider"></div>
			<div class="time-stat warning">
				<span class="time-label">Total Late</span>
				<span class="time-value">{formatDuration(summary.totalLateMinutes)}</span>
			</div>
		</div>
	</div>
{:else}
	<div class="empty-state" in:fade>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
			<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
			<line x1="16" y1="2" x2="16" y2="6" />
			<line x1="8" y1="2" x2="8" y2="6" />
			<line x1="3" y1="10" x2="21" y2="10" />
		</svg>
		<p>Select an employee to view their attendance summary</p>
	</div>
{/if}

<style lang="scss">
	@use '$styles/variables' as *;

	.summary-card {
		background: white;
		border-radius: $radius-xl;
		padding: $spacing-6;
		box-shadow: $shadow-md;
		border: 1px solid $neutral-100;
	}

	.card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: $spacing-6;
	}

	.employee-info {
		h3 {
			margin: 0 0 $spacing-1 0;
			font-size: $font-size-xl;
			font-weight: $font-weight-bold;
			color: $neutral-900;
		}
	}

	.month-label {
		font-size: $font-size-sm;
		color: $neutral-500;
	}

	.attendance-score {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: $spacing-3 $spacing-4;
		border-radius: $radius-xl;
		text-align: center;

		.score-value {
			font-size: $font-size-2xl;
			font-weight: $font-weight-bold;
			line-height: 1;
		}

		.score-label {
			font-size: $font-size-xs;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			margin-top: $spacing-1;
		}

		&.excellent {
			background: linear-gradient(135deg, $success-50 0%, $success-100 100%);
			.score-value { color: $success-600; }
			.score-label { color: $success-500; }
		}

		&.good {
			background: linear-gradient(135deg, $primary-50 0%, $primary-100 100%);
			.score-value { color: $primary-600; }
			.score-label { color: $primary-500; }
		}

		&.fair {
			background: linear-gradient(135deg, $warning-50 0%, $warning-100 100%);
			.score-value { color: $warning-600; }
			.score-label { color: $warning-500; }
		}
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: $spacing-4;
		margin-bottom: $spacing-6;

		@media (max-width: $breakpoint-md) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: $spacing-3;
		padding: $spacing-4;
		border-radius: $radius-lg;
		background: $neutral-50;

		&.present {
			background: rgba($success-500, 0.1);
			.stat-icon { color: $success-500; }
			.stat-value { color: $success-700; }
		}

		&.late {
			background: rgba($warning-500, 0.1);
			.stat-icon { color: $warning-500; }
			.stat-value { color: $warning-700; }
		}

		&.absent {
			background: rgba($danger-500, 0.1);
			.stat-icon { color: $danger-500; }
			.stat-value { color: $danger-700; }
		}

		&.early-leave {
			background: rgba($info-500, 0.1);
			.stat-icon { color: $info-500; }
			.stat-value { color: $info-700; }
		}
	}

	.stat-icon {
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
		font-size: $font-size-xl;
		font-weight: $font-weight-bold;
		line-height: 1;
	}

	.stat-label {
		font-size: $font-size-xs;
		color: $neutral-500;
		margin-top: 2px;
	}

	.progress-section {
		margin-bottom: $spacing-6;
	}

	.progress-label {
		display: flex;
		justify-content: space-between;
		font-size: $font-size-sm;
		color: $neutral-600;
		margin-bottom: $spacing-2;
	}

	.progress-bar {
		height: 8px;
		background: $neutral-200;
		border-radius: $radius-full;
		display: flex;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		transition: width 0.5s ease;

		&.present { background: $success-500; }
		&.late { background: $warning-500; }
		&.early-leave { background: $info-500; }
		&.half-day { background: $secondary-500; }
	}

	.time-stats {
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding: $spacing-4;
		background: $neutral-50;
		border-radius: $radius-lg;
	}

	.time-stat {
		text-align: center;

		&.warning {
			.time-value { color: $warning-600; }
		}
	}

	.time-label {
		display: block;
		font-size: $font-size-xs;
		color: $neutral-500;
		margin-bottom: $spacing-1;
	}

	.time-value {
		font-size: $font-size-lg;
		font-weight: $font-weight-bold;
		color: $neutral-800;
	}

	.time-divider {
		width: 1px;
		height: 40px;
		background: $neutral-200;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: $spacing-12;
		background: white;
		border-radius: $radius-xl;
		box-shadow: $shadow-md;
		border: 1px solid $neutral-100;
		text-align: center;

		svg {
			width: 64px;
			height: 64px;
			color: $neutral-300;
			margin-bottom: $spacing-4;
		}

		p {
			margin: 0;
			color: $neutral-500;
		}
	}
</style>
