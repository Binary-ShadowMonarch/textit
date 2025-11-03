<script>
	import { onMount } from 'svelte';

	let text = $state('');
	let filename = $state('document');
	let selectedFormat = $state(null);
	let showPreview = $state(false);
	let previewContent = $state('');
	let previewFormat = $state('');
	let particles = $state([]);
	let showStats = $state(false);
	let dragActive = $state(false);
	let showCopied = $state(false);

	const formats = [
		{
			id: 'txt',
			name: 'Plain Text',
			ext: '.txt',
			icon: '📄',
			color: 'from-blue-400 to-blue-600',
			desc: 'Universal format'
		},
		{
			id: 'md',
			name: 'Markdown',
			ext: '.md',
			icon: '📝',
			color: 'from-purple-400 to-purple-600',
			desc: 'For documentation'
		},
		{
			id: 'html',
			name: 'HTML',
			ext: '.html',
			icon: '🌐',
			color: 'from-orange-400 to-orange-600',
			desc: 'Web ready'
		},
		{
			id: 'json',
			name: 'JSON',
			ext: '.json',
			icon: '{ }',
			color: 'from-green-400 to-green-600',
			desc: 'Structured data'
		},
		{
			id: 'csv',
			name: 'CSV',
			ext: '.csv',
			icon: '📊',
			color: 'from-teal-400 to-teal-600',
			desc: 'For spreadsheets'
		},
		{
			id: 'xml',
			name: 'XML',
			ext: '.xml',
			icon: '📋',
			color: 'from-red-400 to-red-600',
			desc: 'Data exchange'
		},
		{
			id: 'rtf',
			name: 'Rich Text',
			ext: '.rtf',
			icon: '📑',
			color: 'from-pink-400 to-pink-600',
			desc: 'Formatted text'
		},
		{
			id: 'tex',
			name: 'LaTeX',
			ext: '.tex',
			icon: 'Τ',
			color: 'from-indigo-400 to-indigo-600',
			desc: 'Academic papers'
		}
	];

	const wordCount = $derived(text.split(/\s+/).filter((w) => w.length > 0).length);
	const lineCount = $derived(text.split('\n').length);
	const readingTime = $derived(Math.ceil(wordCount / 200));
	const sentenceCount = $derived(text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length);

	onMount(() => {
		// Create floating particles
		for (let i = 0; i < 20; i++) {
			particles.push({
				x: Math.random() * 100,
				y: Math.random() * 100,
				size: Math.random() * 4 + 2,
				duration: Math.random() * 10 + 10,
				delay: Math.random() * 5
			});
		}

		// Keyboard shortcuts
		const handleKeyPress = (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 's') {
				e.preventDefault();
				downloadFile('txt');
			}
			if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
				e.preventDefault();
				showStats = !showStats;
			}
		};
		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	});

	function convertContent(format) {
		switch (format) {
			case 'txt':
				return text;
			case 'md':
				return `# ${filename}\n\n${text}`;
			case 'html':
				return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename}</title>
    <style>body{font-family:system-ui;max-width:800px;margin:2rem auto;padding:0 1rem;line-height:1.6;}</style>
</head>
<body>
    <h1>${filename}</h1>
    <pre style="white-space:pre-wrap;word-wrap:break-word;">${text}</pre>
</body>
</html>`;
			case 'json':
				return JSON.stringify(
					{
						title: filename,
						content: text,
						metadata: {
							created: new Date().toISOString(),
							wordCount: wordCount,
							characterCount: text.length,
							lineCount: lineCount
						}
					},
					null,
					2
				);
			case 'csv':
				const lines = text.split('\n');
				return `"Line","Content"\n${lines.map((line, i) => `"${i + 1}","${line.replace(/"/g, '""')}"`).join('\n')}`;
			case 'xml':
				return `<?xml version="1.0" encoding="UTF-8"?>
<document>
    <title>${filename}</title>
    <metadata>
        <created>${new Date().toISOString()}</created>
        <wordCount>${wordCount}</wordCount>
    </metadata>
    <content><![CDATA[${text}]]></content>
</document>`;
			case 'rtf':
				return `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 Times New Roman;}}
