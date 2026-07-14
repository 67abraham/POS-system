import express from "express"
import { requireAuth } from "../middleware/requireAuth";
import { createMenu, deleteMenu, getMenu, updateMenu } from "../controller/menu";


export const menu = express.Router();


menu.post("/create",requireAuth, createMenu)
menu.put("/update", requireAuth, updateMenu)
menu.delete("/delete",requireAuth,deleteMenu)
menu.get("/get",getMenu)