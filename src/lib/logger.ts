import pino from "pino";
import { colorizerFactory } from "pino-pretty";



export const logger =pino({
    transport:{
        target: "pino-pretty",
        options:{
            colorizerFactory: true
            
        }
        
    }
})