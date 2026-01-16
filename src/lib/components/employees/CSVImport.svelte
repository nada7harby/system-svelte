<!--
  CSV Import Component
  Bulk import employees from CSV file with validation and preview
-->
<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import type { EmployeeFormData, CSVPreviewRow, CSVImportResult } from '$lib/types/employee';
	import { DEPARTMENTS, EMPLOYMENT_TYPES, EMPLOYEE_STATUSES } from '$lib/types/employee';

	interface Props {
		isOpen: boolean;
		onclose?: () => void;
		onimport?: (employees: EmployeeFormData[]) => Promise<CSVImportResult>;
	}

	let { isOpen = false, onclose, onimport }: Props = $props();

	type ImportStep = 'upload' | 'preview' | 'result';

	let step: ImportStep = $state('upload');
	let isProcessing = $state(false);
	let previewRows: CSVPreviewRow[] = $state([]);
	let importResult: CSVImportResult | null = $state(null);
	let errorMessage = $state('');
	let fileInput: HTMLInputElement;

	// CSV column mapping
	const requiredColumns = [
		'firstName',
		'lastName',
		'email',
		'phone',
		'address',
		'dateOfBirth',
		'department',
		'jobTitle',
		'employmentType',
		'startDate',
		'salary',
		'status'
	];

	// Reset state
	const resetState = () => {
		step = 'upload';
		previewRows = [];
		importResult = null;
		errorMessage = '';
		isProcessing = false;
	};

	// Close modal
	const handleClose = () => {
		resetState();
		onclose?.();
	};

	// Parse CSV file
	const parseCSV = (text: string): Record<string, string>[] => {
		const lines = text.trim().split('\n');
		if (lines.length < 2) {
			throw new Error('CSV file must have at least a header row and one data row');
		}

		const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
		const data: Record<string, string>[] = [];

		for (let i = 1; i < lines.length; i++) {
			const values = lines[i].split(',').map((v) => v.trim().replace(/"/g, ''));
			const row: Record<string, string> = {};

			headers.forEach((header, index) => {
				row[header] = values[index] || '';
			});

			data.push(row);
		}

		return data;
	};

	// Validate row data
	const validateRow = (row: Record<string, string>, rowNum: number): CSVPreviewRow => {
		const errors: string[] = [];

		// Check required fields
		if (!row.firstName?.trim()) errors.push('First name is required');
		if (!row.lastName?.trim()) errors.push('Last name is required');
		if (!row.email?.trim()) errors.push('Email is required');
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) errors.push('Invalid email format');
		if (!row.phone?.trim()) errors.push('Phone is required');
		if (!row.department?.trim()) errors.push('Department is required');
		else if (!DEPARTMENTS.includes(row.department as typeof DEPARTMENTS[number])) {
			errors.push(`Invalid department: ${row.department}`);
		}
		if (!row.jobTitle?.trim()) errors.push('Job title is required');

		// Validate employment type
		const empType = EMPLOYMENT_TYPES.find((t) => t.value === row.employmentType);
		if (!empType) errors.push(`Invalid employment type: ${row.employmentType}`);

		// Validate status
		const status = EMPLOYEE_STATUSES.find((s) => s.value === row.status);
		if (!status) errors.push(`Invalid status: ${row.status}`);

		// Validate salary
		const salary = parseFloat(row.salary);
		if (isNaN(salary) || salary <= 0) errors.push('Invalid salary');

		return {
			rowNumber: rowNum,
			data: {
				firstName: row.firstName || '',
				lastName: row.lastName || '',
				email: row.email || '',
				phone: row.phone || '',
				address: row.address || '',
				dateOfBirth: row.dateOfBirth || '',
				department: row.department || '',
				jobTitle: row.jobTitle || '',
				employmentType: (row.employmentType as EmployeeFormData['employmentType']) || 'full-time',
				startDate: row.startDate || '',
				salary: salary || 0,
				status: (row.status as EmployeeFormData['status']) || 'active'
			},
			isValid: errors.length === 0,
			errors
		};
	};

	// Handle file selection
	const handleFileSelect = async (e: Event) => {
		const target = e.target as HTMLInputElement;
		if (!target.files || !target.files[0]) return;

		const file = target.files[0];

		if (!file.name.endsWith('.csv')) {
			errorMessage = 'Please select a CSV file';
			return;
		}

		isProcessing = true;
		errorMessage = '';

		try {
			const text = await file.text();
			const data = parseCSV(text);

			// Check for required columns
			const firstRow = data[0];
			const missingColumns = requiredColumns.filter((col) => !(col in firstRow));

			if (missingColumns.length > 0) {
				throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
			}

			// Validate each row
			previewRows = data.map((row, index) => validateRow(row, index + 2));
			step = 'preview';
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Failed to parse CSV file';
		} finally {
			isProcessing = false;
		}
	};

	// Perform import
	const handleImport = async () => {
		const validRows = previewRows.filter((row) => row.isValid);

		if (validRows.length === 0) {
			errorMessage = 'No valid rows to import';
			return;
		}

		isProcessing = true;

		try {
			const employeesToImport = validRows.map((row) => row.data as EmployeeFormData);
			const result = await onimport?.(employeesToImport);

			if (result) {
				importResult = result;
				step = 'result';
			}
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Import failed';
		} finally {
			isProcessing = false;
		}
	};

	// Download sample CSV
	const downloadSample = () => {
		const headers = requiredColumns.join(',');
		const sampleRow = [
			'John',
			'Doe',
			'john.doe@company.com',
			'+1 555 123 4567',
			'123 Main St',
			'1990-01-15',
			'Engineering',
			'Software Engineer',
			'full-time',
			'2024-01-01',
			'75000',
			'active'
		].join(',');

		const csv = `${headers}\n${sampleRow}`;
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'employee_import_template.csv';
		a.click();
		URL.revokeObjectURL(url);
	};

	// Computed stats
	const validCount = $derived(previewRows.filter((r) => r.isValid).length);
	const invalidCount = $derived(previewRows.filter((r) => !r.isValid).length);
</script>

<Modal isOpen={isOpen} title="Import Employees from CSV" size="lg" onclose={handleClose}>
	{#if errorMessage}
		<div class="error-banner" transition:slide>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10" />
				<line x1="12" y1="8" x2="12" y2="12" />
				<line x1="12" y1="16" x2="12.01" y2="16" />
			</svg>
			<span>{errorMessage}</span>
			<button onclick={() => (errorMessage = '')}>×</button>
		</div>
	{/if}

	{#if step === 'upload'}
		<div class="upload-step" in:fade>
			<div class="upload-info">
				<h4>Upload a CSV file to import multiple employees at once</h4>
				<p>The CSV file must include the following columns:</p>
				<div class="column-list">
					{#each requiredColumns as col}
						<span class="column-tag">{col}</span>
					{/each}
				</div>
			</div>

			<div class="upload-area">
				<label for="csvInput" class="upload-label">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
						<polyline points="17 8 12 3 7 8" />
						<line x1="12" y1="3" x2="12" y2="15" />
					</svg>
					<span>Click to select CSV file</span>
				</label>
				<input
					type="file"
					id="csvInput"
					accept=".csv"
					bind:this={fileInput}
					onchange={handleFileSelect}
					class="file-input"
				/>
			</div>

			<button class="download-template" onclick={downloadSample}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
					<polyline points="7 10 12 15 17 10" />
					<line x1="12" y1="15" x2="12" y2="3" />
				</svg>
				Download sample template
			</button>
		</div>
	{:else if step === 'preview'}
		<div class="preview-step" in:fade>
			<div class="preview-stats">
				<div class="stat valid">
					<span class="stat-value">{validCount}</span>
					<span class="stat-label">Valid</span>
				</div>
				<div class="stat invalid">
					<span class="stat-value">{invalidCount}</span>
					<span class="stat-label">Invalid</span>
				</div>
				<div class="stat total">
					<span class="stat-value">{previewRows.length}</span>
					<span class="stat-label">Total</span>
				</div>
			</div>

			<div class="preview-table-container">
				<table class="preview-table">
					<thead>
						<tr>
							<th>Row</th>
							<th>Status</th>
							<th>Name</th>
							<th>Email</th>
							<th>Department</th>
							<th>Issues</th>
						</tr>
					</thead>
					<tbody>
						{#each previewRows as row}
							<tr class:invalid={!row.isValid}>
								<td>{row.rowNumber}</td>
								<td>
									{#if row.isValid}
										<span class="status-icon valid">✓</span>
									{:else}
										<span class="status-icon invalid">✗</span>
									{/if}
								</td>
								<td>{row.data.firstName} {row.data.lastName}</td>
								<td>{row.data.email}</td>
								<td>{row.data.department}</td>
								<td>
									{#if row.errors.length > 0}
										<span class="error-count" title={row.errors.join(', ')}>
											{row.errors.length} error{row.errors.length > 1 ? 's' : ''}
										</span>
									{:else}
										<span class="no-errors">—</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			{#if invalidCount > 0}
				<p class="warning-text">
					⚠️ {invalidCount} row{invalidCount > 1 ? 's' : ''} will be skipped due to validation errors.
				</p>
			{/if}
		</div>
	{:else if step === 'result'}
		<div class="result-step" in:fade>
			{#if importResult}
				<div class="result-icon" class:success={importResult.success > 0}>
					{#if importResult.success > 0}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
					{:else}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="10" />
							<line x1="15" y1="9" x2="9" y2="15" />
							<line x1="9" y1="9" x2="15" y2="15" />
						</svg>
					{/if}
				</div>

				<h3 class="result-title">
					{importResult.success > 0 ? 'Import Complete' : 'Import Failed'}
				</h3>

				<div class="result-stats">
					<div class="result-stat success">
						<span class="value">{importResult.success}</span>
						<span class="label">Imported</span>
					</div>
					<div class="result-stat failed">
						<span class="value">{importResult.failed}</span>
						<span class="label">Failed</span>
					</div>
				</div>

				{#if importResult.errors.length > 0}
					<div class="error-list">
						<h4>Errors:</h4>
						<ul>
							{#each importResult.errors.slice(0, 5) as error}
								<li>Row {error.row}: {error.message}</li>
							{/each}
							{#if importResult.errors.length > 5}
								<li class="more">...and {importResult.errors.length - 5} more</li>
							{/if}
						</ul>
					</div>
				{/if}
			{/if}
		</div>
	{/if}

	{#snippet footer()}
		{#if step === 'upload'}
			<Button variant="ghost" onclick={handleClose}>Cancel</Button>
		{:else if step === 'preview'}
			<Button variant="ghost" onclick={() => (step = 'upload')}>Back</Button>
			<Button variant="primary" onclick={handleImport} disabled={validCount === 0} loading={isProcessing}>
				Import {validCount} Employee{validCount !== 1 ? 's' : ''}
			</Button>
		{:else if step === 'result'}
			<Button variant="primary" onclick={handleClose}>Done</Button>
		{/if}
	{/snippet}
</Modal>

<style lang="scss">
	@use '$styles/variables' as *;

	.error-banner {
		display: flex;
		align-items: center;
		gap: $spacing-3;
		padding: $spacing-3 $spacing-4;
		background: $error-50;
		border: 1px solid $error-200;
		border-radius: $radius-lg;
		color: $error-700;
		margin-bottom: $spacing-5;

		svg {
			width: 20px;
			height: 20px;
			flex-shrink: 0;
		}

		span {
			flex: 1;
			font-size: $font-size-sm;
		}

		button {
			background: none;
			border: none;
			font-size: $font-size-xl;
			cursor: pointer;
			color: $error-500;
			line-height: 1;
		}
	}

	// Upload Step
	.upload-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $spacing-6;
	}

	.upload-info {
		text-align: center;

		h4 {
			font-size: $font-size-base;
			color: $neutral-900;
			margin: 0 0 $spacing-2 0;
		}

		p {
			color: $neutral-500;
			margin: 0 0 $spacing-4 0;
		}
	}

	.column-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: $spacing-2;
	}

	.column-tag {
		padding: $spacing-1 $spacing-2;
		background: $primary-50;
		color: $primary-700;
		font-size: $font-size-xs;
		font-family: $font-family-mono;
		border-radius: $radius-md;
	}

	.upload-area {
		width: 100%;
		max-width: 400px;
		border: 2px dashed $neutral-300;
		border-radius: $radius-lg;
		background: $neutral-50;
		transition: all $transition-fast;

		&:hover {
			border-color: $primary-500;
			background: $primary-50;
		}
	}

	.upload-label {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $spacing-3;
		padding: $spacing-10;
		cursor: pointer;
		color: $neutral-500;

		svg {
			width: 48px;
			height: 48px;
		}

		&:hover {
			color: $primary-600;
		}
	}

	.file-input {
		position: absolute;
		width: 0;
		height: 0;
		opacity: 0;
	}

	.download-template {
		display: flex;
		align-items: center;
		gap: $spacing-2;
		padding: $spacing-3 $spacing-4;
		background: transparent;
		border: none;
		color: $primary-600;
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		cursor: pointer;
		transition: all $transition-fast;

		svg {
			width: 16px;
			height: 16px;
		}

		&:hover {
			color: $primary-700;
			text-decoration: underline;
		}
	}

	// Preview Step
	.preview-step {
		display: flex;
		flex-direction: column;
		gap: $spacing-5;
	}

	.preview-stats {
		display: flex;
		gap: $spacing-4;
		justify-content: center;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: $spacing-4 $spacing-6;
		border-radius: $radius-lg;

		.stat-value {
			font-size: $font-size-2xl;
			font-weight: $font-weight-bold;
		}

		.stat-label {
			font-size: $font-size-sm;
		}

		&.valid {
			background: $success-50;
			.stat-value {
				color: $success-600;
			}
		}

		&.invalid {
			background: $error-50;
			.stat-value {
				color: $error-600;
			}
		}

		&.total {
			background: $neutral-100;
			.stat-value {
				color: $neutral-700;
			}
		}
	}

	.preview-table-container {
		max-height: 300px;
		overflow: auto;
		border: 1px solid $neutral-200;
		border-radius: $radius-lg;
	}

	.preview-table {
		width: 100%;
		border-collapse: collapse;
		font-size: $font-size-sm;

		th,
		td {
			padding: $spacing-3 $spacing-4;
			text-align: left;
			border-bottom: 1px solid $neutral-100;
		}

		th {
			background: $neutral-50;
			font-weight: $font-weight-semibold;
			position: sticky;
			top: 0;
		}

		tr.invalid {
			background: $error-50;
		}
	}

	.status-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		font-size: 12px;

		&.valid {
			background: $success-100;
			color: $success-600;
		}

		&.invalid {
			background: $error-100;
			color: $error-600;
		}
	}

	.error-count {
		color: $error-600;
		cursor: help;
	}

	.no-errors {
		color: $neutral-400;
	}

	.warning-text {
		font-size: $font-size-sm;
		color: $warning-600;
		text-align: center;
		margin: 0;
	}

	// Result Step
	.result-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $spacing-5;
		padding: $spacing-6;
	}

	.result-icon {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: $error-100;

		svg {
			width: 48px;
			height: 48px;
			color: $error-600;
		}

		&.success {
			background: $success-100;

			svg {
				color: $success-600;
			}
		}
	}

	.result-title {
		font-size: $font-size-xl;
		color: $neutral-900;
		margin: 0;
	}

	.result-stats {
		display: flex;
		gap: $spacing-6;
	}

	.result-stat {
		display: flex;
		flex-direction: column;
		align-items: center;

		.value {
			font-size: $font-size-3xl;
			font-weight: $font-weight-bold;
		}

		.label {
			font-size: $font-size-sm;
			color: $neutral-500;
		}

		&.success .value {
			color: $success-600;
		}

		&.failed .value {
			color: $error-600;
		}
	}

	.error-list {
		width: 100%;
		max-width: 400px;
		padding: $spacing-4;
		background: $error-50;
		border-radius: $radius-lg;

		h4 {
			font-size: $font-size-sm;
			color: $error-700;
			margin: 0 0 $spacing-2 0;
		}

		ul {
			margin: 0;
			padding-left: $spacing-5;
			font-size: $font-size-sm;
			color: $error-600;
		}

		.more {
			color: $error-400;
			font-style: italic;
		}
	}
</style>
