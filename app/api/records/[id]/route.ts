import prisma from "@/lib/prisma";
import { isAfter } from "date-fns";
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const record = await prisma.checkInRecord.findUnique({
      where: {
        id: params.id,
      },
      select: {
        title: true,
        date: true,
        period: true,
        total: true,
        maleTotal: true,
        femaleTotal: true,
        members: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!record) {
      return Response.error();
    }
    const members = await prisma.member.findMany({
      select: {
        id: true,
        name: true,
        alphabet: true,
        fellow: true,
        birthday: true,
        gender: true,
      },
      where: {
        createdAt: {
          lte: new Date(record.date),
        },
      },
      orderBy: {
        alphabet: "asc",
      },
    });
    const categoryMembers = members
      .map((member) => {
        return {
          ...member,
          checked: record?.members.some((m) => m.id === member.id),
        };
      })
      .reduce((acc, member) => {
        const firstAlphabet = member.alphabet[0];
        if (!acc[firstAlphabet]) {
          acc[firstAlphabet] = [];
        }
        acc[firstAlphabet].push(member);
        return acc;
      }, {} as Record<string, typeof members>);
    const archived = !!(
      record?.date && isAfter(new Date(), new Date(record.date))
    );
    const { title, date, period, total, maleTotal, femaleTotal } = record;
    return Response.json({
      title,
      date,
      period,
      total,
      maleTotal,
      femaleTotal,
      archived,
      categoryMembers,
    });
  } catch (e) {
    return Response.error();
  }
}
