import type { Request, Response } from "express";
import { logger } from "../lib/logger";
import { prisma } from "../lib/prisma";
import { activityLog } from "../lib/activityLog";

export const createMenu = async(req:Request, res:Response)=>{
    try {
        const {name} = req.body

        const existName = await prisma.menu.findUnique({where:{menuName: name}})
        if(existName) return res.status(401).json({message: "Menu Already Exist"});
        const slung =String(name).toLowerCase()

        const creMenu = await prisma.menu.create({
            data:{
                menuName: name,
                slung
            }
        })

        //activity_log
         await activityLog({
            userId: (req as any).user?.id,
            details: `Menu is Created: ${creMenu.menuName}`,
            actions:`CREATE_MENU`
        })

        logger.info(`Menu Created: ${creMenu.menuName}`)
        res.status(201).json(creMenu)

    } catch (error) {
        logger.info(`Error: ${error}`)
        res.status(500).json({message: "Internal Server Error"})
    }

    
    

}

export const updateMenu = async(req:Request, res:Response)=>{

    try {

        const {id}= req.params as {id:string}
        const {name} = req.body
        const existName = await prisma.menu.findUnique({where:{menuName: name}})
        if(existName) return res.status(401).json({message: "Menu Already Exist"});

        const updateMenu = await prisma.menu.update({
            where:{id},
            data:{
                menuName: name
            }
        })

        //activity_log
         await activityLog({
            userId: (req as any).user?.id,
            details: `Menu is Updated: ${updateMenu.menuName}`,
            actions:`UPDATE_MENU`
        })

        logger.info(`Updated Menu: ${updateMenu.menuName}`)
        res.status(200).json(updateMenu)

    } catch (error) {
       logger.info(`Error: ${error}`)
        res.status(500).json({message: "Internal Server Error"}) 
    }

}

export const getMenu = async(req:Request, res:Response)=>{
    try {

        const page = Math.max(1, parseInt(req.query.page as any)|| 1);
        const limit = Math.max(1, parseInt(req.query.limit as any) || 10)

        const skip = (page -1) * limit;

        const [geMenu, totalMenu] = await Promise.all([
            await prisma.menu.findMany({
                take: limit,
                skip: skip,
                orderBy:{
                    menuName: "asc"
                }
            }),

            prisma.menu.count()
        ])
        
        const totalPage = Math.ceil(totalMenu / limit);

        logger.info("Get All Menu")
        res.status(200).json({
            data: getMenu,
            totalPage,
            skip,
            limit,
            hasNextPage: page < totalPage,
            hasPrevPage: page > 1
        })
    } catch (error) {
        logger.info(`Error: ${error}`)
        res.status(500).json({message: "Internal Server Error"}) 
    }
}


export const deleteMenu = async(req:Request , res:Response)=>{
    try {
        const {id} = req.params as {id:string}

        const del = await prisma.menu.delete({
            where: {id}
        })

        await activityLog({
            userId: (req as any).user?.id,
            details: `Menu is Deleted: ${del.menuName}`,
            actions:`DELETE_MENU`
        })

        logger.info("Menu Deleted Successful") 
        res.status(200).json({message: "Menu Deleted Successful"})
        
    } catch (error) {
        logger.info(`Error: ${error}`)
        res.status(500).json({message: "Internal Server Error"}) 
    }
}