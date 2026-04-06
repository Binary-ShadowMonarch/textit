<script lang="ts">
	const useCases = [
		{
			title: 'LLM context packaging',
			description: 'Paste long notes, convert to a file, and upload it to avoid message limits.'
		},
		{
			title: 'Incident report handoff',
			description: 'Turn logs into CSV/JSON so teams can inspect and annotate quickly.'
		},
		{
			title: 'Prompt and doc drafting',
			description: 'Prepare Markdown and plain text files for wikis, pull requests, and specs.'
		},
		{
			title: 'API payload prep',
			description: 'Export clean JSON/XML payload templates to test integrations faster.'
		},
		{
			title: 'Research workflow',
			description: 'Convert rough notes into LaTeX or RTF-ready content before formal writing.'
		},
		{
			title: 'Binary packaging',
			description: 'Wrap small binary files as base64 text when a chat only allows text upload.'
		}
	];
</script>

<section class="rounded-2xl border border-white/15 bg-slate-900/45 p-5 backdrop-blur-sm">
	<h2 class="text-xl font-black tracking-tight text-white">Where TextIt helps most</h2>
	<p class="mt-1 text-sm text-slate-300">
		Built for developer and AI-heavy workflows where quick format switching matters.
	</p>
	<div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each useCases as useCase (useCase.title)}
			<article class="rounded-xl border border-white/10 bg-white/5 p-4">
				<h3 class="text-sm font-semibold text-white">{useCase.title}</h3>
				<p class="mt-1 text-xs leading-relaxed text-slate-300">{useCase.description}</p>
			</article>
		{/each}
	</div>
</section>
