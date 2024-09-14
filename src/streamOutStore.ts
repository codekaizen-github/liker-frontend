import { Transaction } from 'dexie';
import { StreamOut, NewStreamOut } from './database';
import {
    NewTotallyOrderedStreamEvent,
    TotallyOrderedStreamEvent,
} from './transmissionControl/types';

export async function findStreamOutById(trx: Transaction, id: number) {
    return await trx.table<StreamOut>('streamOut').get(id);
}

export async function findTotallyOrderedStreamEvents(
    trx: Transaction,
    eventIdStart?: number,
    eventIdEnd?: number,
    limit?: number,
    offset?: number
): Promise<TotallyOrderedStreamEvent[]> {
    const table = trx.table<StreamOut>('streamOut');
    if (eventIdStart !== undefined) {
        table.where('id').aboveOrEqual(eventIdStart);
    }
    if (eventIdEnd !== undefined) {
        table.where('id').belowOrEqual(eventIdEnd);
    }
    if (limit !== undefined) {
        table.limit(limit);
        if (offset !== undefined) {
            table.offset(offset);
        }
    }
    const queryResults = await table.toArray();
    return queryResults.map((queryResult) => {
        return {
            ...queryResult,
            data: JSON.parse(queryResult.data),
        };
    });
}

export async function createStreamOutFromStreamEvent(
    trx: Transaction,
    streamEvent: NewTotallyOrderedStreamEvent
) {
    const streamOut = await createStreamOut(trx, {
        ...streamEvent,
        id: undefined,
    });
    if (streamOut === undefined) {
        return undefined;
    }
    return streamOut;
}

export async function createStreamOut(
    trx: Transaction,
    streamOut: NewStreamOut
) {
    const insertId = await trx.table<NewStreamOut>('streamOut').add({
        totalOrderId: streamOut.totalOrderId,
        data: JSON.stringify(streamOut.data),
    });
    const streamOutResult = await findStreamOutById(trx, Number(insertId));
    if (streamOutResult === undefined) {
        throw new Error('Failed to create stream out');
    }
    return streamOutResult;
}
