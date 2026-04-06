<script lang="ts">
	import type { TextTransform } from '$lib/utils/text';

	let {
		disabled = false,
		copied = false,
		uploadBusy = false,
		onTransform = (() => {}) as (kind: TextTransform) => void,
		onCopy = () => {},
		onSelectFile = (() => undefined) as (file: File) => Promise<void> | void
	}: {
		disabled?: boolean;
		copied?: boolean;
		uploadBusy?: boolean;
		onTransform?: (kind: TextTransform) => void;
		onCopy?: () => void;
		onSelectFile?: (file: File) => Promise<void> | void;
	} = $props();

	const fileInputId = 'textit-upload-input';

	function openFilePicker() {
		const input = document.getElementById(fileInputId) as HTMLInputElement | null;
		input?.click();
	}

	function handleFileChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			void onSelectFile(file);
		}
		input.value = '';
	}
</script>

<div
	class="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/15 bg-slate-900/40 p-3"
>
	<div class="flex flex-wrap gap-2">
		<button
			type="button"
			onclick={() => onTransform('upper')}
			{disabled}
			class="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
		>
			UPPERCASE
		</button>
		<button
			type="button"
			onclick={() => onTransform('lower')}
			{disabled}
			class="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
		>
			lowercase
		</button>
		<button
			type="button"
			onclick={() => onTransform('title')}
			{disabled}
			class="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
		>
			Title Case
		</button>
		<button
			type="button"
			onclick={onCopy}
			{disabled}
			class="rounded-lg border border-cyan-200/40 bg-cyan-400/20 px-3 py-1.5 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-400/30 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{copied ? 'Copied' : 'Copy'}
		</button>
	</div>

	<div class="flex flex-wrap gap-2">
		<input id={fileInputId} type="file" class="sr-only" onchange={handleFileChange} accept="*/*" />
		<button
			type="button"
			onclick={openFilePicker}
			disabled={uploadBusy}
			class="rounded-lg border border-emerald-200/40 bg-emerald-400/20 px-3 py-1.5 text-xs font-semibold text-emerald-50 transition hover:bg-emerald-400/30 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{uploadBusy ? 'Uploading...' : 'Upload file'}
		</button>
		<button
			type="button"
			onclick={() => onTransform('clear')}
			{disabled}
			class="rounded-lg border border-rose-200/40 bg-rose-400/20 px-3 py-1.5 text-xs font-semibold text-rose-50 transition hover:bg-rose-400/30 disabled:cursor-not-allowed disabled:opacity-50"
		>
			Clear
		</button>
	</div>
</div>
