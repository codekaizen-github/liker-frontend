import { Transaction } from 'dexie';
import {
    StreamOut,
    NewStreamEvent,
    NewStreamOut,
    OrderedStreamEvent,
} from './db';

export async function findStreamOutById(trx: Transaction, id: number) {
    const streamOut = await trx.table<StreamOut>('streamOut').get(id);
    if (streamOut === undefined) {
        return undefined;
    }
    return {
        ...streamOut,
        data: JSON.parse(streamOut.data),
    };
}

export async function createStreamOutFromStreamEvent(
    trx: Transaction,
    streamEvent: NewStreamEvent | OrderedStreamEvent
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
    const insertResult = await trx
        .table<NewStreamOut>('streamOut')
        .add(streamOut);
    const streamOutResult = await findStreamOutById(trx, Number(insertResult));
    if (streamOutResult === undefined) {
        throw new Error('Failed to create stream out');
    }
    return streamOutResult;
}
