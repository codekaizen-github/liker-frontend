import { OrderedStreamEvent, StreamOut } from './db';
import { processStreamEvent } from './streamProcessor';
import {
    getUpstreamControlForUpdate,
    insertIntoIgnoreUpstreamControl,
    updateUpstreamControl,
} from './upstreamControlStore';
import {
    StreamEventIdDuplicateException,
    StreamEventOutOfSequenceException,
} from './exceptions';
import { Dexie, Transaction } from 'dexie';

export async function notifySubscribers(
    streamOut: StreamOut
): Promise<void> {
    console.log('notifying subscribers');
}

export async function notifySubscriberUrl(
    url: string,
    streamOut: StreamOut
): Promise<void> {
    try {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(streamOut),
        });
    } catch (e) {
        console.error(e);
    }
}

export async function subscribe(
    url: string,
    callbackUrl: string
): Promise<void> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: callbackUrl,
            }),
        });
    } catch (e) {
        console.error(e);
    }
}

export async function pollForLatest(
    trx: Transaction,
    url: string
): Promise<void> {
    console.log('pollForLatest');
    const upstreamControlLock = await getUpstreamControlForUpdate(trx, 0); // Prevents duplicate entry keys and insertions in other tables
    console.log({ upstreamControlLock });
    console.log('insertIntoIgnoreUpstreamControl');
    await insertIntoIgnoreUpstreamControl(trx, { id: 0, streamOutId: 0 });
    const upstreamControl = await getUpstreamControlForUpdate(trx, 0); // Prevents duplicate entry keys and insertions in other tables
    console.log({ upstreamControl });
    if (!upstreamControl) {
        throw new Error('Failed to get upstream control for update');
    }
    await poll(trx, url, upstreamControl.id);
}

export async function makePollRequest(
    url: string,
    afterId: number
): Promise<any> {
    try {
        const urlParsed = new URL(url);
        urlParsed.searchParams.append('afterId', afterId.toString());
        const response = await fetch(urlParsed.toString());
        const streamOuts = await response.json();
        return streamOuts;
    } catch (e) {
        console.error(e);
    }
}

export async function poll(
    trx: Transaction,
    url: string,
    afterId: number
): Promise<void> {
    console.log('poll');
    const testGetUpsteamControlForUpdate = await getUpstreamControlForUpdate(
        trx,
        0
    );
    console.log({ testGetUpsteamControlForUpdate });
    // Gets any stream events between last recorded event and this neweset event (if there are any). Hypothetically, there could be gaps in the streamOut IDs.
    // RIGHT HERE IS WHERE THE ERROR IS HAPPENING
    const pollResults = await makePollRequest(url, afterId);
    // https://dexie.org/docs/DexieErrors/Dexie.PrematureCommitError.html
    await new Dexie.Promise((resolve) => setTimeout(resolve, 1000));
    const testGetUpsteamControlForUpdate2 = await getUpstreamControlForUpdate(
        trx,
        0
    );
    console.log({ testGetUpsteamControlForUpdate2 });
    return;
    // BOOM - NOW WE ARE IN TROUBLE
    console.log({ pollResults });
    const testGetUpsteamControlForUpdate3 = await getUpstreamControlForUpdate(
        trx,
        0
    );
    console.log({ testGetUpsteamControlForUpdate3 });
    if (undefined === pollResults?.length || pollResults.length === 0) {
        return;
    }
    // Assumes that the upstream service will return the events in order
    for (const pollResult of pollResults) {
        const testGetUpsteamControlForUpdateInLoop =
            await getUpstreamControlForUpdate(trx, 0);
        console.log({ testGetUpsteamControlForUpdateInLoop });
        try {
            await processStreamEventInTotalOrder(trx, pollResult);
        } catch (e) {
            // Handle StreamEventIdDuplicateException and StreamEventOutOfSequenceException differently than other exceptions
            if (e instanceof StreamEventIdDuplicateException) {
                console.warn('Stream event ID duplicate');
                // If the event ID is a duplicate, we can safely ignore it
                continue;
            }
            if (e instanceof StreamEventOutOfSequenceException) {
                // If the event ID is out of sequence, there is an issue with the upstream service
                // We should stop polling and wait for the upstream service to catch up
                console.error('Stream event out of sequence');
                return;
            }
            throw e;
        }
    }
}

export async function processStreamEventInTotalOrder(
    trx: Transaction,
    orderedStreamEvent: OrderedStreamEvent
): Promise<void> {
    console.log('processStreamEventInTotalOrder');
    /*
    START TRANSACTION;

    -- Step 1: Lock the row for updates
    SELECT config_value FROM config_table WHERE config_id = 1 FOR UPDATE;

    -- Step 2: Try to insert the row with counter = 0
    -- If the row already exists, the insert will be ignored
    INSERT IGNORE INTO config_table (config_id, config_value, version)
    VALUES (1, 0, 1);

    -- Step 3: Select the most recent value for the row
    SELECT config_value FROM config_table WHERE config_id = 1 FOR UPDATE;

    -- Step 4: Perform your operations on config_value
    UPDATE config_table SET config_value = config_value + 1 WHERE config_id = 1;

    -- Step 5: Commit the transaction
    COMMIT;
    */
    const upstreamForUpdateLock = await getUpstreamControlForUpdate(trx, 0); // Prevents duplicate entry keys and insertions in other tables
    console.log({ upstreamForUpdateLock });
    const upstreamControlIgnore = await insertIntoIgnoreUpstreamControl(trx, {
        id: 0,
        streamOutId: 0,
    });
    console.log({ upstreamControlIgnore });
    const upstreamControl = await getUpstreamControlForUpdate(trx, 0);
    console.log({ upstreamControl });
    if (upstreamControl === undefined) {
        throw new Error('Unable to find or create upstreamControl');
    }
    if (orderedStreamEvent.id <= upstreamControl.streamOutId) {
        throw new StreamEventIdDuplicateException();
    }
    if (orderedStreamEvent.id > upstreamControl.streamOutId + 1) {
        throw new StreamEventOutOfSequenceException();
    }
    await processStreamEvent(trx, orderedStreamEvent);
    await updateUpstreamControl(trx, upstreamControl.id, {
        streamOutId: upstreamControl.streamOutId + 1,
    });
}
