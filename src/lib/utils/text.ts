export type TextTransform = 'upper' | 'lower' | 'title' | 'clear';

export interface TextStats {
	characters: number;
	words: number;
	lines: number;
	sentences: number;
	readingMinutes: number;
}

export function getTextStats(text: string): TextStats {
	const normalized = text.replace(/\r\n?/g, '\n');
	const words = normalized.split(/\s+/).filter((word) => word.length > 0).length;
	const lines = normalized.length ? normalized.split('\n').length : 1;
	const sentences = normalized
		.split(/[.!?]+/)
		.filter((sentence) => sentence.trim().length > 0).length;
	const readingMinutes = words > 0 ? Math.ceil(words / 200) : 0;

	return {
		characters: normalized.length,
		words,
		lines,
		sentences,
		readingMinutes
	};
}

export function applyTextTransform(text: string, transform: TextTransform): string {
	switch (transform) {
		case 'upper':
			return text.toUpperCase();
		case 'lower':
			return text.toLowerCase();
		case 'title':
			return text.replace(/\w\S*/g, (word) => {
				const head = word.charAt(0);
				const tail = word.slice(1);
				return `${head.toUpperCase()}${tail.toLowerCase()}`;
			});
		case 'clear':
			return '';
		default:
			return text;
	}
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
	if (typeof navigator === 'undefined' || !navigator.clipboard) {
		return false;
	}

	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
}
