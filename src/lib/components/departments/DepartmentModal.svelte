<!--
  DepartmentModal Component
  Modal for creating and editing departments
-->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Department, DepartmentFormData, DepartmentStatus } from '$lib/types/department';
	import { DEPARTMENT_STATUSES } from '$lib/types/department';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';

	interface Props {
		isOpen: boolean;
		department?: Department | null;
		onclose: () => void;
		onsave: (data: DepartmentFormData) => void;
	}

	let { isOpen = false, department = null, onclose, onsave }: Props = $props();

	// Form state
	let name = $state('');
	let description = $state('');
	let status = $state<DepartmentStatus>('active');
	let location = $state('');
	let budget = $state<number | undefined>(undefined);

	// Form validation
	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);

	// Reset form when modal opens/closes or department changes
	$effect(() => {
		if (isOpen) {
			if (department) {
				name = department.name;
				description = department.description;
				status = department.status;
				location = department.location || '';
				budget = department.budget;
			} else {
				name = '';
				description = '';
				status = 'active';
				location = '';
				budget = undefined;
			}
			errors = {};
		}
	});

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!name.trim()) {
			newErrors.name = 'Department name is required';
		} else if (name.trim().length < 2) {
			newErrors.name = 'Department name must be at least 2 characters';
		}

		if (!description.trim()) {
			newErrors.description = 'Description is required';
		}

		if (budget !== undefined && budget < 0) {
			newErrors.budget = 'Budget cannot be negative';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		isSubmitting = true;

		const formData: DepartmentFormData = {
			name: name.trim(),
			description: description.trim(),
			status,
			location: location.trim() || undefined,
			budget: budget || undefined
		};

		onsave(formData);
		isSubmitting = false;
	};

	const isEditing = $derived(!!department);
	const modalTitle = $derived(isEditing ? 'Edit Department' : 'Create New Department');
</script>

<Modal {isOpen} title={modalTitle} size="md" {onclose}>
	<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="department-form">
		<FormField label="Department Name" required error={errors.name}>
			<Input
				name="name"
				placeholder="e.g., Engineering, Marketing"
				bind:value={name}
				hasError={!!errors.name}
			/>
		</FormField>

		<FormField label="Description" required error={errors.description}>
			<textarea
				name="description"
				placeholder="Brief description of the department's responsibilities..."
				bind:value={description}
				class="textarea"
				class:has-error={!!errors.description}
				rows="3"
			></textarea>
		</FormField>

		<div class="form-row">
			<FormField label="Status" required>
				<div class="status-buttons">
					{#each DEPARTMENT_STATUSES as statusOption}
						<button
							type="button"
							class="status-btn"
							class:active={status === statusOption.value}
							class:status-active={statusOption.value === 'active'}
							class:status-inactive={statusOption.value === 'inactive'}
							onclick={() => status = statusOption.value}
						>
							<span class="status-dot"></span>
							{statusOption.label}
						</button>
					{/each}
				</div>
			</FormField>
		</div>

		<div class="form-row">
			<FormField label="Location">
				<Input
					name="location"
					placeholder="e.g., Building A, Floor 3"
					bind:value={location}
				/>
			</FormField>

			<FormField label="Budget" error={errors.budget}>
				<Input
					name="budget"
					type="number"
					placeholder="0"
					bind:value={budget}
					hasError={!!errors.budget}
				>
					{#snippet icon()}
						<span class="currency-icon">$</span>
					{/snippet}
				</Input>
			</FormField>
		</div>
	</form>

	{#snippet footer()}
		<Button variant="ghost" onclick={onclose} disabled={isSubmitting}>
			Cancel
		</Button>
		<Button variant="primary" onclick={handleSubmit} disabled={isSubmitting}>
			{#if isSubmitting}
				<span class="spinner"></span>
			{/if}
			{isEditing ? 'Save Changes' : 'Create Department'}
		</Button>
	{/snippet}
</Modal>

<style lang="scss">
	@use '$styles/variables' as *;

	.department-form {
		display: flex;
		flex-direction: column;
		gap: $spacing-5;
	}

	.form-row {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: $spacing-4;

		@media (max-width: $breakpoint-sm) {
			grid-template-columns: 1fr;
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

	.status-buttons {
		display: flex;
		gap: $spacing-2;
	}

	.status-btn {
		display: flex;
		align-items: center;
		gap: $spacing-2;
		padding: $spacing-2 $spacing-4;
		border: 1px solid $neutral-300;
		border-radius: $radius-lg;
		background: white;
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		cursor: pointer;
		transition: all $transition-fast;

		.status-dot {
			width: 8px;
			height: 8px;
			border-radius: 50%;
			background: $neutral-400;
		}

		&:hover {
			border-color: $neutral-400;
			background: $neutral-50;
		}

		&.active {
			border-width: 2px;
		}

		&.status-active.active {
			border-color: $success-500;
			background: rgba($success-500, 0.05);
			color: $success-700;

			.status-dot {
				background: $success-500;
			}
		}

		&.status-inactive.active {
			border-color: $danger-500;
			background: rgba($danger-500, 0.05);
			color: $danger-700;

			.status-dot {
				background: $danger-500;
			}
		}
	}

	.currency-icon {
		color: $neutral-500;
		font-weight: $font-weight-medium;
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
