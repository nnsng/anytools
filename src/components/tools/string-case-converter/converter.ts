function getWords(str: string): string[] {
	let clean = str.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
	clean = clean.replace(/[-_]+/g, ' ')
	return clean.split(/\s+/).filter(Boolean)
}

function convertCase(str: string, transform: (words: string[]) => string): string {
	const words = getWords(str)
	if (words.length === 0) return ''
	return transform(words)
}

export function toLowerCase(str: string): string {
	return convertCase(str, (words) => words.map((w) => w.toLowerCase()).join(' '))
}

export function toUpperCase(str: string): string {
	return convertCase(str, (words) => words.map((w) => w.toUpperCase()).join(' '))
}

export function toTitleCase(str: string): string {
	return convertCase(str, (words) =>
		words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '),
	)
}

export function toSentenceCase(str: string): string {
	return convertCase(str, (words) =>
		words
			.map((w, i) =>
				i === 0 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase(),
			)
			.join(' '),
	)
}

export function toCamelCase(str: string): string {
	return convertCase(str, (words) =>
		words
			.map((w, i) =>
				i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
			)
			.join(''),
	)
}

export function toSnakeCase(str: string): string {
	return convertCase(str, (words) => words.map((w) => w.toLowerCase()).join('_'))
}

export function toKebabCase(str: string): string {
	return convertCase(str, (words) => words.map((w) => w.toLowerCase()).join('-'))
}

export function toPascalCase(str: string): string {
	return convertCase(str, (words) =>
		words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(''),
	)
}

export function toConstantCase(str: string): string {
	return convertCase(str, (words) => words.map((w) => w.toUpperCase()).join('_'))
}
