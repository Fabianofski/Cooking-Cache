import { Capacitor } from '@capacitor/core';
export const prerender = true;
export const ssr = !Capacitor.isNativePlatform();
