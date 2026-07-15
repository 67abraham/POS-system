import express from "express"
import { requireAuth } from "../middleware/requireAuth";
import { createMenu, deleteMenu, getMenu, updateMenu } from "../controller/menu";
import { roleCheck } from "../middleware/roleCheck";
import { createMenuItem, deleteMenuItem, getMenuItem, getMenuItemById, updateMenuItem } from "../controller/menuItem";


export const menu = express.Router();
export const menuItem = express.Router()

//menu
menu.post("/create",requireAuth, roleCheck(["ADMIN", "MANAGER"]), createMenu)
menu.put("/update/:id", requireAuth, updateMenu)
menu.delete("/delete",requireAuth,deleteMenu)
menu.get("/get",getMenu)


//menuItem
menuItem.post("/create", requireAuth, roleCheck(["ADMIN","MANAGER"]), createMenuItem);
menuItem.put("/update/:id", requireAuth, roleCheck(["ADMIN","MANAGER"]), updateMenuItem);
menuItem.delete("/delete", requireAuth, roleCheck(["ADMIN","MANAGER"]), deleteMenuItem);
menuItem.get("/menu/:id", requireAuth, roleCheck(["ADMIN","MANAGER","CUSTOMER","STAFF","KITCHEN"]), getMenuItemById);
menuItem.get("/get", requireAuth, roleCheck(["ADMIN","MANAGER","CUSTOMER","STAFF","KITCHEN"]), getMenuItem);
