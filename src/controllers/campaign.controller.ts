import {Request, Response} from "express";
import {Campaign} from "@prisma/client"
import prisma from "../prisma";
import {Channels, publishMessage} from "../utils/redisMessageBroker";


export const getCampaigns = async (req: Request, res: Response) => {

    const createdBy = req?.user?.id;

    const campaign = await prisma.campaign.findMany({
        where: {createdBy: createdBy},
        include: {
            Audience: {
                include: {
                    customers: true
                }
            },
        },
    });

    res.json(campaign);
};


export const getCampaign = async (req: Request, res: Response) => {
    const createdBy = req?.user?.id;
    const {id} = req.params;
    const campaign = await prisma.campaign.findUnique({
        where: {
            id: id,
            createdBy: createdBy
        },
        include: {
            Audience: {
                include: {
                    customers: true
                }
            },
        },
    });

    if (campaign) {
        res.json(campaign);
    } else {
        res.status(404).send("Not Found");
    }
};

export const createCampaign = async (req: Request, res: Response) => {
    const {name, message, audienceId}: Campaign = req.body;
    await publishMessage(Channels.CreateCampaign, {
        name, message, audienceId,
        createdBy: req?.user?.id,
    });
    res.status(202).json({message: "Creation request received"});
};

export const updateCampaign = async (req: Request, res: Response) => {
    const {id} = req.params;

    const {name, message, audienceId}: Campaign = req.body;


    await publishMessage(Channels.UpdateCampaign, {
        id,
        name, message, audienceId,
        createdBy: req?.user?.id,
    });
    res.status(202).json({message: "Update request received"});
};

export const deleteCampaign = (req: Request, res: Response) => {

    const {ids}: { ids: string[] } = req.body;


    const createdBy = req?.user?.id;

    ids.map(async (id) => {
        await publishMessage(Channels.DeleteCampaign, {id, createdBy});
    })
    res.status(202).json({message: "Delete request received"});
};

export const startCampaign = async(req: Request, res: Response) => {
    const {id} = req.params;
    const createdBy = req?.user?.id;

    const campaign = await prisma.campaign.findUnique({
        where: {
            id: id,
            createdBy: createdBy
        },
        include: {
            Audience: {
                include: {
                    customers: true
                }
            },
        },
    });

    if (campaign) {

        campaign.Audience.customers.map(async(customer)=>{
            await publishMessage(Channels.SendCampaign, {customerId:customer.id, customerName: customer.name, customerEmail:customer.email, campaignId:campaign.id, message:campaign.message, createdBy});
        })

        await prisma.campaign.update({
            where:{
                id: id,
                createdBy: createdBy
            },
            data:{
                status: "running"
            }
        })

        res.status(201).send("Send Message Request Created")

    } else {
        res.status(404).send("Not Found");
    }
}


export const getCommunicationLog = async (req: Request, res: Response) => {

    const {id} = req.params;

    const createdBy = req?.user?.id;

    const log = await prisma.communicationLog.findMany({
        where: {
            campaignId: id,
            createdBy: createdBy
        },
        include: {
            Customer: true
        },
    });

    res.json(log);
};