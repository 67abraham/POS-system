import type { Request, Response } from "express";
import { logger } from "../lib/logger";
import { prisma } from "../lib/prisma";


export const createFeedback = async(req:Request, res:Response)=>{
    try {

        const {itemId, rating, comm} = req.body

        if(!!itemId || !rating||!comm) return res.status(401).json({message:"All field required"});
        
        const creFeed = await prisma.feedback.create({
            data:{
                menuItemId: itemId,
                rating,
                commitment: comm,
                userName: (req as any).user.name,
                userId: (req as any).user.id,
            }
        })
        
    } catch (error) {
         logger.info("Internal Server Error")
        res.status(500).json({message: "Internal Server Error"})
            
    }
}