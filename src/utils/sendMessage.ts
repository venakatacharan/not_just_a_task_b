import { v4 as uuidv4 } from 'uuid';

export const sendMessage = (email: string, message: string) => {

    const vendorApiId = uuidv4();

    const deliveryStatus = Math.random() < 0.9 ? 'SENT' : 'FAILED';

    return {
        status: deliveryStatus,
        vendorApiId: vendorApiId,
    };
}
