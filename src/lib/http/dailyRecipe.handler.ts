import { PUBLIC_BASE_URL } from '$env/static/public';
import { createNewAlert } from '../../components/alerts/alert.handler';
import { dailyRecipeStore } from '../../stores/store';
import axios from 'axios';

async function getDailyRecipe(): Promise<string | undefined> {
	return axios
		.get(`${PUBLIC_BASE_URL}/api/daily`, {})
		.then((res) => {
			if (res.status !== 200) return Promise.reject(res);
			dailyRecipeStore.set(res.data);
		})
		.catch((error) => {
			createNewAlert({
				type: 'error',
				message:
					'Beim Abfragen des täglichen Rezepts ist ein Fehler aufgetreten.' +
					(error.status ? ` (Error ${error.status})` : '')
			});
			console.error(error);
			return undefined;
		});
}

export { getDailyRecipe };
