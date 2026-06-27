import {Request,Response,NextFunction } from 'express';
import {AppError} from '../utils/AppError';
export function validateQuote(req:Request , res:Response,next:NextFunction){
    const errors:string[]=[];
    if(!req.body.customer || typeof req.body.customer !== "string" || req.body.customer.trim()=== ""){
        errors.push("Customer is required");
    }
  
    if(!req.body.project || typeof req.body.project!=="string" || req.body.project.trim()===""){
        errors.push("Project is required");
    }
   if( typeof req.body.estimated_value!=="number" || req.body.estimated_value < 0){
     errors.push("Estimated value should be integer and greater than zero");
   }
    if(errors.length>0){
        return res.status(400).json({errors});
    }
    next();

}