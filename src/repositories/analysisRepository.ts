import { prisma } from "../utils/prismaClient";

export async function create(data: {
  quote_id: string;
  risk: string;
  confidence: number;
  missing_items: string[];
}) {
  return prisma.analysisResult.create({
    data: {
      quote_id: data.quote_id,
      risk: data.risk,
      confidence: data.confidence,
      missing_items: JSON.stringify(data.missing_items),
    },
  });
}