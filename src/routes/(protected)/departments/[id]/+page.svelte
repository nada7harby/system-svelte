<!--
  Department Detail Page
  Shows full department info with positions and employee assignment
-->
<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';
	import { currentUser } from '$lib/stores/auth';
	import { departmentsStoreNew } from '$lib/stores/departmentsStore';
	import { employees, employeeFilters, filteredEmployees } from '$lib/stores/employeesStore';
	import type { Department, Position, PositionFormData } from '$lib/types/department';
	import { getPositionLevelInfo, formatPositionSalary, POSITION_LEVELS } from '$lib/types/department';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import PositionModal from '$lib/components/departments/PositionModal.svelte';

	// Get department ID from URL
	const departmentId = $derived($page.params.id);

	// Get department data
	let department = $state<Department | null>(null);
	let isLoading = $state(true);

	$effect(() => {
		if (departmentId) {
			isLoading = true;
			department = departmentsStoreNew.getDepartmentById(departmentId) || null;
			isLoading = false;
		}
	});

	// Permission check
	const canManage = $derived($currentUser?.role === 'admin' || $currentUser?.role === 'manager');

	// Modal states
	let showPositionModal = $state(false);
	let editingPosition = $state<Position | null>(null);
	let showAssignModal = $state(false);
	let assigningPositionId = $state<string | null>(null);

	// Filter employees by this department
	const departmentEmployees = $derived(
		$filteredEmployees.filter(emp => emp.department === department?.name)
	);

	// Get position level badge color
	const getLevelColor = (level: Position['level']): 'info' | 'primary' | 'success' | 'warning' | 'secondary' => {
		const colorMap: Record<string, 'info' | 'primary' | 'success' | 'warning' | 'secondary'> = {
			junior: 'info',
			mid: 'primary',
			senior: 'success',
			lead: 'warning',
			manager: 'secondary'
		};
		return colorMap[level] || 'primary';
	};

	// Position actions
	const handleAddPosition = () => {
		editingPosition = null;
		showPositionModal = true;
	};

	const handleEditPosition = (position: Position) => {
		editingPosition = position;
		showPositionModal = true;
	};

	const handleDeletePosition = async (position: Position) => {
		if (confirm(`Are you sure you want to delete the "${position.title}" position?`)) {
			await departmentsStoreNew.deletePosition(position.id);
			// Refresh department
			department = departmentsStoreNew.getDepartmentById(departmentId) || null;
		}
	};

	const handleSavePosition = async (data: PositionFormData) => {
		if (!department) return;

		if (editingPosition) {
			await departmentsStoreNew.updatePosition(editingPosition.id, data);
		} else {
			await departmentsStoreNew.createPosition(department.id, data);
		}
		showPositionModal = false;
		editingPosition = null;
		// Refresh department
		department = departmentsStoreNew.getDepartmentById(departmentId) || null;
	};

	// Navigate back
	const goBack = () => {
		goto('/departments');
	};
</script>

<svelte:head>
	<title>{department?.name || 'Department'} | HR Management System</title>
</svelte:head>

