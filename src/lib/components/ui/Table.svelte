<!--
  Table Component
  A flexible, styled data table with sorting, hover effects, and responsive design
  Uses slots for customizable table content
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	// Column definition interface
	interface Column {
		key: string;
		label: string;
		sortable?: boolean;
		width?: string;
	}

	interface Props {
		columns: Column[];
		data: Record<string, unknown>[];
		emptyMessage?: string;
		loading?: boolean;
		cellRenderer?: Snippet<[{ row: Record<string, unknown>; column: Column; value: unknown }]>;
		headerRenderer?: Snippet<[{ column: Column }]>;
	}

	let {
		columns,
		data,
		emptyMessage = 'No data available',
		loading = false,
		cellRenderer,
		headerRenderer
	}: Props = $props();
</script>

<div class="table-container">
	{#if loading}
		<div class="table-loading">
			<div class="loading-spinner"></div>
			<span>Loading data...</span>
		</div>
	{:else}
		<table class="data-table">
			<thead>
				<tr>
					{#each columns as column}
						<th style={column.width ? `width: ${column.width}` : ''}>
							{#if headerRenderer}
								{@render headerRenderer({ column })}
							{:else}
								{column.label}
							{/if}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#if data.length === 0}
					<tr class="empty-row">
						<td colspan={columns.length}>
							<div class="empty-state">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="48"
									height="48"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
								>
									<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
									<polyline points="13 2 13 9 20 9" />
								</svg>
								<span>{emptyMessage}</span>
							</div>
						</td>
					</tr>
				{:else}
					{#each data as row, index}
						<tr class="data-row" style="--row-index: {index}">
							{#each columns as column}
								<td>
									{#if cellRenderer}
										{@render cellRenderer({ row, column, value: row[column.key] })}
									{:else}
										{row[column.key]}
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	{/if}
</div>

<style lang="scss">
	@use '$styles/variables' as *;

	.table-container {
		width: 100%;
		overflow-x: auto;
		background: white;
		border-radius: $radius-xl;
		box-shadow: $shadow-md;
		border: 1px solid $neutral-200;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
	}

	thead {
		tr {
			background: linear-gradient(135deg, $neutral-50 0%, $neutral-100 100%);
			border-bottom: 2px solid $neutral-200;
		}

		th {
			padding: $spacing-4 $spacing-5;
			text-align: left;
			font-size: $font-size-sm;
			font-weight: $font-weight-semibold;
			color: $neutral-700;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			white-space: nowrap;
		}
	}

	tbody {
		.data-row {
			border-bottom: 1px solid $neutral-100;
			transition:
				background $transition-fast,
				transform $transition-fast;
			animation: fadeInRow 0.3s ease forwards;
			animation-delay: calc(var(--row-index) * 0.03s);
			opacity: 0;

			&:last-child {
				border-bottom: none;
			}

			&:hover {
				background: $neutral-50;
			}
		}

		td {
			padding: $spacing-4 $spacing-5;
			font-size: $font-size-sm;
			color: $neutral-700;
			vertical-align: middle;
		}
	}

	.empty-row {
		td {
			padding: $spacing-12 $spacing-6;
		}
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $spacing-3;
		color: $neutral-400;

		svg {
			opacity: 0.5;
		}

		span {
			font-size: $font-size-base;
		}
	}

	.table-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: $spacing-4;
		padding: $spacing-12;
		color: $neutral-500;
	}

	.loading-spinner {
		width: 32px;
		height: 32px;
		border: 3px solid $neutral-200;
		border-top-color: $primary-500;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
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

	// Responsive adjustments
	@media (max-width: $breakpoint-md) {
		thead th,
		tbody td {
			padding: $spacing-3 $spacing-3;
		}
	}
</style>
