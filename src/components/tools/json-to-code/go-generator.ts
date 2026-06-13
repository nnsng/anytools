const capitalize = (s: string) => {
	const clean = s.replace(/[^a-zA-Z0-9]/g, '_')
	return clean
		.split('_')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('')
}

function parseGoType(
	// biome-ignore lint/suspicious/noExplicitAny: JSON values are dynamically typed
	val: any,
	keyName: string,
	structs: string[],
): string {
	if (val === null) return 'interface{}'
	if (typeof val === 'string') return 'string'
	if (typeof val === 'number') {
		return Number.isInteger(val) ? 'int' : 'float64'
	}
	if (typeof val === 'boolean') return 'bool'

	if (Array.isArray(val)) {
		if (val.length === 0) return '[]interface{}'
		const elementTypes = new Set(val.map((item) => typeof item))
		if (elementTypes.size === 1) {
			const type = Array.from(elementTypes)[0]
			if (type === 'object') {
				const subName = `${capitalize(keyName)}Item`
				buildGoStruct(val[0], subName, structs)
				return `[]${subName}`
			}
			const goType =
				type === 'number'
					? Number.isInteger(val[0])
						? 'int'
						: 'float64'
					: type === 'boolean'
						? 'bool'
						: 'string'
			return `[]${goType}`
		}
		return '[]interface{}'
	}

	if (typeof val === 'object') {
		const subName = capitalize(keyName)
		buildGoStruct(val, subName, structs)
		return subName
	}

	return 'interface{}'
}

// biome-ignore lint/suspicious/noExplicitAny: JSON values are dynamically typed
function buildGoStruct(obj: any, name: string, structs: string[]) {
	const keys = Object.keys(obj)
	let structStr = `type ${name} struct {\n`

	for (const key of keys) {
		const pascalKey = capitalize(key)
		const typeStr = parseGoType(obj[key], key, structs)
		structStr += `\t${pascalKey} ${typeStr} \`json:"${key}"\`\n`
	}

	structStr += '}'

	if (!structs.includes(structStr)) {
		structs.push(structStr)
	}
}

export function generateGoStructs(jsonStr: string, rootName: string): string {
	const parsed = JSON.parse(jsonStr)
	const structs: string[] = []
	buildGoStruct(parsed, rootName, structs)
	return structs.reverse().join('\n\n')
}
