import { Transaction } from 'dexie';
import {
    StreamOut,
    NewStreamEvent,
    NewStreamOut,
    OrderedStreamEvent,
} from './db';

export async function findStreamOutById(trx: Transaction, id: number) {
    const streamIn = await trx.table<StreamOut>('streamIn').get(id);
    if (streamIn === undefined) {
        return undefined;
    }
    return {
        ...streamIn,
        data: JSON.parse(streamIn.data),
    };
}

export async function createStreamOutFromStreamEvent(
    trx: Transaction,
    streamEvent: NewStreamEvent | OrderedStreamEvent
) {
    const streamIn = await createStreamOut(trx, {
        ...streamEvent,
        id: undefined,
    });
    if (streamIn === undefined) {
        return undefined;
    }
    return streamIn;
}

export async function createStreamOut(
    trx: Transaction,
    streamIn: NewStreamOut
) {
    const insertResult = await trx
        .table<NewStreamOut>('streamIn')
        .add(streamIn);
    const streamInResult = await findStreamOutById(trx, Number(insertResult));
    if (streamInResult === undefined) {
        throw new Error('Failed to create stream out');
    }
    return streamInResult;
}
