import {
    StreamEventIdDuplicateException,
    StreamEventOutOfSequenceException,
} from './exceptions';
import { getUpstreamControl } from '../getUpstreamControl';
import { FetchUpstream } from './buildFetchUpstream';
import { notifySubscribers } from './notifySubscribers';
import { onEventProcessSingle } from './onEventProcessSingle';
import { syncUpstream } from './syncUpstream';
import { TotallyOrderedStreamEvent } from './types';

export default async function onEvent(
    event: TotallyOrderedStreamEvent,
    fetchUpstream: FetchUpstream
) {
    // Random delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
    // Get the upstream control lock
    try {
        const results = await onEventProcessSingle(event);
        console.log({ onEventResults: results });
        if (results.length) {
            for (const result of results) {
                notifySubscribers(result);
            }
        }
    } catch (e) {
        if (e instanceof StreamEventIdDuplicateException) {
            return;
        }
        if (e instanceof StreamEventOutOfSequenceException) {
            console.log(
                'Caught StreamEventOutOfSequenceException - syncing upstream'
            );
            const upstreamControl = await getUpstreamControl();
            await syncUpstream(
                fetchUpstream,
                event.totalOrderId,
                upstreamControl.streamId,
                event.id // Note that the upstream must expect to receive userEventId
            );
        }
    }
}
