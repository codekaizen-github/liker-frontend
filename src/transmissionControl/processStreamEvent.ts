import { Transaction } from 'dexie';
import {
    NewTotallyOrderedStreamEvent,
    TotallyOrderedStreamEvent,
} from './types';
import { createTotallyOrderedStreamEvents } from '../createTotallyOrderedStreamEvents';

export async function processStreamEvent(
    trx: Transaction,
    newNotYetTotallyOrderedStreamEvent: NewTotallyOrderedStreamEvent
): Promise<TotallyOrderedStreamEvent[]> {
    const results = await createTotallyOrderedStreamEvents(
        trx,
        newNotYetTotallyOrderedStreamEvent
    );
    return results;
}
