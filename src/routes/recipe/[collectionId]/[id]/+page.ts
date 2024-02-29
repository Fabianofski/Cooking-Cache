export const prerender = false;

export function load({ params, url }) {
	return {
		id: params.id,
		collectionId: params.collectionId,
		accessToken: url.searchParams.get('key')
	};
}
