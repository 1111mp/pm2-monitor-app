import Link from "next/link";

import { api } from "@/trpc/server";
import { Content } from "@/components/Content";

export default async function Home() {
  // const apps = await api.pm2.list.query().catch((err) => console.log(err));

  // console.log(apps);

  // const desc = await api.pm2.describe.query("app");
  // console.log("desc", desc);

  return (
    <main className="flex min-h-screen">
      <div className="h-96 w-full">
        <Content />
      </div>
    </main>
  );
}
