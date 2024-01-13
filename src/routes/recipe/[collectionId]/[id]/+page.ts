export const prerender = false;

export function load({ params }) {
	return {
		id: params.id,
		collectionId: params.collectionId
	};
}
