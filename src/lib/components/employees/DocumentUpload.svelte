<!--
  Document Upload Component
  Manages employee document uploads and listing
-->
<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import type { EmployeeDocument, DocumentType } from '$lib/types/employee';
	import { DOCUMENT_TYPES, formatDate } from '$lib/types/employee';

	interface Props {
		documents: EmployeeDocument[];
		isLoading?: boolean;
		onupload?: (doc: { name: string; type: DocumentType; url: string; fileSize: number; mimeType: string }) => void;
		ondelete?: (documentId: string) => void;
	}

	let { documents = [], isLoading = false, onupload, ondelete }: Props = $props();

	let showUploadModal = $state(false);
	let selectedType: DocumentType = $state('contract');
	let selectedFile: File | null = $state(null);
	let previewUrl = $state('');
	let deleteConfirmId = $state<string | null>(null);

	// File input reference
	let fileInput: HTMLInputElement;

	// Handle file selection
	const handleFileSelect = (e: Event) => {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			const file = target.files[0];

			// Validate file type
			const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
			if (!allowedTypes.includes(file.type)) {
				alert('Please select a PDF or image file');
				return;
			}

			// Validate file size (10MB max)
			if (file.size > 10 * 1024 * 1024) {
				alert('File size must be less than 10MB');
				return;
			}

			selectedFile = file;

			// Generate preview for images
			if (file.type.startsWith('image/')) {
				const reader = new FileReader();
				reader.onload = (e) => {
					previewUrl = e.target?.result as string;
				};
				reader.readAsDataURL(file);
			} else {
				previewUrl = '';
			}
		}
	};

	// Upload document
	const handleUpload = () => {
		if (!selectedFile) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			const url = e.target?.result as string;
			onupload?.({
				name: selectedFile!.name,
				type: selectedType,
				url,
				fileSize: selectedFile!.size,
				mimeType: selectedFile!.type
			});

			// Reset state
			selectedFile = null;
			previewUrl = '';
			showUploadModal = false;
		};
		reader.readAsDataURL(selectedFile);
	};

	// Format file size
	const formatFileSize = (bytes: number): string => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	// Get icon for document type
	const getDocIcon = (mimeType: string): string => {
		if (mimeType.startsWith('image/')) {
			return 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z';
		}
		return 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z';
	};

	// Reset modal state
	const closeUploadModal = () => {
		showUploadModal = false;
		selectedFile = null;
		previewUrl = '';
		selectedType = 'contract';
	};
</script>

