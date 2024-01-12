import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.f4b1.cookingcache',
	appName: 'Cooking Cache',
	webDir: 'build',
	server: {
		androidScheme: 'https'
	}
};

export default config;
