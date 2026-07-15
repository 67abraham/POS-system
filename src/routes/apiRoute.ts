import express from "express"
import { requireAuth } from "../middleware/requireAuth";
import { createMenu, deleteMenu, getMenu, updateMenu } from "../controller/menu";
import { roleCheck } from "../middleware/roleCheck";
import { createMenuItem, deleteMenuItem, getMenuItem, getMenuItemById, updateMenuItem } from "../controller/menuItem";
import { createOrder, deleteOrder, getOrder, Order_Status, updateOder } from "../controller/order";


export const menu = express.Router();
export const menuItem = express.Router()
export const order = express.Router();

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

//order

order.post("/create", requireAuth, roleCheck(["ADMIN","MANAGER","CUSTOMER"]),createOrder)
order.put("/update/:id", requireAuth, roleCheck(["ADMIN","MANAGER","CUSTOMER"]),updateOder)
order.put("/status/:id", requireAuth, roleCheck(["ADMIN","MANAGER","CUSTOMER", "STAFF"]),Order_Status)
order.delete("/del/:id", requireAuth, roleCheck(["ADMIN","MANAGER"]), deleteOrder)
order.get("/get", requireAuth, roleCheck(["ADMIN","MANAGER","CUSTOMER", "STAFF", "KITCHEN"]),getOrder)
