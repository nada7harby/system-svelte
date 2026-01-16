<!--
  Departments Page
  Full CRUD for departments with positions management
  Includes search, filtering, and employee assignment
-->
<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/stores/auth';
	import {
		departmentsStoreNew,
		filteredDepartmentsNew,
		departmentStatsNew,
		activeDepartments
	} from '$lib/stores/departmentsStore';
	import type { Department, Position, DepartmentFormData, PositionFormData, DepartmentStatus } from '$lib/types/department';
	import { DEPARTMENT_STATUSES, getPositionLevelInfo } from '$lib/types/department';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import DepartmentModal from '$lib/components/departments/DepartmentModal.svelte';
	import PositionModal from '$lib/components/departments/PositionModal.svelte';
	import PositionsList from '$lib/components/departments/PositionsList.svelte';

	// Local state
	let searchQuery = $state('');
	let statusFilter = $state<DepartmentStatus | 'all'>('all');
	let selectedDepartment = $state<Department | null>(null);
	let selectedPosition = $state<Position | null>(null);

	// Modal states
	let showDepartmentModal = $state(false);
	let showPositionModal = $state(false);
	let showDeleteModal = $state(false);
	let showDetailsSidebar = $state(false);
	let editingDepartment = $state<Department | null>(null);
	let deletingDepartment = $state<Department | null>(null);

	// Permission check
	const canManage = $derived($currentUser?.role === 'admin' || $currentUser?.role === 'manager');

	// Update store when search changes
	$effect(() => {
		departmentsStoreNew.setSearchQuery(searchQuery);
	});

	$effect(() => {
		departmentsStoreNew.setStatusFilter(statusFilter);
	});

	// Format currency
	const formatBudget = (amount?: number): string => {
		if (!amount) return 'N/A';
		if (amount >= 1000000) {
			return `$${(amount / 1000000).toFixed(1)}M`;
		}
		return `$${(amount / 1000).toFixed(0)}K`;
	};

	// Department color mapping
	const getDepartmentColor = (index: number): string => {
		const colors = ['primary', 'secondary', 'success', 'warning', 'info', 'purple'];
		return colors[index % colors.length];
	};

	// Handle department actions
	const handleAddDepartment = () => {
		editingDepartment = null;
		showDepartmentModal = true;
	};

	const handleEditDepartment = (dept: Department) => {
		editingDepartment = dept;
		showDepartmentModal = true;
	};

	const handleDeleteDepartment = (dept: Department) => {
		deletingDepartment = dept;
		showDeleteModal = true;
	};

	const handleSaveDepartment = async (data: DepartmentFormData) => {
		if (editingDepartment) {
			await departmentsStoreNew.updateDepartment(editingDepartment.id, data);
		} else {
			await departmentsStoreNew.createDepartment(data);
		}
		showDepartmentModal = false;
		editingDepartment = null;
	};

	const confirmDeleteDepartment = async () => {
		if (deletingDepartment) {
			await departmentsStoreNew.deleteDepartment(deletingDepartment.id);
			if (selectedDepartment?.id === deletingDepartment.id) {
				selectedDepartment = null;
				showDetailsSidebar = false;
			}
		}
		showDeleteModal = false;
		deletingDepartment = null;
	};

	// Handle position actions
	const handleAddPosition = () => {
		selectedPosition = null;
		showPositionModal = true;
	};

	const handleEditPosition = (position: Position) => {
		selectedPosition = position;
		showPositionModal = true;
	};

	const handleDeletePosition = async (position: Position) => {
		if (confirm(`Are you sure you want to delete the "${position.title}" position?`)) {
			await departmentsStoreNew.deletePosition(position.id);
			// Refresh selected department
			if (selectedDepartment) {
				selectedDepartment = departmentsStoreNew.getDepartmentById(selectedDepartment.id) || null;
			}
		}
	};

	const handleSavePosition = async (data: PositionFormData) => {
		if (!selectedDepartment) return;

		if (selectedPosition) {
			await departmentsStoreNew.updatePosition(selectedPosition.id, data);
		} else {
			await departmentsStoreNew.createPosition(selectedDepartment.id, data);
		}
		showPositionModal = false;
		selectedPosition = null;
		// Refresh selected department
		selectedDepartment = departmentsStoreNew.getDepartmentById(selectedDepartment.id) || null;
	};

	// Handle department card click
	const handleDepartmentClick = (dept: Department) => {
		selectedDepartment = dept;
		showDetailsSidebar = true;
	};

	// Navigate to department detail page
	const handleViewDetails = (dept: Department) => {
		goto(`/departments/${dept.id}`);
	};
