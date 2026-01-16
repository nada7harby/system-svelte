<!--
  Tabs Component
  Horizontal tabs with animated indicator
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Tab {
		id: string;
		label: string;
		icon?: string;
	}

	interface Props {
		tabs: Tab[];
		activeTab: string;
		ontabchange?: (tabId: string) => void;
	}

	let { tabs, activeTab = $bindable(), ontabchange }: Props = $props();

	const handleTabClick = (tabId: string) => {
		activeTab = tabId;
		ontabchange?.(tabId);
	};
</script>

<div class="tabs-container">
	<div class="tabs-list" role="tablist">
		{#each tabs as tab}
			<button
				class="tab-item"
				class:active={activeTab === tab.id}
				role="tab"
				aria-selected={activeTab === tab.id}
				onclick={() => handleTabClick(tab.id)}
			>
				{#if tab.icon}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d={tab.icon} />
					</svg>
				{/if}
				{tab.label}
			</button>
		{/each}
	</div>
</div>

<style lang="scss">
	@use '$styles/variables' as *;

	.tabs-container {
		width: 100%;
	}

	.tabs-list {
		display: flex;
		gap: $spacing-1;
		border-bottom: 2px solid $neutral-200;
		overflow-x: auto;
		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.tab-item {
		display: flex;
		align-items: center;
		gap: $spacing-2;
		padding: $spacing-3 $spacing-5;
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		color: $neutral-500;
		background: transparent;
		border: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		cursor: pointer;
		white-space: nowrap;
		transition: all $transition-fast;

		svg {
			width: 18px;
			height: 18px;
		}

		&:hover {
			color: $neutral-700;
			background: $neutral-50;
		}

		&.active {
			color: $primary-600;
			border-bottom-color: $primary-600;
		}
	}
</style>
