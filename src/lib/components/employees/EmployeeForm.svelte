<!--
  Employee Form Component
  Reusable form for creating and editing employees
  Handles validation and form state
-->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import FormField from '$lib/components/ui/FormField.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { EmployeeFormData, EmployeeFormErrors, Employee } from '$lib/types/employee';
	import { DEPARTMENTS, EMPLOYMENT_TYPES, EMPLOYEE_STATUSES } from '$lib/types/employee';

	interface Props {
		employee?: Employee;
		isLoading?: boolean;
		onsubmit?: (data: EmployeeFormData) => void;
		oncancel?: () => void;
	}

	let { employee, isLoading = false, onsubmit, oncancel }: Props = $props();

	// Form state - initialize with employee data if editing
	let formData: EmployeeFormData = $state({
		firstName: employee?.firstName || '',
		lastName: employee?.lastName || '',
		email: employee?.email || '',
		phone: employee?.phone || '',
		address: employee?.address || '',
		dateOfBirth: employee?.dateOfBirth || '',
		profilePicture: employee?.profilePicture || '',
		department: employee?.department || '',
		jobTitle: employee?.jobTitle || '',
		employmentType: employee?.employmentType || 'full-time',
		startDate: employee?.startDate || '',
		salary: employee?.salary || 0,
		status: employee?.status || 'active'
	});

	let errors: EmployeeFormErrors = $state({});
	let touched: Record<string, boolean> = $state({});

	// Validation functions
	const validateEmail = (email: string): string | undefined => {
		if (!email.trim()) return 'Email is required';
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) return 'Please enter a valid email address';
		return undefined;
	};

	const validatePhone = (phone: string): string | undefined => {
		if (!phone.trim()) return 'Phone number is required';
		const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
		if (!phoneRegex.test(phone.replace(/\s/g, ''))) return 'Please enter a valid phone number';
		return undefined;
	};

	const validateRequired = (value: string, fieldName: string): string | undefined => {
		if (!value.trim()) return `${fieldName} is required`;
		return undefined;
	};

	const validateDate = (date: string, fieldName: string): string | undefined => {
		if (!date) return `${fieldName} is required`;
		const parsed = new Date(date);
		if (isNaN(parsed.getTime())) return 'Please enter a valid date';
		return undefined;
	};

	const validateSalary = (salary: number): string | undefined => {
		if (salary <= 0) return 'Salary must be greater than 0';
		if (salary > 1000000) return 'Please enter a valid salary';
		return undefined;
	};

	// Validate all fields
	const validateForm = (): boolean => {
		const newErrors: EmployeeFormErrors = {};

		newErrors.firstName = validateRequired(formData.firstName, 'First name');
		newErrors.lastName = validateRequired(formData.lastName, 'Last name');
		newErrors.email = validateEmail(formData.email);
		newErrors.phone = validatePhone(formData.phone);
		newErrors.address = validateRequired(formData.address, 'Address');
		newErrors.dateOfBirth = validateDate(formData.dateOfBirth, 'Date of birth');
		newErrors.department = validateRequired(formData.department, 'Department');
		newErrors.jobTitle = validateRequired(formData.jobTitle, 'Job title');
		newErrors.startDate = validateDate(formData.startDate, 'Start date');
		newErrors.salary = validateSalary(formData.salary);

		// Remove undefined errors
		Object.keys(newErrors).forEach((key) => {
			if (newErrors[key as keyof EmployeeFormErrors] === undefined) {
				delete newErrors[key as keyof EmployeeFormErrors];
			}
		});

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	};

	// Handle field blur (for validation on touch)
	const handleBlur = (field: string) => {
		touched[field] = true;
		// Trigger validation for this field
		validateForm();
	};

	// Handle form submission
	const handleSubmit = (e: Event) => {
		e.preventDefault();

		// Mark all fields as touched
		Object.keys(formData).forEach((key) => {
			touched[key] = true;
		});

		if (validateForm()) {
			onsubmit?.(formData);
		}
	};
</script>

