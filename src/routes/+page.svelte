<script lang="ts">
	import { onMount } from 'svelte';
	import ActionToolbar from '$lib/components/ActionToolbar.svelte';
	import EditorPanel from '$lib/components/EditorPanel.svelte';
	import FormatGrid from '$lib/components/FormatGrid.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PreviewModal from '$lib/components/PreviewModal.svelte';
	import StatsPanel from '$lib/components/StatsPanel.svelte';
	import UseCases from '$lib/components/UseCases.svelte';
	import {
		FORMATS,
		convertContent,
		getFormatById,
		type ConversionStats,
		type FormatId
	} from '$lib/utils/formats';
	import {
		downloadAllFormats,
		inferBaseFilename,
		readBrowserFile,
		triggerDownload
	} from '$lib/utils/files';
	import {
		applyTextTransform,
		copyTextToClipboard,
		getTextStats,
		type TextTransform
	} from '$lib/utils/text';

	interface Particle {
		x: number;
		y: number;
		size: number;
		duration: number;
		delay: number;
	}

	type StatusTone = 'info' | 'success' | 'error';

	interface StatusMessage {
		tone: StatusTone;
		message: string;
	}

	let text = $state('');
	let filename = $state('document');
	let selectedFormat = $state<FormatId | null>(null);
	let showPreview = $state(false);
	let previewFormatId = $state<FormatId | null>(null);
	let previewContent = $state('');
	let showStats = $state(false);
	let dragActive = $state(false);
	let uploadBusy = $state(false);
	let copied = $state(false);
	let particles = $state<Particle[]>([]);
	let status = $state<StatusMessage | null>(null);

	let statusTimer: ReturnType<typeof setTimeout> | null = null;
	let selectedTimer: ReturnType<typeof setTimeout> | null = null;
	let copiedTimer: ReturnType<typeof setTimeout> | null = null;

	const stats = $derived(getTextStats(text));
	const previewFormat = $derived(previewFormatId ? (getFormatById(previewFormatId) ?? null) : null);

	onMount(() => {
		particles = Array.from({ length: 18 }, () => ({
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: Math.random() * 4 + 2,
			duration: Math.random() * 12 + 10,
			delay: Math.random() * 3
		}));

		return () => {
			if (statusTimer) {
				clearTimeout(statusTimer);
			}
			if (selectedTimer) {
				clearTimeout(selectedTimer);
			}
			if (copiedTimer) {
				clearTimeout(copiedTimer);
			}
		};
	});

	function hasContent(): boolean {
		return text.trim().length > 0;
	}

	function pushStatus(message: string, tone: StatusTone = 'info') {
		status = { message, tone };
		if (statusTimer) {
			clearTimeout(statusTimer);
		}
		statusTimer = setTimeout(() => {
			status = null;
		}, 2600);
	}

	function toConvertedContent(formatId: FormatId): string {
		const conversionStats: ConversionStats = {
			wordCount: stats.words,
			lineCount: stats.lines,
			characterCount: stats.characters
		};

		return convertContent(formatId, {
			text,
			filename,
			stats: conversionStats,
			createdAt: new Date()
		});
	}

	function markDownloaded(formatId: FormatId) {
		selectedFormat = formatId;
		if (selectedTimer) {
			clearTimeout(selectedTimer);
		}
		selectedTimer = setTimeout(() => {
			selectedFormat = null;
		}, 900);
	}

	function downloadOne(formatId: FormatId) {
		if (!hasContent()) {
			pushStatus('Add text before downloading.', 'error');
			return;
		}

		const format = getFormatById(formatId);
		if (!format) {
			pushStatus('Unknown format selected.', 'error');
			return;
		}

		const content = toConvertedContent(formatId);
		const downloadedFileName = triggerDownload({
			content,
			filename,
			format,
			includeTimestamp: false
		});

		markDownloaded(formatId);
		pushStatus(`Saved ${downloadedFileName}`, 'success');
	}

	async function downloadEverything() {
		if (!hasContent()) {
			pushStatus('Add text before downloading all formats.', 'error');
			return;
		}

		pushStatus('Preparing all downloads...', 'info');

		await downloadAllFormats({
			formats: FORMATS,
			filename,
			includeTimestamp: false,
			makeContent: (formatId) => toConvertedContent(formatId),
			onDownloaded: (formatId) => {
				selectedFormat = formatId;
			},
			delayMs: 260
		});

		selectedFormat = null;
		pushStatus('Downloaded all formats.', 'success');
	}

	function openPreview(formatId: FormatId) {
		previewFormatId = formatId;
		previewContent = toConvertedContent(formatId);
		showPreview = true;
	}

	function closePreview() {
		showPreview = false;
	}

	function downloadPreview() {
		if (!previewFormatId) {
			return;
		}
		downloadOne(previewFormatId);
		showPreview = false;
	}

	async function handleCopy() {
		if (!hasContent()) {
			pushStatus('Nothing to copy yet.', 'error');
			return;
		}

		const copiedOk = await copyTextToClipboard(text);
		if (!copiedOk) {
			pushStatus('Clipboard write failed in this browser.', 'error');
			return;
		}

		copied = true;
		if (copiedTimer) {
			clearTimeout(copiedTimer);
		}
		copiedTimer = setTimeout(() => {
			copied = false;
		}, 1700);
		pushStatus('Copied text to clipboard.', 'success');
	}

	function transform(kind: TextTransform) {
		if (kind !== 'clear' && !hasContent()) {
			pushStatus('Add text before applying transforms.', 'error');
			return;
		}

		text = applyTextTransform(text, kind);

		if (kind === 'clear') {
			pushStatus('Editor cleared.', 'info');
		}
	}

	async function loadFile(file: File) {
		uploadBusy = true;
		try {
			const result = await readBrowserFile(file);
			text = result.text;
			filename = inferBaseFilename(file);

			if (result.detectedBinary) {
				pushStatus(`Loaded ${file.name} as binary text package.`, 'info');
			} else {
				pushStatus(`Loaded ${file.name}.`, 'success');
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unable to read this file.';
			pushStatus(message, 'error');
		} finally {
			uploadBusy = false;
			dragActive = false;
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragActive = false;
		const file = event.dataTransfer?.files?.[0];
		if (file) {
			void loadFile(file);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragActive = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		dragActive = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!(event.ctrlKey || event.metaKey)) {
			return;
		}

		const key = event.key.toLowerCase();
		if (key === 's') {
			event.preventDefault();
			downloadOne('txt');
		}

		if (key === 'k') {
			event.preventDefault();
			showStats = !showStats;
		}
	}

	function toggleStats() {
		showStats = !showStats;
	}
</script>

<svelte:head>
	<title>TextIt | Convert long text into upload-ready files</title>
	<meta
		name="description"
		content="Convert long text and files into TXT, Markdown, HTML, JSON, CSV, XML, RTF, or LaTeX. Built for LLM context uploads, developer workflows, and quick format handoff."
	/>
	<meta
		name="keywords"
		content="text converter, llm upload, markdown converter, json converter, csv converter, text formatting, file upload"
	/>
	<link rel="canonical" href="https://textit.saurabpoudel.com.np" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="TextIt | Upload-ready text converter" />
	<meta
		property="og:description"
		content="Package long context and convert files into clean upload formats for chat tools, docs, and engineering workflows."
	/>
	<meta property="og:url" content="https://textit.saurabpoudel.com.np" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="TextIt | Upload-ready text converter" />
	<meta
		name="twitter:description"
		content="Convert long content into files for chat uploads, docs, and structured workflows."
	/>
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<div
	class="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_10%,#0f172a_0%,#082f49_35%,#111827_70%,#020617_100%)] px-4 py-8 sm:px-6"
>
	<div class="pointer-events-none absolute inset-0">
		<div
			class="absolute top-[-10rem] right-[-8rem] h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl"
		></div>
		<div
			class="absolute bottom-[-12rem] left-[-8rem] h-[24rem] w-[24rem] rounded-full bg-fuchsia-500/12 blur-3xl"
		></div>
	</div>

	{#each particles as particle, index (index)}
		<div
			class="pointer-events-none absolute rounded-full bg-cyan-200/25"
			style={`left:${particle.x}%; top:${particle.y}%; width:${particle.size}px; height:${particle.size}px; animation: float ${particle.duration}s ease-in-out ${particle.delay}s infinite;`}
		></div>
	{/each}

	<main class="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6">
		<PageHeader formatCount={FORMATS.length} />

		{#if status}
			<p
				aria-live="polite"
				class={`rounded-xl border px-4 py-2 text-sm font-semibold shadow-sm ${status.tone === 'success' ? 'border-emerald-300/40 bg-emerald-400/20 text-emerald-50' : ''} ${status.tone === 'error' ? 'border-rose-300/40 bg-rose-400/20 text-rose-50' : ''} ${status.tone === 'info' ? 'border-cyan-300/40 bg-cyan-400/20 text-cyan-50' : ''}`}
			>
				{status.message}
			</p>
		{/if}

		<section
			class="space-y-5 rounded-3xl border border-white/15 bg-slate-900/50 p-4 shadow-2xl shadow-slate-950/50 backdrop-blur-md sm:p-6"
		>
			<ActionToolbar
				disabled={!hasContent()}
				{copied}
				{uploadBusy}
				onTransform={transform}
				onCopy={handleCopy}
				onSelectFile={loadFile}
			/>

			<EditorPanel
				bind:text
				bind:filename
				{dragActive}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
			/>

			<StatsPanel {stats} showDetails={showStats} onToggle={toggleStats} />

			<FormatGrid
				formats={FORMATS}
				{selectedFormat}
				disabled={!hasContent()}
				onDownload={downloadOne}
				onPreview={openPreview}
				onDownloadAll={() => void downloadEverything()}
			/>

			<p class="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-slate-300">
				Everything runs in your browser. No server upload, no account, no tracking.
			</p>
		</section>

		<UseCases />
	</main>
</div>

<PreviewModal
	open={showPreview}
	format={previewFormat}
	content={previewContent}
	onClose={closePreview}
	onDownload={downloadPreview}
/>

<style>
	@keyframes float {
		0%,
		100% {
			transform: translate3d(0, 0, 0);
		}
		25% {
			transform: translate3d(8px, -18px, 0);
		}
		50% {
			transform: translate3d(-10px, -10px, 0);
		}
		75% {
			transform: translate3d(6px, -24px, 0);
		}
	}
</style>
