<!--
  Employees List Page
  Enhanced employee listing with search, filters, pagination, and soft delete
-->
<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import CSVImport from '$lib/components/employees/CSVImport.svelte';
	import {
		employees,
		employeeFilters,
		pagination,
		paginatedEmployees,
		isLoading,
		filtersStore,
		employeeStats
	} from '$lib/stores/employeesStore';
	import { DEPARTMENTS, getFullName, formatSalary } from '$lib/types/employee';
	import type { Employee, EmployeeFormData, CSVImportResult } from '$lib/types/employee';

	// Initialize store on mount
	$effect(() => {
		employees.init();
	});

	// Local state for filters
	let searchQuery = $state($filtersStore.searchQuery);
	let selectedDepartment = $state($filtersStore.department);
	let selectedStatus = $state($filtersStore.status);
	let showDeleted = $state($filtersStore.showDeleted);

	// Modal states
	let deleteModalEmployee: Employee | null = $state(null);
	let showCSVImport = $state(false);

	// Debounced search
	let searchTimeout: ReturnType<typeof setTimeout>;
	$effect(() => {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			employeeFilters.setSearchQuery(searchQuery);
		}, 300);
		return () => clearTimeout(searchTimeout);
	});

	// Update filters when local state changes
	$effect(() => {
		employeeFilters.setDepartment(selectedDepartment);
	});

	$effect(() => {
		employeeFilters.setStatus(selectedStatus);
	});

	// Get status badge variant
	const getStatusVariant = (status: string): 'success' | 'warning' | 'neutral' => {
		switch (status) {
			case 'active':
				return 'success';
			case 'on-leave':
				return 'warning';
			case 'resigned':
				return 'neutral';
			default:
				return 'neutral';
		}
	};

	// Format status text
	const formatStatus = (status: string): string => {
		return status.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
	};

	// Handle delete
	const handleDelete = async () => {
		if (!deleteModalEmployee) return;

		await employees.softDelete(deleteModalEmployee.id);
		deleteModalEmployee = null;
	};

	// Handle restore
	const handleRestore = async (id: string) => {
		await employees.restore(id);
	};

	// Handle permanent delete
	const handlePermanentDelete = async (id: string) => {
		await employees.permanentDelete(id);
	};

	// Handle CSV import
	const handleCSVImport = async (data: EmployeeFormData[]): Promise<CSVImportResult> => {
		return await employees.bulkImport(data);
	};

	// Reset filters
	const handleResetFilters = () => {
		searchQuery = '';
		selectedDepartment = 'all';
		selectedStatus = 'all';
		showDeleted = false;
		employeeFilters.reset();
	};

	// Toggle show deleted
	const toggleShowDeleted = () => {
		showDeleted = !showDeleted;
		employeeFilters.toggleShowDeleted();
	};
</script>

<svelte:head>
	<title>Employees | HR Management System</title>
</svelte:head>

