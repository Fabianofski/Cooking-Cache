/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['alert-error', 'alert-info', 'alert-warning', 'alert-success'],
	theme: {
		extend: {
			gridTemplateColumns: {
				fluid: 'repeat(auto-fit, minmax(20rem, 1fr))'
			},
			animation: {
				fade: 'fadeOut var(--lifetime) ease-in-out forwards'
			},
			keyframes: () => ({
				fadeOut: {
					'0%': { opacity: 0 },
					'15%': { opacity: 1 },
					'50%': { opacity: 1 },
					'100%': { opacity: 0 }
				}
			})
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
