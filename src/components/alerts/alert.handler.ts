import { writable } from 'svelte/store';
import type AlertOptions from '../../models/AlertOptions';

const alertStore = writable<{
	[key: string]: AlertOptions;
}>({});

function createNewAlert(alert: AlertOptions) {
	alert = { ...alert };
	let id: string = '';
	do {
		id = 'id' + Math.random().toString(16).slice(2);
	} while (Object.keys(alertStore).includes(id));
	alert.id = id;

	alertStore.update((value) => {
		value[id] = alert;
		return value;
	});

	setTimeout(() => {
		alertStore.update((value) => {
			if (id in value) delete value[id];
			return value;
		});
	}, (alert.lifetime ?? 5) * 1000);
}

export { alertStore, createNewAlert };
