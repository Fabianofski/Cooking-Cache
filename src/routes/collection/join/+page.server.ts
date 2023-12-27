export function load({ url }) {
	return {
		inviteCode: url.searchParams.get('i')
	};
}
