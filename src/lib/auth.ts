import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import crypto from "crypto"
import { prisma } from "./prisma";
import { role } from "better-auth/client";
import { admin } from "better-auth/plugins";
import { accessControl, ADMIN, CUSTOMER } from "./permission";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider:"mongodb"
    }),

    advanced:{
        database:{
            generateId: ()=>{
                return crypto.randomBytes(12).toString("hex")
            }
        }
    },

    emailAndPassword:{
        enabled:true,
        autoSignIn: true
    },

    plugins:[
        admin({
            defaultRole: "CUSTOMER",
            ac: accessControl,
            roles:{
                ADMIN,
                CUSTOMER
            }
        })
    ],

    account:{
        accountLinking:{
            enabled:true
        }
    },

    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [process.env.CLIENT_URL || "http://localhost:5173"],

    socialProviders:{
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
    }, 
    },

    user:{
        additionalFields:{
            role: {
                type: "string"
            },
            phone:{type:"string"},
            biography:{type:"json"},
            dateOfBirth:{type:"date"}

        }
    }
})

// export default auth;