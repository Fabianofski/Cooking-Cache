export function load({ params, url }) {
	return {
		collectionId: params.collectionId,
		inviteCode: url.searchParams.get('i'),
		ownerId: url.searchParams.get('uid')
	};
}