<form class="employee-form" onsubmit={handleSubmit} in:fade={{ duration: 200 }}>
	<!-- Personal Information Section -->
	<section class="form-section">
		<h3 class="section-title">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
				<circle cx="12" cy="7" r="4" />
			</svg>
			Personal Information
		</h3>

		<div class="form-grid">
			<FormField label="First Name" name="firstName" error={touched.firstName ? errors.firstName : ''} required>
				<input
					type="text"
					id="firstName"
					bind:value={formData.firstName}
					onblur={() => handleBlur('firstName')}
					placeholder="Enter first name"
				/>
			</FormField>

			<FormField label="Last Name" name="lastName" error={touched.lastName ? errors.lastName : ''} required>
				<input
					type="text"
					id="lastName"
					bind:value={formData.lastName}
					onblur={() => handleBlur('lastName')}
					placeholder="Enter last name"
				/>
			</FormField>

			<FormField label="Email Address" name="email" error={touched.email ? errors.email : ''} required>
				<input
					type="email"
					id="email"
					bind:value={formData.email}
					onblur={() => handleBlur('email')}
					placeholder="name@company.com"
				/>
			</FormField>

			<FormField label="Phone Number" name="phone" error={touched.phone ? errors.phone : ''} required>
				<input
					type="tel"
					id="phone"
					bind:value={formData.phone}
					onblur={() => handleBlur('phone')}
					placeholder="+1 (555) 123-4567"
				/>
			</FormField>

			<FormField label="Date of Birth" name="dateOfBirth" error={touched.dateOfBirth ? errors.dateOfBirth : ''} required>
				<input
					type="date"
					id="dateOfBirth"
					bind:value={formData.dateOfBirth}
					onblur={() => handleBlur('dateOfBirth')}
				/>
			</FormField>

			<div class="full-width">
				<FormField label="Address" name="address" error={touched.address ? errors.address : ''} required>
					<textarea
						id="address"
						bind:value={formData.address}
						onblur={() => handleBlur('address')}
						placeholder="Enter full address"
						rows="2"
					></textarea>
				</FormField>
			</div>
		</div>
	</section>

	<!-- Job Information Section -->
	<section class="form-section">
		<h3 class="section-title">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
				<path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
			</svg>
			Job Information
		</h3>

		<div class="form-grid">
			<FormField label="Department" name="department" error={touched.department ? errors.department : ''} required>
				<select
					id="department"
					bind:value={formData.department}
					onblur={() => handleBlur('department')}
				>
					<option value="">Select department</option>
					{#each DEPARTMENTS as dept}
						<option value={dept}>{dept}</option>
					{/each}
				</select>
			</FormField>

			<FormField label="Job Title" name="jobTitle" error={touched.jobTitle ? errors.jobTitle : ''} required>
				<input
					type="text"
					id="jobTitle"
					bind:value={formData.jobTitle}
					onblur={() => handleBlur('jobTitle')}
					placeholder="e.g. Software Engineer"
				/>
			</FormField>

			<FormField label="Employment Type" name="employmentType" required>
				<select id="employmentType" bind:value={formData.employmentType}>
					{#each EMPLOYMENT_TYPES as type}
						<option value={type.value}>{type.label}</option>
					{/each}
				</select>
			</FormField>

			<FormField label="Start Date" name="startDate" error={touched.startDate ? errors.startDate : ''} required>
				<input
					type="date"
					id="startDate"
					bind:value={formData.startDate}
					onblur={() => handleBlur('startDate')}
				/>
			</FormField>

			<FormField label="Salary (USD)" name="salary" error={touched.salary ? errors.salary : ''} required>
				<input
					type="number"
					id="salary"
					bind:value={formData.salary}
					onblur={() => handleBlur('salary')}
					placeholder="0"
					min="0"
					step="1000"
				/>
			</FormField>

			<FormField label="Status" name="status" required>
				<select id="status" bind:value={formData.status}>
					{#each EMPLOYEE_STATUSES as status}
						<option value={status.value}>{status.label}</option>
					{/each}
				</select>
			</FormField>
		</div>
	</section>

	<!-- Form Actions -->
	<div class="form-actions">
		<Button variant="ghost" onclick={oncancel} disabled={isLoading}>
			Cancel
		</Button>
		<Button type="submit" variant="primary" loading={isLoading}>
			{employee ? 'Update Employee' : 'Create Employee'}
		</Button>
	</div>
</form>

<style lang="scss">
	@use '$styles/variables' as *;

	.employee-form {
		display: flex;
		flex-direction: column;
		gap: $spacing-8;
	}

	.form-section {
		background: white;
		border-radius: $radius-xl;
		padding: $spacing-6;
		box-shadow: $shadow-md;
		border: 1px solid $neutral-100;
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: $spacing-3;
		font-size: $font-size-lg;
		font-weight: $font-weight-semibold;
		color: $neutral-900;
		margin: 0 0 $spacing-6 0;
		padding-bottom: $spacing-4;
		border-bottom: 1px solid $neutral-100;

		svg {
			width: 22px;
			height: 22px;
			color: $primary-500;
		}
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: $spacing-5;

		@media (max-width: $breakpoint-md) {
			grid-template-columns: 1fr;
		}
	}

	.full-width {
		grid-column: 1 / -1;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: $spacing-3;
		padding-top: $spacing-4;
		border-top: 1px solid $neutral-200;
	}
</style>
