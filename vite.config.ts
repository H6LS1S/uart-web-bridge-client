import { defineConfig } from 'vite';

import { viteSingleFile } from 'vite-plugin-singlefile';
import { svelte } from '@sveltejs/vite-plugin-svelte';

import tailwindcss from '@tailwindcss/vite';

import * as crypto from 'crypto';
import * as http from 'node:http';
import * as path from 'path';

// https://vite.dev/config/
export default defineConfig({
	server: {
		port: 3000,
		proxy: {
			'/api': {
				target: 'http://uart.local',
				changeOrigin: true,
				followRedirects: false,
				rewrite: (p) => p.replace(/^\/api/, ''),
				agent: new http.Agent({ family: 4 }) // disable mDNS ipv6
			}
		}
	},

	define: {
		__APP_VERSION__: JSON.stringify(process.env.npm_package_version),
		__APP_NAME__: JSON.stringify(process.env.npm_package_name)
	},

	html: {
		cspNonce: crypto.randomBytes(6).toString('hex')
	},

	plugins: [
		svelte({ compilerOptions: { css: 'external' } }),
		tailwindcss(),
		viteSingleFile({ removeViteModuleLoader: true })
	],

	build: {
		minify: 'terser',
		modulePreload: { polyfill: false },
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
				passes: 3,
				unsafe_arrows: true,
				unsafe_methods: true,
				unsafe_math: true,
				unsafe_proto: true,
				pure_getters: true,
				booleans_as_integers: true,
				ecma: 2020
			}
		}
	},

	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'#': path.resolve(__dirname, 'public')
		}
	}
});
