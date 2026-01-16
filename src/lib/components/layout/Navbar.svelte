<!--
  Navbar Component
  Top navigation bar with user info, notifications, and logout
  Features glassmorphism effect for modern appearance
-->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, currentUser } from '$lib/stores/auth';

	// Handle logout action
	const handleLogout = () => {
		auth.logout();
		goto('/login');
	};

	// Toggle mobile menu
	let isMobileMenuOpen = $state(false);

	const toggleMobileMenu = () => {
		isMobileMenuOpen = !isMobileMenuOpen;
	};
</script>

<header class="navbar">
	<div class="navbar-left">
		<!-- Mobile menu toggle -->
		<button class="mobile-menu-btn" onclick={toggleMobileMenu} aria-label="Toggle menu">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</button>

		<!-- Page title / breadcrumb area -->
		<div class="page-context">
			<span class="greeting">Welcome back,</span>
			<span class="user-name">{$currentUser?.name || 'User'}</span>
		</div>
	</div>

	<div class="navbar-right">
		<!-- Search -->
		<div class="navbar-search">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="11" cy="11" r="8" />
				<path d="M21 21l-4.35-4.35" />
			</svg>
			<input type="search" placeholder="Search..." class="search-input" />
		</div>

		<!-- Notifications -->
		<button class="navbar-btn" aria-label="Notifications">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path
					d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
				/>
			</svg>
			<span class="notification-badge">3</span>
		</button>

		<!-- User Profile Dropdown -->
		<div class="user-menu">
			<div class="user-avatar">
				{#if $currentUser?.avatar}
					<img src={$currentUser.avatar} alt={$currentUser.name} />
				{:else}
					<span class="avatar-initials">
						{$currentUser?.name?.charAt(0) || 'U'}
					</span>
				{/if}
			</div>
			<div class="user-info">
				<span class="user-fullname">{$currentUser?.name || 'User'}</span>
				<span class="user-role">{$currentUser?.role || 'Employee'}</span>
			</div>

			<!-- Logout Button -->
			<button class="logout-btn" onclick={handleLogout} aria-label="Logout">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
					<polyline points="16 17 21 12 16 7" />
					<line x1="21" y1="12" x2="9" y2="12" />
				</svg>
			</button>
		</div>
	</div>
</header>

<style lang="scss">
	@use '$styles/variables' as *;

	.navbar {
		height: $navbar-height;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid $neutral-200;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 $spacing-6;
		position: sticky;
		top: 0;
		z-index: $z-sticky;
	}

	.navbar-left {
		display: flex;
		align-items: center;
		gap: $spacing-4;
	}

	.mobile-menu-btn {
		display: none;
		width: 40px;
		height: 40px;
		border-radius: $radius-md;
		background: transparent;
		border: none;
		cursor: pointer;
		align-items: center;
		justify-content: center;
		transition: background $transition-fast;

		svg {
			width: 24px;
			height: 24px;
			color: $neutral-600;
		}

		&:hover {
			background: $neutral-100;
		}

		@media (max-width: $breakpoint-lg) {
			display: flex;
		}
	}

	.page-context {
		display: flex;
		flex-direction: column;

		.greeting {
			font-size: $font-size-xs;
			color: $neutral-500;
		}

		.user-name {
			font-size: $font-size-lg;
			font-weight: $font-weight-semibold;
			color: $neutral-900;
		}
	}

	.navbar-right {
		display: flex;
		align-items: center;
		gap: $spacing-4;
	}

	// Search
	.navbar-search {
		display: flex;
		align-items: center;
		gap: $spacing-2;
		background: $neutral-100;
		border-radius: $radius-full;
		padding: $spacing-2 $spacing-4;
		transition:
			background $transition-fast,
			box-shadow $transition-fast;

		svg {
			width: 18px;
			height: 18px;
			color: $neutral-400;
			flex-shrink: 0;
		}

		.search-input {
			border: none;
			background: transparent;
			outline: none;
			font-size: $font-size-sm;
			color: $neutral-700;
			width: 180px;

			&::placeholder {
				color: $neutral-400;
			}
		}

		&:focus-within {
			background: white;
			box-shadow: 0 0 0 3px rgba($primary-500, 0.15);

			svg {
				color: $primary-500;
			}
		}

		@media (max-width: $breakpoint-md) {
			display: none;
		}
	}

	// Navbar buttons
	.navbar-btn {
		position: relative;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: $radius-lg;
		background: transparent;
		border: none;
		cursor: pointer;
		transition: background $transition-fast;

		svg {
			width: 22px;
			height: 22px;
			color: $neutral-600;
		}

		&:hover {
			background: $neutral-100;
		}

		.notification-badge {
			position: absolute;
			top: 6px;
			right: 6px;
			width: 18px;
			height: 18px;
			background: linear-gradient(135deg, $error-500 0%, $error-600 100%);
			color: white;
			font-size: 10px;
			font-weight: $font-weight-bold;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 2px solid white;
		}
	}

	// User menu
	.user-menu {
		display: flex;
		align-items: center;
		gap: $spacing-3;
		padding: $spacing-2;
		padding-right: $spacing-3;
		border-radius: $radius-xl;
		background: $neutral-50;
		border: 1px solid $neutral-200;
		transition: all $transition-fast;

		&:hover {
			background: white;
			box-shadow: $shadow-sm;
		}
	}

	.user-avatar {
		width: 38px;
		height: 38px;
		border-radius: $radius-lg;
		overflow: hidden;
		background: linear-gradient(135deg, $primary-400 0%, $primary-600 100%);
		display: flex;
		align-items: center;
		justify-content: center;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.avatar-initials {
			color: white;
			font-size: $font-size-lg;
			font-weight: $font-weight-bold;
		}
	}

	.user-info {
		display: flex;
		flex-direction: column;

		.user-fullname {
			font-size: $font-size-sm;
			font-weight: $font-weight-medium;
			color: $neutral-900;
		}

		.user-role {
			font-size: $font-size-xs;
			color: $neutral-500;
			text-transform: capitalize;
		}

		@media (max-width: $breakpoint-md) {
			display: none;
		}
	}

	.logout-btn {
		width: 36px;
		height: 36px;
		border-radius: $radius-md;
		background: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			background $transition-fast,
			color $transition-fast;

		svg {
			width: 18px;
			height: 18px;
			color: $neutral-500;
		}

		&:hover {
			background: $error-50;

			svg {
				color: $error-600;
			}
		}
	}
</style>
