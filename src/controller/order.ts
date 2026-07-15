import { logger } from "better-auth";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { OrderStatus } from "../../generated/prisma/enums";


export const createOrder = async(req:Request, res:Response)=>{
    try {
        const {menuItemId, tableId, paymentID, userName} = req.body;
        if(!menuItemId || !tableId) return res.status(401).json({message: "Invalid Order, Missing Content"});

        const creOrder = await prisma.order.create({
            data: {
                userName,
                paymentID,
                user: {
                    connect: { id: (req as any).user.id }
                },
                menuItem: {
                    connect: { id: menuItemId }
                },
                table: {
                    connect: { id: tableId }
                }
            }
        })



    } catch (error) {
        logger.info("Internal Server Error")
        res.status(500).json({message: "Internal Server Error"})
        
    }
}