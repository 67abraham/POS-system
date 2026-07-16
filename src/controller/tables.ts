import type { Request, Response } from "express";
import { logger } from "../lib/logger";
import { prisma } from "../lib/prisma";
import { activityLog } from "../lib/activityLog";
import { TableStatus } from "../../generated/prisma/enums";


export const createTable = async(req:Request, res:Response)=>{
    try {
        const {tableName, seats, image} = req.body;
        if(!tableName || !seats) return res.status(401).json({message: "All field required"})
        
            const checkName = await prisma.table.findFirst({where: {tableName}})
            if(checkName)return res.status(401).json({message: "Table Exist"})
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
        const checkName = await prisma.table.findFirst({where: {tableName}})
        if(checkName)return res.status(401).json({message: "Table Exist"})
    
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
                res.status(200).json({message: "Table Deleted Successful"})
                
    } catch (error) {
        logger.info("Internal Server Error")
        res.status(500).json({message: "Internal Server Error"})
          
    }
}

export const getTable =async(req:Request, res:Response)=>{
    try {

        const page = Math.max(1, parseInt(req.query.page as any) || 1);
        const limit = Math.max(1, parseInt(req.query.limit as any) || 10);

        const skip = (page - 1) * limit;

        const available = (req as any).user.role ==="ADMIN"? undefined : TableStatus.AVAILABLE;

        const [getT, totalTable] = await Promise.all([
            prisma.table.findMany({
                where:{tableStatus: available},
                take: limit,
                skip,
                orderBy:{
                    tableName: "asc"
                }
            }),
            prisma.table.count({where:{tableStatus: available}})


        ]);

        const totalPage = Math.ceil(totalTable / limit);

                
        logger.info(`Get ALl Table`)
         res.status(200).json({
            getT,
            totalPage,
            totalTable,
            limit,
            skip,
            hasNextPage: page < totalPage,
            hasPrevPage: page > 1
         })
                
    } catch (error) {
       logger.info("Internal Server Error")
        res.status(500).json({message: "Internal Server Error"})
          
    }
}