import prisma from "../prisma";
import {Channels, subscribeMessage} from "../utils/redisMessageBroker";

subscribeMessage(Channels.PushNotifications, async (data) => {
    console.log(`Received message from notification channel: ${data.content}`);


    try {
        await prisma.notification.create({
            data: {
                content: data.content,
                userId: data.userId,
            }
        });
    } catch (error) {
        console.error('Error logging notification', error);
    }
});

subscribeMessage(Channels.RemoveNotifications, async (data) =>{
    console.log(`Received message from remove notification channel for id ${data.id}`);

    try {
        await prisma.notification.delete({
            where: {
                id: data.id,
                userId: data.userId,
            }
        });

        console.log(`Notification id "${data.id}" deleted`);

    } catch (error) {
        console.error('Error deleting notification:', error);
    }
})
