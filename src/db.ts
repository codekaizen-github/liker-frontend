// db.ts
import Dexie, { type EntityTable } from "dexie";

interface UpstreamControl {
	id: number;
	streamInId: number;
}
interface StreamIn {
	id: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
}

const db = new Dexie("Database") as Dexie & {
	streamIn: EntityTable<
		StreamIn,
		"id" // primary key "id" (for the typings only)
	>;
	upstreamControl: EntityTable<
		UpstreamControl,
		"id" // primary key "id" (for the typings only)
	>;
};

// Schema declaration:
db.version(1).stores({
	upstreamControl: "id, streamInId", // primary key "id" (for the runtime!)
	streamIn: "++id, data", // primary key "id" (for the runtime!)
});

export type { StreamIn };
export { db };
