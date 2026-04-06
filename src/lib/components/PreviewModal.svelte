<script lang="ts">
	import type { TextFormat } from '$lib/utils/formats';

	let {
		open = false,
		format = null,
		content = '',
		onClose = () => {},
		onDownload = () => {}
	}: {
		open?: boolean;
		format?: TextFormat | null;
		content?: string;
		onClose?: () => void;
		onDownload?: () => void;
	} = $props();

	function handleKeydown(event: KeyboardEvent) {
		if (!open) {
			return;
		}
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
	>
		<button
			type="button"
			onclick={onClose}
			aria-label="Close preview"
			class="absolute inset-0 h-full w-full"
		></button>
		<div
			role="dialog"
			aria-modal="true"
			tabindex="-1"
			class="relative w-full max-w-3xl rounded-2xl border border-white/20 bg-slate-900/95 p-5 shadow-xl"
		>
			<div class="mb-4 flex items-center justify-between gap-3">
				<div>
					<p class="text-xs font-semibold tracking-wide text-slate-300 uppercase">Preview</p>
					<h2 class="text-lg font-bold text-white">{format ? format.name : 'Format'}</h2>
				</div>
				<button
					type="button"
					onclick={onClose}
					class="rounded-lg border border-white/15 bg-white/8 px-3 py-1 text-sm font-semibold text-white transition hover:bg-white/15"
				>
					Close
				</button>
			</div>
			<pre
				class="max-h-[56vh] overflow-auto rounded-xl border border-white/10 bg-black/35 p-4 text-xs leading-relaxed text-slate-200">{content}</pre>
			<div class="mt-4 flex justify-end gap-2">
				<button
					type="button"
					onclick={onClose}
					class="rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
				>
					Cancel
				</button>
				<button
					type="button"
					onclick={onDownload}
					class="rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
				>
					Download
				</button>
			</div>
		</div>
	</div>
{/if}
