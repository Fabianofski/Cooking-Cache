import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		globals: true,
		environment: 'jsdom',
		coverage: {
			include: ['src/**/*.svelte', 'src/**/*.ts'],
			exclude: ['src/models/*', 'src/app.d.ts']
		}
	},
    ssr: {
        noExternal: ['send-intent']
    }
});
