import prisma from "@/lib/prisma";
import { Member, Prisma } from "@prisma/client";
export async function GET() {
  const members = await prisma.member.findMany({
    select: {
      id: true,
      name: true,
      fellow: true,
      birthday: true,
      gender: true,
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

export async function PATCH(request: Request) {
  const { id, ...data } = await request.json();
  await prisma.member.update({
    where: {
      id,
    },
    data,
  });
  return Response.json({ id });
}
