import prisma from "@/lib/prisma";
import { Member, Prisma } from "@prisma/client";
export async function GET() {
  const members = await prisma.member.findMany({
    include: {
      // checkInRecordsId: false,
    },
  });
  return Response.json(members);
}

export async function POST(request: Request) {
  const data = await request.json();
  const member = await prisma.member.create({
    data,
  });
  return Response.json({ id: member.id });
}
