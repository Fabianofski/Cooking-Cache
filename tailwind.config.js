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
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#f27359',

					secondary: '#afffc1',

					accent: '#6be5cf',

					neutral: '#171f2b',

					'base-100': '#484148',

					info: '#8cc4de',

					success: '#82e3b3',

					warning: '#f5d261',

					error: '#eb5665'
				}
			}
		]
	},
	plugins: [require('daisyui')]
};
