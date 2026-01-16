<!--
  Login Page
  Authentication page with email and password form
  Uses mock authentication from auth store
-->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { auth, isAuthenticated, isAuthLoading } from '$lib/stores/auth';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';

	// Form state
	let email = $state('');
	let password = $state('');
	let error = $state('');

	// Redirect if already authenticated
	$effect(() => {
		if (browser && $isAuthenticated) {
			goto('/dashboard');
		}
	});

	// Handle form submission
	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		error = '';

		// Basic validation
		if (!email.trim()) {
			error = 'Email is required';
			return;
		}
		if (!password.trim()) {
			error = 'Password is required';
			return;
		}

		// Attempt login
		const success = await auth.login(email, password);
		if (success) {
			goto('/dashboard');
		}
	};
</script>

<svelte:head>
	<title>Login | HR Management System</title>
</svelte:head>

<div class="login-page">
	<!-- Background decoration -->
	<div class="bg-decoration">
		<div class="circle circle-1"></div>
		<div class="circle circle-2"></div>
		<div class="circle circle-3"></div>
	</div>

	<div class="login-container">
		<!-- Left side - Branding -->
		<div class="login-branding">
			<div class="brand-content">
				<div class="brand-icon">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
					</svg>
				</div>
				<h1 class="brand-title">HR Management System</h1>
				<p class="brand-description">
					Streamline your human resources operations with our modern, intuitive management platform.
				</p>
				<div class="features">
					<div class="feature">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M5 13l4 4L19 7" />
						</svg>
						<span>Employee Management</span>
					</div>
					<div class="feature">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M5 13l4 4L19 7" />
						</svg>
						<span>Department Organization</span>
					</div>
					<div class="feature">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M5 13l4 4L19 7" />
						</svg>
						<span>Attendance Tracking</span>
					</div>
					<div class="feature">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M5 13l4 4L19 7" />
						</svg>
						<span>Leave Management</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Right side - Login Form -->
		<div class="login-form-container">
			<div class="form-wrapper">
				<div class="form-header">
					<h2>Welcome Back</h2>
					<p>Sign in to your account to continue</p>
				</div>

				<form onsubmit={handleSubmit} class="login-form">
					{#if error || $auth?.error}
						<div class="error-alert">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<circle cx="12" cy="12" r="10" />
								<line x1="12" y1="8" x2="12" y2="12" />
								<line x1="12" y1="16" x2="12.01" y2="16" />
							</svg>
							<span>{error || $auth?.error}</span>
						</div>
					{/if}

					<Input
						type="email"
						name="email"
						label="Email Address"
						placeholder="Enter your email"
						bind:value={email}
						required
						autocomplete="email"
					/>

					<Input
						type="password"
						name="password"
						label="Password"
						placeholder="Enter your password"
						bind:value={password}
						required
						autocomplete="current-password"
					/>

					<div class="form-options">
						<label class="remember-me">
							<input type="checkbox" />
							<span>Remember me</span>
						</label>
						<a href="#forgot" class="forgot-link">Forgot password?</a>
					</div>

					<Button type="submit" variant="primary" fullWidth loading={$isAuthLoading}>
						Sign In
					</Button>

					<div class="demo-credentials">
						<p class="demo-title">Demo Credentials</p>
						<p class="demo-info">
							<strong>Email:</strong> admin@company.com<br />
							<strong>Password:</strong> admin123
						</p>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	@use '$styles/variables' as *;

	.login-page {
		min-height: 100vh;
		background: linear-gradient(135deg, $neutral-900 0%, $neutral-950 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: $spacing-4;
		position: relative;
		overflow: hidden;
	}

	// Background decoration
	.bg-decoration {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.circle {
		position: absolute;
		border-radius: 50%;
		opacity: 0.1;
		animation: float 20s infinite ease-in-out;
	}

	.circle-1 {
		width: 600px;
		height: 600px;
		background: $primary-500;
		top: -200px;
		right: -200px;
	}

	.circle-2 {
		width: 400px;
		height: 400px;
		background: $secondary-500;
		bottom: -100px;
		left: -100px;
		animation-delay: -5s;
	}

	.circle-3 {
		width: 300px;
		height: 300px;
		background: $primary-400;
		top: 50%;
		left: 30%;
		animation-delay: -10s;
	}

	@keyframes float {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		25% {
			transform: translate(30px, -30px) scale(1.05);
		}
		50% {
			transform: translate(-20px, 20px) scale(0.95);
		}
		75% {
			transform: translate(20px, 30px) scale(1.02);
		}
	}

	.login-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		max-width: 1100px;
		width: 100%;
		background: white;
		border-radius: $radius-2xl;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
		overflow: hidden;
		position: relative;
		z-index: 1;

		@media (max-width: $breakpoint-lg) {
			grid-template-columns: 1fr;
			max-width: 480px;
		}
	}

	// Left branding section
	.login-branding {
		background: linear-gradient(135deg, $primary-600 0%, $primary-800 100%);
		padding: $spacing-12;
		display: flex;
		flex-direction: column;
		justify-content: center;

		@media (max-width: $breakpoint-lg) {
			display: none;
		}
	}

	.brand-content {
		color: white;
	}

	.brand-icon {
		width: 64px;
		height: 64px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: $radius-xl;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: $spacing-6;
		backdrop-filter: blur(8px);

		svg {
			width: 32px;
			height: 32px;
		}
	}

	.brand-title {
		font-size: $font-size-3xl;
		font-weight: $font-weight-bold;
		margin-bottom: $spacing-4;
		color: white;
	}

	.brand-description {
		font-size: $font-size-lg;
		opacity: 0.9;
		line-height: $line-height-relaxed;
		margin-bottom: $spacing-8;
		color: rgba(255, 255, 255, 0.9);
	}

	.features {
		display: flex;
		flex-direction: column;
		gap: $spacing-4;
	}

	.feature {
		display: flex;
		align-items: center;
		gap: $spacing-3;
		font-size: $font-size-base;
		opacity: 0.9;

		svg {
			width: 20px;
			height: 20px;
			color: $secondary-300;
		}
	}

	// Right form section
	.login-form-container {
		padding: $spacing-12;
		display: flex;
		align-items: center;
		justify-content: center;

		@media (max-width: $breakpoint-md) {
			padding: $spacing-8 $spacing-6;
		}
	}

	.form-wrapper {
		width: 100%;
		max-width: 400px;
	}

	.form-header {
		text-align: center;
		margin-bottom: $spacing-8;

		h2 {
			font-size: $font-size-2xl;
			color: $neutral-900;
			margin-bottom: $spacing-2;
		}

		p {
			color: $neutral-500;
			margin: 0;
		}
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: $spacing-5;
	}

	.error-alert {
		display: flex;
		align-items: flex-start;
		gap: $spacing-3;
		padding: $spacing-4;
		background: $error-50;
		border: 1px solid $error-200;
		border-radius: $radius-lg;
		color: $error-700;
		font-size: $font-size-sm;

		svg {
			width: 20px;
			height: 20px;
			flex-shrink: 0;
			color: $error-500;
		}
	}

	.form-options {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: $font-size-sm;
	}

	.remember-me {
		display: flex;
		align-items: center;
		gap: $spacing-2;
		cursor: pointer;
		color: $neutral-600;

		input[type='checkbox'] {
			width: 16px;
			height: 16px;
			accent-color: $primary-500;
		}
	}

	.forgot-link {
		color: $primary-600;
		font-weight: $font-weight-medium;

		&:hover {
			text-decoration: underline;
		}
	}

	.demo-credentials {
		margin-top: $spacing-4;
		padding: $spacing-4;
		background: $neutral-50;
		border-radius: $radius-lg;
		border: 1px dashed $neutral-200;
		text-align: center;

		.demo-title {
			font-size: $font-size-xs;
			font-weight: $font-weight-semibold;
			color: $neutral-500;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			margin: 0 0 $spacing-2 0;
		}

		.demo-info {
			font-size: $font-size-sm;
			color: $neutral-600;
			margin: 0;
			line-height: 1.6;

			strong {
				color: $neutral-700;
			}
		}
	}
</style>
