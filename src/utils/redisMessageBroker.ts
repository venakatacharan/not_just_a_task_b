import { createClient } from "redis";
import * as dotenv from "dotenv";

dotenv.config();

export const redisClientPublisher = createClient({
  url: process.env.REDIS_URL,
});
redisClientPublisher.connect();

export enum Channels {
  // channels for customers
  CreateCustomer = "createCustomer",
  UpdateCustomer = "updateCustomer",
  DeleteCustomer = "deleteCustomer",
  MarkCustomerVisit = "markCustomerVisit",

  // channels for notifications
  PushNotifications = "pushNotifications",
  RemoveNotifications = "removeNotifications",

  // channels for orders
  CreateOrder = "createOrder",
  UpdateOrder = "updateOrder",
  DeleteOrder = "deleteOrder",

  // channels for orders
  CreateCampaign = "createCampaign",
  UpdateCampaign = "updateCampaign",
  DeleteCampaign = "deleteCampaign",
  SendCampaign = "sendCampaign",
}

export const publishMessage = async (channel: Channels, data: any) => {
  console.log("Publish message", channel, data);
  await redisClientPublisher.publish(channel, JSON.stringify(data));
};

export const redisClientSubscriber = createClient({
  url: process.env.REDIS_URL,
});

export const subscribeMessage = async (
  channel: Channels,
  handler: (data: any, channel: string) => void
) => {
  console.log("Subscribe message", channel);
  redisClientSubscriber.subscribe(channel, (message) => {
    console.log(`Received message from ${channel}`);
    const msgData = JSON.parse(message);
    handler(msgData, channel);
  });
};
