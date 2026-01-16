<!--
  PositionsList Component
  Displays positions for a department with CRUD actions
-->
<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import type { Position, PositionFormData } from '$lib/types/department';
	import { getPositionLevelInfo, formatPositionSalary } from '$lib/types/department';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		positions: Position[];
		departmentName: string;
		canManage?: boolean;
		onaddposition?: () => void;
		oneditposition?: (position: Position) => void;
		ondeleteposition?: (position: Position) => void;
	}

	let {
		positions = [],
		departmentName = '',
		canManage = true,
		onaddposition,
		oneditposition,
		ondeleteposition
	}: Props = $props();

	// Get level badge color
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
</script>

<div class="positions-list">
	<div class="list-header">
		<h4>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
				<circle cx="9" cy="7" r="4" />
				<path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
			</svg>
			Positions
			<span class="count">{positions.length}</span>
		</h4>
		{#if canManage && onaddposition}
			<Button variant="ghost" size="sm" onclick={onaddposition}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
					<path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
				</svg>
				Add Position
			</Button>
		{/if}
	</div>

	{#if positions.length === 0}
		<div class="empty-state" in:fade>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
				<circle cx="9" cy="7" r="4" />
				<path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
			</svg>
			<p>No positions defined yet</p>
			{#if canManage && onaddposition}
				<Button variant="outline" size="sm" onclick={onaddposition}>
					Add First Position
				</Button>
			{/if}
		</div>
	{:else}
		<ul class="positions-grid">
			{#each positions as position (position.id)}
				<li class="position-item" in:slide={{ duration: 200 }}>
					<div class="position-info">
						<div class="position-header">
							<span class="position-title">{position.title}</span>
							<Badge variant={getLevelColor(position.level)} size="sm">
								{getPositionLevelInfo(position.level).label}
							</Badge>
						</div>
						{#if position.description}
							<p class="position-description">{position.description}</p>
						{/if}
						{#if position.baseSalary}
							<span class="position-salary">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								{formatPositionSalary(position.baseSalary)}
							</span>
						{/if}
					</div>
					{#if canManage}
						<div class="position-actions">
							{#if oneditposition}
								<button
									class="action-btn edit"
									onclick={() => oneditposition(position)}
									title="Edit position"
								>
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
										<path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
									</svg>
								</button>
							{/if}
							{#if ondeleteposition}
								<button
									class="action-btn delete"
									onclick={() => ondeleteposition(position)}
									title="Delete position"
								>
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
									</svg>
								</button>
							{/if}
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style lang="scss">
	@use '$styles/variables' as *;

	.positions-list {
		background: $neutral-50;
		border-radius: $radius-lg;
		padding: $spacing-4;
	}

	.list-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: $spacing-4;

		h4 {
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

			.count {
				background: $neutral-200;
				padding: 2px 8px;
				border-radius: $radius-full;
				font-size: $font-size-xs;
				font-weight: $font-weight-medium;
			}
		}
	}

	.empty-state {
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
			font-size: $font-size-sm;
		}
	}

	.positions-grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: $spacing-2;
	}

	.position-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: $spacing-4;
		background: white;
		padding: $spacing-3 $spacing-4;
		border-radius: $radius-md;
		border: 1px solid $neutral-200;
		transition: all $transition-fast;

		&:hover {
			border-color: $neutral-300;
			box-shadow: $shadow-sm;

			.position-actions {
				opacity: 1;
			}
		}
	}

	.position-info {
		flex: 1;
		min-width: 0;
	}

	.position-header {
		display: flex;
		align-items: center;
		gap: $spacing-2;
		margin-bottom: $spacing-1;
	}

	.position-title {
		font-weight: $font-weight-medium;
		color: $neutral-800;
	}

	.position-description {
		margin: 0 0 $spacing-1 0;
		font-size: $font-size-xs;
		color: $neutral-500;
		line-height: $line-height-tight;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.position-salary {
		display: inline-flex;
		align-items: center;
		gap: $spacing-1;
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
		color: $success-600;

		svg {
			width: 12px;
			height: 12px;
		}
	}

	.position-actions {
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
		background: transparent;
		border-radius: $radius-md;
		cursor: pointer;
		transition: all $transition-fast;

		svg {
			width: 16px;
			height: 16px;
		}

		&.edit {
			color: $primary-500;

			&:hover {
				background: $primary-50;
				color: $primary-600;
			}
		}

		&.delete {
			color: $neutral-400;

			&:hover {
				background: $danger-50;
				color: $danger-600;
			}
		}
	}
</style>
