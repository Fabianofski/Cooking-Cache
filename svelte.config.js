import adapterAuto from '@sveltejs/adapter-auto';
import adapterStatic from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const staticSetup = adapterStatic({
	pages: 'build',
	assets: 'build',
	fallback: 'index.html',
	precompress: false,
	strict: true
});
const autoSetup = adapterAuto({});
const adapter = process.env.ADAPTER === 'static' ? staticSetup : autoSetup;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter
	}
};

export default config;
