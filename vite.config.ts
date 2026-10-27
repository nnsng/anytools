import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig, lazyPlugins } from 'vite-plus'

const config = defineConfig({
	staged: {
		'*': 'vp check --fix',
	},
	fmt: {
		useTabs: true,
		singleQuote: true,
		semi: false,
		printWidth: 100,
		ignorePatterns: ['src/routeTree.gen.ts', 'src/styles.css'],
		sortImports: {},
		sortTailwindcss: { functions: ['clsx', 'cn'] },
	},
	lint: {
		ignorePatterns: ['src/routeTree.gen.ts'],
		jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
		rules: {
			'vite-plus/prefer-vite-plus-imports': 'error',
			'unicorn/filename-case': [
				'error',
				{ case: 'kebabCase', ignore: ['^__root\\.tsx$', '^\\$toolId\\.tsx$'] },
			],
		},
		options: { typeAware: true, typeCheck: true },
	},
	test: {
		// Vitest v4 compatibility: preserve mock call history.
		// Remove after tests no longer rely on calls from setup or earlier tests.
		// https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
		// https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
		clearMocks: false,
	},
	resolve: { tsconfigPaths: true },
	plugins: lazyPlugins(() => [
		devtools(),
		tailwindcss(),
		tanstackRouter({ target: 'react', autoCodeSplitting: true }),
		viteReact(),
	]),
	build: {
		chunkSizeWarningLimit: 500,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) {
						return 'react-vendor'
					}
					if (/node_modules\/@tanstack\/(react-router|router-core|history)\//.test(id)) {
						return 'router-vendor'
					}
					return undefined
				},
			},
		},
	},
})

export default config
