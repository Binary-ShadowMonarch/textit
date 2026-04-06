<script lang="ts">
	let { formatCount }: { formatCount: number } = $props();
</script>

<header class="space-y-4 text-center">
	<div
		class="inline-flex items-center gap-2 rounded-full border border-cyan-200/40 bg-cyan-300/20 px-4 py-1.5 text-xs font-semibold tracking-wide text-cyan-50"
	>
		<span>Client-side</span>
		<span aria-hidden="true">|</span>
		<span>Private by design</span>
		<span aria-hidden="true">|</span>
		<span>{formatCount} formats</span>
	</div>

	<h1 class="text-4xl font-black tracking-tight text-balance text-white sm:text-5xl md:text-6xl">
		TextIt Converter
	</h1>
	<p class="mx-auto max-w-3xl text-sm leading-relaxed text-pretty text-slate-200 sm:text-base">
		Turn long notes, logs, prompts, or code snippets into clean downloadable files for chat tools,
		reviews, docs, and handoffs.
	</p>
	<div class="flex flex-wrap justify-center gap-2 text-xs text-slate-300">
		<span class="rounded-full bg-white/10 px-3 py-1">Ctrl/Cmd+S quick save</span>
		<span class="rounded-full bg-white/10 px-3 py-1">Ctrl/Cmd+K toggle stats</span>
		<span class="rounded-full bg-white/10 px-3 py-1">Drag, drop, or tap upload</span>
	</div>
</header>
