import { parseAllDocuments, stringify } from 'yaml'

export type Indent = 2 | 4

export function jsonToYaml(text: string, indent: Indent): string {
	const parsed: unknown = JSON.parse(text)
	return stringify(parsed, { indent }).trimEnd()
}

export function yamlToJson(text: string, indent: Indent): string {
	const documents = parseAllDocuments(text, { merge: true })
	if (documents.length > 1) {
		throw new Error('Multiple YAML documents are not supported. Keep a single document.')
	}

	const document = documents[0]
	const parseError = document?.errors[0]
	if (parseError) {
		// The library message starts with the problem and its "at line X, column Y" position
		throw new Error(parseError.message.split('\n')[0]?.replace(/:$/, '') ?? 'Invalid YAML')
	}

	return JSON.stringify(document?.toJS() ?? null, null, indent)
}
