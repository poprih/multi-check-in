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
import { useRouter } from "next/navigation";
import BasicTable from "@/components/basic-table";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader } from "lucide-react";
import { PERIOD_DESCRIPTION } from "@/const";

export default function CheckInRecords() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const handleCreate = async (period: TimePeriod) => {
    const record = await fetch("/api/records", {
      method: "POST",
      body: JSON.stringify({ period }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    router.push(`/records/${record.id}`);
    return;
  };
  const [records, setRecords] = useState<CheckInRecord[]>([]);
  useEffect(() => {
    fetch("/api/records")
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
        setLoading(false);
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
      accessorKey: "total",
      header: "總人數",
    },
    {
      accessorKey: "maleTotal",
      header: "弟兄人數",
    },
    {
      accessorKey: "femaleTotal",
      header: "姊妹人數",
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
          </div>
        );
      },
    },
  ];
  return (
    <div className="p-4">
      <div className="flex gap-4 items-center">
        <h1>簽到</h1>
        <Button asChild>
          <Link href="member">教會成員</Link>
        </Button>
      </div>
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
                    {PERIOD_DESCRIPTION[period]}
                  </Button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {loading ? (
        <div className="flex justify-center">
          <Loader className="animate-spin-slow" />
        </div>
      ) : (
        <BasicTable columns={columns} data={records} />
      )}
    </div>
  );
}
