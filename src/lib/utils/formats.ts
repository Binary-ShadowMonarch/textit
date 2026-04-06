export type FormatId = 'txt' | 'md' | 'html' | 'json' | 'csv' | 'xml' | 'rtf' | 'tex';

export interface TextFormat {
	id: FormatId;
	name: string;
	extension: string;
	icon: string;
	gradient: string;
	description: string;
	mimeType: string;
}

export interface ConversionStats {
	wordCount: number;
	lineCount: number;
	characterCount: number;
}

export interface ConversionInput {
	text: string;
	filename: string;
	stats: ConversionStats;
	createdAt?: Date;
}

const INVALID_FILENAME_CHARS = /[\\/:*?"<>|]/g;

function normalizeLineEndings(text: string): string {
	return text.replace(/\r\n?/g, '\n');
}

function escapeHtml(input: string): string {
	return input
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function escapeXml(input: string): string {
	return input
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function escapeRtf(input: string): string {
	return input
		.replace(/\\/g, '\\\\')
		.replace(/[{}]/g, (match) => `\\${match}`)
		.replace(/\n/g, '\\par ');
}

function escapeLatex(input: string): string {
	const latexEscapes: Record<string, string> = {
		'\\': '\\textbackslash{}',
		'{': '\\{',
		'}': '\\}',
		'#': '\\#',
		$: '\\$',
		'%': '\\%',
		'&': '\\&',
		_: '\\_',
		'^': '\\textasciicircum{}',
		'~': '\\textasciitilde{}'
	};

	return input.replace(/[\\{}#$%&_^~]/g, (match) => latexEscapes[match] ?? match);
}

function escapeCsvField(value: string): string {
	return `"${value.replace(/"/g, '""')}"`;
}

export const FORMATS: TextFormat[] = [
	{
		id: 'txt',
		name: 'Plain Text',
		extension: '.txt',
		icon: 'TXT',
		gradient: 'from-blue-500 to-cyan-400',
		description: 'Universal plain text',
		mimeType: 'text/plain;charset=utf-8'
	},
	{
		id: 'md',
		name: 'Markdown',
		extension: '.md',
		icon: 'MD',
		gradient: 'from-fuchsia-500 to-sky-500',
		description: 'Docs and prompt context',
		mimeType: 'text/markdown;charset=utf-8'
	},
	{
		id: 'html',
		name: 'HTML',
		extension: '.html',
		icon: 'HTML',
		gradient: 'from-amber-500 to-orange-500',
		description: 'Web-friendly export',
		mimeType: 'text/html;charset=utf-8'
	},
	{
		id: 'json',
		name: 'JSON',
		extension: '.json',
		icon: '{}',
		gradient: 'from-emerald-500 to-teal-500',
		description: 'Structured payload',
		mimeType: 'application/json;charset=utf-8'
	},
	{
		id: 'csv',
		name: 'CSV',
		extension: '.csv',
		icon: 'CSV',
		gradient: 'from-cyan-500 to-emerald-500',
		description: 'Spreadsheet rows',
		mimeType: 'text/csv;charset=utf-8'
	},
	{
		id: 'xml',
		name: 'XML',
		extension: '.xml',
		icon: 'XML',
		gradient: 'from-rose-500 to-red-500',
		description: 'Data exchange markup',
		mimeType: 'application/xml;charset=utf-8'
	},
	{
		id: 'rtf',
		name: 'Rich Text',
		extension: '.rtf',
		icon: 'RTF',
		gradient: 'from-pink-500 to-rose-500',
		description: 'Word processor import',
		mimeType: 'application/rtf;charset=utf-8'
	},
	{
		id: 'tex',
		name: 'LaTeX',
		extension: '.tex',
		icon: 'TEX',
		gradient: 'from-indigo-500 to-blue-500',
		description: 'Academic writing',
		mimeType: 'application/x-tex;charset=utf-8'
	}
];

export function getFormatById(formatId: FormatId): TextFormat | undefined {
	return FORMATS.find((format) => format.id === formatId);
}

export function sanitizeFilename(name: string, fallback = 'document'): string {
	const cleaned = name
		.trim()
		.replace(INVALID_FILENAME_CHARS, '-')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^[-.]+|[-.]+$/g, '');

	if (!cleaned.length) {
		return fallback;
	}

	return cleaned.slice(0, 120);
}

export function stripExtension(name: string): string {
	return name.replace(/\.[^/.]+$/, '');
}

export function convertContent(formatId: FormatId, input: ConversionInput): string {
	const text = normalizeLineEndings(input.text);
	const title = input.filename.trim() || 'document';
	const createdAt = input.createdAt ?? new Date();

	switch (formatId) {
		case 'txt':
			return text;
		case 'md':
			return `# ${title}\n\n${text}`;
		case 'html':
			return `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>${escapeHtml(title)}</title>\n  <style>\n    :root { color-scheme: light dark; }\n    body { font-family: ui-sans-serif, system-ui, sans-serif; line-height: 1.55; max-width: 80ch; margin: 2rem auto; padding: 0 1rem; }\n    pre { white-space: pre-wrap; word-break: break-word; background: color-mix(in oklab, canvas 88%, currentColor 6%); border-radius: 0.75rem; padding: 1rem; }\n  </style>\n</head>\n<body>\n  <h1>${escapeHtml(title)}</h1>\n  <pre>${escapeHtml(text)}</pre>\n</body>\n</html>`;
		case 'json':
			return JSON.stringify(
				{
					title,
					content: text,
					metadata: {
						created: createdAt.toISOString(),
						wordCount: input.stats.wordCount,
						lineCount: input.stats.lineCount,
						characterCount: input.stats.characterCount
					}
				},
				null,
				2
			);
		case 'csv': {
			const lines = text.split('\n');
			const rows = lines.map(
				(line, index) => `${escapeCsvField(String(index + 1))},${escapeCsvField(line)}`
			);
			return `"Line","Content"\n${rows.join('\n')}`;
		}
		case 'xml': {
			const cdataSafeText = text.replace(/\]\]>/g, ']]]]><![CDATA[>');
			return `<?xml version="1.0" encoding="UTF-8"?>\n<document>\n  <title>${escapeXml(title)}</title>\n  <metadata>\n    <created>${createdAt.toISOString()}</created>\n    <wordCount>${input.stats.wordCount}</wordCount>\n    <lineCount>${input.stats.lineCount}</lineCount>\n    <characterCount>${input.stats.characterCount}</characterCount>\n  </metadata>\n  <content><![CDATA[${cdataSafeText}]]></content>\n</document>`;
		}
		case 'rtf':
			return `{\\rtf1\\ansi\\deff0\n{\\fonttbl{\\f0 Times New Roman;}}\n\\f0\\fs24 ${escapeRtf(text)}\n}`;
		case 'tex':
			return `\\documentclass{article}\n\\usepackage[utf8]{inputenc}\n\\title{${escapeLatex(title)}}\n\\author{}\n\\date{\\today}\n\n\\begin{document}\n\\maketitle\n\n${escapeLatex(text)}\n\n\\end{document}`;
		default:
			return text;
	}
}
