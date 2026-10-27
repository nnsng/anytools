import { describe, expect, it } from 'vite-plus/test'

import { generateAxios, generateFetch, parseCurl } from './utils'

const CURL = `curl -X POST https://api.example.com/users -H 'Content-Type: application/json' -d '{"name":"Neo"}'`

describe('curl parsing', () => {
	it('extracts url, method, headers and body', () => {
		const parsed = parseCurl(CURL)
		expect(parsed.url).toBe('https://api.example.com/users')
		expect(parsed.method).toBe('POST')
		expect(parsed.headers['Content-Type']).toBe('application/json')
		expect(parsed.body).toContain('Neo')
	})

	it('defaults to POST when a body is present without -X', () => {
		expect(parseCurl(`curl https://x.dev -d 'a=1'`).method).toBe('POST')
	})

	it('generates fetch and axios snippets for the url', () => {
		const parsed = parseCurl(CURL)
		expect(generateFetch(parsed)).toContain('https://api.example.com/users')
		expect(generateAxios(parsed)).toContain('https://api.example.com/users')
	})
})
