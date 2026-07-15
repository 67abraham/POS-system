import type { Request, Response } from "express";
import { logger } from "../lib/logger";
import { prisma } from "../lib/prisma";
import { activityLog } from "../lib/activityLog";


export const createTable = async(req:Request, res:Response)=>{
    try {
        const {tableName, seats, image} = req.body;
        if(!tableName || !seats) return res.status(401).json({message: "All field required"})
        
        const creTable = await prisma.table.create({
            data:{
                tableName,
                seats,
                image
            }
        });
                 await activityLog({
                    userId: (req as any).user?.id,
                    details: `Create Table: ${creTable.tableName}`,
                    actions:`CREATE TABLE`
                        });
                
                logger.info(`Table Created: ${creTable.tableName}`)
                res.status(201).json(creTable)
                
        
    } catch (error) {
        logger.info("Internal Server Error")
        res.status(500).json({message: "Internal Server Error"})
        
    }
}

export const updateTable = async(req:Request, res:Response)=>{
    try {
        const {id}= req.params as {id:string}
        const {tableName, seats, image} = req.body;
        if(!tableName || !seats) return res.status(401).json({message: "All field required"})
        
        const upTable = await prisma.table.update({
            where: {id},
            data:{
                tableName,
                seats,
                image
            }
        });

             await activityLog({
                    userId: (req as any).user?.id,
                    details: `UpDate Table: ${upTable.tableName}`,
                    actions:`Update TABLE`
                        });
                
                logger.info(`Table Created: ${upTable.tableName}`)
                res.status(201).json(upTable)
                
        
    } catch (error) {
        logger.info("Internal Server Error")
        res.status(500).json({message: "Internal Server Error"})
        
    }
}

export const deleteTable= async(req:Request, res:Response)=>{
    try {
        const {id} = req.params as {id:string};

        const delTable = await prisma.table.delete({
            where: {id}
        })

             await activityLog({
                    userId: (req as any).user?.id,
                    details: `Deleted Table: ${delTable.tableName}`,
                    actions:`DELETE TABLE`
                        });
                
                logger.info(`Table Created: ${delTable.tableName}`)
                res.status(201).json({message: "Table Deleted Successful"})
                
    } catch (error) {
        logger.info("Internal Server Error")
        res.status(500).json({message: "Internal Server Error"})
          
    }
}