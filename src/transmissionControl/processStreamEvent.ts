import { createStreamOutFromStreamEvent } from '../streamOutStore';
// import { notifySubscribers } from "./subscriptions";
import { Transaction } from 'dexie';
import {
    NewTotallyOrderedStreamEvent,
    TotallyOrderedStreamEvent,
} from './types';

export async function processStreamEvent(
    trx: Transaction,
    newTotallyOrderedStreamEvent: NewTotallyOrderedStreamEvent
) {
    const results: TotallyOrderedStreamEvent[] = [];
    const streamOut = await createStreamOutFromStreamEvent(
        trx,
        newTotallyOrderedStreamEvent
    );
    if (streamOut === undefined) {
        throw new Error('Failed to create stream out');
    }
    results.push({
        id: streamOut.id,
        totalOrderId: newTotallyOrderedStreamEvent.totalOrderId,
        data: JSON.parse(streamOut.data),
    });
    return results;
}
