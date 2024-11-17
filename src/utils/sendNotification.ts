import {Channels, publishMessage} from "./redisMessageBroker";


export const sendNotification = (msg: string, userId: string) => {
    publishMessage(Channels.PushNotifications, {
        content: msg,
        userId: userId,
    })
}