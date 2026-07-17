import type { Request, Response } from "express";
import { logger } from "../lib/logger";
import { prisma } from "../lib/prisma";
import { activityLog } from "../lib/activityLog";


export const createFeedback = async(req:Request, res:Response)=>{
    try {

        const {itemId, rating, comm} = req.body

        if(!itemId || !rating||!comm) return res.status(401).json({message:"All field required"});

        if(rating <1 || rating >5 ) return res.status(401).json({message: "Invalid Rate"});
        
        const creFeed = await prisma.feedback.create({
            data:{
                menuItemId: itemId,
                rating,
                commitment: comm,
                userName: (req as any).user.name,
                userId: (req as any).user.id,
                userImage: (req as any).user.image,
            }
        })

        await activityLog({
            userId: (req as any).user?.id,
            details: `User Feedback: ${creFeed.id}-User:${creFeed.userName}`,
            actions:`CREATE`
        })
                
        logger.info(`Feedback Created ${creFeed.userName}`)
        res.status(201).json(creFeed)
        
        
    } catch (error) {
         logger.info("Internal Server Error")
        res.status(500).json({message: "Internal Server Error"})
            
    }
}

export const updateFeedback =async(req:Request, res:Response)=>{
    try {

        const {id}=req.params as {id:string}
        const {rating, comm} = req.body

        if(!rating||!comm) return res.status(401).json({message:"All field required"});
        
        const upFeed = await prisma.feedback.update({
            where:{id, userId: (req as any).user.id},
            data:{
                rating,
                commitment: comm
            }
        })
        
        await activityLog({
            userId: (req as any).user?.id,
            details: `User Feedback Updated: ${upFeed.id}-User:${upFeed.userName}`,
            actions:`UPDATE`
        })
                
        logger.info(`Feedback Update: ${upFeed.userName}`)
        res.status(201).json(upFeed)
        
    } catch (error) {
        logger.info("Internal Server Error")
        res.status(500).json({message: "Internal Server Error"})
         
    }
}

export const deleteFeedback=async(req:Request, res:Response)=>{
    try {
        const {id } = req.params as {id:string}

        const adm = (req as any).user?.role ==="ADMIN" ? undefined : (req as any).user?.id
        const del= await prisma.feedback.delete({
            where:{id, userId: adm}
        })

        await activityLog({
            userId: (req as any).user?.id,
            details: `User Feedback Delete: ${del.id}-User:${del.userName}`,
            actions:`DELETE`
        })
                
        logger.info(`Feedback deleted:  ${del.userName}`)
        res.status(201).json({message: "Feedback Deleted"})
        
    } catch (error) {
        logger.info("Internal Server Error")
        res.status(500).json({message: "Internal Server Error"})
        
    }
}


