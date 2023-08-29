/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			gridTemplateColumns: {
				fluid: 'repeat(auto-fit, minmax(20rem, 1fr))'
			}
		}
	},
	plugins: [require('daisyui')]
};
