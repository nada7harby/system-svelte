<!--
  AttendanceOverrideModal Component
  Modal for HR to manually override attendance records
-->
<script lang="ts">
	import type { AttendanceRecord, AttendanceOverrideData, AttendanceStatus, OverrideReason } from '$lib/types/attendance';
	import { ATTENDANCE_STATUSES, OVERRIDE_REASONS, formatTime } from '$lib/types/attendance';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	interface Props {
		isOpen: boolean;
		record: AttendanceRecord | null;
		overrideBy: string;
		onclose: () => void;
		onsave: (data: AttendanceOverrideData) => void;
	}

	let { isOpen = false, record = null, overrideBy = '', onclose, onsave }: Props = $props();

	// Form state
	let checkIn = $state('');
	let checkOut = $state('');
	let status = $state<AttendanceStatus>('present');
	let reason = $state<OverrideReason>('correction');
	let notes = $state('');

	// Form validation
	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);

	// Reset form when modal opens
	$effect(() => {
		if (isOpen && record) {
			// Extract time from ISO string
			checkIn = record.checkIn ? formatTime(record.checkIn) : '';
			checkOut = record.checkOut ? formatTime(record.checkOut) : '';
			status = record.status;
			reason = 'correction';
			notes = '';
			errors = {};
		}
	});

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!reason) {
			newErrors.reason = 'Please select a reason for the override';
		}

		if (!notes.trim()) {
			newErrors.notes = 'Please provide notes explaining the override';
		} else if (notes.trim().length < 10) {
			newErrors.notes = 'Notes must be at least 10 characters';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (!validateForm() || !record) return;

		isSubmitting = true;

		// Convert time inputs to ISO strings
		let checkInTimestamp: string | undefined;
		let checkOutTimestamp: string | undefined;

		if (checkIn) {
			const [hours, minutes] = checkIn.split(':').map(Number);
			const date = new Date(record.date);
			date.setHours(hours, minutes, 0, 0);
			checkInTimestamp = date.toISOString();
		}

		if (checkOut) {
			const [hours, minutes] = checkOut.split(':').map(Number);
			const date = new Date(record.date);
			date.setHours(hours, minutes, 0, 0);
			checkOutTimestamp = date.toISOString();
		}

		const data: AttendanceOverrideData = {
			attendanceId: record.id,
			checkIn: checkInTimestamp,
			checkOut: checkOutTimestamp,
			status,
			reason,
			notes: notes.trim(),
			overrideBy
		};

		onsave(data);
		isSubmitting = false;
	};

	// Get badge color for status
	const getStatusColor = (s: AttendanceStatus): 'success' | 'warning' | 'danger' | 'info' | 'secondary' => {
		const colorMap: Record<AttendanceStatus, 'success' | 'warning' | 'danger' | 'info' | 'secondary'> = {
			'present': 'success',
			'late': 'warning',
			'absent': 'danger',
			'early-leave': 'info',
			'half-day': 'secondary'
		};
		return colorMap[s];
	};
</script>

