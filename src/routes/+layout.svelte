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
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content="#0f172a" />
	<meta name="application-name" content="TextIt" />
	<meta
		name="description"
		content="TextIt converts long text and uploaded files into multiple formats for chat uploads, docs, and developer workflows."
	/>
	<title>TextIt | Upload-ready text converter</title>

	<link rel="icon" type="image/x-icon" href={favicon} />
	<link rel="icon" type="image/png" sizes="16x16" href={icon16} />
	<link rel="icon" type="image/png" sizes="32x32" href={icon32} />
	<link rel="icon" type="image/png" sizes="192x192" href={android192} />
	<link rel="icon" type="image/png" sizes="512x512" href={android512} />
	<link rel="apple-touch-icon" href={appleTouchIcon} />

	<link rel="manifest" href="/site.webmanifest" />
	<link rel="shortcut icon" href={favicon} />
</svelte:head>

<!-- App content -->
{@render children()}
