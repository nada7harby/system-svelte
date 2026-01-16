<!--
  Settings Page (Placeholder)
  To be implemented in Phase 2
-->
<script lang="ts">
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>Settings | HR Management System</title>
</svelte:head>

<div class="page-container" in:fade={{ duration: 200 }}>
	<div class="page-header">
		<h1>Settings</h1>
		<p>Configure system preferences and account settings</p>
	</div>

	<div class="placeholder-card">
		<div class="placeholder-icon">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="3" />
				<path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01.18 2.66 2 2 0 01-2.84.18l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.41a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.66.18 2 2 0 01-.18-2.84l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.59 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 01-.18-2.66 2 2 0 012.84-.18l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.66-.18 2 2 0 01.18 2.84l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
			</svg>
		</div>
		<h2>Coming Soon</h2>
		<p>The Settings module is under development and will be available in Phase 2.</p>
		<div class="features-preview">
			<span class="feature-tag">Profile Settings</span>
			<span class="feature-tag">Notifications</span>
			<span class="feature-tag">Security</span>
			<span class="feature-tag">Integrations</span>
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
		background: linear-gradient(135deg, $neutral-100 0%, $neutral-200 100%);
		border-radius: $radius-2xl;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: $spacing-6;

		svg {
			width: 40px;
			height: 40px;
			color: $neutral-600;
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
