import { PUBLIC_BASE_URL } from '$env/static/public';
import type { User } from '@firebase/auth';
import axios from 'axios';
import { createNewAlert } from '../../components/alerts/alert.handler';
import { weeklyPlanStore } from '../../stores/store';

async function getWeeklyPlan(user: User) {
    const token = await user.getIdToken();
    return axios
        .get(`${PUBLIC_BASE_URL}/api/weeklyPlan`, {
            headers: {
                Authorization: token
            }
        })
        .then((res) => {
            if (res.status !== 200) return Promise.reject(res);

            weeklyPlanStore.set(res.data);
        })
        .catch((error) => {
            createNewAlert({
                message:
                    'Beim Laden des Wochenplans ist ein Fehler aufgetreten!' +
                    (error.status ? ` (Error ${error.status})` : ''),
                type: 'error'
            });
        });
}

async function addRecipeToWeeklyPlan(
	user: User,
	date: string,
	collectionId: string,
	recipeId: string
) {
	const token = await user.getIdToken();
	return axios
		.post(
			`${PUBLIC_BASE_URL}/api/weeklyPlan`,
			{
				date: date,
				collectionId: collectionId,
				recipeId: recipeId
			},
			{
				headers: {
					Authorization: token,
					'Content-Type': 'application/json'
				}
			}
		)
		.then((res) => {
			if (res.status !== 200) return Promise.reject(res);

			weeklyPlanStore.update((value) => {
				if (!value) value = {};
				if (!value[date]) value[date] = { recipes: [] };
				value[date].recipes.push({
					recipeId: recipeId,
					collectionId: collectionId
				});
				return value;
			});
		})
		.catch((error) => {
			createNewAlert({
				message:
					'Beim Hinzufügen des Rezepts zum Wochenplan ist ein Fehler aufgetreten!' +
					(error.status ? ` (Error ${error.status})` : ''),
				type: 'error'
			});
		});
}

async function removeRecipeFromWeeklyPlan(user: User, date: string, index: number) {
	const token = await user.getIdToken();
	return axios
		.delete(`${PUBLIC_BASE_URL}/api/weeklyPlan?date=${date}&index=${index}`, {
			headers: {
				Authorization: token
			}
		})
		.then((res) => {
			if (res.status !== 200) return Promise.reject(res);

			weeklyPlanStore.update((value) => {
				if (!value) return value;
				if (!value[date]) return value;
				value[date].recipes.splice(index, 1);
				return value;
			});
		})
		.catch((error) => {
			createNewAlert({
				message:
					'Beim Entfernen des Rezepts vom Wochenplan ist ein Fehler aufgetreten!' +
					(error.status ? ` (Error ${error.status})` : ''),
				type: 'error'
			});
		});
}

export { getWeeklyPlan, addRecipeToWeeklyPlan, removeRecipeFromWeeklyPlan };
