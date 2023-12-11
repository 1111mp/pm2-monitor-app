import Link from "next/link";

import { api } from "@/trpc/server";
import { Content } from "@/components/Content";
import { readStreamToString } from "@/utils/file";
import { LogWrapper } from "@/components/LogWrapper";

export default async function Home() {
  // const apps = await api.pm2.list.query();

  // console.log(apps);
  // const { pm2_env } = apps[0]!;
  // const { pm_out_log_path, pm_err_log_path } = pm2_env!;

  // // const desc = await api.pm2.describe.query("app");
  // // console.log("desc", desc);
  // const { output, error } = await api.pm2.logs.query({
  //   pm_out_log_path: pm_out_log_path!,
  //   pm_err_log_path: pm_err_log_path!,
  // });

  // const outputStr = await readStreamToString(output);

  return (
    <main className="min-h-screen">
      <div className="h-96 w-full">
        <Content />
      </div>
      {/* <div>
        <LogWrapper code={outputStr} />
      </div> */}
    </main>
  );
}
