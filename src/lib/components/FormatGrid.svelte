<script lang="ts">
	import type { FormatId, TextFormat } from '$lib/utils/formats';

	let {
		formats,
		selectedFormat = null,
		disabled = false,
		onDownload = (() => {}) as (formatId: FormatId) => void,
		onPreview = (() => {}) as (formatId: FormatId) => void,
		onDownloadAll = () => {}
	}: {
		formats: TextFormat[];
		selectedFormat?: FormatId | null;
		disabled?: boolean;
		onDownload?: (formatId: FormatId) => void;
		onPreview?: (formatId: FormatId) => void;
		onDownloadAll?: () => void;
	} = $props();
</script>

<section class="space-y-3">
	<div class="flex items-center justify-between gap-3">
		<p class="text-xs font-semibold tracking-wide text-slate-300 uppercase">Download as</p>
		<button
			type="button"
			onclick={onDownloadAll}
			{disabled}
			class="rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-cyan-900/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
		>
			Download all
		</button>
	</div>

	<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
		{#each formats as format (format.id)}
			<div class="group relative">
				<button
					type="button"
					onclick={() => onDownload(format.id)}
					{disabled}
					class={`relative flex w-full flex-col items-center gap-2 overflow-hidden rounded-xl border border-white/15 bg-white/8 p-3 text-center transition hover:scale-[1.01] hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50 ${selectedFormat === format.id ? 'ring-2 ring-emerald-300/70' : ''}`}
				>
					<div
						class={`absolute inset-0 bg-gradient-to-br ${format.gradient} opacity-0 transition-opacity group-hover:opacity-20`}
					></div>
					<div class="relative text-xs font-black tracking-wide text-white">{format.icon}</div>
					<div class="relative">
						<p class="text-sm font-semibold text-white">{format.name}</p>
						<p class="text-xs text-slate-300">{format.extension}</p>
						<p class="mt-1 text-xs text-slate-400">{format.description}</p>
					</div>
				</button>

				<button
					type="button"
					onclick={() => onPreview(format.id)}
					{disabled}
					class="absolute right-2 bottom-2 rounded-md border border-white/20 bg-black/30 px-2 py-1 text-[11px] font-semibold text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/45 disabled:cursor-not-allowed disabled:opacity-0"
				>
					Preview
				</button>
			</div>
		{/each}
	</div>
</section>
