import prisma from "../prisma";
import {Channels, subscribeMessage} from "../utils/redisMessageBroker";
import {sendNotification} from "../utils/sendNotification";
import {Campaign} from "@prisma/client"
import {sendMessage} from "../utils/sendMessage";

const handleMessage = async (data: Campaign, channel: string) => {
    try {
        switch (channel) {
            case Channels.CreateCampaign:
                const createdCampaign = await prisma.campaign.create({data});
                console.log(`Campaign created:`, data);
                sendNotification(`${createdCampaign.name} is added as Campaign`, createdCampaign.createdBy);
                break;
            case Channels.UpdateCampaign:
                const updatedCampaign = await prisma.campaign.update({
                    where: {id: data.id, createdBy: data.createdBy},
                    data

                });
                console.log(`Campaign updated:`, updatedCampaign);
                sendNotification(`${updatedCampaign.name} data is updated`, updatedCampaign.createdBy);
                break;
            case Channels.DeleteCampaign:
                const deletedCampaign = await prisma.campaign.delete({where: {id: data.id}});
                console.log(`Campaign deleted:`, data);
                sendNotification(`${deletedCampaign.name} is deleted from Campaign`, deletedCampaign.createdBy);
                break;
            default:
                console.log(`Unknown channel: ${channel}`);
        }
    } catch (error: any) {
        console.error(`Error handling message on channel ${channel}:`, error);
        sendNotification(`Something went wrong while ${channel}. error:${error.meta.cause}`, data.createdBy);
    }
};

const channels = [Channels.CreateCampaign, Channels.UpdateCampaign, Channels.DeleteCampaign];

channels.forEach((channel) => {
    subscribeMessage(channel, handleMessage)
});


subscribeMessage(Channels.SendCampaign, async (data) =>{

    const {customerId, customerName, customerEmail, message, campaignId ,createdBy} = data

    try {

        const emailStatus = sendMessage(customerEmail,`Hi ${customerName}, ${message}`)


        await prisma.communicationLog.create({
            data:{
                campaignId: campaignId,
                status: emailStatus.status,
                createdBy: createdBy,
                customerId: customerId,
                vendorMsgId: emailStatus.vendorApiId
            }
        });

        console.log(`Communication Log Updated`);

    } catch (error) {
        console.error('Error updating communication log', error);
    }
})