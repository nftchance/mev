import { defineConfig } from 'tsup'

export default defineConfig({
	entryPoints: ['src/'],
	outDir: 'dist',
	dts: true,
	sourcemap: true,
	clean: true,
	format: ['cjs', 'esm']
})
