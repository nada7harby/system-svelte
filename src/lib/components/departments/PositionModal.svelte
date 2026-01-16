<!--
  PositionModal Component
  Modal for creating and editing positions within a department
-->
<script lang="ts">
	import type { Position, PositionFormData, PositionLevel } from '$lib/types/department';
	import { POSITION_LEVELS, formatPositionSalary } from '$lib/types/department';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';

	interface Props {
		isOpen: boolean;
		position?: Position | null;
		departmentName?: string;
		onclose: () => void;
		onsave: (data: PositionFormData) => void;
	}

	let { isOpen = false, position = null, departmentName = '', onclose, onsave }: Props = $props();

	// Form state
	let title = $state('');
	let level = $state<PositionLevel>('mid');
	let baseSalary = $state<number | undefined>(undefined);
	let description = $state('');

	// Form validation
	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);

	// Reset form when modal opens/closes or position changes
	$effect(() => {
		if (isOpen) {
			if (position) {
				title = position.title;
				level = position.level;
				baseSalary = position.baseSalary;
				description = position.description || '';
			} else {
				title = '';
				level = 'mid';
				baseSalary = undefined;
				description = '';
			}
			errors = {};
		}
	});

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!title.trim()) {
			newErrors.title = 'Position title is required';
		} else if (title.trim().length < 2) {
			newErrors.title = 'Position title must be at least 2 characters';
		}

		if (baseSalary !== undefined && baseSalary < 0) {
			newErrors.baseSalary = 'Salary cannot be negative';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		isSubmitting = true;

		const formData: PositionFormData = {
			title: title.trim(),
			level,
			baseSalary: baseSalary || undefined,
			description: description.trim() || undefined
		};

		onsave(formData);
		isSubmitting = false;
	};

	const isEditing = $derived(!!position);
	const modalTitle = $derived(isEditing ? 'Edit Position' : 'Add New Position');
</script>

<Modal {isOpen} title={modalTitle} size="md" {onclose}>
	<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="position-form">
		{#if departmentName}
			<div class="department-badge">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
				</svg>
				<span>{departmentName}</span>
			</div>
		{/if}

		<FormField label="Position Title" required error={errors.title}>
			<Input
				name="title"
				placeholder="e.g., Software Engineer, HR Manager"
				bind:value={title}
				hasError={!!errors.title}
			/>
		</FormField>

		<FormField label="Level" required>
			<div class="level-grid">
				{#each POSITION_LEVELS as levelOption}
					<button
						type="button"
						class="level-btn"
						class:active={level === levelOption.value}
						class:level-junior={levelOption.value === 'junior'}
						class:level-mid={levelOption.value === 'mid'}
						class:level-senior={levelOption.value === 'senior'}
						class:level-lead={levelOption.value === 'lead'}
						class:level-manager={levelOption.value === 'manager'}
						onclick={() => level = levelOption.value}
					>
						<span class="level-indicator"></span>
						<span class="level-label">{levelOption.label}</span>
					</button>
				{/each}
			</div>
		</FormField>

		<FormField label="Base Salary (Optional)" error={errors.baseSalary}>
			<Input
				name="baseSalary"
				type="number"
				placeholder="Enter base salary"
				bind:value={baseSalary}
				hasError={!!errors.baseSalary}
			>
				{#snippet icon()}
					<span class="currency-icon">$</span>
				{/snippet}
			</Input>
			{#if baseSalary}
				<p class="salary-preview">Formatted: {formatPositionSalary(baseSalary)}</p>
			{/if}
		</FormField>

		<FormField label="Description (Optional)">
			<textarea
				name="description"
				placeholder="Brief description of the position's responsibilities..."
				bind:value={description}
				class="textarea"
				rows="2"
			></textarea>
		</FormField>
	</form>

	{#snippet footer()}
		<Button variant="ghost" onclick={onclose} disabled={isSubmitting}>
			Cancel
		</Button>
		<Button variant="primary" onclick={handleSubmit} disabled={isSubmitting}>
			{#if isSubmitting}
				<span class="spinner"></span>
			{/if}
			{isEditing ? 'Save Changes' : 'Add Position'}
		</Button>
	{/snippet}
</Modal>

<style lang="scss">
	@use '$styles/variables' as *;

	.position-form {
		display: flex;
		flex-direction: column;
		gap: $spacing-5;
	}

	.department-badge {
		display: inline-flex;
		align-items: center;
		gap: $spacing-2;
		padding: $spacing-2 $spacing-3;
		background: $primary-50;
		border: 1px solid $primary-200;
		border-radius: $radius-lg;
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		color: $primary-700;

		svg {
			width: 16px;
			height: 16px;
		}
	}

	.level-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: $spacing-2;

		@media (max-width: $breakpoint-md) {
			grid-template-columns: repeat(3, 1fr);
		}

		@media (max-width: $breakpoint-sm) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.level-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $spacing-1;
		padding: $spacing-3 $spacing-2;
		border: 2px solid $neutral-200;
		border-radius: $radius-lg;
		background: white;
		cursor: pointer;
		transition: all $transition-fast;

		.level-indicator {
			width: 12px;
			height: 12px;
			border-radius: 50%;
			background: $neutral-300;
			transition: all $transition-fast;
		}

		.level-label {
			font-size: $font-size-xs;
			font-weight: $font-weight-medium;
			color: $neutral-600;
		}

		&:hover {
			border-color: $neutral-300;
			background: $neutral-50;
		}

		&.active {
			.level-label {
				font-weight: $font-weight-semibold;
			}
		}

		&.level-junior.active {
			border-color: $info-500;
			background: rgba($info-500, 0.05);
			.level-indicator { background: $info-500; }
			.level-label { color: $info-700; }
		}

		&.level-mid.active {
			border-color: $primary-500;
			background: rgba($primary-500, 0.05);
			.level-indicator { background: $primary-500; }
			.level-label { color: $primary-700; }
		}

		&.level-senior.active {
			border-color: $success-500;
			background: rgba($success-500, 0.05);
			.level-indicator { background: $success-500; }
			.level-label { color: $success-700; }
		}

		&.level-lead.active {
			border-color: $warning-500;
			background: rgba($warning-500, 0.05);
			.level-indicator { background: $warning-500; }
			.level-label { color: $warning-700; }
		}

		&.level-manager.active {
			border-color: $secondary-500;
			background: rgba($secondary-500, 0.05);
			.level-indicator { background: $secondary-500; }
			.level-label { color: $secondary-700; }
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

		&::placeholder {
			color: $neutral-400;
		}
	}

	.currency-icon {
		color: $neutral-500;
		font-weight: $font-weight-medium;
	}

	.salary-preview {
		margin: $spacing-1 0 0 0;
		font-size: $font-size-xs;
		color: $neutral-500;
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