</script>

<svelte:head>
	<title>Departments | HR Management System</title>
	<meta name="description" content="Manage organization departments and positions" />
</svelte:head>

<div class="departments-page" in:fade={{ duration: 200 }}>
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<h1>Departments</h1>
			<p>Manage your organization's structure and positions</p>
		</div>
		{#if canManage}
			<div class="header-actions">
				<Button variant="primary" onclick={handleAddDepartment}>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;">
						<path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
					</svg>
					Add Department
				</Button>
			</div>
		{/if}
	</div>

	<!-- Stats Overview -->
	<div class="stats-row" in:fly={{ y: 20, delay: 100, duration: 300 }}>
		<div class="stat-item">
			<span class="stat-value">{$departmentStatsNew.total}</span>
			<span class="stat-label">Total Departments</span>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-item">
			<span class="stat-value success">{$departmentStatsNew.active}</span>
			<span class="stat-label">Active</span>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-item">
			<span class="stat-value">{$departmentStatsNew.totalPositions}</span>
			<span class="stat-label">Total Positions</span>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-item">
			<span class="stat-value">{$departmentStatsNew.totalEmployees}</span>
			<span class="stat-label">Total Employees</span>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-item">
			<span class="stat-value">{formatBudget($departmentStatsNew.totalBudget)}</span>
			<span class="stat-label">Total Budget</span>
		</div>
	</div>

	<!-- Search & Filter Section -->
	<div class="search-section" in:fly={{ y: 20, delay: 200, duration: 300 }}>
		<div class="search-filters">
			<div class="search-wrapper">
				<Input
					type="search"
					name="search"
					placeholder="Search departments by name, description, or manager..."
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
			<div class="filter-buttons">
				<button
					class="filter-btn"
					class:active={statusFilter === 'all'}
					onclick={() => statusFilter = 'all'}
				>
					All
				</button>
				{#each DEPARTMENT_STATUSES as status}
					<button
						class="filter-btn"
						class:active={statusFilter === status.value}
						class:status-active={status.value === 'active'}
						class:status-inactive={status.value === 'inactive'}
						onclick={() => statusFilter = status.value}
					>
						<span class="status-dot"></span>
						{status.label}
					</button>
				{/each}
			</div>
		</div>
		<span class="results-info">
			Showing <strong>{$filteredDepartmentsNew.length}</strong> of {$departmentStatsNew.total} departments
		</span>
	</div>

	<!-- Main Content -->
	<div class="main-content" class:sidebar-open={showDetailsSidebar}>
		<!-- Departments Grid -->
		<div class="departments-grid">
			{#if $filteredDepartmentsNew.length === 0}
				<div class="empty-state" in:fade>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
					</svg>
					<span>No departments found</span>
					<p>Try adjusting your search criteria or add a new department</p>
					{#if canManage}
						<Button variant="primary" onclick={handleAddDepartment}>
							Add Department
						</Button>
					{/if}
				</div>
			{:else}
				{#each $filteredDepartmentsNew as department, index (department.id)}
					<div
						class="department-card color-{getDepartmentColor(index)}"
						class:selected={selectedDepartment?.id === department.id}
						in:scale={{ start: 0.95, delay: index * 50, duration: 300 }}
						onclick={() => handleDepartmentClick(department)}
						role="button"
						tabindex="0"
						onkeydown={(e) => e.key === 'Enter' && handleDepartmentClick(department)}
					>
						<div class="card-header">
							<div class="department-icon">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
								</svg>
							</div>
							<div class="card-badges">
								<Badge variant={department.status === 'active' ? 'success' : 'danger'} size="sm">
									{department.status === 'active' ? 'Active' : 'Inactive'}
								</Badge>
							</div>
						</div>

						<div class="card-content">
							<h3 class="department-name">{department.name}</h3>
							<p class="department-description">{department.description}</p>
						</div>

						<div class="card-stats">
							<div class="stat">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
									<circle cx="9" cy="7" r="4" />
									<path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
								</svg>
								<span>{department.employeeCount} employees</span>
							</div>
							<div class="stat">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M20 7h-4l-3-3H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
								</svg>
								<span>{department.positions.length} positions</span>
							</div>
						</div>

						<div class="card-footer">
							<div class="manager-info">
								<div class="manager-avatar">
									{department.managerName?.charAt(0) || '?'}
								</div>
								<div class="manager-details">
									<span class="manager-label">Manager</span>
									<span class="manager-name">{department.managerName || 'Not assigned'}</span>
								</div>
							</div>
							{#if department.budget}
								<span class="budget">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									{formatBudget(department.budget)}
								</span>
							{/if}
						</div>

						{#if canManage}
							<div class="card-actions" onclick={(e) => e.stopPropagation()}>
								<button class="action-btn" onclick={() => handleEditDepartment(department)} title="Edit department">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
										<path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
									</svg>
								</button>
								<button class="action-btn delete" onclick={() => handleDeleteDepartment(department)} title="Delete department">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
									</svg>
								</button>
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>

		<!-- Details Sidebar -->
		{#if showDetailsSidebar && selectedDepartment}
			<aside class="details-sidebar" in:fly={{ x: 300, duration: 300 }} out:fly={{ x: 300, duration: 200 }}>
				<div class="sidebar-header">
					<h2>{selectedDepartment.name}</h2>
					<button class="close-btn" onclick={() => showDetailsSidebar = false}>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M18 6L6 18M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div class="sidebar-content">
					<div class="detail-section">
						<p class="description">{selectedDepartment.description}</p>
						<div class="detail-grid">
							<div class="detail-item">
								<span class="detail-label">Status</span>
								<Badge variant={selectedDepartment.status === 'active' ? 'success' : 'danger'}>
									{selectedDepartment.status === 'active' ? 'Active' : 'Inactive'}
								</Badge>
							</div>
							<div class="detail-item">
								<span class="detail-label">Manager</span>
								<span class="detail-value">{selectedDepartment.managerName || 'Not assigned'}</span>
							</div>
							<div class="detail-item">
								<span class="detail-label">Location</span>
								<span class="detail-value">{selectedDepartment.location || 'Not specified'}</span>
							</div>
							<div class="detail-item">
								<span class="detail-label">Budget</span>
								<span class="detail-value">{formatBudget(selectedDepartment.budget)}</span>
							</div>
							<div class="detail-item">
								<span class="detail-label">Employees</span>
								<span class="detail-value">{selectedDepartment.employeeCount}</span>
							</div>
						</div>
					</div>

					<PositionsList
						positions={selectedDepartment.positions}
						departmentName={selectedDepartment.name}
						{canManage}
						onaddposition={handleAddPosition}
						oneditposition={handleEditPosition}
						ondeleteposition={handleDeletePosition}
					/>
				</div>

				<div class="sidebar-footer">
					<Button variant="outline" fullWidth onclick={() => handleViewDetails(selectedDepartment!)}>
						View Full Details
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-left: 8px;">
							<path d="M5 12h14M12 5l7 7-7 7" />
						</svg>
					</Button>
				</div>
			</aside>
		{/if}
	</div>
</div>

<!-- Department Modal -->
<DepartmentModal
	isOpen={showDepartmentModal}
	department={editingDepartment}
	onclose={() => { showDepartmentModal = false; editingDepartment = null; }}
	onsave={handleSaveDepartment}
/>

<!-- Position Modal -->
<PositionModal
	isOpen={showPositionModal}
	position={selectedPosition}
	departmentName={selectedDepartment?.name || ''}
	onclose={() => { showPositionModal = false; selectedPosition = null; }}
	onsave={handleSavePosition}
/>

<!-- Delete Confirmation Modal -->
<Modal isOpen={showDeleteModal} title="Delete Department" size="sm" onclose={() => { showDeleteModal = false; deletingDepartment = null; }}>
	<div class="delete-confirmation">
		<div class="warning-icon">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
				<line x1="12" y1="9" x2="12" y2="13" />
				<line x1="12" y1="17" x2="12.01" y2="17" />
			</svg>
		</div>
		<p>Are you sure you want to delete <strong>{deletingDepartment?.name}</strong>?</p>
		<p class="warning-text">This action cannot be undone. All positions in this department will also be deleted.</p>
	</div>

	{#snippet footer()}
		<Button variant="ghost" onclick={() => { showDeleteModal = false; deletingDepartment = null; }}>
			Cancel
		</Button>
		<Button variant="danger" onclick={confirmDeleteDepartment}>
			Delete Department
		</Button>
	{/snippet}
</Modal>

<style lang="scss">
	@use '$styles/variables' as *;

	.departments-page {
		max-width: $content-max-width;
		margin: 0 auto;
	}

	// Page Header
	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: $spacing-8;
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
	}

	// Stats Row
	.stats-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: $spacing-8;
		background: white;
		border-radius: $radius-xl;
		padding: $spacing-6 $spacing-8;
		box-shadow: $shadow-md;
		border: 1px solid $neutral-100;
		margin-bottom: $spacing-6;
		flex-wrap: wrap;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $spacing-1;
	}

	.stat-value {
		font-size: $font-size-3xl;
		font-weight: $font-weight-bold;
		color: $neutral-900;
		line-height: 1;

		&.success {
			color: $success-600;
		}
	}

	.stat-label {
		font-size: $font-size-sm;
		color: $neutral-500;
	}

	.stat-divider {
		width: 1px;
		height: 40px;
		background: $neutral-200;

		@media (max-width: $breakpoint-md) {
			display: none;
		}
	}

	// Search Section
	.search-section {
		background: white;
		border-radius: $radius-xl;
		padding: $spacing-6;
		box-shadow: $shadow-md;
		border: 1px solid $neutral-100;
		margin-bottom: $spacing-6;
	}

	.search-filters {
		display: flex;
		gap: $spacing-4;
		margin-bottom: $spacing-3;
		flex-wrap: wrap;
	}

	.search-wrapper {
		flex: 1;
		min-width: 250px;
	}

	.filter-buttons {
		display: flex;
		gap: $spacing-2;
	}

	.filter-btn {
		display: flex;
		align-items: center;
		gap: $spacing-2;
		padding: $spacing-2 $spacing-4;
		border: 1px solid $neutral-300;
		border-radius: $radius-lg;
		background: white;
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		color: $neutral-600;
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
			border-color: $primary-500;
			background: $primary-50;
			color: $primary-700;
		}

		&.status-active.active .status-dot {
			background: $success-500;
		}

		&.status-inactive.active .status-dot {
			background: $danger-500;
		}
	}

	.results-info {
		font-size: $font-size-sm;
		color: $neutral-500;

		strong {
			color: $neutral-700;
		}
	}

	// Main Content
	.main-content {
		display: flex;
		gap: $spacing-6;
		transition: all $transition-base;

		&.sidebar-open {
			.departments-grid {
				@media (min-width: $breakpoint-lg) {
					grid-template-columns: repeat(2, 1fr);
				}
			}
		}
	}

	// Departments Grid
	.departments-grid {
		flex: 1;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: $spacing-6;

		@media (max-width: $breakpoint-xl) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (max-width: $breakpoint-md) {
			grid-template-columns: 1fr;
		}
	}

	// Department Card
	.department-card {
		position: relative;
		background: white;
		border-radius: $radius-xl;
		padding: $spacing-6;
		box-shadow: $shadow-md;
		border: 2px solid transparent;
		transition: all $transition-base;
		display: flex;
		flex-direction: column;
		cursor: pointer;

		&:hover {
			transform: translateY(-4px);
			box-shadow: $shadow-lg;

			.card-actions {
				opacity: 1;
			}
		}

		&.selected {
			border-color: $primary-500;
			box-shadow: 0 0 0 3px rgba($primary-500, 0.15);
		}
	}

	.card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: $spacing-4;
	}

	.department-icon {
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
	}

	// Color variations
	.color-primary .department-icon {
		background: linear-gradient(135deg, $primary-100 0%, $primary-200 100%);
		svg { color: $primary-600; }
	}

	.color-secondary .department-icon {
		background: linear-gradient(135deg, $secondary-100 0%, $secondary-200 100%);
		svg { color: $secondary-600; }
	}

	.color-success .department-icon {
		background: linear-gradient(135deg, $success-100 0%, $success-100 100%);
		svg { color: $success-600; }
	}

	.color-warning .department-icon {
		background: linear-gradient(135deg, $warning-100 0%, $warning-100 100%);
		svg { color: $warning-600; }
	}

	.color-info .department-icon {
		background: linear-gradient(135deg, $info-100 0%, $info-100 100%);
		svg { color: $info-600; }
	}

	.color-purple .department-icon {
		background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
		svg { color: #7c3aed; }
	}

	.card-content {
		margin-bottom: $spacing-4;
		flex: 1;
	}

	.department-name {
		font-size: $font-size-xl;
		font-weight: $font-weight-semibold;
		color: $neutral-900;
		margin: 0 0 $spacing-2 0;
	}

	.department-description {
		font-size: $font-size-sm;
		color: $neutral-500;
		margin: 0;
		line-height: $line-height-relaxed;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card-stats {
		display: flex;
		gap: $spacing-4;
		margin-bottom: $spacing-4;
		padding-bottom: $spacing-4;
		border-bottom: 1px solid $neutral-100;
	}

	.stat {
		display: flex;
		align-items: center;
		gap: $spacing-2;
		font-size: $font-size-sm;
		color: $neutral-600;

		svg {
			width: 16px;
			height: 16px;
			color: $neutral-400;
		}
	}

	.card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: $spacing-3;
	}

	.manager-info {
		display: flex;
		align-items: center;
		gap: $spacing-3;
	}

	.manager-avatar {
		width: 36px;
		height: 36px;
		background: linear-gradient(135deg, $secondary-400 0%, $secondary-600 100%);
		border-radius: $radius-lg;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: $font-weight-semibold;
		font-size: $font-size-sm;
	}

	.manager-details {
		display: flex;
		flex-direction: column;
	}

	.manager-label {
		font-size: $font-size-xs;
		color: $neutral-400;
	}

	.manager-name {
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		color: $neutral-700;
	}

	.budget {
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

	.card-actions {
		position: absolute;
		top: $spacing-4;
		right: $spacing-4;
		display: flex;
		gap: $spacing-1;
		opacity: 0;
		transition: opacity $transition-fast;
	}

	.action-btn {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: white;
		border-radius: $radius-md;
		cursor: pointer;
		color: $neutral-500;
		box-shadow: $shadow-sm;
		transition: all $transition-fast;

		svg {
			width: 16px;
			height: 16px;
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

	// Details Sidebar
	.details-sidebar {
		width: 400px;
		flex-shrink: 0;
		background: white;
		border-radius: $radius-xl;
		box-shadow: $shadow-lg;
		border: 1px solid $neutral-100;
		display: flex;
		flex-direction: column;
		max-height: calc(100vh - 200px);
		position: sticky;
		top: $spacing-6;

		@media (max-width: $breakpoint-lg) {
			position: fixed;
			right: $spacing-4;
			top: 80px;
			bottom: $spacing-4;
			z-index: $z-sticky;
			max-height: none;
		}
	}

	.sidebar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: $spacing-5 $spacing-6;
		border-bottom: 1px solid $neutral-100;

		h2 {
			margin: 0;
			font-size: $font-size-xl;
			font-weight: $font-weight-semibold;
			color: $neutral-900;
		}
	}

	.close-btn {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: transparent;
		border-radius: $radius-lg;
		cursor: pointer;
		color: $neutral-500;
		transition: all $transition-fast;

		svg {
			width: 20px;
			height: 20px;
		}

		&:hover {
			background: $neutral-100;
			color: $neutral-700;
		}
	}

	.sidebar-content {
		flex: 1;
		overflow-y: auto;
		padding: $spacing-6;
		display: flex;
		flex-direction: column;
		gap: $spacing-6;
	}

	.detail-section {
		.description {
			margin: 0 0 $spacing-4 0;
			color: $neutral-600;
			line-height: $line-height-relaxed;
		}
	}

	.detail-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: $spacing-4;
	}

	.detail-item {
		display: flex;
		flex-direction: column;
		gap: $spacing-1;
	}

	.detail-label {
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
		color: $neutral-500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.detail-value {
		font-weight: $font-weight-medium;
		color: $neutral-800;
	}

	.sidebar-footer {
		padding: $spacing-4 $spacing-6;
		border-top: 1px solid $neutral-100;
	}

	// Empty State
	.empty-state {
		grid-column: 1 / -1;
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
		color: $neutral-400;

		svg {
			width: 64px;
			height: 64px;
			opacity: 0.5;
			margin-bottom: $spacing-4;
		}

		span {
			font-size: $font-size-lg;
			font-weight: $font-weight-medium;
			color: $neutral-600;
		}

		p {
			margin: $spacing-2 0 $spacing-6 0;
			color: $neutral-400;
		}
	}

	// Delete Confirmation
	.delete-confirmation {
		text-align: center;

		.warning-icon {
			width: 60px;
			height: 60px;
			margin: 0 auto $spacing-4;
			background: rgba($danger-500, 0.1);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;

			svg {
				width: 32px;
				height: 32px;
				color: $danger-500;
			}
		}

		p {
			margin: 0 0 $spacing-2 0;
			color: $neutral-700;

			strong {
				color: $neutral-900;
			}
		}

		.warning-text {
			font-size: $font-size-sm;
			color: $neutral-500;
		}
	}
</style>
