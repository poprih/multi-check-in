import prisma from "@/lib/prisma";
import { pinyin } from "pinyin-pro";
export async function GET() {
  const members = await prisma.member.findMany({
    select: {
      id: true,
      name: true,
      alphabet: true,
      fellow: true,
      birthday: true,
      gender: true,
    },
  });
  return Response.json(members);
}

export async function POST(request: Request) {
  const { alphabet, ...rest } = await request.json();
  const member = await prisma.member.create({
    data: {
      ...rest,
      alphabet: (
        alphabet || pinyin(rest.name, { toneType: "none" })
      ).toUpperCase(),
    },
  });
  return Response.json({ id: member.id });
}

export async function PATCH(request: Request) {
  const { id, alphabet, ...rest } = await request.json();
  await prisma.member.update({
    where: {
      id,
    },
    data: {
      ...rest,
      alphabet: (
        alphabet || pinyin(rest.name, { toneType: "none" })
      ).toUpperCase(),
    },
  });
  return Response.json({ id });
}
