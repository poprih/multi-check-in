"use client";
import { Member } from "@prisma/client";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MemberForm from "@/components/member-form";
import type { MemberFormValues } from "@/components/member-form";

const MemberPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const handleSubmit = (values: MemberFormValues) => {
    fetch("/api/member", {
      method: "POST",
      body: JSON.stringify({
        ...values,
        child: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res, "====res");
    });
  };
  return (
    <div>
      <h1>Member Page</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">新增成员</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>新增成员</DialogTitle>
          </DialogHeader>
          <MemberForm onSubmit={handleSubmit} />
          <DialogFooter>
            <Button type="submit" form="member">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            <span>姓名：{member.name}</span>
            <span>性别：{member.gender}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberPage;
