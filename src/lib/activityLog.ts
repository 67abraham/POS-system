import type { Request, Response } from "express"
import { prisma } from "./prisma"
import { logger } from "./logger";


export const activityLog =async({userId, details, actions}:{userId:string, details:string, actions:string})=>{
  try {

    if(!userId || !details || !actions){return;}

    const createActivity = await prisma.activityLog.create({
        data:{
            userId,
            details,
            actions
        }
    })

    logger.info("Log: OK")
    
  } catch (error) {

    logger.error(error)
    
  }
}