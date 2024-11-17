import {Request, Response} from "express";
import prisma from "../prisma";
import {Channels, publishMessage} from "../utils/redisMessageBroker";

export const getAllNotifications = async (req: Request, res: Response) => {

    const userId = req?.user?.id;


    const skip = parseInt(req.query.skip as string, 10) || 0; // Default skip to 0 if not provided
    const limit = parseInt(req.query.limit as string, 10) || 10; // Default limit to 10 if not provided

    try {
        const notifications = await prisma.notification.findMany({
            where: {
                userId: userId,
            },
            skip: skip,
            take: limit,
            orderBy: {
                createdAt: 'desc', // Sort by createdAt in descending order
            },
        });
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'An error occurred while fetching notifications.' });
    }
};


export const deleteNotification = (req: Request, res: Response) => {
    const {ids}:{ids:string[]} = req.body;
    const createdBy = req?.user?.id;
    ids.map(async (id)=>{
        await publishMessage(Channels.RemoveNotifications, {id, createdBy});
    })
    res.status(202).json({message: "Delete request received"});
}
