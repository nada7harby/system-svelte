<!--
  Pagination Component
  Table pagination with page numbers and page size selector
-->
<script lang="ts">
	import type { PaginationState } from '$lib/types/employee';
	import { PAGE_SIZES } from '$lib/types/employee';

	interface Props {
		pagination: PaginationState;
		onpagechange?: (page: number) => void;
		onpagesizechange?: (size: number) => void;
	}

	let { pagination, onpagechange, onpagesizechange }: Props = $props();

	// Generate page numbers to show
	const getPageNumbers = (current: number, total: number): (number | 'ellipsis')[] => {
		const pages: (number | 'ellipsis')[] = [];
		const maxVisible = 5;

		if (total <= maxVisible + 2) {
			for (let i = 1; i <= total; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			if (current > 3) {
				pages.push('ellipsis');
			}

			const start = Math.max(2, current - 1);
			const end = Math.min(total - 1, current + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (current < total - 2) {
				pages.push('ellipsis');
			}

			pages.push(total);
		}

		return pages;
	};

	const pageNumbers = $derived(getPageNumbers(pagination.currentPage, pagination.totalPages));

	const handlePageSizeChange = (e: Event) => {
		const target = e.target as HTMLSelectElement;
		onpagesizechange?.(parseInt(target.value, 10));
	};
</script>

<div class="pagination">
	<div class="pagination-info">
		<span class="info-text">
			Showing {Math.min(
				(pagination.currentPage - 1) * pagination.pageSize + 1,
				pagination.totalItems
			)} to {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems}
			results
		</span>
	</div>

	<div class="pagination-controls">
		<div class="page-size">
			<span>Show</span>
			<select value={pagination.pageSize} onchange={handlePageSizeChange}>
				{#each PAGE_SIZES as size}
					<option value={size}>{size}</option>
				{/each}
			</select>
		</div>

		<div class="page-buttons">
			<button
				class="page-btn nav-btn"
				disabled={pagination.currentPage === 1}
				onclick={() => onpagechange?.(pagination.currentPage - 1)}
				aria-label="Previous page"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M15 18l-6-6 6-6" />
				</svg>
			</button>

			{#each pageNumbers as page}
				{#if page === 'ellipsis'}
					<span class="page-ellipsis">...</span>
				{:else}
					<button
						class="page-btn"
						class:active={page === pagination.currentPage}
						onclick={() => onpagechange?.(page)}
					>
						{page}
					</button>
				{/if}
			{/each}

			<button
				class="page-btn nav-btn"
				disabled={pagination.currentPage === pagination.totalPages}
				onclick={() => onpagechange?.(pagination.currentPage + 1)}
				aria-label="Next page"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M9 18l6-6-6-6" />
				</svg>
			</button>
		</div>
	</div>
</div>

<style lang="scss">
	@use '$styles/variables' as *;

	.pagination {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: $spacing-4 $spacing-5;
		border-top: 1px solid $neutral-200;
		background: $neutral-50;
		border-radius: 0 0 $radius-xl $radius-xl;
		gap: $spacing-4;
		flex-wrap: wrap;
	}

	.pagination-info {
		.info-text {
			font-size: $font-size-sm;
			color: $neutral-600;
		}
	}

	.pagination-controls {
		display: flex;
		align-items: center;
		gap: $spacing-4;
	}

	.page-size {
		display: flex;
		align-items: center;
		gap: $spacing-2;
		font-size: $font-size-sm;
		color: $neutral-600;

		select {
			padding: $spacing-2 $spacing-8 $spacing-2 $spacing-3;
			font-size: $font-size-sm;
			border: 1px solid $neutral-200;
			border-radius: $radius-md;
			background: white;
			cursor: pointer;
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

	.page-buttons {
		display: flex;
		align-items: center;
		gap: $spacing-1;
	}

	.page-btn {
		min-width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		color: $neutral-600;
		background: white;
		border: 1px solid $neutral-200;
		border-radius: $radius-md;
		cursor: pointer;
		transition: all $transition-fast;

		svg {
			width: 16px;
			height: 16px;
		}

		&:hover:not(:disabled) {
			background: $neutral-100;
			border-color: $neutral-300;
		}

		&.active {
			background: $primary-600;
			border-color: $primary-600;
			color: white;
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	.nav-btn {
		padding: 0 $spacing-2;
	}

	.page-ellipsis {
		padding: 0 $spacing-2;
		color: $neutral-400;
	}

	@media (max-width: $breakpoint-md) {
		.pagination {
			flex-direction: column;
			align-items: stretch;
			text-align: center;
		}

		.pagination-controls {
			justify-content: center;
		}
	}
</style>
