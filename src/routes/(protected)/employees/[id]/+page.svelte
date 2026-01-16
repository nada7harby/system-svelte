<!--
  Employee Profile Page
  Detailed employee view with tabs for different sections
-->
<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import Tabs from '$lib/components/ui/Tabs.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import ProfilePictureUpload from '$lib/components/employees/ProfilePictureUpload.svelte';
	import DocumentUpload from '$lib/components/employees/DocumentUpload.svelte';
	import { employees, isLoading } from '$lib/stores/employeesStore';
	import type { Employee, DocumentType } from '$lib/types/employee';
	import {
		getFullName,
		formatSalary,
		formatDate,
		EMPLOYMENT_TYPES,
		EMPLOYEE_STATUSES
	} from '$lib/types/employee';

	// Get employee ID from route params
	const employeeId = $derived($page.params.id);

	// State
	let employee: Employee | null = $state(null);
	let loadError = $state(false);
	let activeTab = $state('overview');
	let showPictureModal = $state(false);
	let showDeleteConfirm = $state(false);

	// Tab configuration
	const tabs = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'personal', label: 'Personal Info' },
		{ id: 'job', label: 'Job Info' },
		{ id: 'documents', label: 'Documents' }
	];

	// Load employee data
	onMount(async () => {
		employee = await employees.getById(employeeId);
		if (!employee) {
			loadError = true;
		}
	});

	// Get status variant for badge
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

	// Format employment type
	const getEmploymentTypeLabel = (type: string): string => {
		return EMPLOYMENT_TYPES.find((t) => t.value === type)?.label || type;
	};

	// Handle profile picture upload
	const handlePictureUpload = async (imageData: string) => {
		if (!employee) return;
		await employees.updateProfilePicture(employee.id, imageData);
		employee = await employees.getById(employeeId);
		showPictureModal = false;
	};

	// Handle profile picture remove
	const handlePictureRemove = async () => {
		if (!employee) return;
		await employees.updateProfilePicture(employee.id, '');
		employee = await employees.getById(employeeId);
	};

	// Handle document upload
	const handleDocumentUpload = async (doc: { name: string; type: DocumentType; url: string; fileSize: number; mimeType: string }) => {
		if (!employee) return;
		await employees.addDocument(employee.id, doc);
		employee = await employees.getById(employeeId);
	};

	// Handle document delete
	const handleDocumentDelete = async (documentId: string) => {
		if (!employee) return;
		await employees.removeDocument(employee.id, documentId);
		employee = await employees.getById(employeeId);
	};

	// Handle employee delete
	const handleDelete = async () => {
		if (!employee) return;
		await employees.softDelete(employee.id);
		goto('/employees');
	};

	// Navigate back to list
	const goToList = () => goto('/employees');

	// Navigate to edit page
	const goToEdit = () => goto(`/employees/${employeeId}/edit`);
</script>

<svelte:head>
	<title>{employee ? getFullName(employee) : 'Employee Profile'} | HR Management System</title>
</svelte:head>

