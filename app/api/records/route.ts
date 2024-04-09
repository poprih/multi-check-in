import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
export async function PATCH(request: Request) {
  const { id, memberIds }: { id: string; memberIds: string[] } =
    await request.json();
  await prisma.checkInRecord.update({
    where: {
      id,
    },
    data: {
      members: {
        set: memberIds,
      },
    },
  });
  return Response.json({ id });
}

export async function POST(request: Request) {
  const data = await request.json();
  const record = await prisma.checkInRecord.create({
    data,
  });
  return Response.json({ id: record.id });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id") || undefined;
  const title = searchParams.get("title") || undefined;
  const select: Record<string, boolean> = {
    id: true,
    title: true,
    period: true,
  };
  if (id || title) {
    select.members = true;
  }
  const records = await prisma.checkInRecord.findMany({
    where: {
      id,
      title,
    },
    select,
  });
  return Response.json(records || []);
}
