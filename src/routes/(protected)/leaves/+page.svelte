<!--
  Leaves Page (Placeholder)
  To be implemented in Phase 2
-->
<script lang="ts">
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>Leaves | HR Management System</title>
</svelte:head>

<div class="page-container" in:fade={{ duration: 200 }}>
	<div class="page-header">
		<h1>Leave Management</h1>
		<p>Manage employee vacation and leave requests</p>
	</div>

	<div class="placeholder-card">
		<div class="placeholder-icon">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
				<polyline points="17 21 17 13 7 13 7 21" />
				<polyline points="7 3 7 8 15 8" />
			</svg>
		</div>
		<h2>Coming Soon</h2>
		<p>The Leave Management module is under development and will be available in Phase 2.</p>
		<div class="features-preview">
			<span class="feature-tag">Leave Requests</span>
			<span class="feature-tag">Approvals</span>
			<span class="feature-tag">Leave Balance</span>
			<span class="feature-tag">Calendar View</span>
		</div>
	</div>
</div>

<style lang="scss">
	@use '$styles/variables' as *;

	.page-container {
		max-width: $content-max-width;
		margin: 0 auto;
	}

	.page-header {
		margin-bottom: $spacing-8;

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

	.placeholder-card {
		background: white;
		border-radius: $radius-xl;
		padding: $spacing-12;
		box-shadow: $shadow-md;
		border: 1px solid $neutral-100;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.placeholder-icon {
		width: 80px;
		height: 80px;
		background: linear-gradient(135deg, $warning-100 0%, $warning-100 100%);
		border-radius: $radius-2xl;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: $spacing-6;

		svg {
			width: 40px;
			height: 40px;
			color: $warning-600;
		}
	}

	h2 {
		font-size: $font-size-2xl;
		color: $neutral-900;
		margin: 0 0 $spacing-3 0;
	}

	p {
		color: $neutral-500;
		max-width: 400px;
		margin: 0 0 $spacing-6 0;
	}

	.features-preview {
		display: flex;
		gap: $spacing-2;
		flex-wrap: wrap;
		justify-content: center;
	}

	.feature-tag {
		padding: $spacing-2 $spacing-4;
		background: $neutral-100;
		color: $neutral-600;
		border-radius: $radius-full;
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
	}
</style>
