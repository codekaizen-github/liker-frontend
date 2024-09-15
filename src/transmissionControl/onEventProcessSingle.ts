import { db } from '../database';
import {
    StreamEventIdDuplicateException,
    StreamEventOutOfSequenceException,
} from './exceptions';
import {
    getUpstreamControlForUpdate,
    insertIntoIgnoreUpstreamControl,
    updateUpstreamControl,
} from '../upstreamControlStore';
import { processStreamEvent } from './processStreamEvent';
import { TotallyOrderedStreamEvent } from './types';

export async function onEventProcessSingle(event: TotallyOrderedStreamEvent) {
    console.log({ onEventProcessSingle: event });
    const results = await db.transaction(
        'rw',
        [db.upstreamControl, db.streamOut],
        async (trx) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const upstreamForUpdateLock = await getUpstreamControlForUpdate(
                trx,
                0
            ); // Prevents duplicate entry keys and insertions in other tables
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const upstreamControlIgnore = await insertIntoIgnoreUpstreamControl(
                trx,
                {
                    id: 0,
                    streamId: 0,
                    totalOrderId: 0,
                }
            );
            const upstreamControl = await getUpstreamControlForUpdate(trx, 0);
            if (upstreamControl === undefined) {
                console.log('Failed to get upstream control lock');
                throw new Error('Failed to get upstream control lock');
            }
            if (upstreamControl.streamId >= event.id) {
                console.log('Stream event ID duplicate');
                throw new StreamEventIdDuplicateException();
            }
            if (upstreamControl.streamId + 1 === event.id) {
                const results = await processStreamEvent(trx, event);
                const upstreamControlToUpdate = {
                    id: 0,
                    streamId: event.id,
                    totalOrderId: event.totalOrderId,
                };
                await updateUpstreamControl(trx, 0, upstreamControlToUpdate);
                return results;
            }
            console.log('Stream event out of sequence');
            throw new StreamEventOutOfSequenceException();
        }
    );
    return results;
}
