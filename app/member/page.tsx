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
      .finally(() => setCreateLoading(false));
  };
  const handleUpdate = (id: string, values: MemberFormValues) => {
    fetch("/api/member", {
      method: "PATCH",
      body: JSON.stringify({
        id,
        ...values,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res, "====res");
    });
  };
  useEffect(() => {
    fetch("/api/member", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      });
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
          <>
            <Dialog>
              <DialogTrigger asChild>
                <Button>修改</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>信息修改</DialogTitle>
                </DialogHeader>
                <MemberForm
                  onSubmit={(values) => handleUpdate(row.original.id, values)}
                  initialMember={row.original}
                />
                <DialogFooter>
                  <Button type="submit" form="member">
                    確定
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        );
      },
    },
  ];
  return (
    <div className="p-4">
      <h1>成员</h1>
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
