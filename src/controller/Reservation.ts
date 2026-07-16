import type { Request, Response } from "express"
import { logger } from "../lib/logger"


export const createReservation = async(req:Request, res:Response)=>{
    try {
        
        

    } catch (error) {
        logger.info("Internal Server Error")
        res.status(500).json({message: "Internal Server Error"})
    
    }
}