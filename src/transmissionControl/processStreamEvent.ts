import { createTotallyOrderedStreamEvent } from '../createTotallyOrderedStreamEvent';
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
    const streamIn = await createTotallyOrderedStreamEvent(
        trx,
        newTotallyOrderedStreamEvent
    );
    if (streamIn === undefined) {
        throw new Error('Failed to create stream out');
    }
    results.push({
        id: streamIn.id,
        totalOrderId: newTotallyOrderedStreamEvent.totalOrderId,
        data: streamIn.data,
    });
    return results;
}
