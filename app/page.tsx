import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-2">
      <h1>Multi Check In</h1>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/member">教會成員</Link>
        </Button>
        <Button asChild>
          <Link href="/records">簽到表</Link>
        </Button>
      </div>
    </div>
  );
}
