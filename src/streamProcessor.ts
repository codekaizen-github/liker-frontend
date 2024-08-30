import { NewStreamEvent } from "./db";
import { createStreamOutFromStreamEvent } from "./streamOutStore";
import { notifySubscribers } from "./subscriptions";
import { Transaction } from "dexie";

export async function processStreamEvent(
	trx: Transaction,
	newStreamEvent: NewStreamEvent
) {
	const streamOut = await createStreamOutFromStreamEvent(trx, newStreamEvent);
	if (streamOut === undefined) {
		throw new Error("Failed to create stream out");
	}
	console.log({ streamOut });
	notifySubscribers(trx, streamOut);
}