<Modal {isOpen} title="Override Attendance Record" size="lg" {onclose}>
	{#if record}
		<div class="override-form">
			<!-- Record Info -->
			<div class="record-info">
				<div class="info-row">
					<span class="info-label">Employee:</span>
					<span class="info-value">{record.employeeName}</span>
				</div>
				<div class="info-row">
					<span class="info-label">Date:</span>
					<span class="info-value">
						{new Date(record.date).toLocaleDateString('en-US', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					</span>
				</div>
				<div class="info-row">
					<span class="info-label">Current Status:</span>
					<Badge variant={getStatusColor(record.status)}>
						{ATTENDANCE_STATUSES.find(s => s.value === record.status)?.label}
					</Badge>
				</div>
			</div>

			<!-- Time Override -->
			<div class="form-section">
				<h4 class="section-title">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10" />
						<polyline points="12,6 12,12 16,14" />
					</svg>
					Override Times
				</h4>
				<div class="time-inputs">
					<FormField label="Check-In Time">
						<Input
							name="checkIn"
							type="time"
							bind:value={checkIn}
						/>
					</FormField>
					<FormField label="Check-Out Time">
						<Input
							name="checkOut"
							type="time"
							bind:value={checkOut}
						/>
					</FormField>
				</div>
			</div>

			<!-- Status Override -->
			<div class="form-section">
				<h4 class="section-title">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M9 11l3 3L22 4" />
						<path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
					</svg>
					Override Status
				</h4>
				<div class="status-grid">
					{#each ATTENDANCE_STATUSES as statusOption}
						<button
							type="button"
							class="status-btn"
							class:active={status === statusOption.value}
							class:status-success={statusOption.value === 'present'}
							class:status-warning={statusOption.value === 'late'}
							class:status-danger={statusOption.value === 'absent'}
							class:status-info={statusOption.value === 'early-leave'}
							class:status-secondary={statusOption.value === 'half-day'}
							onclick={() => status = statusOption.value}
						>
							<span class="status-dot"></span>
							{statusOption.label}
						</button>
					{/each}
				</div>
			</div>

			<!-- Override Reason -->
			<div class="form-section">
				<h4 class="section-title">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
					</svg>
					Override Details
				</h4>
				<FormField label="Reason" required error={errors.reason}>
					<select
						bind:value={reason}
						class="select-input"
						class:has-error={!!errors.reason}
					>
						{#each OVERRIDE_REASONS as reasonOption}
							<option value={reasonOption.value}>{reasonOption.label}</option>
						{/each}
					</select>
				</FormField>
				<FormField label="Notes" required error={errors.notes}>
					<textarea
						bind:value={notes}
						placeholder="Explain why this override is needed..."
						class="textarea"
						class:has-error={!!errors.notes}
						rows="3"
					></textarea>
				</FormField>
			</div>

			<!-- Warning -->
			<div class="warning-notice">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
					<line x1="12" y1="9" x2="12" y2="13" />
					<line x1="12" y1="17" x2="12.01" y2="17" />
				</svg>
				<p>This action will be logged and cannot be undone. The original record will be marked as overridden.</p>
			</div>
		</div>
	{/if}

	{#snippet footer()}
		<Button variant="ghost" onclick={onclose} disabled={isSubmitting}>
			Cancel
		</Button>
		<Button variant="warning" onclick={handleSubmit} disabled={isSubmitting}>
			{#if isSubmitting}
				<span class="spinner"></span>
			{/if}
			Confirm Override
		</Button>
	{/snippet}
</Modal>

<style lang="scss">
	@use '$styles/variables' as *;

	.override-form {
		display: flex;
		flex-direction: column;
		gap: $spacing-6;
	}

	.record-info {
		background: $neutral-50;
		border-radius: $radius-lg;
		padding: $spacing-4;
		display: flex;
		flex-direction: column;
		gap: $spacing-2;
	}

	.info-row {
		display: flex;
		align-items: center;
		gap: $spacing-2;
	}

	.info-label {
		font-size: $font-size-sm;
		color: $neutral-500;
		min-width: 100px;
	}

	.info-value {
		font-weight: $font-weight-medium;
		color: $neutral-800;
	}

	.form-section {
		display: flex;
		flex-direction: column;
		gap: $spacing-4;
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: $spacing-2;
		margin: 0;
		font-size: $font-size-sm;
		font-weight: $font-weight-semibold;
		color: $neutral-700;

		svg {
			width: 18px;
			height: 18px;
			color: $neutral-500;
		}
	}

	.time-inputs {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: $spacing-4;
	}

	.status-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: $spacing-2;

		@media (max-width: $breakpoint-md) {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.status-btn {
		display: flex;
		align-items: center;
		gap: $spacing-2;
		padding: $spacing-2 $spacing-3;
		border: 2px solid $neutral-200;
		border-radius: $radius-lg;
		background: white;
		font-size: $font-size-sm;
		cursor: pointer;
		transition: all $transition-fast;

		.status-dot {
			width: 8px;
			height: 8px;
			border-radius: 50%;
			background: $neutral-300;
		}

		&:hover {
			border-color: $neutral-300;
		}

		&.active {
			font-weight: $font-weight-medium;
		}

		&.status-success.active {
			border-color: $success-500;
			background: rgba($success-500, 0.05);
			.status-dot { background: $success-500; }
		}

		&.status-warning.active {
			border-color: $warning-500;
			background: rgba($warning-500, 0.05);
			.status-dot { background: $warning-500; }
		}

		&.status-danger.active {
			border-color: $danger-500;
			background: rgba($danger-500, 0.05);
			.status-dot { background: $danger-500; }
		}

		&.status-info.active {
			border-color: $info-500;
			background: rgba($info-500, 0.05);
			.status-dot { background: $info-500; }
		}

		&.status-secondary.active {
			border-color: $secondary-500;
			background: rgba($secondary-500, 0.05);
			.status-dot { background: $secondary-500; }
		}
	}

	.select-input {
		width: 100%;
		padding: $spacing-3;
		border: 1px solid $neutral-300;
		border-radius: $radius-lg;
		font-family: inherit;
		font-size: $font-size-base;
		background: white;
		cursor: pointer;
		transition: all $transition-fast;

		&:focus {
			outline: none;
			border-color: $primary-500;
			box-shadow: 0 0 0 3px rgba($primary-500, 0.15);
		}

		&.has-error {
			border-color: $danger-500;
		}
	}

	.textarea {
		width: 100%;
		padding: $spacing-3;
		border: 1px solid $neutral-300;
		border-radius: $radius-lg;
		font-family: inherit;
		font-size: $font-size-base;
		line-height: $line-height-relaxed;
		resize: vertical;
		transition: all $transition-fast;

		&:focus {
			outline: none;
			border-color: $primary-500;
			box-shadow: 0 0 0 3px rgba($primary-500, 0.15);
		}

		&.has-error {
			border-color: $danger-500;
		}

		&::placeholder {
			color: $neutral-400;
		}
	}

	.warning-notice {
		display: flex;
		gap: $spacing-3;
		padding: $spacing-4;
		background: rgba($warning-500, 0.1);
		border: 1px solid $warning-200;
		border-radius: $radius-lg;

		svg {
			width: 20px;
			height: 20px;
			color: $warning-600;
			flex-shrink: 0;
		}

		p {
			margin: 0;
			font-size: $font-size-sm;
			color: $warning-700;
			line-height: $line-height-relaxed;
		}
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
		margin-right: $spacing-2;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
