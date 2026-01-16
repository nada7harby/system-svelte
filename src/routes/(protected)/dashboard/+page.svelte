<!--
  Dashboard Page
  Main dashboard with statistics cards and overview widgets
  Displays key HR metrics at a glance
-->
<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { employeeStats, departmentStats } from '$lib';

	// Dashboard stats configuration
	const stats = $derived([
		{
			label: 'Total Employees',
			value: $employeeStats.total,
			change: '+12%',
			changeType: 'positive' as const,
			icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
			color: 'primary'
		},
		{
			label: 'Active Employees',
			value: $employeeStats.active,
			change: '+8%',
			changeType: 'positive' as const,
			icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
			color: 'success'
		},
		{
			label: 'On Leave',
			value: $employeeStats.onLeave,
			change: '-2',
			changeType: 'neutral' as const,
			icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
			color: 'warning'
		},
		{
			label: 'Departments',
			value: $departmentStats.total,
			change: '0',
			changeType: 'neutral' as const,
			icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
			color: 'secondary'
		}
	]);

	// Quick actions
	const quickActions = [
		{ label: 'Add Employee', href: '/employees', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
		{
			label: 'View Reports',
			href: '/dashboard',
			icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
		},
		{ label: 'Manage Leaves', href: '/leaves', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
	];

	// Recent activities
	const recentActivities = [
		{
			type: 'new_employee',
			message: 'Alice Thompson joined the Engineering team',
			time: '2 hours ago'
		},
		{ type: 'leave_approved', message: "Daniel Lee's leave request was approved", time: '4 hours ago' },
		{
			type: 'department_update',
			message: 'Marketing department budget updated',
			time: 'Yesterday'
		},
		{ type: 'new_employee', message: 'James Wilson joined as Frontend Developer', time: '2 days ago' },
		{ type: 'attendance', message: 'Weekly attendance report generated', time: '3 days ago' }
	];
</script>

<svelte:head>
	<title>Dashboard | HR Management System</title>
</svelte:head>

<div class="dashboard" in:fade={{ duration: 200 }}>
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<h1>Dashboard</h1>
			<p>Welcome to your HR management overview</p>
		</div>
		<div class="header-actions">
			<button class="refresh-btn">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path
						d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
					/>
				</svg>
				Refresh
			</button>
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="stats-grid">
		{#each stats as stat, index}
			<div
				class="stat-card stat-{stat.color}"
				in:fly={{ y: 20, delay: index * 100, duration: 300 }}
			>
				<div class="stat-icon">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d={stat.icon} />
					</svg>
				</div>
				<div class="stat-content">
					<span class="stat-label">{stat.label}</span>
					<span class="stat-value">{stat.value}</span>
					<span class="stat-change change-{stat.changeType}">{stat.change}</span>
				</div>
			</div>
		{/each}
	</div>

	<!-- Main Content Grid -->
	<div class="content-grid">
		<!-- Quick Actions -->
		<div class="card quick-actions-card" in:fly={{ y: 20, delay: 400, duration: 300 }}>
			<h3 class="card-title">Quick Actions</h3>
			<div class="quick-actions">
				{#each quickActions as action}
					<a href={action.href} class="action-btn">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d={action.icon} />
						</svg>
						<span>{action.label}</span>
					</a>
				{/each}
			</div>
		</div>

		<!-- Recent Activity -->
		<div class="card activity-card" in:fly={{ y: 20, delay: 500, duration: 300 }}>
			<h3 class="card-title">Recent Activity</h3>
			<ul class="activity-list">
				{#each recentActivities as activity, i}
					<li class="activity-item" style="--delay: {i * 50}ms">
						<div class="activity-dot"></div>
						<div class="activity-content">
							<p class="activity-message">{activity.message}</p>
							<span class="activity-time">{activity.time}</span>
						</div>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Department Overview -->
		<div class="card department-overview" in:fly={{ y: 20, delay: 600, duration: 300 }}>
			<h3 class="card-title">Department Overview</h3>
			<div class="overview-stats">
				<div class="overview-item">
					<span class="overview-label">Total Departments</span>
					<span class="overview-value">{$departmentStats.total}</span>
				</div>
				<div class="overview-item">
					<span class="overview-label">Total Employees</span>
					<span class="overview-value">{$departmentStats.totalEmployees}</span>
				</div>
				<div class="overview-item">
					<span class="overview-label">Total Budget</span>
					<span class="overview-value">
						${($departmentStats.totalBudget / 1000000).toFixed(1)}M
					</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	@use '$styles/variables' as *;

	.dashboard {
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

	.refresh-btn {
		display: flex;
		align-items: center;
		gap: $spacing-2;
		padding: $spacing-3 $spacing-4;
		background: white;
		border: 1px solid $neutral-200;
		border-radius: $radius-lg;
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		color: $neutral-700;
		cursor: pointer;
		transition: all $transition-fast;

		svg {
			width: 18px;
			height: 18px;
		}

		&:hover {
			background: $neutral-50;
			border-color: $neutral-300;
		}
	}

	// Stats Grid
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: $spacing-6;
		margin-bottom: $spacing-8;

		@media (max-width: $breakpoint-xl) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (max-width: $breakpoint-md) {
			grid-template-columns: 1fr;
		}
	}

	.stat-card {
		background: white;
		border-radius: $radius-xl;
		padding: $spacing-6;
		display: flex;
		align-items: flex-start;
		gap: $spacing-4;
		box-shadow: $shadow-md;
		border: 1px solid $neutral-100;
		transition:
			transform $transition-base,
			box-shadow $transition-base;

		&:hover {
			transform: translateY(-4px);
			box-shadow: $shadow-lg;
		}
	}

	.stat-icon {
		width: 52px;
		height: 52px;
		border-radius: $radius-xl;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;

		svg {
			width: 26px;
			height: 26px;
		}
	}

	.stat-primary .stat-icon {
		background: linear-gradient(135deg, $primary-100 0%, $primary-200 100%);
		svg {
			color: $primary-600;
		}
	}

	.stat-success .stat-icon {
		background: linear-gradient(135deg, $success-100 0%, $success-100 100%);
		svg {
			color: $success-600;
		}
	}

	.stat-warning .stat-icon {
		background: linear-gradient(135deg, $warning-100 0%, $warning-100 100%);
		svg {
			color: $warning-600;
		}
	}

	.stat-secondary .stat-icon {
		background: linear-gradient(135deg, $secondary-100 0%, $secondary-200 100%);
		svg {
			color: $secondary-600;
		}
	}

	.stat-content {
		display: flex;
		flex-direction: column;
		gap: $spacing-1;
	}

	.stat-label {
		font-size: $font-size-sm;
		color: $neutral-500;
	}

	.stat-value {
		font-size: $font-size-3xl;
		font-weight: $font-weight-bold;
		color: $neutral-900;
		line-height: 1;
	}

	.stat-change {
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;

		&.change-positive {
			color: $success-600;
		}
		&.change-negative {
			color: $error-600;
		}
		&.change-neutral {
			color: $neutral-500;
		}
	}

	// Content Grid
	.content-grid {
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

	.card {
		background: white;
		border-radius: $radius-xl;
		padding: $spacing-6;
		box-shadow: $shadow-md;
		border: 1px solid $neutral-100;
	}

	.card-title {
		font-size: $font-size-lg;
		font-weight: $font-weight-semibold;
		color: $neutral-900;
		margin: 0 0 $spacing-5 0;
		padding-bottom: $spacing-4;
		border-bottom: 1px solid $neutral-100;
	}

	// Quick Actions
	.quick-actions {
		display: flex;
		flex-direction: column;
		gap: $spacing-3;
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: $spacing-3;
		padding: $spacing-4;
		background: $neutral-50;
		border-radius: $radius-lg;
		color: $neutral-700;
		text-decoration: none;
		font-weight: $font-weight-medium;
		transition: all $transition-fast;

		svg {
			width: 22px;
			height: 22px;
			color: $primary-500;
		}

		&:hover {
			background: $primary-50;
			color: $primary-700;
			transform: translateX(4px);
		}
	}

	// Activity List
	.activity-list {
		display: flex;
		flex-direction: column;
		gap: $spacing-4;
	}

	.activity-item {
		display: flex;
		align-items: flex-start;
		gap: $spacing-3;
		animation: slideIn 0.3s ease forwards;
		animation-delay: var(--delay);
		opacity: 0;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(-10px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.activity-dot {
		width: 8px;
		height: 8px;
		background: $primary-500;
		border-radius: 50%;
		margin-top: 6px;
		flex-shrink: 0;
	}

	.activity-content {
		flex: 1;
	}

	.activity-message {
		font-size: $font-size-sm;
		color: $neutral-700;
		margin: 0;
		line-height: 1.4;
	}

	.activity-time {
		font-size: $font-size-xs;
		color: $neutral-400;
	}

	// Department Overview
	.overview-stats {
		display: flex;
		flex-direction: column;
		gap: $spacing-4;
	}

	.overview-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: $spacing-4;
		background: $neutral-50;
		border-radius: $radius-lg;
	}

	.overview-label {
		font-size: $font-size-sm;
		color: $neutral-600;
	}

	.overview-value {
		font-size: $font-size-xl;
		font-weight: $font-weight-bold;
		color: $neutral-900;
	}
</style>
