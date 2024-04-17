import { TimePeriod } from "@prisma/client";

export const PERIOD_DESCRIPTION = {
  [TimePeriod.AM]: "上午禮拜",
  [TimePeriod.NOON]: "中午日本語礼拝",
  [TimePeriod.PM]: "下午禮拜",
};
