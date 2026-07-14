import type { Request, Response, NextFunction } from "express";
import type { IncomingHttpHeaders } from "http";
import { auth } from "./auth";
import { fromNodeHeaders } from "better-auth/node";
import { logger } from "./logger";

export const requireAuth = async(req:Request, res:Response, next:NextFunction)=>{

    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers as unknown as IncomingHttpHeaders)
        });

        if(!session || !session?.session.id){
            return res.status(401).json({message:"Unauthorized, Please Login"})

        }

        (req as any).user = session.user;
        (req as any).session = session.session

        next();
    } catch (error) {
        logger.info(`Error: ${error}`)
        res.status(500).json({message: "Internal Server Error"}) 
        
    }

}