<div class="document-manager">
	<div class="manager-header">
		<div class="header-info">
			<h4>Documents</h4>
			<span class="doc-count">{documents.length} document{documents.length !== 1 ? 's' : ''}</span>
		</div>
		<Button variant="outline" size="sm" onclick={() => (showUploadModal = true)}>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
				<path d="M12 5v14m-7-7h14" />
			</svg>
			Upload
		</Button>
	</div>

	{#if documents.length === 0}
		<div class="empty-state">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
			<p>No documents uploaded yet</p>
		</div>
	{:else}
		<ul class="document-list">
			{#each documents as doc (doc.id)}
				<li class="document-item" transition:slide>
					<div class="doc-icon">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d={getDocIcon(doc.mimeType)} />
						</svg>
					</div>
					<div class="doc-info">
						<span class="doc-name">{doc.name}</span>
						<span class="doc-meta">
							{DOCUMENT_TYPES.find((t) => t.value === doc.type)?.label} • {formatFileSize(doc.fileSize)} • {formatDate(doc.uploadedAt)}
						</span>
					</div>
					<div class="doc-actions">
						{#if doc.url && doc.mimeType.startsWith('image/')}
							<a href={doc.url} target="_blank" rel="noopener noreferrer" class="action-btn" title="Preview">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							</a>
						{/if}
						<button class="action-btn delete" title="Delete" onclick={() => (deleteConfirmId = doc.id)}>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
						</button>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<!-- Upload Modal -->
<Modal isOpen={showUploadModal} title="Upload Document" onclose={closeUploadModal}>
	<div class="upload-form">
		<div class="form-field">
			<label for="docType">Document Type</label>
			<select id="docType" bind:value={selectedType}>
				{#each DOCUMENT_TYPES as type}
					<option value={type.value}>{type.label}</option>
				{/each}
			</select>
		</div>

		<div class="upload-area" class:has-file={selectedFile}>
			{#if selectedFile}
				<div class="selected-file">
					{#if previewUrl}
						<img src={previewUrl} alt="Preview" class="file-preview" />
					{:else}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
						</svg>
					{/if}
					<div class="file-info">
						<span class="file-name">{selectedFile.name}</span>
						<span class="file-size">{formatFileSize(selectedFile.size)}</span>
					</div>
					<button class="remove-file" onclick={() => { selectedFile = null; previewUrl = ''; }}>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M18 6L6 18M6 6l12 12" />
						</svg>
					</button>
				</div>
			{:else}
				<label for="fileInput" class="upload-label">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
						<polyline points="17 8 12 3 7 8" />
						<line x1="12" y1="3" x2="12" y2="15" />
					</svg>
					<span>Click to select file</span>
					<span class="hint">PDF or Image (max 10MB)</span>
				</label>
			{/if}
			<input
				type="file"
				id="fileInput"
				accept=".pdf,image/*"
				bind:this={fileInput}
				onchange={handleFileSelect}
				class="file-input"
			/>
		</div>
	</div>

	{#snippet footer()}
		<Button variant="ghost" onclick={closeUploadModal}>Cancel</Button>
		<Button variant="primary" onclick={handleUpload} disabled={!selectedFile} loading={isLoading}>
			Upload Document
		</Button>
	{/snippet}
</Modal>

<!-- Delete Confirmation Modal -->
<Modal isOpen={!!deleteConfirmId} title="Delete Document" size="sm" onclose={() => (deleteConfirmId = null)}>
	<p class="confirm-text">
		Are you sure you want to delete this document? This action cannot be undone.
	</p>

	{#snippet footer()}
		<Button variant="ghost" onclick={() => (deleteConfirmId = null)}>Cancel</Button>
		<Button
			variant="danger"
			onclick={() => {
				if (deleteConfirmId) {
					ondelete?.(deleteConfirmId);
					deleteConfirmId = null;
				}
			}}
			loading={isLoading}
		>
			Delete
		</Button>
	{/snippet}
</Modal>

<style lang="scss">
	@use '$styles/variables' as *;

	.document-manager {
		background: white;
		border-radius: $radius-xl;
		border: 1px solid $neutral-200;
		overflow: hidden;
	}

	.manager-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: $spacing-4 $spacing-5;
		border-bottom: 1px solid $neutral-100;
		background: $neutral-50;
	}

	.header-info {
		display: flex;
		align-items: center;
		gap: $spacing-3;

		h4 {
			font-size: $font-size-base;
			font-weight: $font-weight-semibold;
			color: $neutral-900;
			margin: 0;
		}

		.doc-count {
			font-size: $font-size-sm;
			color: $neutral-500;
		}
	}

	.empty-state {
		padding: $spacing-10;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $spacing-3;
		color: $neutral-400;

		svg {
			width: 48px;
			height: 48px;
			opacity: 0.5;
		}

		p {
			margin: 0;
			font-size: $font-size-sm;
		}
	}

	.document-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.document-item {
		display: flex;
		align-items: center;
		gap: $spacing-4;
		padding: $spacing-4 $spacing-5;
		border-bottom: 1px solid $neutral-100;
		transition: background $transition-fast;

		&:last-child {
			border-bottom: none;
		}

		&:hover {
			background: $neutral-50;
		}
	}

	.doc-icon {
		width: 40px;
		height: 40px;
		background: $primary-50;
		border-radius: $radius-lg;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;

		svg {
			width: 20px;
			height: 20px;
			color: $primary-600;
		}
	}

	.doc-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.doc-name {
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		color: $neutral-900;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.doc-meta {
		font-size: $font-size-xs;
		color: $neutral-500;
	}

	.doc-actions {
		display: flex;
		gap: $spacing-1;
	}

	.action-btn {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: $radius-md;
		border: none;
		background: transparent;
		color: $neutral-500;
		cursor: pointer;
		transition: all $transition-fast;
		text-decoration: none;

		svg {
			width: 16px;
			height: 16px;
		}

		&:hover {
			background: $neutral-100;
			color: $neutral-700;
		}

		&.delete:hover {
			background: $error-50;
			color: $error-600;
		}
	}

	// Upload Modal Styles
	.upload-form {
		display: flex;
		flex-direction: column;
		gap: $spacing-5;
	}

	.form-field {
		display: flex;
		flex-direction: column;
		gap: $spacing-2;

		label {
			font-size: $font-size-sm;
			font-weight: $font-weight-medium;
			color: $neutral-700;
		}

		select {
			padding: $spacing-3 $spacing-4;
			border: 2px solid $neutral-200;
			border-radius: $radius-lg;
			font-size: $font-size-base;
			cursor: pointer;

			&:focus {
				outline: none;
				border-color: $primary-500;
			}
		}
	}

	.upload-area {
		border: 2px dashed $neutral-300;
		border-radius: $radius-lg;
		background: $neutral-50;
		transition: all $transition-fast;

		&.has-file {
			border-style: solid;
			border-color: $primary-500;
			background: white;
		}
	}

	.upload-label {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $spacing-2;
		padding: $spacing-8;
		cursor: pointer;
		color: $neutral-500;

		svg {
			width: 40px;
			height: 40px;
		}

		span {
			font-size: $font-size-sm;
		}

		.hint {
			font-size: $font-size-xs;
			color: $neutral-400;
		}

		&:hover {
			color: $primary-600;
		}
	}

	.selected-file {
		display: flex;
		align-items: center;
		gap: $spacing-4;
		padding: $spacing-4;

		svg {
			width: 40px;
			height: 40px;
			color: $primary-500;
		}

		.file-preview {
			width: 60px;
			height: 60px;
			object-fit: cover;
			border-radius: $radius-md;
		}

		.file-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 2px;
		}

		.file-name {
			font-size: $font-size-sm;
			font-weight: $font-weight-medium;
			color: $neutral-900;
		}

		.file-size {
			font-size: $font-size-xs;
			color: $neutral-500;
		}

		.remove-file {
			width: 32px;
			height: 32px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: $radius-md;
			border: none;
			background: $neutral-100;
			color: $neutral-500;
			cursor: pointer;

			svg {
				width: 16px;
				height: 16px;
			}

			&:hover {
				background: $error-50;
				color: $error-600;
			}
		}
	}

	.file-input {
		position: absolute;
		width: 0;
		height: 0;
		opacity: 0;
	}

	.confirm-text {
		color: $neutral-600;
		line-height: $line-height-relaxed;
	}
</style>
