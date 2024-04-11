import { CheckInRecord, Member, Prisma } from "@prisma/client";

export type { Member, CheckInRecord };
export const RECORD_ACTION = {
  IN: "IN",
  OUT: "OUT",
} as const;
export type RECORD_ACTION = (typeof RECORD_ACTION)[keyof typeof RECORD_ACTION];

export type CheckInRecordSelect = Prisma.CheckInRecordSelect;

export type CheckInRecordWithMembers = CheckInRecord & { members: Member[] };
