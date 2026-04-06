# TextIt

TextIt is a Svelte 5 text/file converter built for modern chat and developer workflows.

When message size limits get in the way, TextIt helps you package content into uploadable files fast: paste text, upload a file, convert to your target format, and download.

## Why TextIt

- Client-side only processing (privacy-first)
- Upload button for phone and desktop
- Drag and drop support
- Correct filename behavior (uses your chosen filename)
- Preview before download
- Download one format or all formats
- Keyboard shortcuts for power users
- Componentized Svelte 5 runes-mode codebase

## Practical Use Cases

- LLM context packaging: Convert long notes/prompts into uploadable files when chat input is limited.
- Engineering handoff: Export logs and traces as CSV/JSON for sharing and triage.
- Documentation flow: Convert rough notes into Markdown or HTML for wikis and PRs.
- API prep: Build JSON/XML payload templates quickly.
- Research and writing: Move draft text into RTF/LaTeX-ready formats.
- Binary-to-text packaging: Wrap small binary files as base64 text blocks for text-only channels.

## Supported Formats

- `.txt` plain text
- `.md` markdown
- `.html` HTML document
- `.json` structured JSON payload
- `.csv` line-by-line CSV
- `.xml` XML document
- `.rtf` rich text format
- `.tex` LaTeX article template

## Local Development

```bash
pnpm install
pnpm dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

### Quality checks

```bash
pnpm lint
pnpm check
```

### Production build

```bash
pnpm build
pnpm preview
```

## How to Use

1. Paste text or upload a file using the Upload file button.
2. Optionally adjust filename and text transforms.
3. Preview a format if needed.
4. Download one format or Download all.

### Shortcuts

- `Ctrl/Cmd + S`: quick download as `.txt`
- `Ctrl/Cmd + K`: toggle stats panel

## Project Structure

```text
src/
  lib/
    components/
      ActionToolbar.svelte
      EditorPanel.svelte
      FormatGrid.svelte
      PageHeader.svelte
      PreviewModal.svelte
      StatsPanel.svelte
      UseCases.svelte
    utils/
      files.ts
      formats.ts
      text.ts
  routes/
    +layout.svelte
    +page.svelte
```

## Tech Stack

- Svelte 5 (runes mode)
- SvelteKit
- Tailwind CSS v4
- TypeScript

## Notes on File Uploads

- Text-like files are loaded directly as text.
- Non-text files can be packaged as base64 text when small enough.
- Very large binary files are blocked to avoid generating unusable output.

## Contributing

Issues and pull requests are welcome.

Useful contribution ideas:

- Add new export formats
- Add test coverage for conversion utilities
- Improve accessibility and keyboard interactions
- Add optional timestamp naming toggle

## License

MIT License. See [LICENSE](LICENSE).
