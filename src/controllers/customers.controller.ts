import { Request, Response } from "express";
import { Customer } from "@prisma/client";
import prisma from "../prisma";
import { Channels, publishMessage } from "../utils/redisMessageBroker";

export const getCustomers = async (req: Request, res: Response) => {
  const createdBy = req?.user?.id;

  const customers = await prisma.customer.findMany({
    where: { createdBy: createdBy },
  });

  res.json(customers);
};

export const getCustomerCount = async (req: Request, res: Response) => {
  const createdBy = req?.user?.id;

  try {
    const customerCount = await prisma.customer.count({
      where: {
        createdBy: createdBy,
      },
    });

    res.json({ count: customerCount });
  } catch (error) {
    console.error("Error fetching customer count:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  const createdBy = req?.user?.id;
  const { id } = req.params;
  const customer = await prisma.customer.findUnique({
    where: {
      id: id,
      createdBy: createdBy,
    },
  });

  if (customer) {
    res.json(customer);
  } else {
    res.status(404).send("Not Found");
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  const { name, email, lastVisit }: Customer = req.body;
  await publishMessage(Channels.CreateCustomer, {
    name,
    email,
    lastVisit,
    createdBy: req?.user?.id,
  });
  res.status(202).json({ message: "Creation request received" });
};

export const updateCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, lastVisit } = req.body;
  const createdBy = req?.user?.id;

  await publishMessage(Channels.UpdateCustomer, {
    id,
    name,
    email,
    lastVisit,
    createdBy,
  });
  res.status(202).json({ message: "Update request received" });
};

export const deleteCustomer = (req: Request, res: Response) => {
  const { ids }: { ids: string[] } = req.body;
  const createdBy = req?.user?.id;
  ids.map(async (id) => {
    await publishMessage(Channels.DeleteCustomer, { id, createdBy });
  });
  res.status(202).json({ message: "Delete request received" });
};

export const markCustomerVisit = async (req: Request, res: Response) => {
  const { id } = req.params;
  const createdBy = req?.user?.id;
  await publishMessage(Channels.MarkCustomerVisit, { id, createdBy });

  res.status(202).json({ message: "Visit Increment request received" });
};
