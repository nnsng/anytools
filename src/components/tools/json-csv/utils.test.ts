import { describe, expect, it } from 'vite-plus/test'

import { csvToJson, jsonToCsv, parseCsv, stringifyCsv } from './utils'

const TO_CSV = { delimiter: ',', includeHeader: true, flatten: true } as const
const TO_JSON = { delimiter: ',', hasHeader: true, inferTypes: true } as const

describe('parseCsv', () => {
	it('parses simple rows', () => {
		expect(parseCsv('a,b\n1,2', ',')).toEqual([
			['a', 'b'],
			['1', '2'],
		])
	})

	it('handles quoted fields, escaped quotes and embedded delimiters', () => {
		expect(parseCsv('"a,b","say ""hi"""', ',')).toEqual([['a,b', 'say "hi"']])
	})

	it('keeps newlines inside quotes', () => {
		expect(parseCsv('"line1\nline2",x', ',')).toEqual([['line1\nline2', 'x']])
	})

	it('accepts CRLF, a BOM and a trailing newline', () => {
		expect(parseCsv('﻿a,b\r\n1,2\r\n', ',')).toEqual([
			['a', 'b'],
			['1', '2'],
		])
	})

	it('skips blank lines but keeps empty fields', () => {
		expect(parseCsv('a,b\n\n,\n', ',')).toEqual([
			['a', 'b'],
			['', ''],
		])
	})

	it('supports other delimiters', () => {
		expect(parseCsv('a;b\tc', ';')).toEqual([['a', 'b\tc']])
		expect(parseCsv('a\tb', '\t')).toEqual([['a', 'b']])
	})

	it('throws on an unterminated quote', () => {
		expect(() => parseCsv('"abc,def', ',')).toThrow('Unterminated quoted field')
	})
})

describe('stringifyCsv', () => {
	it('quotes only the fields that need it', () => {
		expect(stringifyCsv([['a', 'b,c', 'say "hi"', 'two\nlines']], ',')).toBe(
			'a,"b,c","say ""hi""","two\nlines"',
		)
	})
})

describe('jsonToCsv', () => {
	it('uses the union of keys as the header and fills gaps', () => {
		const csv = jsonToCsv('[{"a":1},{"b":2,"a":3}]', TO_CSV)
		expect(csv).toBe('a,b\n1,\n3,2')
	})

	it('flattens nested objects, or stringifies them when flatten is off', () => {
		const json = '[{"user":{"name":"Neo","tags":["a","b"]}}]'
		expect(jsonToCsv(json, TO_CSV)).toBe('user.name,user.tags\nNeo,"[""a"",""b""]"')
		expect(jsonToCsv(json, { ...TO_CSV, flatten: false })).toBe(
			'user\n"{""name"":""Neo"",""tags"":[""a"",""b""]}"',
		)
	})

	it('can omit the header and accepts a single object', () => {
		expect(jsonToCsv('{"a":1,"b":"x"}', { ...TO_CSV, includeHeader: false })).toBe('1,x')
	})

	it('handles arrays of arrays and plain values', () => {
		expect(jsonToCsv('[[1,2],[3,null]]', TO_CSV)).toBe('1,2\n3,')
		expect(jsonToCsv('[1,"b"]', TO_CSV)).toBe('value\n1\nb')
	})

	it('returns nothing for an empty array and rejects mixed items', () => {
		expect(jsonToCsv('[]', TO_CSV)).toBe('')
		expect(() => jsonToCsv('[{"a":1},[1]]', TO_CSV)).toThrow('Array items must all be')
	})

	it('reports invalid JSON', () => {
		expect(() => jsonToCsv('{nope', TO_CSV)).toThrow()
	})

	it('uses the chosen delimiter and quotes accordingly', () => {
		expect(jsonToCsv('[{"a":"x;y"}]', { ...TO_CSV, delimiter: ';' })).toBe('a\n"x;y"')
	})
})

describe('csvToJson', () => {
	it('builds objects from the header and infers types', () => {
		const json = csvToJson('name,age,ok,note\nNeo,30,true,null', TO_JSON)
		expect(JSON.parse(json)).toEqual([{ name: 'Neo', age: 30, ok: true, note: null }])
	})

	it('keeps every value a string when inference is off', () => {
		const json = csvToJson('a,b\n1,true', { ...TO_JSON, inferTypes: false })
		expect(JSON.parse(json)).toEqual([{ a: '1', b: 'true' }])
	})

	it('does not convert leading zeros or huge integers', () => {
		const json = csvToJson('a,b\n007,12345678901234567890', TO_JSON)
		expect(JSON.parse(json)).toEqual([{ a: '007', b: '12345678901234567890' }])
	})

	it('pads short rows, names blank and duplicate headers', () => {
		const json = csvToJson('a,,a\n1', { ...TO_JSON, inferTypes: false })
		expect(JSON.parse(json)).toEqual([{ a: '1', column_2: '', a_2: '' }])
	})

	it('returns arrays when there is no header row', () => {
		const json = csvToJson('1,2\n3,4', { ...TO_JSON, hasHeader: false })
		expect(JSON.parse(json)).toEqual([
			[1, 2],
			[3, 4],
		])
	})

	it('returns [] for empty input', () => {
		expect(csvToJson('', TO_JSON)).toBe('[]')
	})

	it('round-trips through jsonToCsv', () => {
		const original = [{ id: 1, text: 'a, "b"\nc' }]
		const csv = jsonToCsv(JSON.stringify(original), TO_CSV)
		expect(JSON.parse(csvToJson(csv, TO_JSON))).toEqual(original)
	})
})
