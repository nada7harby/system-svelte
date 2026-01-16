<!--
  Sidebar Component
  Main navigation sidebar with collapsible menu items
  Features glassmorphism effect and animated transitions
-->
<script lang="ts">
	import { page } from '$app/stores';

	// Navigation menu items
	const menuItems = [
		{
			href: '/dashboard',
			label: 'Dashboard',
			icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
		},
		{
			href: '/employees',
			label: 'Employees',
			icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
		},
		{
			href: '/departments',
			label: 'Departments',
			icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
		},
		{
			href: '/attendance',
			label: 'Attendance',
			icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
		},
		{
			href: '/leaves',
			label: 'Leaves',
			icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
		},
		{
			href: '/settings',
			label: 'Settings',
			icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
		}
	];

	// Check if a menu item is active
	const isActive = (href: string): boolean => {
		if (typeof $page?.url?.pathname === 'string') {
			return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
		}
		return false;
	};
</script>

<aside class="sidebar">
	<!-- Brand/Logo -->
	<div class="sidebar-brand">
		<div class="brand-icon">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
			</svg>
		</div>
		<div class="brand-text">
			<span class="brand-name">HR System</span>
			<span class="brand-tagline">Management</span>
		</div>
	</div>

	<!-- Navigation Menu -->
	<nav class="sidebar-nav">
		<ul class="nav-list">
			{#each menuItems as item}
				<li class="nav-item">
					<a href={item.href} class="nav-link" class:active={isActive(item.href)}>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d={item.icon} />
						</svg>
						<span class="nav-label">{item.label}</span>
						{#if isActive(item.href)}
							<span class="active-indicator"></span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<!-- Footer -->
	<div class="sidebar-footer">
		<div class="footer-content">
			<span class="version">v1.0.0</span>
			<span class="separator">•</span>
			<span class="year">2026</span>
		</div>
	</div>
</aside>

<style lang="scss">
	@use '$styles/variables' as *;

	.sidebar {
		width: $sidebar-width;
		height: 100vh;
		background: linear-gradient(180deg, $neutral-900 0%, $neutral-950 100%);
		display: flex;
		flex-direction: column;
		position: fixed;
		left: 0;
		top: 0;
		z-index: $z-fixed;
		box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
	}

	// Brand Section
	.sidebar-brand {
		padding: $spacing-6;
		display: flex;
		align-items: center;
		gap: $spacing-3;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.brand-icon {
		width: 44px;
		height: 44px;
		background: linear-gradient(135deg, $primary-500 0%, $primary-600 100%);
		border-radius: $radius-lg;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba($primary-500, 0.4);

		svg {
			width: 24px;
			height: 24px;
			color: white;
		}
	}

	.brand-text {
		display: flex;
		flex-direction: column;
	}

	.brand-name {
		font-size: $font-size-lg;
		font-weight: $font-weight-bold;
		color: white;
		line-height: 1.2;
	}

	.brand-tagline {
		font-size: $font-size-xs;
		color: $neutral-400;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	// Navigation
	.sidebar-nav {
		flex: 1;
		padding: $spacing-4 0;
		overflow-y: auto;
	}

	.nav-list {
		display: flex;
		flex-direction: column;
		gap: $spacing-1;
		padding: 0 $spacing-3;
	}

	.nav-item {
		list-style: none;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: $spacing-3;
		padding: $spacing-3 $spacing-4;
		border-radius: $radius-lg;
		color: $neutral-400;
		text-decoration: none;
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		transition:
			background $transition-fast,
			color $transition-fast,
			transform $transition-fast;
		position: relative;
		overflow: hidden;

		svg {
			width: 20px;
			height: 20px;
			flex-shrink: 0;
			transition: transform $transition-fast;
		}

		&:hover {
			color: white;
			background: rgba(255, 255, 255, 0.08);

			svg {
				transform: scale(1.1);
			}
		}

		&.active {
			color: white;
			background: linear-gradient(135deg, $primary-600 0%, $primary-700 100%);
			box-shadow: 0 4px 12px rgba($primary-500, 0.3);

			.active-indicator {
				position: absolute;
				right: $spacing-3;
				width: 6px;
				height: 6px;
				background: white;
				border-radius: 50%;
				animation: pulse 2s infinite;
			}
		}
	}

	// Footer
	.sidebar-footer {
		padding: $spacing-4 $spacing-6;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.footer-content {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: $spacing-2;
		font-size: $font-size-xs;
		color: $neutral-500;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	// Responsive - Hide on mobile
	@media (max-width: $breakpoint-lg) {
		.sidebar {
			transform: translateX(-100%);
			transition: transform $transition-base;

			&.open {
				transform: translateX(0);
			}
		}
	}
</style>
