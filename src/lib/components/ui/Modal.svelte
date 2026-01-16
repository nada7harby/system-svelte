<!--
  Modal Component
  Reusable modal/dialog with backdrop, transitions, and customizable content
-->
<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	interface Props {
		isOpen: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		showCloseButton?: boolean;
		closeOnBackdrop?: boolean;
		onclose?: () => void;
		children: Snippet;
		footer?: Snippet;
	}

	let {
		isOpen = false,
		title = '',
		size = 'md',
		showCloseButton = true,
		closeOnBackdrop = true,
		onclose,
		children,
		footer
	}: Props = $props();

	const handleBackdropClick = () => {
		if (closeOnBackdrop && onclose) {
			onclose();
		}
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape' && onclose) {
			onclose();
		}
	};
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<div class="modal-backdrop" transition:fade={{ duration: 200 }} onclick={handleBackdropClick}>
		<div
			class="modal-container modal-{size}"
			transition:scale={{ start: 0.95, duration: 200 }}
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			{#if title || showCloseButton}
				<div class="modal-header">
					{#if title}
						<h2 id="modal-title" class="modal-title">{title}</h2>
					{/if}
					{#if showCloseButton}
						<button class="modal-close" onclick={onclose} aria-label="Close modal">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M18 6L6 18M6 6l12 12" />
							</svg>
						</button>
					{/if}
				</div>
			{/if}

			<div class="modal-body">
				{@render children()}
			</div>

			{#if footer}
				<div class="modal-footer">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	@use '$styles/variables' as *;

	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: $spacing-4;
		z-index: $z-modal;
		overflow-y: auto;
	}

	.modal-container {
		background: white;
		border-radius: $radius-xl;
		box-shadow: $shadow-2xl;
		max-height: calc(100vh - #{$spacing-8});
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	// Size variants
	.modal-sm {
		width: 100%;
		max-width: 400px;
	}

	.modal-md {
		width: 100%;
		max-width: 560px;
	}

	.modal-lg {
		width: 100%;
		max-width: 720px;
	}

	.modal-xl {
		width: 100%;
		max-width: 960px;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: $spacing-5 $spacing-6;
		border-bottom: 1px solid $neutral-200;
	}

	.modal-title {
		font-size: $font-size-xl;
		font-weight: $font-weight-semibold;
		color: $neutral-900;
		margin: 0;
	}

	.modal-close {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		border-radius: $radius-lg;
		cursor: pointer;
		color: $neutral-500;
		transition: all $transition-fast;

		svg {
			width: 20px;
			height: 20px;
		}

		&:hover {
			background: $neutral-100;
			color: $neutral-700;
		}
	}

	.modal-body {
		padding: $spacing-6;
		overflow-y: auto;
		flex: 1;
	}

	.modal-footer {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: $spacing-3;
		padding: $spacing-4 $spacing-6;
		border-top: 1px solid $neutral-200;
		background: $neutral-50;
	}
</style>
