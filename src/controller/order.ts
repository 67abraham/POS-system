import { logger } from "better-auth";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { OrderStatus } from "../../generated/prisma/enums";
import { activityLog } from "../lib/activityLog";


export const createOrder = async(req:Request, res:Response)=>{
    try {
        const {menuItemId, tableId, userName} = req.body;
        if(!menuItemId || !tableId) return res.status(401).json({message: "Invalid Order, Missing Content"});

        const creOrder = await prisma.order.create({
            data: {
                userName,
                user: {
                    connect: { id: (req as any).user.id }
                },
                menuItem: {
                    connect: { id: menuItemId }
                },
                table: {
                    connect: { id: tableId }
                },
                // tableId: tableId,
                // menuItemId: menuItemId,
                
            }
        })

                await activityLog({
                    userId: (req as any).user?.id,
                    details: `Order is Created: User: ${creOrder.userName}- Status:${creOrder.status}`,
                    actions:`CREATE ORDER`
                        });
                
                logger.info(`MenItem Deleted: Order is Created: User: ${creOrder.userName}- Status:${creOrder.status}`)
                res.status(201).json(createOrder)
                
    } catch (error) {
        logger.info("Internal Server Error")
        res.status(500).json({message: "Internal Server Error"})
        
    }
}

export const updateOder = async(req:Request, res:Response)=>{
    try {
        const {id}= req.params as {id:string}
        const {tableId, userName} = req.body;
        if(!tableId) return res.status(401).json({message: "Invalid Order, Missing Content"});

        const upOrder= await prisma.order.update({
            where: {id},
            data:{
                tableId,
                userName,
            }
        })
            await activityLog({
            userId: (req as any).user?.id,
            details: `Order is UpDated: User: ${upOrder.userName}- Status:${upOrder.status}`,
            actions:`UPDATE_ORDER`
                        });
                
                logger.info(`Order is Updated: order -${upOrder.id}`)
                res.status(200).json(upOrder)
             
        
    } catch (error) {
        logger.info("Internal Server Error")
        res.status(500).json({message: "Internal Server Error"})
    
    }
}

export const Order_Status = async(req:Request, res:Response)=>{
    try {
        const {id} = req.params as {id:string}
        const {status} = req.body
        if(!status) return res.status(401).json({message:"Status Field Required"});

        
        const changeStatus = await prisma.order.update({
            where:{id},
            data:{
                status: (req as any).user.role === "CUSTOMER" ? OrderStatus.CANCELLED: status
            }
        })

            await activityLog({
            userId: (req as any).user?.id,
            details: `Order Status Change ${changeStatus.id}`,
            actions:`UPDATE_ORDER`
                        });
                
                logger.info(`Order Status Change: ${changeStatus.status}`)
                res.status(200).json(changeStatus)
             


    } catch (error) {
        logger.info("Internal Server Error")
        res.status(500).json({message: "Internal Server Error"})
      
    }
}

export const deleteOrder = async( req:Request, res:Response)=>{
    try {
        const {id}= req.params as {id:string}
        const role = (req as any).user.role;
        if(!(role === "ADMIN" || "MANAGER")) return res.status(401).json({message: "Permission Denied"});

        const del = await prisma.order.delete({
            where:{id}
        });

            await activityLog({
            userId: (req as any).user?.id,
            details: `DELETE order ${del.id}`,
            actions:`DELETE_ORDER`
                        });
                
            logger.info(`Order Deleted Successful`)
            res.status(200).json({message: "Order Deleted Successful"})
             
        
    } catch (error) {
        logger.info("Internal Server Error")
        res.status(500).json({message: "Internal Server Error"})
        
    }
}

export const getOrder = async(req:Request, res:Response)=>{
    try {
        const role = (req as any).user.role;
        const page = Math.max(1, parseInt(req.query.page as any)||1);
        const limit = Math.max(1, parseInt(req.query.limit as any)|| 10);

        const skip = (page -1) * limit;
        const userOwnOrder = await prisma.user.findUnique({
            where: {id: (req as any).user.id}
        })

        switch(role){
            case role ==="CUSTOMER":{
                const [getO, totalOrder] = await Promise.all([
                    prisma.order.findMany({
                        where:{
                            userId: userOwnOrder?.id
                        },
                        include:{
                            table: true,
                            menuItem:{
                                select:{
                                    id: true,
                                    name:true,
                                    price:true,
                                    image:true
                                }
                            }
                        },
                        orderBy:{
                            status: "asc"
                        },
                        take: limit,
                        skip
                    }),
                    prisma.order.count({where: {userId: userOwnOrder?.id}})
                ]) 

                const totalPage = Math.ceil(totalOrder / limit);

                res.status(200).json({
                    ...getO,
                    totalOrder,
                    totalPage,
                    limit,
                    skip,
                    hasNextPage: page < totalPage,
                    hasPrevPage: page > 1,

                });

                break;

            };
            case role === "STAFF" || "KITCHEN": {
                const [getO, totalOrder] = await Promise.all([
                    prisma.order.findMany({
                        where:{
                            status: OrderStatus.PREPARING
                        },
                        include:{
                            table: true,
                            menuItem:{
                                select:{
                                    id: true,
                                    name:true,
                                    price:true,
                                    image:true
                                }
                            }
                        },
                        orderBy:{
                            status: "asc"
                        },
                        take: limit,
                        skip
                    }),
                    prisma.order.count({where: {status: OrderStatus.PREPARING}})
                ]);

                const totalPage = Math.ceil(totalOrder / limit);

                res.status(200).json({
                    ...getO,
                    totalOrder,
                    totalPage,
                    limit,
                    skip,
                    hasNextPage: page < totalPage,
                    hasPrevPage: page > 1,

                });

                break;

            };
            case role === "ADMIN"||"MANAGER":{
                const [getO, totalOrder] = await Promise.all([
                    prisma.order.findMany({
                        include:{
                            table: true,
                            menuItem:{
                                select:{
                                    id: true,
                                    name:true,
                                    price:true,
                                    image:true
                                }
                            }
                        },
                        orderBy:{
                            status: "asc"
                        },
                        take: limit,
                        skip
                    }),
                    prisma.order.count({where: {status: OrderStatus.PREPARING}})
                ]);

                const totalPage = Math.ceil(totalOrder / limit);

                res.status(200).json({
                    ...getO,
                    totalOrder,
                    totalPage,
                    limit,
                    skip,
                    hasNextPage: page < totalPage,
                    hasPrevPage: page > 1,

                });

                break;

            };

            default:{
                logger.error("User is not Allow")
                res.status(401).json({message:"User Not Allow"})
            }
        }
        

        
    } catch (error) {
        logger.info("Internal Server Error")
        res.status(500).json({message: "Internal Server Error"})
       
    }
}