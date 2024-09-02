import { StreamOut } from '../db';
import { handleEventNotification } from '../handleEventNotification';
export async function notifySubscribers(streamOut: StreamOut): Promise<void> {
    await handleEventNotification(streamOut);
}
