import prisma from "@/lib/prisma";
import { CheckInRecordSelect } from "@/types";
import { Gender } from "@prisma/client";
import { NextRequest } from "next/server";
export async function PATCH(request: Request) {
  const { id, memberIds }: { id: string; memberIds: string[] } =
    await request.json();
  const members = await prisma.member.findMany({
    where: {
      id: {
        in: memberIds,
      },
    },
    select: {
      id: true,
      gender: true,
      birthday: true,
    },
  });
  const maleTotal = members.filter(
    (member) => member.gender === Gender.Male
  ).length;
  await prisma.checkInRecord.update({
    where: {
      id,
    },
    data: {
      members: {
        set: memberIds.map((id) => ({ id })),
      },
      total: members.length,
      maleTotal,
      femaleTotal: members.length - maleTotal,
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
  const select: CheckInRecordSelect = {
    id: true,
    title: true,
    period: true,
    total: true,
    maleTotal: true,
    femaleTotal: true,
  };
  if (id || title) {
    select.members = {
      select: {
        id: true,
        name: true,
      },
    };
  }
  try {
    const records = await prisma.checkInRecord.findMany({
      where: {
        id,
        title,
      },
      select,
    });
    return Response.json(records || []);
  } catch (error) {
    console.error("Error getting check-in records with member counts:", error);
    return Response.json([]);
  }
}