<div class="employees-page" in:fade={{ duration: 200 }}>
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<h1>Employees</h1>
			<p>Manage your organization's workforce</p>
		</div>
		<div class="header-actions">
			<Button variant="outline" onclick={() => (showCSVImport = true)}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;">
					<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
					<polyline points="17 8 12 3 7 8" />
					<line x1="12" y1="3" x2="12" y2="15" />
				</svg>
				Import CSV
			</Button>
			<Button variant="primary" onclick={() => goto('/employees/new')}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;">
					<path d="M12 5v14m-7-7h14" />
				</svg>
				Add Employee
			</Button>
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="stats-row" in:fly={{ y: 20, delay: 100, duration: 300 }}>
		<div class="stat-card">
			<span class="stat-value">{$employeeStats.total}</span>
			<span class="stat-label">Total</span>
		</div>
		<div class="stat-card success">
			<span class="stat-value">{$employeeStats.active}</span>
			<span class="stat-label">Active</span>
		</div>
		<div class="stat-card warning">
			<span class="stat-value">{$employeeStats.onLeave}</span>
			<span class="stat-label">On Leave</span>
		</div>
		<div class="stat-card neutral">
			<span class="stat-value">{$employeeStats.resigned}</span>
			<span class="stat-label">Resigned</span>
		</div>
		{#if $employeeStats.deleted > 0}
			<div class="stat-card error">
				<span class="stat-value">{$employeeStats.deleted}</span>
				<span class="stat-label">Deleted</span>
			</div>
		{/if}
	</div>

	<!-- Filters Section -->
	<div class="filters-section" in:fly={{ y: 20, delay: 200, duration: 300 }}>
		<div class="search-wrapper">
			<Input
				type="search"
				name="search"
				placeholder="Search by name, email, job title..."
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

		<div class="filter-controls">
			<div class="filter-group">
				<label for="department-filter">Department</label>
				<select id="department-filter" bind:value={selectedDepartment}>
					<option value="all">All Departments</option>
					{#each DEPARTMENTS as dept}
						<option value={dept}>{dept}</option>
					{/each}
				</select>
			</div>

			<div class="filter-group">
				<label for="status-filter">Status</label>
				<select id="status-filter" bind:value={selectedStatus}>
					<option value="all">All Status</option>
					<option value="active">Active</option>
					<option value="on-leave">On Leave</option>
					<option value="resigned">Resigned</option>
				</select>
			</div>

			<label class="show-deleted-toggle">
				<input type="checkbox" bind:checked={showDeleted} onchange={toggleShowDeleted} />
				<span>Show deleted</span>
			</label>

			<button class="reset-btn" onclick={handleResetFilters}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
				</svg>
				Reset
			</button>
		</div>
	</div>

	<!-- Employees Table -->
	<div class="table-wrapper" in:fly={{ y: 20, delay: 300, duration: 300 }}>
		{#if $isLoading}
			<div class="loading-overlay">
				<div class="spinner"></div>
			</div>
		{/if}

		<table class="employees-table">
			<thead>
				<tr>
					<th>Employee</th>
					<th>Job Title</th>
					<th>Department</th>
					<th>Salary</th>
					<th>Status</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#if $paginatedEmployees.length === 0}
					<tr class="empty-row">
						<td colspan="6">
							<div class="empty-state">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
									<path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
								</svg>
								<span>No employees found</span>
								<p>Try adjusting your search or filter criteria</p>
							</div>
						</td>
					</tr>
				{:else}
					{#each $paginatedEmployees as employee, index (employee.id)}
						<tr
							class="employee-row"
							class:deleted={employee.isDeleted}
							style="--index: {index}"
						>
							<td>
								<a href="/employees/{employee.id}" class="employee-cell">
									<Avatar
										src={employee.profilePicture}
										name={getFullName(employee)}
										status={employee.status}
										showStatus
									/>
									<div class="employee-info">
										<span class="employee-name">{getFullName(employee)}</span>
										<span class="employee-email">{employee.email}</span>
									</div>
								</a>
							</td>
							<td>{employee.jobTitle}</td>
							<td>
								<span class="department-badge">{employee.department}</span>
							</td>
							<td>
								<span class="salary">{formatSalary(employee.salary)}</span>
							</td>
							<td>
								{#if employee.isDeleted}
									<Badge variant="error" text="Deleted" />
								{:else}
									<Badge variant={getStatusVariant(employee.status)} text={formatStatus(employee.status)} />
								{/if}
							</td>
							<td>
								<div class="action-buttons">
									{#if employee.isDeleted}
										<button class="action-btn restore" title="Restore" onclick={() => handleRestore(employee.id)}>
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9" />
											</svg>
										</button>
										<button class="action-btn delete" title="Permanent Delete" onclick={() => handlePermanentDelete(employee.id)}>
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										</button>
									{:else}
										<a href="/employees/{employee.id}" class="action-btn view" title="View Profile">
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												<path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
											</svg>
										</a>
										<a href="/employees/{employee.id}/edit" class="action-btn edit" title="Edit">
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
											</svg>
										</a>
										<button class="action-btn delete" title="Delete" onclick={() => (deleteModalEmployee = employee)}>
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										</button>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>

		{#if $pagination.totalItems > 0}
			<Pagination
				pagination={$pagination}
				onpagechange={(page) => pagination.setPage(page)}
				onpagesizechange={(size) => pagination.setPageSize(size)}
			/>
		{/if}
	</div>
</div>

<!-- Delete Confirmation Modal -->
<Modal isOpen={!!deleteModalEmployee} title="Delete Employee" size="sm" onclose={() => (deleteModalEmployee = null)}>
	<p class="confirm-text">
		Are you sure you want to delete <strong>{deleteModalEmployee ? getFullName(deleteModalEmployee) : ''}</strong>?
		This employee will be soft-deleted and can be restored later.
	</p>

	{#snippet footer()}
		<Button variant="ghost" onclick={() => (deleteModalEmployee = null)}>Cancel</Button>
		<Button variant="danger" onclick={handleDelete} loading={$isLoading}>Delete</Button>
	{/snippet}
</Modal>

<!-- CSV Import Modal -->
<CSVImport
	isOpen={showCSVImport}
	onclose={() => (showCSVImport = false)}
	onimport={handleCSVImport}
/>

<style lang="scss">
	@use '$styles/variables' as *;

	.employees-page {
		max-width: $content-max-width;
		margin: 0 auto;
	}

	// Page Header
	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: $spacing-6;
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
			gap: $spacing-3;
		}
	}

	// Stats Row
	.stats-row {
		display: flex;
		gap: $spacing-4;
		margin-bottom: $spacing-6;
		overflow-x: auto;
		padding-bottom: $spacing-2;
	}

	.stat-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: $spacing-4 $spacing-6;
		background: white;
		border-radius: $radius-lg;
		border: 1px solid $neutral-200;
		min-width: 100px;

		.stat-value {
			font-size: $font-size-2xl;
			font-weight: $font-weight-bold;
			color: $neutral-900;
		}

		.stat-label {
			font-size: $font-size-sm;
			color: $neutral-500;
		}

		&.success .stat-value {
			color: $success-600;
		}

		&.warning .stat-value {
			color: $warning-600;
		}

		&.neutral .stat-value {
			color: $neutral-500;
		}

		&.error .stat-value {
			color: $error-600;
		}
	}

	// Filters Section
	.filters-section {
		background: white;
		border-radius: $radius-xl;
		padding: $spacing-5;
		box-shadow: $shadow-md;
		border: 1px solid $neutral-100;
		margin-bottom: $spacing-6;
	}

	.search-wrapper {
		margin-bottom: $spacing-4;
	}

	.filter-controls {
		display: flex;
		align-items: flex-end;
		gap: $spacing-4;
		flex-wrap: wrap;
	}

	.filter-group {
		display: flex;
		flex-direction: column;
		gap: $spacing-2;
		min-width: 150px;

		label {
			font-size: $font-size-sm;
			font-weight: $font-weight-medium;
			color: $neutral-700;
		}

		select {
			padding: $spacing-2 $spacing-8 $spacing-2 $spacing-3;
			border: 1px solid $neutral-200;
			border-radius: $radius-lg;
			font-size: $font-size-sm;
			cursor: pointer;
			background: white;
			appearance: none;
			background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371717a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
			background-repeat: no-repeat;
			background-position: right $spacing-2 center;
			background-size: 16px;

			&:focus {
				outline: none;
				border-color: $primary-500;
			}
		}
	}

	.show-deleted-toggle {
		display: flex;
		align-items: center;
		gap: $spacing-2;
		cursor: pointer;
		font-size: $font-size-sm;
		color: $neutral-600;

		input[type='checkbox'] {
			width: 16px;
			height: 16px;
			accent-color: $primary-500;
		}
	}

	.reset-btn {
		display: flex;
		align-items: center;
		gap: $spacing-2;
		padding: $spacing-2 $spacing-4;
		background: $neutral-100;
		border: none;
		border-radius: $radius-lg;
		font-size: $font-size-sm;
		color: $neutral-600;
		cursor: pointer;
		transition: all $transition-fast;

		svg {
			width: 16px;
			height: 16px;
		}

		&:hover {
			background: $neutral-200;
		}
	}

	// Table
	.table-wrapper {
		background: white;
		border-radius: $radius-xl;
		box-shadow: $shadow-md;
		border: 1px solid $neutral-100;
		overflow: hidden;
		position: relative;
	}

	.loading-overlay {
		position: absolute;
		inset: 0;
		background: rgba(255, 255, 255, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;

		.spinner {
			width: 32px;
			height: 32px;
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

	.employees-table {
		width: 100%;
		border-collapse: collapse;
	}

	thead tr {
		background: linear-gradient(135deg, $neutral-50 0%, $neutral-100 100%);
		border-bottom: 2px solid $neutral-200;
	}

	thead th {
		padding: $spacing-4 $spacing-5;
		text-align: left;
		font-size: $font-size-xs;
		font-weight: $font-weight-semibold;
		color: $neutral-600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	tbody {
		.employee-row {
			border-bottom: 1px solid $neutral-100;
			animation: fadeInRow 0.3s ease forwards;
			animation-delay: calc(var(--index) * 30ms);
			opacity: 0;
			transition: background $transition-fast;

			&:last-child {
				border-bottom: none;
			}

			&:hover {
				background: $neutral-50;
			}

			&.deleted {
				background: $error-50;
				opacity: 0.7;

				&:hover {
					opacity: 1;
				}
			}
		}

		td {
			padding: $spacing-4 $spacing-5;
			vertical-align: middle;
		}
	}

	@keyframes fadeInRow {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.employee-cell {
		display: flex;
		align-items: center;
		gap: $spacing-3;
		text-decoration: none;
		color: inherit;

		&:hover .employee-name {
			color: $primary-600;
		}
	}

	.employee-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.employee-name {
		font-weight: $font-weight-medium;
		color: $neutral-900;
		transition: color $transition-fast;
	}

	.employee-email {
		font-size: $font-size-sm;
		color: $neutral-500;
	}

	.department-badge {
		display: inline-block;
		padding: $spacing-1 $spacing-3;
		background: $primary-50;
		color: $primary-700;
		border-radius: $radius-full;
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
	}

	.salary {
		font-weight: $font-weight-medium;
		color: $neutral-700;
	}

	// Actions
	.action-buttons {
		display: flex;
		gap: $spacing-1;
	}

	.action-btn {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: $radius-md;
		border: none;
		cursor: pointer;
		transition: all $transition-fast;
		text-decoration: none;

		svg {
			width: 16px;
			height: 16px;
		}

		&.view {
			background: $info-50;
			color: $info-600;

			&:hover {
				background: $info-100;
			}
		}

		&.edit {
			background: $primary-50;
			color: $primary-600;

			&:hover {
				background: $primary-100;
			}
		}

		&.delete {
			background: $error-50;
			color: $error-600;

			&:hover {
				background: $error-100;
			}
		}

		&.restore {
			background: $success-50;
			color: $success-600;

			&:hover {
				background: $success-100;
			}
		}
	}

	// Empty State
	.empty-row td {
		padding: $spacing-12;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $spacing-3;
		color: $neutral-400;

		svg {
			width: 64px;
			height: 64px;
			opacity: 0.5;
		}

		span {
			font-size: $font-size-lg;
			font-weight: $font-weight-medium;
			color: $neutral-600;
		}

		p {
			margin: 0;
			color: $neutral-400;
		}
	}

	.confirm-text {
		color: $neutral-600;
		line-height: $line-height-relaxed;

		strong {
			color: $neutral-900;
		}
	}

	@media (max-width: $breakpoint-lg) {
		.employees-table {
			display: block;
			overflow-x: auto;
		}
	}
</style>
