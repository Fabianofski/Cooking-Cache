/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['alert-error', 'alert-info', 'alert-warning', 'alert-success'],
	theme: {
		extend: {
			gridTemplateColumns: {
				fluid: 'repeat(auto-fill, minmax(20rem, 1fr))',
				'fluid-narrow': 'repeat(auto-fill, minmax(15rem, 1fr))'
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
				myTheme: {
					primary: '#15803d',
					secondary: '#0000ff',
					accent: '#5d73ff',
					neutral: '#0d070e',
					'base-100': '#1d252e',
					info: '#004eff',
					success: '#84cc16',
					warning: '#ba3700',
					error: '#ff7e98'
				},
				myTheme2: {
					primary: '#00b998',
					secondary: '#001dff',
					accent: '#00dff1',
					neutral: '#000412',
					'base-100': '#252a27',
					info: '#5ac6ff',
					success: '#8dc211',
					warning: '#b38f00',
					error: '#f12843'
				}
			}
		]
	},
	plugins: [require('daisyui')]
};
