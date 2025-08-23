
module.exports = {
	content: [
		'./Servicio.html',
	],
	theme: {
		extend: {
			colors: {
				primary: '#1db954',
				secondary: '#191414',
				accent: '#ffffff',
				'text-primary': '#ffffff',
				'text-secondary': '#b3b3b3',
				'background-dark': '#121212',
				'background-card': '#1e1e1e',
				'background-hover': '#2a2a2a',
				'menu-pink': '#ff1d89',
				'menu-hover': '#ff7f50',
				'menu-hover-text': '#faf7f8',
			},
			fontFamily: {
				'dream-orphans': ['"Dream Orphans"', 'sans-serif'],
				'shrikhand': ['Shrikhand', 'cursive'],
			},
			boxShadow: {
				menu: '0 4px 10px rgba(0, 0, 0, 0.1)',
				card: '0 4px 20px rgba(0, 0, 0, 0.3)',
				'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4)',
				'menu-active': '0 8px 20px rgba(0, 0, 0, 0.15)',
			},
			borderRadius: {
				menu: '12px',
			},
			transitionProperty: {
				menu: 'all',
			},
		},
	},
	plugins: [],
};
