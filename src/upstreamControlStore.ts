import { Transaction } from "dexie";
import {
	UpstreamControlUpdate,
	UpstreamControl,
	NewUpstreamControl,
} from "./db";

// db.transaction('rw', db.upstreamControl, async (trx) => {

export async function findUpstreamControlById(trx: Transaction, id: number) {
	return await trx
		.table<UpstreamControl>("upstreamControl")
		.where({ id: id })
		.first();
}

export async function getUpstreamControlForUpdate(
	trx: Transaction,
	id: number
) {
	return await trx
		.table<UpstreamControl>("upstreamControl")
		.where({ id: id })
		.first();
}

export async function updateUpstreamControl(
	trx: Transaction,
	id: number,
	updateWith: UpstreamControlUpdate
) {
	await trx
		.table<UpstreamControl>("upstreamControl")
		.where({ id: id })
		.modify(updateWith);
}

export async function insertIntoIgnoreUpstreamControl(
	trx: Transaction,
	upstreamControl: NewUpstreamControl
) {
	await trx.table<UpstreamControl>("upstreamControl").add(upstreamControl);
}

export async function deleteUpstreamControl(trx: Transaction, id: number) {
	const upstreamControl = await findUpstreamControlById(trx, id);

	if (upstreamControl) {
		await trx.table("upstreamControl").delete(id);
	}

	return upstreamControl;
}
