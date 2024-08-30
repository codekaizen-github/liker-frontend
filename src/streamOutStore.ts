import { Transaction } from "dexie";
import {
	StreamOut,
	NewStreamEvent,
	NewStreamOut,
	OrderedStreamEvent,
} from "./db";

export async function findStreamOutById(trx: Transaction, id: number) {
	return await trx.table<StreamOut>("streamOut").get(id);
}

export async function createStreamOutFromStreamEvent(
	trx: Transaction,
	streamEvent: NewStreamEvent | OrderedStreamEvent
) {
	const streamOut = await createStreamOut(trx, {
		...streamEvent,
		id: undefined,
		data: JSON.stringify(streamEvent.data),
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
	const { insertId } = await trx
		.table<NewStreamOut>("streamOut")
		.add(streamOut);

	return await findStreamOutById(trx, Number(insertId!));
}
