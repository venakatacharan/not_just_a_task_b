import { Strategy as GoogleStartegy } from "passport-google-oauth20";
import passport from "passport";
import * as dotenv from "dotenv";
import prisma from "../prisma";

dotenv.config();

passport.use(
  new GoogleStartegy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
      scope: ["email", "profile"],
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await prisma.user.findUnique({
                where: {
                    id: profile.id,
                },
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        id: profile.id,
                        name: profile.displayName!,
                        email: profile.emails![0].value,
                        photo: profile.photos![0].value,
                    },
                });
            }

            done(null, user);
        } catch (error) {
            done(error);
        }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});
