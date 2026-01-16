<!--
  Avatar Component
  User avatar with image or initials fallback
-->
<script lang="ts">
	interface Props {
		src?: string;
		name: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		showStatus?: boolean;
		status?: 'active' | 'on-leave' | 'resigned';
	}

	let { src = '', name, size = 'md', showStatus = false, status = 'active' }: Props = $props();

	// Get initials from name
	const getInitials = (fullName: string): string => {
		const parts = fullName.trim().split(' ');
		if (parts.length >= 2) {
			return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
		}
		return fullName.substring(0, 2).toUpperCase();
	};

	const initials = $derived(getInitials(name));
</script>

<div class="avatar avatar-{size}">
	{#if src}
		<img src={src} alt={name} class="avatar-image" />
	{:else}
		<span class="avatar-initials">{initials}</span>
	{/if}

	{#if showStatus}
		<span class="avatar-status status-{status}"></span>
	{/if}
</div>

<style lang="scss">
	@use '$styles/variables' as *;

	.avatar {
		position: relative;
		border-radius: $radius-lg;
		background: linear-gradient(135deg, $primary-400 0%, $primary-600 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	// Size variants
	.avatar-sm {
		width: 32px;
		height: 32px;

		.avatar-initials {
			font-size: $font-size-sm;
		}
	}

	.avatar-md {
		width: 42px;
		height: 42px;

		.avatar-initials {
			font-size: $font-size-base;
		}
	}

	.avatar-lg {
		width: 64px;
		height: 64px;

		.avatar-initials {
			font-size: $font-size-xl;
		}
	}

	.avatar-xl {
		width: 96px;
		height: 96px;
		border-radius: $radius-xl;

		.avatar-initials {
			font-size: $font-size-3xl;
		}
	}

	.avatar-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.avatar-initials {
		color: white;
		font-weight: $font-weight-semibold;
	}

	.avatar-status {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 2px solid white;
	}

	.status-active {
		background: $success-500;
	}

	.status-on-leave {
		background: $warning-500;
	}

	.status-resigned {
		background: $neutral-400;
	}
</style>
