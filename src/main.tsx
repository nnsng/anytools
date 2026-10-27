import { createRouter, RouterProvider } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'

import { NotFound } from '@/components/layout'

import { routeTree } from './routeTree.gen'

const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
	scrollRestoration: true,
	defaultNotFoundComponent: () => <NotFound />,
})

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

const rootElement = document.getElementById('app')

if (rootElement) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(<RouterProvider router={router} />)
}
