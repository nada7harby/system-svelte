<!--
  CheckInOutCard Component
  Card for employee check-in/check-out functionality
-->
<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { formatTime, formatDuration } from '$lib/types/attendance';

	interface Props {
		isCheckedIn: boolean;
		isCheckedOut: boolean;
		checkInTime?: string;
		checkOutTime?: string;
		workingHours?: number;
		lateMinutes?: number;
		disabled?: boolean;
		oncheckin?: () => void;
		oncheckout?: () => void;
	}

	let {
		isCheckedIn = false,
		isCheckedOut = false,
		checkInTime,
		checkOutTime,
		workingHours = 0,
		lateMinutes = 0,
		disabled = false,
		oncheckin,
		oncheckout
	}: Props = $props();

	// Current time display
	let currentTime = $state(new Date());

	$effect(() => {
		const interval = setInterval(() => {
			currentTime = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});

	const formatCurrentTime = (date: Date): string => {
		return date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: true
		});
	};

	const formatCurrentDate = (date: Date): string => {
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};
</script>

<div class="checkinout-card" in:fade={{ duration: 200 }}>
	<div class="time-display">
		<div class="current-time">{formatCurrentTime(currentTime)}</div>
		<div class="current-date">{formatCurrentDate(currentTime)}</div>
	</div>

	<div class="status-section">
		{#if !isCheckedIn}
			<div class="status-message waiting">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="10" />
					<polyline points="12,6 12,12 16,14" />
				</svg>
				<span>Ready to check in</span>
			</div>
		{:else if isCheckedIn && !isCheckedOut}
			<div class="status-message active" in:scale>
				<div class="pulse-dot"></div>
				<span>Working since {formatTime(checkInTime)}</span>
				{#if lateMinutes > 0}
					<Badge variant="warning" size="sm">Late by {formatDuration(lateMinutes)}</Badge>
				{/if}
			</div>
		{:else}
			<div class="status-message completed" in:scale>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
					<polyline points="22,4 12,14.01 9,11.01" />
				</svg>
				<span>Day completed</span>
			</div>
		{/if}
	</div>

	<div class="times-grid">
		<div class="time-item">
			<div class="time-label">Check In</div>
			<div class="time-value" class:empty={!checkInTime}>
				{#if checkInTime}
					<span class="time">{formatTime(checkInTime)}</span>
				{:else}
					<span class="placeholder">--:--</span>
				{/if}
			</div>
		</div>
		<div class="time-divider">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M5 12h14M12 5l7 7-7 7" />
			</svg>
		</div>
		<div class="time-item">
			<div class="time-label">Check Out</div>
			<div class="time-value" class:empty={!checkOutTime}>
				{#if checkOutTime}
					<span class="time">{formatTime(checkOutTime)}</span>
				{:else}
					<span class="placeholder">--:--</span>
				{/if}
			</div>
		</div>
	</div>

	{#if workingHours > 0}
		<div class="working-hours" in:fade>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10" />
				<polyline points="12,6 12,12 16,14" />
			</svg>
			<span>Total Working Hours: <strong>{formatDuration(workingHours)}</strong></span>
		</div>
	{/if}

	<div class="action-section">
		{#if !isCheckedIn}
			<Button
				variant="primary"
				size="lg"
				fullWidth
				onclick={oncheckin}
				{disabled}
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;">
					<path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
				</svg>
				Check In Now
			</Button>
		{:else if !isCheckedOut}
			<Button
				variant="secondary"
				size="lg"
				fullWidth
				onclick={oncheckout}
				{disabled}
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;">
					<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
				</svg>
				Check Out Now
			</Button>
		{:else}
			<div class="completed-badge">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
					<polyline points="22,4 12,14.01 9,11.01" />
				</svg>
				<span>Today's attendance recorded</span>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	@use '$styles/variables' as *;

	.checkinout-card {
		background: white;
		border-radius: $radius-xl;
		padding: $spacing-8;
		box-shadow: $shadow-md;
		border: 1px solid $neutral-100;
		text-align: center;
	}

	.time-display {
		margin-bottom: $spacing-6;
	}

	.current-time {
		font-size: 3rem;
		font-weight: $font-weight-bold;
		color: $neutral-900;
		line-height: 1;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
	}

	.current-date {
		font-size: $font-size-base;
		color: $neutral-500;
		margin-top: $spacing-2;
	}

	.status-section {
		margin-bottom: $spacing-6;
	}

	.status-message {
		display: inline-flex;
		align-items: center;
		gap: $spacing-2;
		padding: $spacing-2 $spacing-4;
		border-radius: $radius-full;
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;

		svg {
			width: 18px;
			height: 18px;
		}

		&.waiting {
			background: $neutral-100;
			color: $neutral-600;
		}

		&.active {
			background: $success-100;
			color: $success-700;
		}

		&.completed {
			background: $primary-100;
			color: $primary-700;
		}
	}

	.pulse-dot {
		width: 10px;
		height: 10px;
		background: $success-500;
		border-radius: 50%;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 rgba($success-500, 0.7);
		}
		70% {
			box-shadow: 0 0 0 8px rgba($success-500, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba($success-500, 0);
		}
	}

	.times-grid {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: $spacing-6;
		margin-bottom: $spacing-6;
		padding: $spacing-6;
		background: $neutral-50;
		border-radius: $radius-xl;
	}

	.time-item {
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
		.time {
			font-size: $font-size-2xl;
			font-weight: $font-weight-bold;
			color: $neutral-900;
			font-variant-numeric: tabular-nums;
		}

		.placeholder {
			font-size: $font-size-2xl;
			font-weight: $font-weight-bold;
			color: $neutral-300;
		}

		&.empty {
			opacity: 0.6;
		}
	}

	.time-divider {
		svg {
			width: 24px;
			height: 24px;
			color: $neutral-300;
		}
	}

	.working-hours {
		display: inline-flex;
		align-items: center;
		gap: $spacing-2;
		padding: $spacing-3 $spacing-5;
		background: $primary-50;
		border: 1px solid $primary-200;
		border-radius: $radius-lg;
		font-size: $font-size-sm;
		color: $primary-700;
		margin-bottom: $spacing-6;

		svg {
			width: 18px;
			height: 18px;
		}

		strong {
			font-weight: $font-weight-bold;
		}
	}

	.action-section {
		max-width: 300px;
		margin: 0 auto;
	}

	.completed-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: $spacing-2;
		padding: $spacing-4;
		background: linear-gradient(135deg, $success-50 0%, $success-100 100%);
		border: 1px solid $success-200;
		border-radius: $radius-xl;
		color: $success-700;
		font-weight: $font-weight-medium;

		svg {
			width: 22px;
			height: 22px;
			color: $success-500;
		}
	}
</style>
