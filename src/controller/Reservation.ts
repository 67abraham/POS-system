import type { Request, Response } from "express"
import { logger } from "../lib/logger"
import { prisma } from "../lib/prisma";
import { activityLog } from "../lib/activityLog";


export const createReservation = async(req:Request, res:Response)=>{
    try {

        const {requestDate,tableId} = req.body

        const startDay = new Date(requestDate); // 4:00
        startDay.setTime(startDay.getTime() - 2 * 60 * 60 * 1000); //2:00
        const endDate =new Date(requestDate)
        endDate.setTime(endDate.getTime() + 2 * 60 * 60 * 1000);//6:00

        const checkIfTableBooked = await prisma.reservation.findFirst({
            where:{
                date:{
                    gte: startDay,
                    lte: endDate
                }
            }
        })

        if(checkIfTableBooked) return res.status(401).json({message: "Sorry, Table Already Reserved around this time. "});

        const creRes = await prisma.reservation.create({
            data:{
                date: requestDate,
                tableId,
                userId: (req as any).user.id,
                userName: (req as any).user.name
            }
        })

         await activityLog({
                    userId: (req as any).user?.id,
                    details: `Create Reservation: ${creRes.id}-User:${creRes.userName}`,
                    actions:`CREATE`
                        })
        
                logger.info(`MenItem Created ${creRes.userName}`)
                res.status(201).json(creRes)

    } catch (error) {
        logger.info("Internal Server Error")
        res.status(500).json({message: "Internal Server Error"})
    
    }
}