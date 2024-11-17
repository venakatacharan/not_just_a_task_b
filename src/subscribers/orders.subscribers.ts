import prisma from "../prisma";
import {Channels, subscribeMessage} from "../utils/redisMessageBroker";
import {sendNotification} from "../utils/sendNotification";
import {Order} from "@prisma/client"

const handleMessage = async (data: Order, channel: string) => {
    try {
        switch (channel) {
            case Channels.CreateOrder:
                const createdOrder = await prisma.order.create({data});
                console.log(`Order created:`, data);
                sendNotification(`${createdOrder.itemName} is added as Order`, createdOrder.createdBy);
                break;
            case Channels.UpdateOrder:
                const updatedOrder = await prisma.order.update({
                    where: {id: data.id, createdBy: data.createdBy},
                    data

                });
                console.log(`Order updated:`, updatedOrder);
                sendNotification(`${updatedOrder.itemName} data is updated`, updatedOrder.createdBy);
                break;
            case Channels.DeleteOrder:
                const deletedOrder = await prisma.order.delete({where: {id: data.id}});
                console.log(`Order deleted:`, data);
                sendNotification(`${deletedOrder.itemName} is deleted from Order`, deletedOrder.createdBy);
                break;
            default:
                console.log(`Unknown channel: ${channel}`);
        }
    } catch (error: any) {
        console.error(`Error handling message on channel ${channel}:`, error);
        sendNotification(`Something went wrong while ${channel}. error:${error.meta.cause}`, data.createdBy);
    }
};

const channels = [Channels.CreateOrder, Channels.UpdateOrder, Channels.DeleteOrder];

channels.forEach((channel) => {
    subscribeMessage(channel, handleMessage)
});