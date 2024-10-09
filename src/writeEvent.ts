const fencingTokenStore: string[] = [];
export async function addToken() {
    const response = await fetch(
        import.meta.env.VITE_LIKER_FENCING_TOKEN_URL ?? '',
        {
            credentials: 'include',
        }
    );
    const { fencingToken } = await response.json();
    fencingTokenStore.push(fencingToken);
}
export function addTokens(amount: number) {
    for (let i = 0; i < amount; i++) {
        addToken();
    }
}
export async function getToken() {
    if (fencingTokenStore.length === 0) {
        await addToken();
    }
    const token = fencingTokenStore.shift();
    if (!token) {
        throw new Error('No fencing tokens available');
    }
    return token;
}
export default async function writeEvent(
    type: string,
    payload: any,
    fencingToken?: string
) {
    const fencingTokenToSend = fencingToken ? fencingToken : await getToken();
    await fetch(import.meta.env.VITE_LIKER_WRITE_PATH_URL ?? '', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            data: {
                type,
                payload: {
                    ...payload,
                    fencingToken: fencingTokenToSend,
                },
            },
        }),
    });
    return fencingTokenToSend;
}
addTokens(10);
