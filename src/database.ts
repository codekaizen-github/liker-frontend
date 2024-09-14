// db.ts
import Dexie, { type EntityTable } from 'dexie';

export interface UpstreamControl {
    id: number;
    streamId: number;
    totalOrderId: number;
}

export type NewUpstreamControl = {
    id: number;
    streamId: number;
    totalOrderId: number;
} & {};

export type UpstreamControlUpdate = {
    id?: number | undefined;
    streamId?: number | undefined;
    totalOrderId?: number | undefined;
};

export type NewStreamOut = {
    id?: number;
    totalOrderId: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
} & {};

export interface StreamOut {
    id: number;
    totalOrderId: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

const db = new Dexie('Database') as Dexie & {
    streamOut: EntityTable<
        StreamOut,
        'id' // primary key "id" (for the typings only)
    >;
    upstreamControl: EntityTable<
        UpstreamControl,
        'id' // primary key "id" (for the typings only)
    >;
};

// Schema declaration:
db.version(1).stores({
    upstreamControl: 'id, totalOrderId, streamId', // primary key "id" (for the runtime!)
    streamOut: '++id, totalOrderId, data', // primary key "id" (for the runtime!)
});

export { db };
