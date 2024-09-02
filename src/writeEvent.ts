export default function writeEvent(type: string, payload: any) {
    return fetch(import.meta.env.VITE_LIKER_WRITE_PATH_URL ?? '', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data: {
                type,
                payload,
            },
        }),
    });
}
