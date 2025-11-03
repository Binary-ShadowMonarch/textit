<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.ico';
	import icon16 from '$lib/assets/favicon-16x16.png';
	import icon32 from '$lib/assets/favicon-32x32.png';
	import appleTouchIcon from '$lib/assets/apple-touch-icon.png';
	import android192 from '$lib/assets/android-chrome-192x192.png';
	import android512 from '$lib/assets/android-chrome-512x512.png';

	let { children } = $props();
</script>

<svelte:head>
	<!-- Basic meta -->
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content="#ffffff" />

	<!-- Favicon and icons -->
	<link rel="icon" type="image/svg+xml" href={favicon} />
	<link rel="icon" type="image/png" sizes="16x16" href={icon16} />
	<link rel="icon" type="image/png" sizes="32x32" href={icon32} />
	<link rel="apple-touch-icon" href={appleTouchIcon} />

	<!-- Android / PWA icons -->
	<link rel="manifest" href="/manifest.webmanifest" />
	<link rel="shortcut icon" href={favicon} />

	<!-- Optional SEO / App Info -->
	<title>My Svelte App</title>
	<meta name="description" content="A modern Svelte app with proper favicon setup." />
</svelte:head>

<!-- App content -->
{@render children()}