<div class="department-detail" in:fade={{ duration: 200 }}>
	{#if isLoading}
		<div class="loading-state">
			<div class="loading-spinner"></div>
			<p>Loading department...</p>
		</div>
	{:else if !department}
		<div class="error-state">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<circle cx="12" cy="12" r="10" />
				<path d="M12 8v4M12 16h.01" />
			</svg>
			<h2>Department Not Found</h2>
			<p>The department you're looking for doesn't exist or has been deleted.</p>
			<Button variant="primary" onclick={goBack}>
				Back to Departments
			</Button>
		</div>
	{:else}
		<!-- Header -->
		<div class="page-header">
			<button class="back-btn" onclick={goBack}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M19 12H5M12 19l-7-7 7-7" />
				</svg>
			</button>
			<div class="header-content">
				<div class="title-row">
					<h1>{department.name}</h1>
					<Badge variant={department.status === 'active' ? 'success' : 'danger'} size="lg">
						{department.status === 'active' ? 'Active' : 'Inactive'}
					</Badge>
				</div>
				<p>{department.description}</p>
			</div>
		</div>

		<!-- Info Cards -->
		<div class="info-cards" in:fly={{ y: 20, delay: 100, duration: 300 }}>
			<div class="info-card">
				<div class="card-icon manager">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
						<circle cx="12" cy="7" r="4" />
					</svg>
				</div>
				<div class="card-content">
					<span class="card-label">Manager</span>
					<span class="card-value">{department.managerName || 'Not assigned'}</span>
				</div>
			</div>

			<div class="info-card">
				<div class="card-icon location">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
						<circle cx="12" cy="10" r="3" />
					</svg>
				</div>
				<div class="card-content">
					<span class="card-label">Location</span>
					<span class="card-value">{department.location || 'Not specified'}</span>
				</div>
			</div>

			<div class="info-card">
				<div class="card-icon employees">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
						<circle cx="9" cy="7" r="4" />
						<path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
					</svg>
				</div>
				<div class="card-content">
					<span class="card-label">Employees</span>
					<span class="card-value">{department.employeeCount}</span>
				</div>
			</div>

			<div class="info-card">
				<div class="card-icon budget">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<div class="card-content">
					<span class="card-label">Budget</span>
					<span class="card-value">{formatPositionSalary(department.budget)}</span>
				</div>
			</div>
		</div>

		<!-- Positions Section -->
		<section class="positions-section" in:fly={{ y: 20, delay: 200, duration: 300 }}>
			<div class="section-header">
				<h2>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
						<line x1="8" y1="21" x2="16" y2="21" />
						<line x1="12" y1="17" x2="12" y2="21" />
					</svg>
					Positions
					<span class="count">{department.positions.length}</span>
				</h2>
				{#if canManage}
					<Button variant="primary" size="sm" onclick={handleAddPosition}>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
							<path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
						</svg>
						Add Position
					</Button>
				{/if}
			</div>

			{#if department.positions.length === 0}
				<div class="empty-positions">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
						<line x1="8" y1="21" x2="16" y2="21" />
						<line x1="12" y1="17" x2="12" y2="21" />
					</svg>
					<p>No positions defined for this department yet</p>
					{#if canManage}
						<Button variant="outline" onclick={handleAddPosition}>
							Add First Position
						</Button>
					{/if}
				</div>
			{:else}
				<div class="positions-grid">
					{#each department.positions as position (position.id)}
						<div class="position-card" in:fade>
							<div class="position-header">
								<h3>{position.title}</h3>
								<Badge variant={getLevelColor(position.level)}>
									{getPositionLevelInfo(position.level).label}
								</Badge>
							</div>
							{#if position.description}
								<p class="position-description">{position.description}</p>
							{/if}
							<div class="position-footer">
								{#if position.baseSalary}
									<span class="salary">
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										{formatPositionSalary(position.baseSalary)}
									</span>
								{:else}
									<span class="no-salary">Salary not set</span>
								{/if}
								{#if canManage}
									<div class="position-actions">
										<button class="action-btn" onclick={() => handleEditPosition(position)} title="Edit">
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
												<path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
											</svg>
										</button>
										<button class="action-btn delete" onclick={() => handleDeletePosition(position)} title="Delete">
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
											</svg>
										</button>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</section>

		<!-- Employees Section -->
		<section class="employees-section" in:fly={{ y: 20, delay: 300, duration: 300 }}>
			<div class="section-header">
				<h2>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
						<circle cx="9" cy="7" r="4" />
						<path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
					</svg>
					Employees
					<span class="count">{departmentEmployees.length}</span>
				</h2>
				<Button variant="outline" size="sm" onclick={() => goto('/employees')}>
					View All Employees
				</Button>
			</div>

			{#if departmentEmployees.length === 0}
				<div class="empty-employees">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
						<circle cx="9" cy="7" r="4" />
						<path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
					</svg>
					<p>No employees assigned to this department</p>
				</div>
			{:else}
				<div class="employees-list">
					{#each departmentEmployees.slice(0, 10) as employee (employee.id)}
						<div class="employee-item">
							<div class="employee-avatar">
								{employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
							</div>
							<div class="employee-info">
								<span class="employee-name">{employee.firstName} {employee.lastName}</span>
								<span class="employee-title">{employee.jobTitle}</span>
							</div>
							<Badge variant={employee.status === 'active' ? 'success' : employee.status === 'on-leave' ? 'warning' : 'secondary'} size="sm">
								{employee.status}
							</Badge>
						</div>
					{/each}
					{#if departmentEmployees.length > 10}
						<div class="more-employees">
							+{departmentEmployees.length - 10} more employees
						</div>
					{/if}
				</div>
			{/if}
		</section>
	{/if}
</div>

<!-- Position Modal -->
<PositionModal
	isOpen={showPositionModal}
	position={editingPosition}
	departmentName={department?.name || ''}
	onclose={() => { showPositionModal = false; editingPosition = null; }}
	onsave={handleSavePosition}
/>

<style lang="scss">
	@use '$styles/variables' as *;

	.department-detail {
		max-width: $content-max-width;
		margin: 0 auto;
	}

	.loading-state,
	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: $spacing-16;
		text-align: center;
	}

	.loading-spinner {
		width: 48px;
		height: 48px;
		border: 4px solid $neutral-200;
		border-top-color: $primary-500;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		margin-bottom: $spacing-4;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.error-state {
		svg {
			width: 64px;
			height: 64px;
			color: $neutral-300;
			margin-bottom: $spacing-4;
		}

		h2 {
			margin: 0 0 $spacing-2 0;
			color: $neutral-700;
		}

		p {
			margin: 0 0 $spacing-6 0;
			color: $neutral-500;
		}
	}

	// Header
	.page-header {
		display: flex;
		gap: $spacing-4;
		margin-bottom: $spacing-8;
	}

	.back-btn {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid $neutral-200;
		background: white;
		border-radius: $radius-xl;
		cursor: pointer;
		color: $neutral-600;
		transition: all $transition-fast;
		flex-shrink: 0;

		svg {
			width: 24px;
			height: 24px;
		}

		&:hover {
			background: $neutral-50;
			border-color: $neutral-300;
		}
	}

	.header-content {
		flex: 1;

		.title-row {
			display: flex;
			align-items: center;
			gap: $spacing-3;
			margin-bottom: $spacing-2;
		}

		h1 {
			margin: 0;
			font-size: $font-size-3xl;
			color: $neutral-900;
		}

		p {
			margin: 0;
			color: $neutral-500;
			line-height: $line-height-relaxed;
		}
	}

	// Info Cards
	.info-cards {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: $spacing-6;
		margin-bottom: $spacing-8;

		@media (max-width: $breakpoint-lg) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (max-width: $breakpoint-sm) {
			grid-template-columns: 1fr;
		}
	}

	.info-card {
		display: flex;
		align-items: center;
		gap: $spacing-4;
		background: white;
		padding: $spacing-5;
		border-radius: $radius-xl;
		box-shadow: $shadow-md;
		border: 1px solid $neutral-100;
	}

	.card-icon {
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

		&.manager {
			background: linear-gradient(135deg, $primary-100 0%, $primary-200 100%);
			svg { color: $primary-600; }
		}

		&.location {
			background: linear-gradient(135deg, $info-100 0%, $info-100 100%);
			svg { color: $info-600; }
		}

		&.employees {
			background: linear-gradient(135deg, $success-100 0%, $success-100 100%);
			svg { color: $success-600; }
		}

		&.budget {
			background: linear-gradient(135deg, $warning-100 0%, $warning-100 100%);
			svg { color: $warning-600; }
		}
	}

	.card-content {
		display: flex;
		flex-direction: column;
	}

	.card-label {
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
		color: $neutral-500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.card-value {
		font-size: $font-size-lg;
		font-weight: $font-weight-semibold;
		color: $neutral-800;
	}

	// Sections
	.positions-section,
	.employees-section {
		background: white;
		border-radius: $radius-xl;
		padding: $spacing-6;
		box-shadow: $shadow-md;
		border: 1px solid $neutral-100;
		margin-bottom: $spacing-6;
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: $spacing-6;

		h2 {
			display: flex;
			align-items: center;
			gap: $spacing-2;
			margin: 0;
			font-size: $font-size-xl;
			color: $neutral-800;

			svg {
				width: 24px;
				height: 24px;
				color: $neutral-500;
			}

			.count {
				background: $neutral-100;
				padding: 2px 10px;
				border-radius: $radius-full;
				font-size: $font-size-sm;
				font-weight: $font-weight-medium;
				color: $neutral-600;
			}
		}
	}

	// Positions Grid
	.positions-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: $spacing-4;

		@media (max-width: $breakpoint-lg) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (max-width: $breakpoint-md) {
			grid-template-columns: 1fr;
		}
	}

	.position-card {
		background: $neutral-50;
		border: 1px solid $neutral-200;
		border-radius: $radius-lg;
		padding: $spacing-4;
		transition: all $transition-fast;

		&:hover {
			border-color: $neutral-300;
			box-shadow: $shadow-sm;

			.position-actions {
				opacity: 1;
			}
		}
	}

	.position-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: $spacing-2;
		margin-bottom: $spacing-2;

		h3 {
			margin: 0;
			font-size: $font-size-base;
			font-weight: $font-weight-semibold;
			color: $neutral-800;
		}
	}

	.position-description {
		margin: 0 0 $spacing-3 0;
		font-size: $font-size-sm;
		color: $neutral-500;
		line-height: $line-height-relaxed;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.position-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.salary {
		display: flex;
		align-items: center;
		gap: $spacing-1;
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		color: $success-600;

		svg {
			width: 14px;
			height: 14px;
		}
	}

	.no-salary {
		font-size: $font-size-sm;
		color: $neutral-400;
		font-style: italic;
	}

	.position-actions {
		display: flex;
		gap: $spacing-1;
		opacity: 0;
		transition: opacity $transition-fast;
	}

	.action-btn {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: white;
		border-radius: $radius-md;
		cursor: pointer;
		color: $neutral-500;
		transition: all $transition-fast;

		svg {
			width: 14px;
			height: 14px;
		}

		&:hover {
			background: $primary-50;
			color: $primary-600;
		}

		&.delete:hover {
			background: $danger-50;
			color: $danger-600;
		}
	}

	.empty-positions,
	.empty-employees {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: $spacing-8;
		text-align: center;
		color: $neutral-400;

		svg {
			width: 48px;
			height: 48px;
			margin-bottom: $spacing-3;
			opacity: 0.5;
		}

		p {
			margin: 0 0 $spacing-4 0;
		}
	}

	// Employees List
	.employees-list {
		display: flex;
		flex-direction: column;
		gap: $spacing-2;
	}

	.employee-item {
		display: flex;
		align-items: center;
		gap: $spacing-3;
		padding: $spacing-3 $spacing-4;
		background: $neutral-50;
		border-radius: $radius-lg;
		transition: background $transition-fast;

		&:hover {
			background: $neutral-100;
		}
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
	}

	.employee-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.employee-name {
		font-weight: $font-weight-medium;
		color: $neutral-800;
	}

	.employee-title {
		font-size: $font-size-sm;
		color: $neutral-500;
	}

	.more-employees {
		padding: $spacing-3;
		text-align: center;
		font-size: $font-size-sm;
		color: $neutral-500;
		font-weight: $font-weight-medium;
	}
</style>
