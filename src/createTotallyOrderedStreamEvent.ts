import { Transaction } from 'dexie';
import { createStreamOutFromStreamEvent } from './streamInStore';
import { NewTotallyOrderedStreamEvent } from './transmissionControl/types';

export async function createTotallyOrderedStreamEvent(
    trx: Transaction,
    streamEvent: NewTotallyOrderedStreamEvent
) {
    const streamIn = await createStreamOutFromStreamEvent(trx, {
        ...streamEvent,
        id: undefined,
    });
    if (streamIn === undefined) {
        return undefined;
    }
    return streamIn;
}
