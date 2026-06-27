import { prisma } from "../utils/prismaClient"; 

export async function create(data: {
  customer: string;
  project: string;
  estimated_value: number;
}) {
  return prisma.quoteRequest.create({
    data: {
      ...data,
      status: "New",
    },
  });
}
export async function findById(id:string){
    return prisma.quoteRequest.findUnique({
        where:{
            id,
        },
        include:{
            analyses:{
                orderBy : {
                    analyzed_at: "desc",
                },
            },
        },
    });
} 
export async function findAll() {
  
  return prisma.quoteRequest.findMany({
    include:{
        analyses:{
            orderBy:{
                analyzed_at:"desc",
            },
        },
    },
  });
}
export async function updateStatus(id: string, status: string) {
  return prisma.quoteRequest.update({
    where: { id },
    data: { status },
  });
}