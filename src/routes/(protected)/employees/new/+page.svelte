<!--
  New Employee Page
  Create a new employee
-->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import EmployeeForm from '$lib/components/employees/EmployeeForm.svelte';
	import { employees, isLoading } from '$lib/stores/employeesStore';
	import type { EmployeeFormData } from '$lib/types/employee';

	// Handle form submission
	const handleSubmit = async (data: EmployeeFormData) => {
		const newEmployee = await employees.create(data);
		if (newEmployee) {
			goto(`/employees/${newEmployee.id}`);
		}
	};

	// Handle cancel
	const handleCancel = () => {
		goto('/employees');
	};
</script>

<svelte:head>
	<title>Add Employee | HR Management System</title>
</svelte:head>

<div class="new-employee-page" in:fade={{ duration: 200 }}>
	<!-- Page Header -->
	<div class="page-header">
		<button class="back-button" onclick={handleCancel}>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M19 12H5m7-7l-7 7 7 7" />
			</svg>
			Back to Employees
		</button>

		<div class="header-content">
			<h1>Add New Employee</h1>
			<p>Fill in the information below to create a new employee record</p>
		</div>
	</div>

	<!-- Employee Form -->
	<EmployeeForm isLoading={$isLoading} onsubmit={handleSubmit} oncancel={handleCancel} />
</div>

<style lang="scss">
	@use '$styles/variables' as *;

	.new-employee-page {
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
</style>
