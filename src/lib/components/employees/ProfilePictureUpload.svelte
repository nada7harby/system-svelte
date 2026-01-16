<!--
  Profile Picture Upload Component
  Handles image upload with preview
-->
<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { getInitials } from '$lib/types/employee';

	interface Props {
		currentImage?: string;
		firstName: string;
		lastName: string;
		isLoading?: boolean;
		onupload?: (imageData: string) => void;
		onremove?: () => void;
	}

	let { currentImage = '', firstName, lastName, isLoading = false, onupload, onremove }: Props = $props();

	let previewUrl = $state(currentImage);
	let fileInput: HTMLInputElement;
	let isDragging = $state(false);

	const initials = $derived(getInitials(firstName, lastName));

	// Handle file selection
	const handleFileSelect = (file: File) => {
		if (!file.type.startsWith('image/')) {
			alert('Please select an image file');
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			alert('Image size must be less than 5MB');
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result as string;
			previewUrl = result;
		};
		reader.readAsDataURL(file);
	};

	const handleInputChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			handleFileSelect(target.files[0]);
		}
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		isDragging = true;
	};

	const handleDragLeave = () => {
		isDragging = false;
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		isDragging = false;

		if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
			handleFileSelect(e.dataTransfer.files[0]);
		}
	};

	const handleSave = () => {
		if (previewUrl && previewUrl !== currentImage) {
			onupload?.(previewUrl);
		}
	};

	const handleRemove = () => {
		previewUrl = '';
		onremove?.();
	};

	const triggerFileInput = () => {
		fileInput?.click();
	};
</script>

<div class="profile-upload">
	<div class="upload-header">
		<h4>Profile Picture</h4>
		<p>Upload a profile photo. Recommended size: 200x200px</p>
	</div>

	<div class="upload-content">
		<div
			class="upload-area"
			class:dragging={isDragging}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
			role="button"
			tabindex="0"
			onclick={triggerFileInput}
			onkeydown={(e) => e.key === 'Enter' && triggerFileInput()}
		>
			{#if previewUrl}
				<img src={previewUrl} alt="Profile preview" class="preview-image" />
			{:else}
				<div class="avatar-fallback">
					{initials}
				</div>
			{/if}

			<div class="upload-overlay">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
					<polyline points="17 8 12 3 7 8" />
					<line x1="12" y1="3" x2="12" y2="15" />
				</svg>
				<span>Click or drag to upload</span>
			</div>

			<input
				type="file"
				accept="image/*"
				bind:this={fileInput}
				onchange={handleInputChange}
				class="file-input"
			/>
		</div>

		<div class="upload-actions">
			{#if previewUrl && previewUrl !== currentImage}
				<Button variant="primary" size="sm" onclick={handleSave} loading={isLoading}>
					Save Photo
				</Button>
			{/if}
			{#if previewUrl}
				<Button variant="ghost" size="sm" onclick={handleRemove}>
					Remove
				</Button>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	@use '$styles/variables' as *;

	.profile-upload {
		padding: $spacing-5;
		background: $neutral-50;
		border-radius: $radius-lg;
		border: 1px solid $neutral-200;
	}

	.upload-header {
		margin-bottom: $spacing-4;

		h4 {
			font-size: $font-size-base;
			font-weight: $font-weight-semibold;
			color: $neutral-900;
			margin: 0 0 $spacing-1 0;
		}

		p {
			font-size: $font-size-sm;
			color: $neutral-500;
			margin: 0;
		}
	}

	.upload-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $spacing-4;
	}

	.upload-area {
		width: 150px;
		height: 150px;
		border-radius: $radius-xl;
		border: 2px dashed $neutral-300;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition: all $transition-fast;

		&:hover,
		&.dragging {
			border-color: $primary-500;
			background: $primary-50;

			.upload-overlay {
				opacity: 1;
			}
		}

		&.dragging {
			transform: scale(1.02);
		}
	}

	.preview-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.avatar-fallback {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, $primary-400 0%, $primary-600 100%);
		color: white;
		font-size: $font-size-4xl;
		font-weight: $font-weight-bold;
	}

	.upload-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: $spacing-2;
		opacity: 0;
		transition: opacity $transition-fast;
		color: white;

		svg {
			width: 32px;
			height: 32px;
		}

		span {
			font-size: $font-size-xs;
			text-align: center;
			padding: 0 $spacing-2;
		}
	}

	.file-input {
		position: absolute;
		width: 0;
		height: 0;
		opacity: 0;
	}

	.upload-actions {
		display: flex;
		gap: $spacing-2;
	}
</style>
