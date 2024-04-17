"use client";
import { Gender, Member } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MemberForm from "@/components/member-form";
import type { MemberFormValues } from "@/components/member-form";
import BasicTable from "@/components/basic-table";
import { ColumnDef } from "@tanstack/react-table";
import LoaderButton from "@/components/loader-button";
import { Loader } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const MemberPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [createVisible, setCreateVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const handleCreate = (values: MemberFormValues) => {
    setCreateLoading(true);
    fetch("/api/member", {
      method: "POST",
      body: JSON.stringify({
        ...values,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => setCreateVisible(false))
      .then(() => fetchMembers())
      .finally(() => setCreateLoading(false));
  };
  const [updateMember, setUpdateMember] = useState<Member | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const handleUpdate = (values: MemberFormValues) => {
    setUpdateLoading(true);
    fetch("/api/member", {
      method: "PATCH",
      body: JSON.stringify({
        id: updateMember?.id,
        ...values,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => setUpdateMember(null))
      .then(() => fetchMembers())
      .finally(() => setUpdateLoading(false));
  };
  const fetchMembers = () => {
    setLoading(true);
    return fetch("/api/member", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchMembers();
  }, []);
  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "姓名",
    },
    {
      accessorKey: "alphabet",
      header: "字母名",
    },
    {
      accessorKey: "gender",
      header: "性別",
      accessorFn: ({ gender }) => {
        return gender === Gender.Male ? "弟兄" : "姊妹";
      },
    },
    {
      accessorKey: "birthday",
      header: "生日",
    },
    {
      accessorKey: "createdAt",
      header: "創建日期",
      accessorFn: ({ createdAt }) => {
        return format(new Date(createdAt), "yyyy-MM-dd");
      },
    },
    {
      accessorKey: "fellow",
      header: "同工",
      accessorFn: ({ fellow }) => {
        return fellow ? "是" : "否";
      },
    },
    {
      accessorKey: "action",
      header: "操作",
      cell: ({ row }) => {
        return (
          <Button onClick={() => setUpdateMember(row.original)}>修改</Button>
        );
      },
    },
  ];
  return (
    <div className="p-4">
      <div className="flex gap-4 items-center">
        <h1>成员</h1>
        <Button asChild>
          <Link href="records">簽到</Link>
        </Button>
      </div>
      <Dialog
        open={!!updateMember?.id}
        onOpenChange={() => setUpdateMember(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>信息修改</DialogTitle>
          </DialogHeader>
          <MemberForm
            onSubmit={handleUpdate}
            initialMember={updateMember as Member}
          />
          <DialogFooter>
            <LoaderButton type="submit" form="member" loading={updateLoading}>
              確定
            </LoaderButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex justify-end my-4">
        <Button onClick={() => setCreateVisible(true)}>新增成员</Button>
        <Dialog
          open={createVisible}
          onOpenChange={() => setCreateVisible(false)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>新增成员</DialogTitle>
            </DialogHeader>
            <MemberForm onSubmit={handleCreate} />
            <DialogFooter>
              <LoaderButton type="submit" form="member" loading={createLoading}>
                確定
              </LoaderButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {loading ? (
        <div className="flex justify-center">
          <Loader className="animate-spin-slow" />
        </div>
      ) : (
        <BasicTable columns={columns} data={members} />
      )}
    </div>
  );
};

export default MemberPage;
