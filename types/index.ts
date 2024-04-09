export type { Member, CheckInRecord } from "@prisma/client";

export const RECORD_ACTION = {
  IN: "IN",
  OUT: "OUT",
} as const;
export type RECORD_ACTION = (typeof RECORD_ACTION)[keyof typeof RECORD_ACTION];
