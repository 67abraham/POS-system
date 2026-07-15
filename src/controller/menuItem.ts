import type { Request, Response } from "express";
import { logger } from "../lib/logger";
import { prisma } from "../lib/prisma";
import { activityLog } from "../lib/activityLog";

export const createMenuItem = async (req:Request, res:Response)=>{
    try {
        const {name, description, price, image, menuId, isAvailable}= req.body
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
                price,
                isAvailable
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
         const {name, description, price, image, menuId, isAvailable}= req.body
        if(!name || !description || !price || !image || !menuId) return res.status(401).json({message: "All Field Required"});

        const updateItem = await prisma.menuItem.update({
            where:{id},
            data:{
                name,
                description,
                image,
                menuId,
                price,
                isAvailable

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

export const getMenuItemById = async(req:Request, res:Response)=>{
    try {
        const {id} = req.params as {id:string}

        const getItem = await prisma.menuItem.findUnique({
            where:{id, isAvailable: true},
            include:{
                feedback: true
            }
        })
        if(!getItem)return res.status(404).json({message:"Item Not Found"});
       // const totalFeedback = getItem.feedback.reduce((sum, f)=> sum + f?.rating as any, 0);
         
        logger.info(`MenItem Retrieved ${getItem?.name}`)
        res.status(201).json({
            ...getItem,
          //  totalReview : totalFeedback
        })

    } catch (error){
        logger.info(`Error: ${error}`)
    res.status(500).json({message: "Internal Server Error"}) 
    }
}



export const deleteMenuItem = async(req:Request, res:Response) =>{
    try {
        const {id}=req.params as {id:string};

        const del = await prisma.menuItem.delete({
            where:{id},
            include:{
                feedback: true
            }
        })

        await activityLog({
            userId: (req as any).user?.id,
            details: `MenuItem is Deleted: ${del.name}`,
            actions:`DELETE_MENU_ITEM`
                });
        
        logger.info(`MenItem Deleted: ${del?.name}`)
        res.status(200).json({message:"Item Deleted Successful" })
        
    } catch (error) {
        logger.info(`Error: ${error}`)
        res.status(500).json({message: "Internal Server Error"}) 
       
    }
}


//How to handler pagination, when querying a large data out of the database

export const getAllItem = async( req:Request, res:Response)=>{
    try {
        const page = Math.max(1, parseInt(req.query.page as any) || 1);
        const limit = Math.max(1, parseInt(req.query.limit as any)|| 10);

        const skip = (page -1) * limit; 


        const isAvailable = (req as any).user.role === "ADMIN"? undefined: true;

        const [getData, totalItem] = await Promise.all([
            prisma.menuItem.findMany({
                take: limit,  
                skip: skip,
                orderBy:{
                    name: "asc"
                },
                where:{
                    isAvailable
                }
            }),
            
            prisma.menuItem.count({where: {isAvailable}})
        ]);

        const totalPage = Math.ceil(totalItem / limit);

        logger.info("Get All Item")
        res.status(200).json({
            getData,
            totalPage,
            skip,
            limit,
            hasNextPage: page < totalPage,
            hasPrevPage: page > 1 
        })
        
    } catch (error) {
        logger.info("Internal Server Error")
        res.status(500).json({message: "Internal Server Error"})
    }
}


