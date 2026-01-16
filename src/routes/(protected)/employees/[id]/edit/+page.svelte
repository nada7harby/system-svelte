<!--
  Edit Employee Page
  Edit an existing employee
-->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import EmployeeForm from '$lib/components/employees/EmployeeForm.svelte';
	import { employees, isLoading, selectedEmployee } from '$lib/stores/employeesStore';
	import type { EmployeeFormData, Employee } from '$lib/types/employee';
	import { getFullName } from '$lib/types/employee';

	// Get employee ID from route params
	const employeeId = $derived($page.params.id);

	// Load employee data
	let employee: Employee | null = $state(null);
	let loadError = $state(false);

	onMount(async () => {
		employee = await employees.getById(employeeId);
		if (!employee) {
			loadError = true;
		}
	});

	// Handle form submission
	const handleSubmit = async (data: EmployeeFormData) => {
		const updated = await employees.update(employeeId, data);
		if (updated) {
			goto(`/employees/${employeeId}`);
		}
	};

	// Handle cancel
	const handleCancel = () => {
		goto(`/employees/${employeeId}`);
	};

	// Go back to employees list
	const goToList = () => {
		goto('/employees');
	};
</script>

<svelte:head>
	<title>{employee ? `Edit ${getFullName(employee)}` : 'Edit Employee'} | HR Management System</title>
</svelte:head>

<div class="edit-employee-page" in:fade={{ duration: 200 }}>
	{#if loadError}
		<div class="error-state">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10" />
				<line x1="12" y1="8" x2="12" y2="12" />
				<line x1="12" y1="16" x2="12.01" y2="16" />
			</svg>
			<h2>Employee Not Found</h2>
			<p>The employee you're trying to edit doesn't exist or has been deleted.</p>
			<button class="back-link" onclick={goToList}>
				← Back to Employees
			</button>
		</div>
	{:else if !employee}
		<div class="loading-state">
			<div class="spinner"></div>
			<span>Loading employee data...</span>
		</div>
	{:else}
		<!-- Page Header -->
		<div class="page-header">
			<button class="back-button" onclick={handleCancel}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M19 12H5m7-7l-7 7 7 7" />
				</svg>
				Back to Profile
			</button>

			<div class="header-content">
				<h1>Edit Employee</h1>
				<p>Update {getFullName(employee)}'s information</p>
			</div>
		</div>

		<!-- Employee Form -->
		<EmployeeForm {employee} isLoading={$isLoading} onsubmit={handleSubmit} oncancel={handleCancel} />
	{/if}
</div>

<style lang="scss">
	@use '$styles/variables' as *;

	.edit-employee-page {
		max-width: 900px;
		margin: 0 auto;
	}

	.page-header {
		margin-bottom: $spacing-6;
	}

	.back-button {
		display: inline-flex;
		align-items: center;
		gap: $spacing-2;
		padding: $spacing-2 $spacing-3;
		margin-bottom: $spacing-4;
		background: transparent;
		border: none;
		color: $neutral-600;
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		cursor: pointer;
		border-radius: $radius-lg;
		transition: all $transition-fast;

		svg {
			width: 18px;
			height: 18px;
		}

		&:hover {
			background: $neutral-100;
			color: $neutral-900;
		}
	}

	.header-content {
		h1 {
			font-size: $font-size-2xl;
			color: $neutral-900;
			margin: 0 0 $spacing-2 0;
		}

		p {
			color: $neutral-500;
			margin: 0;
		}
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 300px;
		gap: $spacing-4;
		color: $neutral-500;

		.spinner {
			width: 40px;
			height: 40px;
			border: 3px solid $neutral-200;
			border-top-color: $primary-500;
			border-radius: 50%;
			animation: spin 0.8s linear infinite;
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 400px;
		text-align: center;
		gap: $spacing-4;

		svg {
			width: 64px;
			height: 64px;
			color: $error-400;
		}

		h2 {
			font-size: $font-size-xl;
			color: $neutral-900;
			margin: 0;
		}

		p {
			color: $neutral-500;
			margin: 0;
			max-width: 400px;
		}

		.back-link {
			background: none;
			border: none;
			color: $primary-600;
			font-size: $font-size-sm;
			font-weight: $font-weight-medium;
			cursor: pointer;

			&:hover {
				text-decoration: underline;
			}
		}
	}
</style>
