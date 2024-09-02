import { TotallyOrderedStreamEvent } from './types';
import { handleNotifyingSubscribers } from '../handleNotifyingSubscribers';
export async function notifySubscribers(
    streamIn: TotallyOrderedStreamEvent
): Promise<void> {
    await handleNotifyingSubscribers(streamIn);
}
