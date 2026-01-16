<!--
  FormField Component
  Wrapper for form inputs with label and error message
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		name: string;
		error?: string;
		required?: boolean;
		hint?: string;
		children: Snippet;
	}

	let { label, name, error = '', required = false, hint = '', children }: Props = $props();
</script>

<div class="form-field" class:has-error={error}>
	<label for={name} class="field-label">
		{label}
		{#if required}
			<span class="required">*</span>
		{/if}
	</label>

	<div class="field-input">
		{@render children()}
	</div>

	{#if error}
		<span class="field-error">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10" />
				<line x1="12" y1="8" x2="12" y2="12" />
				<line x1="12" y1="16" x2="12.01" y2="16" />
			</svg>
			{error}
		</span>
	{:else if hint}
		<span class="field-hint">{hint}</span>
	{/if}
</div>

<style lang="scss">
	@use '$styles/variables' as *;

	.form-field {
		display: flex;
		flex-direction: column;
		gap: $spacing-2;
	}

	.field-label {
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		color: $neutral-700;
		display: flex;
		align-items: center;
		gap: $spacing-1;
	}

	.required {
		color: $error-500;
	}

	.field-input {
		:global(input),
		:global(select),
		:global(textarea) {
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
				box-shadow $transition-fast;
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

		:global(select) {
			cursor: pointer;
			appearance: none;
			background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371717a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
			background-repeat: no-repeat;
			background-position: right $spacing-3 center;
			background-size: 20px;
			padding-right: $spacing-10;
		}

		:global(textarea) {
			resize: vertical;
			min-height: 100px;
		}
	}

	.has-error {
		.field-input {
			:global(input),
			:global(select),
			:global(textarea) {
				border-color: $error-500;

				&:focus {
					box-shadow: 0 0 0 3px rgba($error-500, 0.15);
				}
			}
		}
	}

	.field-error {
		display: flex;
		align-items: center;
		gap: $spacing-1;
		font-size: $font-size-sm;
		color: $error-600;

		svg {
			width: 14px;
			height: 14px;
			flex-shrink: 0;
		}
	}

	.field-hint {
		font-size: $font-size-sm;
		color: $neutral-500;
	}
</style>
