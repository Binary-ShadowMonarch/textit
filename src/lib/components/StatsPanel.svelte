<script lang="ts">
	import type { TextStats } from '$lib/utils/text';

	let {
		stats,
		showDetails = false,
		onToggle = () => {}
	}: {
		stats: TextStats;
		showDetails?: boolean;
		onToggle?: () => void;
	} = $props();
</script>

<section class="space-y-2">
	<div class="flex items-center justify-between">
		<p class="text-xs font-semibold tracking-wide text-slate-300 uppercase">Live stats</p>
		<button
			type="button"
			onclick={onToggle}
			class="rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/15"
		>
			{showDetails ? 'Hide details' : 'Show details'}
		</button>
	</div>

	{#if showDetails}
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
			<div class="rounded-xl border border-cyan-300/30 bg-cyan-400/10 p-3">
				<p class="text-xs font-semibold text-cyan-100">Characters</p>
				<p class="mt-1 text-2xl font-black text-white">{stats.characters.toLocaleString()}</p>
			</div>
			<div class="rounded-xl border border-fuchsia-300/30 bg-fuchsia-400/10 p-3">
				<p class="text-xs font-semibold text-fuchsia-100">Words</p>
				<p class="mt-1 text-2xl font-black text-white">{stats.words.toLocaleString()}</p>
			</div>
			<div class="rounded-xl border border-amber-300/30 bg-amber-400/10 p-3">
				<p class="text-xs font-semibold text-amber-100">Lines</p>
				<p class="mt-1 text-2xl font-black text-white">{stats.lines.toLocaleString()}</p>
			</div>
			<div class="rounded-xl border border-emerald-300/30 bg-emerald-400/10 p-3">
				<p class="text-xs font-semibold text-emerald-100">Read time</p>
				<p class="mt-1 text-2xl font-black text-white">{stats.readingMinutes}m</p>
			</div>
		</div>
	{:else}
		<div
			class="flex flex-wrap justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200"
		>
			<span>{stats.characters.toLocaleString()} chars</span>
			<span>{stats.words.toLocaleString()} words</span>
			<span>{stats.lines.toLocaleString()} lines</span>
			<span>{stats.sentences.toLocaleString()} sentences</span>
		</div>
	{/if}
</section>
