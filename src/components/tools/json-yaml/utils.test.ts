import { describe, expect, it } from 'vite-plus/test'

import { jsonToYaml, yamlToJson } from './utils'

describe('jsonToYaml', () => {
	it('converts nested objects and arrays', () => {
		const yaml = jsonToYaml('{"name":"Neo","tags":["a","b"],"nested":{"ok":true,"n":null}}', 2)
		expect(yaml).toBe('name: Neo\ntags:\n  - a\n  - b\nnested:\n  ok: true\n  n: null')
	})

	it('respects the indent option', () => {
		expect(jsonToYaml('{"a":{"b":1}}', 4)).toBe('a:\n    b: 1')
	})

	it('quotes strings that would otherwise be read as other types', () => {
		const yaml = jsonToYaml('{"v":"true","n":"123"}', 2)
		expect(JSON.parse(yamlToJson(yaml, 2))).toEqual({ v: 'true', n: '123' })
	})

	it('throws on invalid JSON', () => {
		expect(() => jsonToYaml('{nope', 2)).toThrow()
	})
})

describe('yamlToJson', () => {
	it('converts maps, lists and scalars', () => {
		const json = yamlToJson('name: Neo\nage: 30\nok: true\nitems:\n  - 1\n  - two\n', 2)
		expect(JSON.parse(json)).toEqual({ name: 'Neo', age: 30, ok: true, items: [1, 'two'] })
	})

	it('resolves anchors, aliases and merge keys', () => {
		const yaml = 'base: &base\n  a: 1\nchild:\n  <<: *base\n  b: 2\ncopy: *base\n'
		expect(JSON.parse(yamlToJson(yaml, 2))).toEqual({
			base: { a: 1 },
			child: { a: 1, b: 2 },
			copy: { a: 1 },
		})
	})

	it('keeps multiline block scalars', () => {
		const json = yamlToJson('text: |\n  line1\n  line2\n', 2)
		expect(JSON.parse(json)).toEqual({ text: 'line1\nline2\n' })
	})

	it('reports the line and column of a syntax error', () => {
		expect(() => yamlToJson('a: 1\nb: [1, 2\nc: 3', 2)).toThrow(/line \d+, column \d+/)
	})

	it('rejects multiple documents', () => {
		expect(() => yamlToJson('a: 1\n---\nb: 2', 2)).toThrow('Multiple YAML documents')
	})

	it('treats a comment-only document as null', () => {
		expect(yamlToJson('# nothing here', 2)).toBe('null')
	})

	it('honours the indent option', () => {
		expect(yamlToJson('a:\n  b: 1', 4)).toBe('{\n    "a": {\n        "b": 1\n    }\n}')
	})

	it('round-trips with jsonToYaml', () => {
		const original = { list: [1, { a: 'x: y' }], text: 'multi\nline', empty: [], flag: false }
		const yaml = jsonToYaml(JSON.stringify(original), 2)
		expect(JSON.parse(yamlToJson(yaml, 2))).toEqual(original)
	})
})
