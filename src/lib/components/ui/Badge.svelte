<!--
  Badge Component
  Status indicator badges with color variants
-->
<script lang="ts">
	interface Props {
		variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
		size?: 'sm' | 'md';
		dot?: boolean;
		text: string;
	}

	let { variant = 'default', size = 'md', dot = true, text }: Props = $props();
</script>

<span class="badge badge-{variant} badge-{size}">
	{#if dot}
		<span class="badge-dot"></span>
	{/if}
	{text}
</span>

<style lang="scss">
	@use '$styles/variables' as *;

	.badge {
		display: inline-flex;
		align-items: center;
		gap: $spacing-2;
		font-weight: $font-weight-medium;
		border-radius: $radius-full;
		white-space: nowrap;
	}

	.badge-sm {
		padding: 2px $spacing-2;
		font-size: $font-size-xs;
	}

	.badge-md {
		padding: $spacing-1 $spacing-3;
		font-size: $font-size-sm;
	}

	.badge-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
	}

	// Variants
	.badge-default,
	.badge-success {
		background: $success-50;
		color: $success-700;

		.badge-dot {
			background: $success-500;
		}
	}

	.badge-warning {
		background: $warning-50;
		color: $warning-600;

		.badge-dot {
			background: $warning-500;
		}
	}

	.badge-error {
		background: $error-50;
		color: $error-700;

		.badge-dot {
			background: $error-500;
		}
	}

	.badge-info {
		background: $info-50;
		color: $info-600;

		.badge-dot {
			background: $info-500;
		}
	}

	.badge-neutral {
		background: $neutral-100;
		color: $neutral-600;

		.badge-dot {
			background: $neutral-400;
		}
	}
</style>