<div class="profile-page" in:fade={{ duration: 200 }}>
	{#if loadError}
		<div class="error-state">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10" />
				<line x1="12" y1="8" x2="12" y2="12" />
				<line x1="12" y1="16" x2="12.01" y2="16" />
			</svg>
			<h2>Employee Not Found</h2>
			<p>The employee you're looking for doesn't exist or has been deleted.</p>
			<button class="back-link" onclick={goToList}>← Back to Employees</button>
		</div>
	{:else if !employee}
		<div class="loading-state">
			<div class="spinner"></div>
			<span>Loading employee profile...</span>
		</div>
	{:else}
		<!-- Back Button -->
		<button class="back-button" onclick={goToList}>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M19 12H5m7-7l-7 7 7 7" />
			</svg>
			Back to Employees
		</button>

		<!-- Profile Header -->
		<div class="profile-header" in:fly={{ y: 20, duration: 300 }}>
			<div class="profile-left">
				<button class="avatar-btn" onclick={() => (showPictureModal = true)}>
					<Avatar
						src={employee.profilePicture}
						name={getFullName(employee)}
						size="xl"
						status={employee.status}
						showStatus
					/>
					<span class="avatar-edit">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
							<circle cx="12" cy="13" r="4" />
						</svg>
					</span>
				</button>

				<div class="profile-info">
					<h1>{getFullName(employee)}</h1>
					<p class="job-title">{employee.jobTitle}</p>
					<div class="quick-info">
						<span class="info-item">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
							</svg>
							{employee.department}
						</span>
						<span class="info-item">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
							</svg>
							{employee.email}
						</span>
					</div>
					<div class="badges">
						<Badge variant={getStatusVariant(employee.status)} text={formatStatus(employee.status)} />
						<Badge variant="info" text={getEmploymentTypeLabel(employee.employmentType)} dot={false} />
					</div>
				</div>
			</div>

			<div class="profile-actions">
				<Button variant="outline" onclick={goToEdit}>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
						<path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
					</svg>
					Edit
				</Button>
				<Button variant="ghost" onclick={() => (showDeleteConfirm = true)}>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
						<path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
					Delete
				</Button>
			</div>
		</div>

		<!-- Tabs -->
		<div class="tabs-container" in:fly={{ y: 20, delay: 100, duration: 300 }}>
			<Tabs {tabs} bind:activeTab />
		</div>

		<!-- Tab Content -->
		<div class="tab-content" in:fly={{ y: 20, delay: 200, duration: 300 }}>
			{#if activeTab === 'overview'}
				<div class="overview-tab">
					<div class="info-grid">
						<div class="info-card">
							<h3>Contact Information</h3>
							<dl>
								<div class="info-row">
									<dt>Email</dt>
									<dd><a href="mailto:{employee.email}">{employee.email}</a></dd>
								</div>
								<div class="info-row">
									<dt>Phone</dt>
									<dd><a href="tel:{employee.phone}">{employee.phone}</a></dd>
								</div>
								<div class="info-row">
									<dt>Address</dt>
									<dd>{employee.address}</dd>
								</div>
							</dl>
						</div>

						<div class="info-card">
							<h3>Employment Details</h3>
							<dl>
								<div class="info-row">
									<dt>Department</dt>
									<dd>{employee.department}</dd>
								</div>
								<div class="info-row">
									<dt>Job Title</dt>
									<dd>{employee.jobTitle}</dd>
								</div>
								<div class="info-row">
									<dt>Start Date</dt>
									<dd>{formatDate(employee.startDate)}</dd>
								</div>
								<div class="info-row">
									<dt>Salary</dt>
									<dd>{formatSalary(employee.salary)}</dd>
								</div>
							</dl>
						</div>

						<div class="info-card">
							<h3>Documents Summary</h3>
							<div class="doc-summary">
								<span class="doc-count">{employee.documents.length}</span>
								<span>document{employee.documents.length !== 1 ? 's' : ''} uploaded</span>
							</div>
							{#if employee.documents.length > 0}
								<ul class="doc-preview-list">
									{#each employee.documents.slice(0, 3) as doc}
										<li>{doc.name}</li>
									{/each}
									{#if employee.documents.length > 3}
										<li class="more">+{employee.documents.length - 3} more</li>
									{/if}
								</ul>
							{/if}
							<Button variant="ghost" size="sm" onclick={() => (activeTab = 'documents')}>
								View All Documents →
							</Button>
						</div>
					</div>
				</div>
			{:else if activeTab === 'personal'}
				<div class="personal-tab">
					<div class="info-card large">
						<h3>Personal Information</h3>
						<dl class="two-col">
							<div class="info-row">
								<dt>Full Name</dt>
								<dd>{getFullName(employee)}</dd>
							</div>
							<div class="info-row">
								<dt>Email Address</dt>
								<dd>{employee.email}</dd>
							</div>
							<div class="info-row">
								<dt>Phone Number</dt>
								<dd>{employee.phone}</dd>
							</div>
							<div class="info-row">
								<dt>Date of Birth</dt>
								<dd>{formatDate(employee.dateOfBirth)}</dd>
							</div>
							<div class="info-row full-width">
								<dt>Address</dt>
								<dd>{employee.address}</dd>
							</div>
						</dl>
					</div>
				</div>
			{:else if activeTab === 'job'}
				<div class="job-tab">
					<div class="info-card large">
						<h3>Job Information</h3>
						<dl class="two-col">
							<div class="info-row">
								<dt>Department</dt>
								<dd>{employee.department}</dd>
							</div>
							<div class="info-row">
								<dt>Job Title</dt>
								<dd>{employee.jobTitle}</dd>
							</div>
							<div class="info-row">
								<dt>Employment Type</dt>
								<dd>{getEmploymentTypeLabel(employee.employmentType)}</dd>
							</div>
							<div class="info-row">
								<dt>Status</dt>
								<dd>
									<Badge variant={getStatusVariant(employee.status)} text={formatStatus(employee.status)} />
								</dd>
							</div>
							<div class="info-row">
								<dt>Start Date</dt>
								<dd>{formatDate(employee.startDate)}</dd>
							</div>
							<div class="info-row">
								<dt>Annual Salary</dt>
								<dd class="salary">{formatSalary(employee.salary)}</dd>
							</div>
						</dl>
					</div>
				</div>
			{:else if activeTab === 'documents'}
				<div class="documents-tab">
					<DocumentUpload
						documents={employee.documents}
						isLoading={$isLoading}
						onupload={handleDocumentUpload}
						ondelete={handleDocumentDelete}
					/>
				</div>
			{/if}
		</div>
	{/if}
</div>

<!-- Profile Picture Modal -->
<Modal isOpen={showPictureModal} title="Update Profile Picture" size="sm" onclose={() => (showPictureModal = false)}>
	{#if employee}
		<ProfilePictureUpload
			currentImage={employee.profilePicture}
			firstName={employee.firstName}
			lastName={employee.lastName}
			isLoading={$isLoading}
			onupload={handlePictureUpload}
			onremove={handlePictureRemove}
		/>
	{/if}
</Modal>

<!-- Delete Confirmation Modal -->
<Modal isOpen={showDeleteConfirm} title="Delete Employee" size="sm" onclose={() => (showDeleteConfirm = false)}>
	{#if employee}
		<p class="confirm-text">
			Are you sure you want to delete <strong>{getFullName(employee)}</strong>?
			This employee will be soft-deleted and can be restored later from the employees list.
		</p>
	{/if}

	{#snippet footer()}
		<Button variant="ghost" onclick={() => (showDeleteConfirm = false)}>Cancel</Button>
		<Button variant="danger" onclick={handleDelete} loading={$isLoading}>Delete</Button>
	{/snippet}
</Modal>

<style lang="scss">
	@use '$styles/variables' as *;

	.profile-page {
		max-width: $content-max-width;
		margin: 0 auto;
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

	// Profile Header
	.profile-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: $spacing-6;
		background: white;
		border-radius: $radius-xl;
		padding: $spacing-6;
		box-shadow: $shadow-md;
		border: 1px solid $neutral-100;
		margin-bottom: $spacing-6;
		flex-wrap: wrap;
	}

	.profile-left {
		display: flex;
		gap: $spacing-6;
		align-items: flex-start;

		@media (max-width: $breakpoint-md) {
			flex-direction: column;
			align-items: center;
			text-align: center;
			width: 100%;
		}
	}

	.avatar-btn {
		position: relative;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;

		&:hover .avatar-edit {
			opacity: 1;
		}
	}

	.avatar-edit {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 32px;
		height: 32px;
		background: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: $shadow-md;
		opacity: 0;
		transition: opacity $transition-fast;

		svg {
			width: 16px;
			height: 16px;
			color: $neutral-600;
		}
	}

	.profile-info {
		display: flex;
		flex-direction: column;
		gap: $spacing-2;

		h1 {
			font-size: $font-size-2xl;
			color: $neutral-900;
			margin: 0;
		}

		.job-title {
			font-size: $font-size-lg;
			color: $neutral-600;
			margin: 0;
		}
	}

	.quick-info {
		display: flex;
		gap: $spacing-4;
		flex-wrap: wrap;
		margin-top: $spacing-2;
	}

	.info-item {
		display: flex;
		align-items: center;
		gap: $spacing-2;
		font-size: $font-size-sm;
		color: $neutral-500;

		svg {
			width: 16px;
			height: 16px;
		}
	}

	.badges {
		display: flex;
		gap: $spacing-2;
		margin-top: $spacing-2;
		flex-wrap: wrap;
	}

	.profile-actions {
		display: flex;
		gap: $spacing-2;

		@media (max-width: $breakpoint-md) {
			width: 100%;
			justify-content: center;
		}
	}

	// Tabs
	.tabs-container {
		background: white;
		border-radius: $radius-xl $radius-xl 0 0;
		padding: $spacing-4 $spacing-6 0;
		border: 1px solid $neutral-100;
		border-bottom: none;
	}

	.tab-content {
		background: white;
		border-radius: 0 0 $radius-xl $radius-xl;
		padding: $spacing-6;
		border: 1px solid $neutral-100;
		border-top: none;
		box-shadow: $shadow-md;
	}

	// Overview Tab
	.info-grid {
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

	.info-card {
		background: $neutral-50;
		border-radius: $radius-lg;
		padding: $spacing-5;

		h3 {
			font-size: $font-size-base;
			font-weight: $font-weight-semibold;
			color: $neutral-900;
			margin: 0 0 $spacing-4 0;
			padding-bottom: $spacing-3;
			border-bottom: 1px solid $neutral-200;
		}

		&.large {
			grid-column: 1 / -1;
		}
	}

	dl {
		margin: 0;
	}

	.info-row {
		display: flex;
		flex-direction: column;
		gap: $spacing-1;
		margin-bottom: $spacing-3;

		&:last-child {
			margin-bottom: 0;
		}

		dt {
			font-size: $font-size-xs;
			font-weight: $font-weight-medium;
			color: $neutral-500;
			text-transform: uppercase;
			letter-spacing: 0.05em;
		}

		dd {
			font-size: $font-size-sm;
			color: $neutral-900;
			margin: 0;

			a {
				color: $primary-600;
				text-decoration: none;

				&:hover {
					text-decoration: underline;
				}
			}
		}
	}

	.two-col {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: $spacing-5;

		@media (max-width: $breakpoint-md) {
			grid-template-columns: 1fr;
		}

		.full-width {
			grid-column: 1 / -1;
		}
	}

	.salary {
		font-weight: $font-weight-semibold;
		color: $success-600 !important;
	}

	// Documents Summary
	.doc-summary {
		display: flex;
		align-items: center;
		gap: $spacing-2;
		margin-bottom: $spacing-3;

		.doc-count {
			font-size: $font-size-2xl;
			font-weight: $font-weight-bold;
			color: $primary-600;
		}

		span:last-child {
			color: $neutral-500;
			font-size: $font-size-sm;
		}
	}

	.doc-preview-list {
		list-style: none;
		margin: 0 0 $spacing-3 0;
		padding: 0;

		li {
			font-size: $font-size-sm;
			color: $neutral-600;
			padding: $spacing-1 0;

			&.more {
				color: $neutral-400;
				font-style: italic;
			}
		}
	}

	// Loading & Error States
	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 400px;
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

	.confirm-text {
		color: $neutral-600;
		line-height: $line-height-relaxed;

		strong {
			color: $neutral-900;
		}
	}
</style>
