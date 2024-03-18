export const prerender = false;

export async function load({ url }) {
    const inviteCode = url.searchParams.get('i');
    return {
        inviteCode
    };
}
