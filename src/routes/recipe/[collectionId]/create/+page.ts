export const prerender = false;

export function load({ params, url }) {
	return {
		collectionId: params.collectionId,
        url: url.searchParams.get('url')
	};
}
