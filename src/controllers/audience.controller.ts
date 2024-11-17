import {Request, Response} from "express";
import prisma from "../prisma";
import {Customer} from "@prisma/client";
import {Channels, publishMessage} from "../utils/redisMessageBroker";

interface Rule {
    field?: 'totalSpends' | 'totalVisits' | 'lastVisit';
    value?: number;
    operator: 'AND' | 'OR';
    rules?: Rule[];

    map(param: (rule: Rule) => ({})): any;
}


const buildConditions = (rules: Rule[]): any => {
    return rules.map(rule => {
        if (rule.operator && rule.rules) {
            return {
                [rule.operator]: buildConditions(rule.rules)
            };
        } else {
            switch (rule.field) {
                case 'totalSpends':
                    return {orders: {some: {total: {gt: rule.value}}}};
                case 'totalVisits':
                    return {totalVisits: {lte: rule.value}};
                case 'lastVisit':
                    return {lastVisit: {gt: new Date(new Date().setMonth(new Date().getMonth() - (rule.value ?? 0)))}};
                default:
                    return {};
            }
        }
    });
};


export const getAudienceSize = async (req: Request, res: Response) => {
    const {rules} = req.body;

    try {
        const conditions = buildConditions(rules);
        const query = {where: {AND: conditions}, include: {orders: true}};

        const audience = await prisma.customer.findMany(query);
        res.json(audience);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({error: error.message});
    }
}

export const createAudience = async (req: Request, res: Response) => {
    try {
        const {customers}: { customers: Customer[] } = req.body;

        console.log(customers)

        const createdBy = req?.user?.id || "";

        const audience = await prisma.audience.create({
            data: {
                createdBy: createdBy,
                customers: {
                    connect: customers.map((customer: Customer) => ({id: customer.id})),
                },
            },
            include: {
                customers: true
            }
        })

        res.status(201).json({audience});
    } catch (error) {
        console.error('Error creating audience:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}

export const getAudience = async (req: Request, res: Response) => {

    const createdBy = req?.user?.id;

    const orders = await prisma.audience.findMany({
        where: {createdBy: createdBy},
        include: {
            customers: true, // Include the related customer data
        },
    });

    res.json(orders);
};

export const deleteAudience = async (req: Request, res: Response) => {

    const {id} = req.params;


    const createdBy = req?.user?.id;
    try{
        const deletedAudience = await prisma.audience.delete({
            where: {
                id: id,
                createdBy: createdBy,
            }
        });
        res.status(200).json({deletedAudience});
    }catch(error) {
        console.error('Error creating audience:', error);
        res.status(500).json({error: 'Internal server error'});
    }

};
