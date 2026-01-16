<!--
  Protected Layout
  Layout wrapper for authenticated pages with sidebar and navbar
  Redirects to login if user is not authenticated
-->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { isAuthenticated } from '$lib/stores/auth';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	// Reactive effect to handle auth redirect
	$effect(() => {
		if (browser && !$isAuthenticated) {
			goto('/login');
		}
	});
</script>

{#if $isAuthenticated}
	<div class="app-layout">
		<Sidebar />
		<div class="main-wrapper">
			<Navbar />
			<main class="main-content">
				{@render children()}
			</main>
		</div>
	</div>
{:else}
	<div class="loading-container">
		<div class="loading-spinner"></div>
	</div>
{/if}

<style lang="scss">
	@use '$styles/variables' as *;

	.app-layout {
		display: flex;
		min-height: 100vh;
		background: $neutral-50;
	}

	.main-wrapper {
		flex: 1;
		margin-left: $sidebar-width;
		display: flex;
		flex-direction: column;
		min-height: 100vh;

		@media (max-width: $breakpoint-lg) {
			margin-left: 0;
		}
	}

	.main-content {
		flex: 1;
		padding: $spacing-6;
		overflow-y: auto;
		animation: fadeIn 0.3s ease;

		@media (max-width: $breakpoint-md) {
			padding: $spacing-4;
		}
	}

	.loading-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: $neutral-50;
	}

	.loading-spinner {
		width: 48px;
		height: 48px;
		border: 4px solid $neutral-200;
		border-top-color: $primary-500;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
