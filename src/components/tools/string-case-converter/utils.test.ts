import { describe, expect, it } from 'vite-plus/test'

import {
	toCamelCase,
	toConstantCase,
	toKebabCase,
	toPascalCase,
	toSnakeCase,
	toTitleCase,
} from './utils'

describe('case converters', () => {
	it('splits camelCase and separators into words', () => {
		expect(toSnakeCase('helloWorld-fooBar baz')).toBe('hello_world_foo_bar_baz')
		expect(toKebabCase('Hello World')).toBe('hello-world')
	})

	it('converts to camel, pascal, constant and title case', () => {
		expect(toCamelCase('hello big world')).toBe('helloBigWorld')
		expect(toPascalCase('hello big world')).toBe('HelloBigWorld')
		expect(toConstantCase('hello big world')).toBe('HELLO_BIG_WORLD')
		expect(toTitleCase('HELLO WORLD')).toBe('Hello World')
	})

	it('returns an empty string for empty input', () => {
		expect(toCamelCase('   ')).toBe('')
	})
})
