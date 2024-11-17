import {Request, Response} from "express";
import { Order } from "@prisma/client"
import prisma from "../prisma";
import {Channels, publishMessage} from "../utils/redisMessageBroker";


export const getOrders = async (req: Request, res: Response) => {

    const createdBy = req?.user?.id;

    const orders = await prisma.order.findMany({
        where: {createdBy: createdBy},
        include: {
            customer: true, // Include the related customer data
        },
    });

    res.json(orders);
};

export const getOrdersCount = async (req: Request, res: Response) => {
    const createdBy = req?.user?.id;

    try {
        const orderCount = await prisma.order.count({
            where: {
                createdBy: createdBy,
            },
        });

        res.json({ count: orderCount });
    } catch (error) {
        console.error('Error fetching order count:', error);
        res.status(500).send("Internal Server Error");
    }
};

export const getOrder = async (req: Request, res: Response) => {
    const createdBy = req?.user?.id;
    const {id} = req.params;
    const order = await prisma.order.findUnique({
        where: {
            id: id,
            createdBy: createdBy
        },
        include: {
            customer: true, // Include the related customer data
        },
    });

    if (order){
        res.json(order);
    }else{
        res.status(404).send("Not Found");
    }
};

export const createOrder = async (req: Request, res: Response) => {
    const { itemName, quantity, customerId, total }:Order = req.body;
    await publishMessage(Channels.CreateOrder, {
        itemName,
        quantity,
        customerId,
        total,
        createdBy: req?.user?.id,
    });
    res.status(202).json({message: "Creation request received"});
};

export const updateOrder = async (req: Request, res: Response) => {
    const {id} = req.params;

    const {itemName, quantity, customerId, total }:Order = req.body;


    await publishMessage(Channels.UpdateOrder, {
        itemName,
        id,
        quantity,
        customerId,
        total,
        createdBy: req?.user?.id,
    });
    res.status(202).json({message: "Update request received"});
};

export const deleteOrder = (req: Request, res: Response) => {

    const {ids}:{ids:string[]} = req.body;


    const createdBy = req?.user?.id;

    ids.map(async (id)=>{
        await publishMessage(Channels.DeleteOrder, {id, createdBy});
    })
    res.status(202).json({message: "Delete request received"});
};
