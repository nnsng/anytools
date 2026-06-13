const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

function parseValueType(
	// biome-ignore lint/suspicious/noExplicitAny: JSON values are dynamically typed
	val: any,
	keyName: string,
	interfaces: string[],
): string {
	if (val === null) return 'any'
	if (typeof val === 'string') return 'string'
	if (typeof val === 'number') return 'number'
	if (typeof val === 'boolean') return 'boolean'

	if (Array.isArray(val)) {
		if (val.length === 0) return 'any[]'
		const elementTypes = new Set(val.map((item) => typeof item))
		if (elementTypes.size === 1) {
			const type = Array.from(elementTypes)[0]
			if (type === 'object') {
				const subName = `${capitalize(keyName)}Item`
				buildInterface(val[0], subName, interfaces)
				return `${subName}[]`
			}
			return `${type}[]`
		}
		return 'any[]'
	}

	if (typeof val === 'object') {
		const subName = capitalize(keyName)
		buildInterface(val, subName, interfaces)
		return subName
	}

	return 'any'
}

// biome-ignore lint/suspicious/noExplicitAny: JSON values are dynamically typed
function buildInterface(obj: any, name: string, interfaces: string[]) {
	const keys = Object.keys(obj)
	let interfaceStr = `type ${name} = {\n`

	for (const key of keys) {
		const typeStr = parseValueType(obj[key], key, interfaces)
		interfaceStr += `  ${key}: ${typeStr};\n`
	}

	interfaceStr += '}'

	if (!interfaces.includes(interfaceStr)) {
		interfaces.push(interfaceStr)
	}
}

export function generateTsInterfaces(jsonStr: string, rootName: string): string {
	const parsed = JSON.parse(jsonStr)
	const interfaces: string[] = []
	buildInterface(parsed, rootName, interfaces)
	return interfaces.reverse().join('\n\n')
}
