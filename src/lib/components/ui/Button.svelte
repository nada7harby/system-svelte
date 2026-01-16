<!--
  Button Component
  A versatile, reusable button with multiple variants and sizes
  Supports icons, loading states, and various visual styles
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	// Props interface
	interface Props {
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		loading?: boolean;
		fullWidth?: boolean;
		onclick?: () => void;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		type = 'button',
		disabled = false,
		loading = false,
		fullWidth = false,
		onclick,
		children
	}: Props = $props();

	// Computed class based on variant and size
	const getClasses = () => {
		return `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${loading ? 'btn-loading' : ''}`;
	};
</script>

<button class={getClasses()} {type} disabled={disabled || loading} {onclick}>
	{#if loading}
		<span class="spinner"></span>
	{/if}
	<span class="btn-content" class:hidden={loading}>
		{#if children}
			{@render children()}
		{/if}
	</span>
</button>

<style lang="scss">
	@use '$styles/variables' as *;

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: $spacing-2;
		font-family: $font-family-base;
		font-weight: $font-weight-medium;
		border-radius: $radius-lg;
		cursor: pointer;
		transition:
			background $transition-fast,
			transform $transition-fast,
			box-shadow $transition-fast,
			border-color $transition-fast;
		border: 2px solid transparent;
		position: relative;

		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}

		&:not(:disabled):active {
			transform: scale(0.98);
		}
	}

	// Size variants
	.btn-sm {
		padding: $spacing-2 $spacing-3;
		font-size: $font-size-sm;
	}

	.btn-md {
		padding: $spacing-2 $spacing-5;
		font-size: $font-size-base;
		min-height: 44px;
	}

	.btn-lg {
		padding: $spacing-3 $spacing-6;
		font-size: $font-size-lg;
		min-height: 52px;
	}

	// Variant styles
	.btn-primary {
		background: linear-gradient(135deg, $primary-500 0%, $primary-600 100%);
		color: white;
		box-shadow: 0 2px 8px rgba($primary-500, 0.3);

		&:not(:disabled):hover {
			background: linear-gradient(135deg, $primary-600 0%, $primary-700 100%);
			box-shadow: 0 4px 12px rgba($primary-500, 0.4);
		}
	}

	.btn-secondary {
		background: linear-gradient(135deg, $secondary-500 0%, $secondary-600 100%);
		color: white;
		box-shadow: 0 2px 8px rgba($secondary-500, 0.3);

		&:not(:disabled):hover {
			background: linear-gradient(135deg, $secondary-600 0%, $secondary-700 100%);
		}
	}

	.btn-outline {
		background: transparent;
		border-color: $primary-500;
		color: $primary-600;

		&:not(:disabled):hover {
			background: $primary-50;
			border-color: $primary-600;
		}
	}

	.btn-ghost {
		background: transparent;
		color: $neutral-600;

		&:not(:disabled):hover {
			background: $neutral-100;
			color: $neutral-900;
		}
	}

	.btn-danger {
		background: linear-gradient(135deg, $error-500 0%, $error-600 100%);
		color: white;
		box-shadow: 0 2px 8px rgba($error-500, 0.3);

		&:not(:disabled):hover {
			background: linear-gradient(135deg, $error-600 0%, $error-700 100%);
		}
	}

	.btn-full {
		width: 100%;
	}

	.btn-loading {
		pointer-events: none;
	}

	.btn-content.hidden {
		visibility: hidden;
	}

	// Loading spinner
	.spinner {
		position: absolute;
		width: 20px;
		height: 20px;
		border: 2px solid transparent;
		border-top-color: currentColor;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
