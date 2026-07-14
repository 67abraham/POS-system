import type { Request, Response } from "express";
import { logger } from "../lib/logger";
import { prisma } from "../lib/prisma";
import { activityLog } from "../lib/activityLog";

export const createMenuItem = async (req:Request, res:Response)=>{
    try {
        const {name, description, price, image, menuId}= req.body
        if(!name || !description || !price || !image || !menuId) return res.status(401).json({message: "All Field Required"});
        const menuExist = await prisma.menu.findUnique({
            where: {id: menuId}
        })
        if(!menuExist) return res.status(401).json({message: "Menu Not Available"});

        const createItem = await prisma.menuItem.create({
            data:{
                name,
                description,
                image,
                menuId,
                price
            }
        })

         await activityLog({
            userId: (req as any).user?.id,
            details: `MenuItem is Created: ${createItem.name}`,
            actions:`CREATE_MENU_ITEM`
                })

        logger.info(`MenItem Created ${createItem.name}`)
        res.status(201).json(createItem)
    } catch (error) {
        logger.info(`Error: ${error}`)
        res.status(500).json({message: "Internal Server Error"}) 
    }
}

export const updateMenuItem = async (req:Request, res:Response)=>{
    try {
        const {id}=req.params as {id:string}
         const {name, description, price, image, menuId}= req.body
        if(!name || !description || !price || !image || !menuId) return res.status(401).json({message: "All Field Required"});

        const updateItem = await prisma.menuItem.update({
            where:{id},
            data:{
                name,
                description,
                image,
                menuId,
                price

            }
        })

          await activityLog({
            userId: (req as any).user?.id,
            details: `MenuItem is Update: ${updateItem.name}`,
            actions:`Update_MENU_ITEM`
                })

        logger.info(`MenItem Created ${updateItem.name}`)
        res.status(201).json(updateItem)


    } catch (error) {
         logger.info(`Error: ${error}`)
        res.status(500).json({message: "Internal Server Error"}) 
    }
}