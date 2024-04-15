import prisma from "@/lib/prisma";
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  let [members, record] = await Promise.all([
    prisma.member.findMany({
      select: {
        id: true,
        name: true,
        alphabet: true,
        fellow: true,
        birthday: true,
        gender: true,
      },
    }),
    prisma.checkInRecord.findUnique({
      where: {
        id: params.id,
      },
      select: {
        title: true,
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
    }),
  ]);
  members = members.map((member) => {
    return {
      ...member,
      checked: record?.members.some((m) => m.id === member.id),
    };
  });
  const categoryMembers = members.reduce((acc, member) => {
    const firstAlphabet = member.alphabet[0];
    if (!acc[firstAlphabet]) {
      acc[firstAlphabet] = [];
    }
    acc[firstAlphabet].push(member);
    return acc;
  }, {} as Record<string, typeof members>);
  return Response.json({
    ...record,
    categoryMembers,
  });
}
