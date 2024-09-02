// db.ts
import Dexie, { type EntityTable } from "dexie";

export interface OrderedStreamEvent {
	id: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
}

export interface NewStreamEvent {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
}

export interface UpstreamControl {
	id: number;
	streamOutId: number;
}

export type NewUpstreamControl = {
	id: number;
	streamOutId: number;
} & {};

export type UpstreamControlUpdate = {
	id?: number | undefined;
	streamOutId?: number | undefined;
};

export type NewStreamOut = {
	id?: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
} & {};

export interface StreamOut {
	id: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
}

const db = new Dexie("Database") as Dexie & {
	streamOut: EntityTable<
		StreamOut,
		"id" // primary key "id" (for the typings only)
	>;
	upstreamControl: EntityTable<
		UpstreamControl,
		"id" // primary key "id" (for the typings only)
	>;
};

// Schema declaration:
db.version(1).stores({
	upstreamControl: "id, streamOutId", // primary key "id" (for the runtime!)
	streamOut: "++id, data", // primary key "id" (for the runtime!)
});

export { db };
