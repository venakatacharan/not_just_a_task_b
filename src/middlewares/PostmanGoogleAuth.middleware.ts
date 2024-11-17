import * as dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import prisma from "../prisma";

dotenv.config();


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const verifyGoogleToken = async (token: string) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
};

export const authenticateGoogleToken = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const googleUser = await verifyGoogleToken(token);
            let user = await prisma.user.findUnique({
                where: {
                    id: googleUser?.sub,
                },
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        id: googleUser?.sub || "",
                        name: googleUser?.name || "",
                        email: googleUser?.email || "",
                        photo: googleUser?.picture || "",
                    }
                })
            }

            req.user = user;
            next();
        } catch (error) {
            console.log("authHeader", error)
            return res.sendStatus(403);
        }
    } else {
        next();
    }
};