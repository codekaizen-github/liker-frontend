import { Transaction } from 'dexie';
import { createStreamOutFromStreamEvent } from './streamOutStore';
import { NewTotallyOrderedStreamEvent } from './transmissionControl/types';

export async function createTotallyOrderedStreamEvent(
    trx: Transaction,
    streamEvent: NewTotallyOrderedStreamEvent
) {
    const streamOut = await createStreamOutFromStreamEvent(trx, {
        ...streamEvent,
        id: undefined,
    });
    if (streamOut === undefined) {
        return undefined;
    }
    return streamOut;
}
