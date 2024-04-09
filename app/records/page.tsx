"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckInRecord, TimePeriod } from "@prisma/client";
import { getters } from "@/utils";
import { useRouter } from "next/navigation";
import BasicTable from "@/components/basic-table";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CheckInRecords() {
  const router = useRouter();
  const handleCreate = async (period: TimePeriod) => {
    const title = `${getters.lastestSunday} ${period}`;
    let [record] = await fetch(`/api/records?title=${title}`).then((res) =>
      res.json()
    );
    if (!record?.id) {
      record = await fetch("/api/records", {
        method: "POST",
        body: JSON.stringify({ title, period }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    }
    router.push(`/records/${record.id}`);
    return;
  };
  const [records, setRecords] = useState<CheckInRecord[]>([]);
  useEffect(() => {
    fetch("/api/records")
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
      });
  }, []);
  const columns: ColumnDef<CheckInRecord>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "title",
      header: "標題",
    },
    {
      accessorKey: "period",
      header: "時間段",
    },
    {
      accessorKey: "action",
      header: "操作",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/records/${row.getValue("id")}`}>查看</Link>
            </Button>
            <Button>刪除</Button>
          </div>
        );
      },
    },
  ];
  return (
    <div className="p-4">
      <h1>Check In Records</h1>
      <div className="flex justify-end mb-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button>新增簽到表</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>時間段</DialogTitle>
            </DialogHeader>
            <div className="flex justify-between gap-4">
              {Object.values(TimePeriod).map((period) => {
                return (
                  <Button
                    key={period}
                    variant="outline"
                    onClick={() => handleCreate(period)}
                  >
                    {period}
                  </Button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <BasicTable columns={columns} data={records} />
    </div>
  );
}
