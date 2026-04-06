<script lang="ts">
	let {
		text = $bindable(''),
		filename = $bindable('document'),
		dragActive = false,
		onDrop = (() => {}) as (event: DragEvent) => void,
		onDragOver = (() => {}) as (event: DragEvent) => void,
		onDragLeave = (() => {}) as (event: DragEvent) => void
	}: {
		text?: string;
		filename?: string;
		dragActive?: boolean;
		onDrop?: (event: DragEvent) => void;
		onDragOver?: (event: DragEvent) => void;
		onDragLeave?: (event: DragEvent) => void;
	} = $props();
</script>

<section class="space-y-3">
	<label for="filename" class="text-xs font-semibold tracking-wide text-slate-300 uppercase"
		>Filename</label
	>
	<input
		id="filename"
		type="text"
		bind:value={filename}
		placeholder="document"
		class="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-sm font-medium text-white placeholder:text-slate-400 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/30 focus:outline-none"
	/>

	<div class="relative">
		<textarea
			bind:value={text}
			ondrop={onDrop}
			ondragover={onDragOver}
			ondragleave={onDragLeave}
			class="h-72 w-full resize-y rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/30 focus:outline-none"
			placeholder="Paste text, drag and drop a file, or use Upload file..."
		></textarea>
		{#if dragActive}
			<div
				class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl border-2 border-dashed border-cyan-300/60 bg-cyan-300/10 text-sm font-semibold text-cyan-50"
			>
				Drop file to load
			</div>
		{/if}
	</div>
</section>
