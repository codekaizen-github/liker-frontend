import { Transaction } from 'dexie';
import { createStreamOutFromStreamEvent } from './streamOutStore';
import {
    NewTotallyOrderedStreamEvent,
    TotallyOrderedStreamEvent,
} from './transmissionControl/types';

export async function createTotallyOrderedStreamEvents(
    trx: Transaction,
    streamEvent: NewTotallyOrderedStreamEvent
): Promise<TotallyOrderedStreamEvent[]> {
    const results: TotallyOrderedStreamEvent[] = [];
    const streamOut = await createStreamOutFromStreamEvent(trx, streamEvent);
    if (streamOut === undefined) {
        throw new Error('Failed to create stream out');
    }
    results.push(streamOut);
    return results;
}
