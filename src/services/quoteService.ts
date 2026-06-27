
import * as quoteRepository from "../repositories/quoteRepository";
import { AppError } from "../utils/AppError";
import * as analysisRepository from "../repositories/analysisRepository";
import * as fastApiClient from "../utils/fastApiClient";

export async function createQuote(data: {
customer: string;
project : string;
estimated_value:number;

}){
    const quote =await quoteRepository.create(data);
    return quote; 
}
export async function getQuoteById(id:string){
const quote=await quoteRepository.findById(id);
if(quote==null){
    throw new AppError("Quote not found",404);
}
return quote;
}
export async function getAllQuotes() {
  // pass-through, same as createQuote — call repository.findAll(), return it
  const quotes=await quoteRepository.findAll();
  return quotes ;
}

export async function analyzeQuote(quoteId: string) {
  
  const quote = await getQuoteById(quoteId);

  let analysisData;
  try {
    analysisData = await fastApiClient.analyzeQuote(quoteId);
  } catch (err) {
    throw new AppError("Analysis service unavailable", 503);
  }

  const savedAnalysis = await analysisRepository.create({
    quote_id: quoteId,
    risk: analysisData.risk,
    confidence: analysisData.confidence,
    missing_items: analysisData.missing_items,
  });

  
  return {
    quote,
    analysis: {
      ...savedAnalysis,
      missing_items: JSON.parse(savedAnalysis.missing_items),
    },
  };
}
const ALLOWED_STATUSES = ["New", "In Review", "Needs Info", "Completed"];

export async function updateQuoteStatus(id: string, status: string) {

  if (!ALLOWED_STATUSES.includes(status)) {
    throw new AppError(`Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`, 400);
  }
  await getQuoteById(id);

  const updated = await quoteRepository.updateStatus(id, status);

  return updated;
}