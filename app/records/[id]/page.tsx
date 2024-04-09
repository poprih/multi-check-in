"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckInRecord, Member, RECORD_ACTION } from "@/types";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useImmer } from "use-immer";

interface CheckedMember extends Member {
  checked: boolean;
}
export default function Record() {
  const params = useParams();
  const [record, setRecord] = useState<CheckInRecord>();
  const [members, updateMembers] = useImmer<CheckedMember[]>([]);
  useEffect(() => {
    Promise.all([
      fetch(`/api/records?id=${params.id}`, {
        method: "GET",
      }).then((res) => res.json()),
      fetch("/api/member", {
        method: "GET",
      }).then((res) => res.json()),
    ]).then(([record, members]: [CheckInRecord[], Member[]]) => {
      setRecord(record[0]);
      updateMembers(
        members.map((member: Member) => ({
          ...member,
          checked: record[0].members.includes(member.id),
        }))
      );
    });
  }, [params.id, updateMembers]);
  const handleCheckIn = () => {
    fetch("/api/records", {
      method: "PATCH",
      body: JSON.stringify({
        id: params.id,
        memberIds: members.map((m) => m.id),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res, "====res");
    });
  };
  return (
    <div className="p-4">
      <h1>{record?.title}</h1>
      <div className="flex gap-4 my-4">
        {members.map((member) => {
          return (
            <Fragment key={member.id}>
              <Checkbox
                id={member.id}
                checked={member.checked}
                onCheckedChange={(value) => {
                  updateMembers((members: CheckedMember[]) => {
                    const target = members.find((m) => m.id === member.id);
                    if (target) {
                      target.checked = !!value;
                    }
                  });
                }}
              />
              <label
                htmlFor={member.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {member.name}
              </label>
            </Fragment>
          );
        })}
      </div>
      <Button onClick={handleCheckIn}>提交</Button>
    </div>
  );
}
