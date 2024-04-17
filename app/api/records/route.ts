import prisma from "@/lib/prisma";
import { Gender, TimePeriod } from "@prisma/client";
import { getters } from "@/utils";
import { PERIOD_DESCRIPTION } from "@/const";
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
  const { period }: { period: TimePeriod } = await request.json();
  const date = getters.lastestSunday;
  const title = `${date} ${PERIOD_DESCRIPTION[period]}`;
  let record = await prisma.checkInRecord.findUnique({
    where: {
      title,
    },
    select: {
      id: true,
    },
  });
  if (!record?.id) {
    record = await prisma.checkInRecord.create({
      data: {
        title,
        date,
        period,
      },
    });
  }
  return Response.json({ id: record.id });
}

export async function GET(request: Request) {
  try {
    const records = await prisma.checkInRecord.findMany({
      select: {
        id: true,
        title: true,
        period: true,
        total: true,
        maleTotal: true,
        femaleTotal: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return Response.json(records || []);
  } catch (error) {
    console.error("Error getting check-in records with member counts:", error);
    return Response.json([]);
  }
}
