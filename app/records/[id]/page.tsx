"use client";
import { Fragment, useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CategoryMembers,
  CheckedMember,
  CheckInRecord,
  CheckInRecordWithCategaryMembers,
} from "@/types";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import LoaderButton from "@/components/loader-button";

export default function Record() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<CheckInRecord>();
  const [categoryMembers, updateCategoryMembers] = useImmer<CategoryMembers>(
    {}
  );
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    fetch(`/api/records/${params.id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((record: CheckInRecordWithCategaryMembers) => {
        const { categoryMembers, ...rest } = record;
        setRecord(rest);
        updateCategoryMembers(categoryMembers);
      })
      .finally(() => setLoading(false));
  }, [params.id, updateCategoryMembers]);
  const handleCheckIn = () => {
    setSubmitting(true);
    const memberIds = Object.values(categoryMembers).flatMap((members) => {
      return members
        .filter((member) => member.checked)
        .map((member) => member.id);
    });
    fetch("/api/records", {
      method: "PATCH",
      body: JSON.stringify({
        id: params.id,
        memberIds,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => setSubmitting(false));
  };
  return (
    <div className="p-4">
      <div className="flex justify-between  items-center">
        <div className="flex gap-2 items-center">
          <h1>{record?.title}</h1>
          <Button asChild>
            <Link href="/records">返回</Link>
          </Button>
        </div>
        <LoaderButton onClick={handleCheckIn} loading={submitting}>
          提交
        </LoaderButton>
      </div>
      {loading ? (
        <div className="flex justify-center">
          <Loader className="animate-spin-slow" />
        </div>
      ) : (
        <div>
          {Object.entries(categoryMembers || {}).map(([alphabet, members]) => {
            return (
              <div key={alphabet} className="my-4">
                <div className="py-2">{alphabet}</div>
                <div className="flex gap-4">
                  {members.map((member) => {
                    return (
                      <div key={member.id} className="flex items-center gap-2">
                        <Checkbox
                          id={member.id}
                          checked={member.checked}
                          onCheckedChange={(checked) => {
                            updateCategoryMembers((category) => {
                              const target = category[alphabet].find(
                                (_) => _.id === member.id
                              ) as CheckedMember;
                              target.checked = !!checked;
                            });
                          }}
                        />
                        <label
                          htmlFor={member.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {member.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
