import {
	sanitizeFilename,
	stripExtension,
	type FormatId,
	type TextFormat
} from '$lib/utils/formats';

const TEXT_LIKE_EXTENSIONS = new Set([
	'txt',
	'md',
	'csv',
	'tsv',
	'json',
	'xml',
	'html',
	'htm',
	'rtf',
	'tex',
	'log',
	'ini',
	'cfg',
	'yaml',
	'yml',
	'toml',
	'js',
	'ts',
	'svelte',
	'css',
	'scss',
	'java',
	'py',
	'go',
	'rs',
	'c',
	'cpp',
	'sh',
	'bat'
]);

const KNOWN_BINARY_EXTENSIONS = new Set([
	'png',
	'jpg',
	'jpeg',
	'gif',
	'webp',
	'pdf',
	'zip',
	'7z',
	'rar',
	'mp3',
	'mp4',
	'mov',
	'avi',
	'exe',
	'bin',
	'wasm'
]);

const MAX_BINARY_BYTES = 2_000_000;

export interface DownloadInput {
	content: string;
	filename: string;
	format: TextFormat;
	includeTimestamp?: boolean;
	timestamp?: Date;
}

export interface DownloadAllInput {
	formats: TextFormat[];
	filename: string;
	makeContent: (formatId: FormatId) => string;
	includeTimestamp?: boolean;
	delayMs?: number;
	onDownloaded?: (formatId: FormatId, fileName: string) => void;
}

export interface ReadFileResult {
	text: string;
	detectedBinary: boolean;
}

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

function formatTimestamp(date: Date): string {
	const year = String(date.getFullYear());
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hour = String(date.getHours()).padStart(2, '0');
	const minute = String(date.getMinutes()).padStart(2, '0');
	const second = String(date.getSeconds()).padStart(2, '0');
	return `${year}${month}${day}-${hour}${minute}${second}`;
}

function getExtension(name: string): string {
	const chunks = name.toLowerCase().split('.');
	return chunks.length > 1 ? chunks[chunks.length - 1] : '';
}

function hasBinarySignature(buffer: ArrayBuffer): boolean {
	const bytes = new Uint8Array(buffer);
	const limit = Math.min(bytes.length, 4096);
	let suspiciousBytes = 0;

	for (let index = 0; index < limit; index += 1) {
		const value = bytes[index];
		if (value === 0) {
			return true;
		}
		if (value < 9 || (value > 13 && value < 32)) {
			suspiciousBytes += 1;
		}
	}

	return suspiciousBytes / Math.max(limit, 1) > 0.1;
}

function normalizeLineEndings(text: string): string {
	return text.replace(/\r\n?/g, '\n');
}

function bytesToBase64(buffer: ArrayBuffer): string {
	let binary = '';
	const bytes = new Uint8Array(buffer);
	const chunkSize = 0x8000;

	for (let index = 0; index < bytes.length; index += chunkSize) {
		const chunk = bytes.subarray(index, index + chunkSize);
		binary += String.fromCharCode(...chunk);
	}

	return btoa(binary);
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) {
		return `${bytes} bytes`;
	}
	if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(1)} KB`;
	}
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function buildDownloadName(
	filename: string,
	extension: string,
	includeTimestamp = false,
	timestamp = new Date()
): string {
	const baseName = sanitizeFilename(filename, 'document');
	if (includeTimestamp) {
		return `${baseName}-${formatTimestamp(timestamp)}${extension}`;
	}
	return `${baseName}${extension}`;
}

export function triggerDownload(input: DownloadInput): string {
	const fileName = buildDownloadName(
		input.filename,
		input.format.extension,
		input.includeTimestamp,
		input.timestamp
	);
	const blob = new Blob([input.content], { type: input.format.mimeType });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = fileName;
	document.body.append(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
	return fileName;
}

export async function downloadAllFormats(input: DownloadAllInput): Promise<void> {
	const delayMs = input.delayMs ?? 240;
	for (const format of input.formats) {
		const content = input.makeContent(format.id);
		const fileName = triggerDownload({
			content,
			filename: input.filename,
			format,
			includeTimestamp: input.includeTimestamp
		});
		input.onDownloaded?.(format.id, fileName);
		await wait(delayMs);
	}
}

export async function readBrowserFile(file: File): Promise<ReadFileResult> {
	const extension = getExtension(file.name);
	const isTextMime = file.type.startsWith('text/');
	const isKnownText = TEXT_LIKE_EXTENSIONS.has(extension);

	if (isTextMime || isKnownText) {
		const text = normalizeLineEndings(await file.text());
		return {
			text,
			detectedBinary: false
		};
	}

	const buffer = await file.arrayBuffer();
	const hasBinaryData = hasBinarySignature(buffer) || KNOWN_BINARY_EXTENSIONS.has(extension);

	if (!hasBinaryData) {
		const decoded = new TextDecoder('utf-8', { fatal: false }).decode(buffer);
		return {
			text: normalizeLineEndings(decoded),
			detectedBinary: false
		};
	}

	if (file.size > MAX_BINARY_BYTES) {
		throw new Error(
			`The file appears to be binary (${formatBytes(file.size)}). Use a file under ${formatBytes(MAX_BINARY_BYTES)} for binary-to-text packaging.`
		);
	}

	const base64 = bytesToBase64(buffer);
	const packaged = [
		`Binary package generated from: ${file.name}`,
		`MIME type: ${file.type || 'unknown'}`,
		`Size: ${formatBytes(file.size)}`,
		'',
		'--- BEGIN BASE64 ---',
		base64,
		'--- END BASE64 ---'
	].join('\n');

	return {
		text: packaged,
		detectedBinary: true
	};
}

export function inferBaseFilename(file: File): string {
	const inferred = sanitizeFilename(stripExtension(file.name), 'document');
	return inferred.length ? inferred : 'document';
}