\\f0\\fs24 ${text.replace(/\n/g, '\\par ')}
}`;
			case 'tex':
				return `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\title{${filename}}
\\author{}
\\date{\\today}

\\begin{document}
\\maketitle

${text}

\\end{document}`;
			default:
				return text;
		}
	}

	function downloadFile(format) {
		if (!text.trim()) {
			alert('Please enter some text first! ✍️');
			return;
		}

		const formatObj = formats.find((f) => f.id === format);
		const content = convertContent(format);
		const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		if (filename.length >= 1) {
			link.download = `${new Date().toISOString()}${formatObj.ext}`;
		} else {
			link.download = `${filename}${formatObj.ext}`;
		}
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);

		selectedFormat = format;
		setTimeout(() => {
			selectedFormat = null;
		}, 1000);
	}

	function downloadAll() {
		if (!text.trim()) {
			alert('Please enter some text first! ✍️');
			return;
		}
		formats.forEach((format, index) => {
			setTimeout(() => downloadFile(format.id), index * 300);
		});
	}

	function openPreview(format) {
		activePreviewFormat = format.id;
		previewContent = convertContent(format.id);
		showPreview = true;
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(text);
		showCopied = true;
		setTimeout(() => {
			showCopied = false;
		}, 2000);
	}

	function textTransform(type) {
		switch (type) {
			case 'upper':
				text = text.toUpperCase();
				break;
			case 'lower':
				text = text.toLowerCase();
				break;
			case 'title':
				text = text.replace(
					/\w\S*/g,
					(txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
				);
				break;
			case 'clear':
				text = '';
				break;
		}
	}

	function handleDrop(e) {
		e.preventDefault();
		dragActive = false;
		const file = e.dataTransfer.files[0];
		if (file && file.type.startsWith('text/')) {
			const reader = new FileReader();
			reader.onload = (e) => {
				text = e.target.result;
				filename = file.name.replace(/\.[^/.]+$/, '');
			};
			reader.readAsText(file);
		}
	}

	function handleDragOver(e) {
		e.preventDefault();
		dragActive = true;
	}

	function handleDragLeave() {
		dragActive = false;
	}
</script>

<svelte:head>
	<title>Text Format Converter - Convert Text to TXT, MD, HTML, JSON, CSV, XML & More</title>
	<meta
		name="description"
		content="Free online text format converter. Instantly convert and download your text in 8+ formats: TXT, Markdown, HTML, JSON, CSV, XML, RTF, LaTeX. Perfect for developers, writers, and AI context feeding."
	/>
	<meta
		name="keywords"
		content="text converter, format converter, markdown, html, json, csv, xml, rtf, latex, text download, file converter, llm context, ai prompts"
	/>
	<meta name="author" content="Text Converter Tool" />
	<link rel="canonical" href="https://textconverter.app" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://textconverter.app" />
	<meta property="og:title" content="Text Format Converter - 8+ Formats Instantly" />
	<meta
		property="og:description"
		content="Convert and download text in multiple formats. Perfect for developers, writers, and feeding context to AI models."
	/>
	<meta property="og:image" content="https://textconverter.app/og-image.jpg" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://textconverter.app" />
	<meta property="twitter:title" content="Text Format Converter - 8+ Formats" />
	<meta
		property="twitter:description"
		content="Free text converter supporting TXT, MD, HTML, JSON, CSV, XML, RTF & LaTeX"
	/>
	<meta property="twitter:image" content="https://textconverter.app/twitter-image.jpg" />

	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="robots" content="index, follow" />
	<meta name="theme-color" content="#7c3aed" />
</svelte:head>

<div
	class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4"
>
	<!-- Animated particles -->
	{#each particles as particle, i (i)}
		<div
			class="absolute h-1 w-1 rounded-full bg-purple-400/30"
			style="left: {particle.x}%; top: {particle.y}%; animation: float {particle.duration}s ease-in-out infinite {particle.delay}s; width: {particle.size}px; height: {particle.size}px;"
		></div>
	{/each}

	<!-- Animated background orbs -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div
			class="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl"
		></div>
		<div
			class="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl delay-1000"
		></div>
		<div
			class="absolute top-1/2 left-1/2 h-72 w-72 animate-pulse rounded-full bg-pink-500/10 blur-3xl delay-2000"
		></div>
	</div>

	<div class="relative z-10 w-full max-w-5xl">
		<!-- Main Card with drag-drop -->
		<div
			class="space-y-6 rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 {dragActive
				? 'scale-[1.02] ring-4 ring-purple-500'
				: ''}"
			ondrop={handleDrop}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
		>
			<!-- Header with live stats -->
			<div class="space-y-3 text-center">
				<div
					class="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/20 px-4 py-2 backdrop-blur-sm"
				>
					<span class="animate-bounce text-2xl">✨</span>
					<span class="text-sm font-medium text-purple-200">Free • Client-Side • Privacy-First</span
					>
				</div>
				<h1
					class="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-5xl font-bold tracking-tight text-transparent text-white"
				>
					Text Format Converter
				</h1>
				<p class="text-lg text-gray-300">
					Transform your text into 8+ formats instantly • Perfect for AI context feeding 🤖
				</p>
				<div class="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
					<span>⌨️ Ctrl+S to save</span>
					<span>⌨️ Ctrl+K for stats</span>
					<span>📂 Drag & drop files</span>
				</div>
			</div>

			<!-- Quick Actions Bar -->
			<div class="flex flex-wrap justify-between gap-2">
				<div class="flex flex-wrap gap-2">
					<button
						onclick={() => textTransform('upper')}
						class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white transition-all hover:scale-105 hover:bg-white/10"
					>
						UPPERCASE
					</button>
					<button
						onclick={() => textTransform('lower')}
						class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white transition-all hover:scale-105 hover:bg-white/10"
					>
						lowercase
					</button>
					<button
						onclick={() => textTransform('title')}
						class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white transition-all hover:scale-105 hover:bg-white/10"
					>
						Title Case
					</button>
					<button
						onclick={copyToClipboard}
						class="relative rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white transition-all hover:scale-105 hover:bg-white/10"
					>
						{showCopied ? '✅ Copied!' : '📋 Copy'}
					</button>
				</div>
				<button
					onclick={() => textTransform('clear')}
					class="rounded-lg border border-red-400/30 bg-red-500/20 px-3 py-1.5 text-xs text-red-200 transition-all hover:scale-105 hover:bg-red-500/30"
				>
					🗑️ Clear
				</button>
			</div>

			<!-- Filename Input with live preview -->
			<div class="space-y-2">
				<label class="flex items-center gap-2 text-sm font-medium text-gray-300">
					<span>📝</span>
					<span>Filename</span>
				</label>
				<input
					type="text"
					bind:value={filename}
					class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:border-transparent focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
					placeholder="Enter filename..."
				/>
			</div>

			<!-- Text Area with stats toggle -->
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<label class="flex items-center gap-2 text-sm font-medium text-gray-300">
						<span>✍️</span>
						<span>Your Content</span>
					</label>
					<button
						onclick={() => (showStats = !showStats)}
						class="rounded-lg bg-white/5 px-3 py-1 text-xs text-gray-300 transition-all hover:bg-white/10"
					>
						{showStats ? '📊 Hide Stats' : '📊 Show Stats'}
					</button>
				</div>
				<textarea
					bind:value={text}
					class="h-64 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:border-transparent focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
					placeholder="Start typing or drag & drop a text file here..."
				></textarea>

				{#if showStats}
					<div class="animate-fadeIn grid grid-cols-2 gap-3 md:grid-cols-4">
						<div class="rounded-lg border border-blue-400/20 bg-blue-500/10 p-3">
							<div class="text-xs font-medium text-blue-400">Characters</div>
							<div class="text-2xl font-bold text-white">{text.length.toLocaleString()}</div>
						</div>
						<div class="rounded-lg border border-purple-400/20 bg-purple-500/10 p-3">
							<div class="text-xs font-medium text-purple-400">Words</div>
							<div class="text-2xl font-bold text-white">{wordCount.toLocaleString()}</div>
						</div>
						<div class="rounded-lg border border-pink-400/20 bg-pink-500/10 p-3">
							<div class="text-xs font-medium text-pink-400">Lines</div>
							<div class="text-2xl font-bold text-white">{lineCount.toLocaleString()}</div>
						</div>
						<div class="rounded-lg border border-green-400/20 bg-green-500/10 p-3">
							<div class="text-xs font-medium text-green-400">Read Time</div>
							<div class="text-2xl font-bold text-white">{readingTime}min</div>
						</div>
					</div>
				{:else}
					<div class="flex justify-between text-xs text-gray-400">
						<span>{text.length.toLocaleString()} characters</span>
						<span>{wordCount.toLocaleString()} words • {lineCount} lines</span>
					</div>
				{/if}
			</div>

			<!-- Format Grid with preview option -->
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<label class="flex items-center gap-2 text-sm font-medium text-gray-300">
						<span>⬇️</span>
						<span>Download As</span>
					</label>
					<button
						onclick={downloadAll}
						class="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-xs font-medium text-white shadow-lg transition-all hover:scale-105 hover:from-purple-600 hover:to-pink-600"
					>
						⚡ Download All
					</button>
				</div>
				<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
					{#each formats as format}
						<div class="group relative">
							<button
								onclick={() => downloadFile(format.id)}
								class="w-full rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/20 {selectedFormat ===
								format.id
									? 'scale-105 ring-2 ring-green-400'
									: ''}"
							>
								<div
									class="absolute inset-0 bg-gradient-to-br {format.color} rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-20"
								></div>
								<div class="relative flex flex-col items-center space-y-2">
									<div
										class="text-3xl {selectedFormat === format.id
											? 'scale-110 animate-bounce'
											: ''} transition-transform"
									>
										{format.icon}
									</div>
									<div class="text-center">
										<div class="text-sm font-medium text-white">{format.name}</div>
										<div class="text-xs text-gray-400">{format.ext}</div>
										<div
											class="mt-1 text-xs text-gray-500 opacity-0 transition-opacity group-hover:opacity-100"
										>
											{format.desc}
										</div>
									</div>
								</div>
								{#if selectedFormat === format.id}
									<div class="absolute top-2 right-2">
										<div class="h-2 w-2 animate-ping rounded-full bg-green-400"></div>
									</div>
								{/if}
							</button>
							<button
								onclick={() => openPreview(format)}
								class="absolute right-2 bottom-2 rounded-lg bg-white/10 px-2 py-1 text-xs text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-white/20"
							>
								👁️
							</button>
						</div>
					{/each}
				</div>
			</div>

			<!-- Footer -->
			<div class="space-y-3 border-t border-white/10 pt-4">
				<div class="flex items-center justify-center space-x-2 text-sm text-gray-400">
					<span>⚡</span>
					<span>All processing happens in your browser • Zero server uploads</span>
				</div>
			</div>
		</div>

		<!-- Why This Tool Section -->
		<div class="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
			<h2 class="mb-4 text-2xl font-bold text-white">🎯 Why Use This Tool?</h2>
			<div class="grid gap-4 text-sm text-gray-300 md:grid-cols-2">
				<div class="flex gap-3">
					<span class="text-xl">🤖</span>
					<div>
						<strong class="text-white">Feed Context to AI Models</strong>
						<p class="mt-1 text-xs text-gray-400">
							Convert large texts to formats LLMs can easily process
						</p>
					</div>
				</div>
				<div class="flex gap-3">
					<span class="text-xl">🔒</span>
					<div>
						<strong class="text-white">Privacy First</strong>
						<p class="mt-1 text-xs text-gray-400">
							100% client-side processing, your data never leaves your device
						</p>
					</div>
				</div>
				<div class="flex gap-3">
					<span class="text-xl">⚡</span>
					<div>
						<strong class="text-white">Instant Conversion</strong>
						<p class="mt-1 text-xs text-gray-400">
							No uploads, no waiting, convert and download immediately
						</p>
					</div>
				</div>
				<div class="flex gap-3">
					<span class="text-xl">📚</span>
					<div>
						<strong class="text-white">Universal Compatibility</strong>
						<p class="mt-1 text-xs text-gray-400">
							Works with docs, code, research, notes, and more
						</p>
					</div>
				</div>
				<div class="flex gap-3">
					<span class="text-xl">🛠️</span>
					<div>
						<strong class="text-white">Developer Workflow</strong>
						<p class="mt-1 text-xs text-gray-400">
							Quick format switching for README, config files, documentation
						</p>
					</div>
				</div>
				<div class="flex gap-3">
					<span class="text-xl">🎓</span>
					<div>
						<strong class="text-white">Academic & Research</strong>
						<p class="mt-1 text-xs text-gray-400">LaTeX, citations, structured data for papers</p>
					</div>
				</div>
				<div class="flex gap-3">
					<span class="text-xl">💼</span>
					<div>
						<strong class="text-white">Business & Reports</strong>
						<p class="mt-1 text-xs text-gray-400">
							CSV for data, RTF for docs, HTML for presentations
						</p>
					</div>
				</div>
				<div class="flex gap-3">
					<span class="text-xl">🌐</span>
					<div>
						<strong class="text-white">Cross-Platform</strong>
						<p class="mt-1 text-xs text-gray-400">
							Works everywhere - no software installation needed
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Preview Modal -->
{#if showPreview}
	<div
		class="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
		onclick={() => (showPreview = false)}
	>
		<div
			class="max-h-[80vh] w-full max-w-3xl overflow-auto rounded-2xl border border-white/20 bg-slate-900 p-6"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-xl font-bold text-white">
					Preview: {formats.find((f) => f.id === activePreviewFormat)?.name}
				</h3>
				<button
					onclick={() => (showPreview = false)}
					class="text-2xl text-gray-400 hover:text-white">×</button
				>
			</div>
			<pre
				class="max-h-96 overflow-auto rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-gray-300">{previewContent}</pre>
			<div class="mt-4 flex gap-2">
				<button
					onclick={() => {
						downloadFile(activePreviewFormat);
						showPreview = false;
					}}
					class="flex-1 rounded-lg bg-purple-500 px-4 py-2 font-medium text-white transition-all hover:bg-purple-600"
				>
					⬇️ Download
				</button>
				<button
					onclick={() => (showPreview = false)}
					class="rounded-lg bg-white/10 px-4 py-2 text-white transition-all hover:bg-white/20"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes float {
		0%,
		100% {
			transform: translateY(0) translateX(0);
		}
		25% {
			transform: translateY(-20px) translateX(10px);
		}
		50% {
			transform: translateY(-10px) translateX(-10px);
		}
		75% {
			transform: translateY(-30px) translateX(5px);
		}
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

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-pulse {
		animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	.animate-fadeIn {
		animation: fadeIn 0.3s ease-out;
	}

	.delay-1000 {
		animation-delay: 1s;
	}

	.delay-2000 {
		animation-delay: 2s;
	}

	@keyframes ping {
		75%,
		100% {
			transform: scale(2);
			opacity: 0;
		}
	}

	.animate-ping {
		animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.animate-bounce {
		animation: bounce 2s ease-in-out infinite;
	}
</style>
