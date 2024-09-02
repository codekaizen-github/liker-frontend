import { TotallyOrderedStreamEvent } from './types';
import { handleEventNotification } from '../handleEventNotification';
export async function notifySubscribers(streamOut: TotallyOrderedStreamEvent): Promise<void> {
    await handleEventNotification(streamOut);
}
