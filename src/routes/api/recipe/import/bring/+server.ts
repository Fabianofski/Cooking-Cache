import { GOOGLE_AD_ID } from '$env/static/private';
import { json } from '@sveltejs/kit';
import axios from 'axios';

export async function GET({ url }) {
	const importUrl = url.searchParams.get('url');
	const baseQuantity = url.searchParams.get('baseQuantity');
	const requestedQuantity = url.searchParams.get('requestedQuantity');

	if (!url) return new Response('400 Bad Request', { status: 400 });

	try {
		const response = await axios.post(
			'https://api.getbring.com/rest/bringrecipes/deeplink',
			{
				url: importUrl,
				source: 'web',
				baseQuantity: baseQuantity,
				requestedQuantity: requestedQuantity,
				sha1GoogleAdId: GOOGLE_AD_ID
			},
			{}
		);
		if (response.status !== 200) return new Response('400 Bad Request', { status: 400 });

		return json(response.data.deeplink);
	} catch (error) {
		console.error(error);
		return new Response('400 Bad Request', { status: 400 });
	}
}
