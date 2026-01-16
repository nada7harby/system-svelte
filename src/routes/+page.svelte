<!--
  Root Page
  Redirects to dashboard (if authenticated) or login page
-->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { isAuthenticated } from '$lib/stores/auth';

	// Redirect on mount based on auth status
	$effect(() => {
		if (browser) {
			if ($isAuthenticated) {
				goto('/dashboard');
			} else {
				goto('/login');
			}
		}
	});
</script>

<svelte:head>
	<title>HR Management System</title>
</svelte:head>

<!-- Loading state while redirect happens -->
<div class="loading-container">
	<div class="loading-spinner"></div>
	<p>Loading...</p>
</div>

<style lang="scss">
	@use '$styles/variables' as *;

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: $neutral-50;
		gap: $spacing-4;
	}

	.loading-spinner {
		width: 48px;
		height: 48px;
		border: 4px solid $neutral-200;
		border-top-color: $primary-500;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	p {
		color: $neutral-500;
		font-size: $font-size-sm;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
