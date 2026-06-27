import { Request, Response, NextFunction } from "express";
import * as quoteService from "../services/quoteService";
export async function createQuote(req: Request, res: Response, next: NextFunction) {
  try {
    // call service.createQuote(req.body)
const data = req.body;
const quote=await quoteService.createQuote(data);
return res.status(201).json(quote);
    // res.status(201).json(result)
  } catch (err) {
    next(err);
  }
}
export async function getQuoteById(req: Request, res: Response, next: NextFunction) {
  try {
   
    const id = req.params.id;

    const quote=await quoteService.getQuoteById(id);
    
    return res.status(200).json(quote);
  } catch (err) {
    next(err);
  }
}
export async function getAllQuotes(req: Request, res: Response, next: NextFunction) {
  try {
    
    const result = await quoteService.getAllQuotes();
 
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
export async function analyzeQuote(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const result = await quoteService.analyzeQuote(id);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
export async function updateQuoteStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const id=  req.params.id;
    const  status= req.body.status;
    const result= await quoteService.updateQuoteStatus(id, status)
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}