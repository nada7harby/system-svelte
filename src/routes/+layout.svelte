<!--
  Root Layout
  The top-level layout that wraps all pages
  Imports global styles
-->
<script lang="ts">
	import '$styles/global.scss';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
	<title>HR Management System</title>
	<meta name="description" content="Modern HR and Employees Management System built with SvelteKit" />
</svelte:head>

{@render children()}
