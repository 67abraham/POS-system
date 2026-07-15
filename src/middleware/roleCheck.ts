import { logger } from "better-auth";
import type { NextFunction, Request, Response } from "express"

type Role= "ADMIN" |"MANAGER"|"CUSTOMER"|"STAFF"|"KITCHEN"

export const roleCheck = (role:Role[])=>{
    return (req:Request, res:Response, next:NextFunction)=>{
        const user_role = (req as any).user?.role;
        if(!user_role)return res.status(401).json({message: "Unauthorized"});

        if(role.includes(user_role)){
            next();
        }

        logger.info(`Permission Denial ${(req as any).user?.role}`)
       return res.status(400).json({message: "Access Denial"})


    }
    

}