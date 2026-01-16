<!--
  Input Component
  A styled form input with label, error handling, and icon support
  Supports various input types and validation states
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	// Props interface
	interface Props {
		type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'search';
		name?: string;
		value?: string;
		placeholder?: string;
		label?: string;
		error?: string;
		disabled?: boolean;
		required?: boolean;
		autocomplete?: string;
		oninput?: (e: Event) => void;
		onchange?: (e: Event) => void;
		icon?: Snippet;
	}

	let {
		type = 'text',
		name = '',
		value = $bindable(''),
		placeholder = '',
		label = '',
		error = '',
		disabled = false,
		required = false,
		autocomplete = 'off',
		oninput,
		onchange,
		icon
	}: Props = $props();

	// Handle input events
	const handleInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		value = target.value;
		oninput?.(e);
	};
</script>

<div class="input-wrapper" class:has-error={error} class:has-icon={icon}>
	{#if label}
		<label for={name} class="input-label">
			{label}
			{#if required}
				<span class="required-marker">*</span>
			{/if}
		</label>
	{/if}

	<div class="input-container">
		{#if icon}
			<span class="input-icon">
				{@render icon()}
			</span>
		{/if}

		<input
			{type}
			{name}
			id={name}
			{value}
			{placeholder}
			{disabled}
			{required}
			{autocomplete}
			class="input-field"
			oninput={handleInput}
			{onchange}
		/>
	</div>

	{#if error}
		<span class="input-error">{error}</span>
	{/if}
</div>

<style lang="scss">
	@use '$styles/variables' as *;

	.input-wrapper {
		display: flex;
		flex-direction: column;
		gap: $spacing-2;
		width: 100%;
	}

	.input-label {
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		color: $neutral-700;
		display: flex;
		align-items: center;
		gap: $spacing-1;
	}

	.required-marker {
		color: $error-500;
	}

	.input-container {
		position: relative;
		display: flex;
		align-items: center;
	}

	.input-icon {
		position: absolute;
		left: $spacing-4;
		color: $neutral-400;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		transition: color $transition-fast;

		:global(svg) {
			width: 20px;
			height: 20px;
		}
	}

	.input-field {
		width: 100%;
		padding: $spacing-3 $spacing-4;
		font-size: $font-size-base;
		font-family: $font-family-base;
		color: $neutral-900;
		background: white;
		border: 2px solid $neutral-200;
		border-radius: $radius-lg;
		transition:
			border-color $transition-fast,
			box-shadow $transition-fast,
			background $transition-fast;
		outline: none;

		&::placeholder {
			color: $neutral-400;
		}

		&:hover:not(:disabled) {
			border-color: $neutral-300;
		}

		&:focus {
			border-color: $primary-500;
			box-shadow: 0 0 0 3px rgba($primary-500, 0.15);
		}

		&:disabled {
			background: $neutral-100;
			color: $neutral-500;
			cursor: not-allowed;
		}
	}

	.has-icon .input-field {
		padding-left: $spacing-12;
	}

	.has-icon .input-field:focus ~ .input-icon,
	.has-icon .input-field:focus + .input-icon {
		color: $primary-500;
	}

	.has-error {
		.input-field {
			border-color: $error-500;

			&:focus {
				box-shadow: 0 0 0 3px rgba($error-500, 0.15);
			}
		}

		.input-icon {
			color: $error-500;
		}
	}

	.input-error {
		font-size: $font-size-sm;
		color: $error-600;
		display: flex;
		align-items: center;
		gap: $spacing-1;
	}
</style>
