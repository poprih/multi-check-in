"use client";
import { useEffect, useState } from "react";
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
  const [archived, setArchived] = useState(true);
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
        const { categoryMembers, archived, ...rest } = record;
        setArchived(archived);
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
  const anchors = Object.keys(categoryMembers);
  return (
    <div className="p-8">
      <div className="flex justify-between  items-center">
        <div className="flex gap-2 items-center">
          <h1>{record?.title}</h1>
          <Button asChild>
            <Link href="/records">返回</Link>
          </Button>
        </div>
      </div>
      <div className="fixed top-24 right-4 flex flex-col gap-2">
        <LoaderButton
          onClick={handleCheckIn}
          loading={submitting}
          disabled={archived}
        >
          保存
        </LoaderButton>
        <ul className="flex flex-col gap-2 text-2xl text-center">
          {anchors.map((anchor) => {
            return (
              <li key={anchor}>
                <Link href={`#${anchor}`} scroll>
                  {anchor === "servant" ? "同工" : anchor.toUpperCase()}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {loading ? (
        <div className="flex justify-center">
          <Loader className="animate-spin-slow" />
        </div>
      ) : (
        <div>
          {Object.entries(categoryMembers || {}).map(([category, members]) => {
            return (
              <div key={category} className="h-96" id={category}>
                <Link
                  className="p-2 my-2 block bg-gray-400"
                  href={`#${category}`}
                >
                  {category === "servant" ? "同工" : category.toUpperCase()}
                </Link>
                <div className="flex gap-4">
                  {members.map((member) => {
                    return (
                      <div key={member.id} className="flex items-center gap-2">
                        <Checkbox
                          disabled={archived}
                          id={member.id}
                          checked={member.checked}
                          onCheckedChange={(checked) => {
                            updateCategoryMembers((categoryMember) => {
                              const target = categoryMember[category].find(
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
