import { Transaction } from 'dexie';
import {
    UpstreamControlUpdate,
    UpstreamControl,
    NewUpstreamControl,
} from './database';

// db.transaction('rw', db.upstreamControl, async (trx) => {

export async function findUpstreamControlById(trx: Transaction, id: number) {
    return await trx
        .table<UpstreamControl>('upstreamControl')
        .where({ id: id })
        .first();
}

export async function getUpstreamControlForUpdate(
    trx: Transaction,
    id: number
) {
    try {
        return await trx
            .table<UpstreamControl>('upstreamControl')
            .where({ id: id })
            .first();
    } catch (e) {
        console.error({ e });
    }
}

export async function updateUpstreamControl(
    trx: Transaction,
    id: number,
    updateWith: UpstreamControlUpdate
) {
    await trx
        .table<UpstreamControl>('upstreamControl')
        .where({ id: id })
        .modify(updateWith);
}

export async function insertIntoIgnoreUpstreamControl(
    trx: Transaction,
    upstreamControl: NewUpstreamControl
) {
    // Check to see if the ignoreUpstreamControl already exists
    const ignoreUpstreamControl = await trx
        .table<UpstreamControl>('upstreamControl')
        .where({ id: upstreamControl.id })
        .first();
    if (ignoreUpstreamControl) {
        return;
    }
    await trx
        .table<UpstreamControl>('upstreamControl')
        .put(upstreamControl, upstreamControl.id);
}

export async function deleteUpstreamControl(trx: Transaction, id: number) {
    const upstreamControl = await findUpstreamControlById(trx, id);

    if (upstreamControl) {
        await trx.table('upstreamControl').delete(id);
    }

    return upstreamControl;
}
