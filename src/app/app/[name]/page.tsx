"use client";

import { Card, CardBody } from "@nextui-org/card";
import { Spacer } from "@nextui-org/spacer";
import { Tabs, Tab } from "@nextui-org/tabs";
import { LogWrapper } from "@/components/LogWrapper";
import { CPU, Memory } from "@/components/Charts";

import { swrApi } from "@/trpc/react";

export default function Page({ params }: { params: { name: string } }) {
  const { data, isLoading } = swrApi.pm2.describe.useSWR(7, {
    // refreshInterval: 1000,
    revalidateOnFocus: false,
  });

  console.log(data);

  return (
    <div className="h-full w-full p-6">
      {/* <Tabs color="warning" size="sm">
        <Tab key="0" title="pm_id: 0" />
        <Tab key="1" title="pm_id: 1" />
        <Tab key="2" title="pm_id: 2" />
      </Tabs>
      <Spacer y={3} /> */}
      <div className="flex h-full w-full">
        <div className="flex w-2/3 flex-col">
          <Card className="basis-1/2" isHoverable>
            <CardBody className="flex h-96 flex-col">
              <div className="basis-1/2">
                <CPU data={data} isLoading={isLoading} />
              </div>
              <Spacer x={2} />
              <div className="basis-1/2">
                <Memory data={data} isLoading={isLoading} />
              </div>
            </CardBody>
          </Card>
          <Spacer y={3} />
          <div className="flex basis-1/2 flex-row">
            <Card className="basis-1/2" isHoverable>
              <CardBody className="h-96">ssss</CardBody>
            </Card>
            <Spacer x={3} />
            <Card className="basis-1/2" isHoverable>
              <CardBody className="h-96">ssss</CardBody>
            </Card>
          </div>
        </div>
        <Spacer x={3} />
        <div className="flex w-1/3 flex-col">
          <Card className="w-full basis-1/2 py-3" isHoverable>
            <CardBody className="overflow-y-auto py-0 pl-0">
              <LogWrapper
                code={`Server is running at http://127.0.0.1:8080/
GET: /
GET: /favicon.ico
GET: /
GET: /favicon.ico
GET: /
GET: /favicon.ico
GET: /
GET: /favicon.ico
GET: /
GET: /favicon.ico
GET: /
GET: /favicon.ico
GET: /
GET: /favicon.ico
GET: /
GET: /favicon.ico
GET: /
GET: /favicon.ico
GET: /
GET: /favicon.ico
GET: /
GET: /favicon.ico
GET: /
GET: /favicon.ico
GET: /
GET: /favicon.ico
`}
              />
            </CardBody>
          </Card>
          <Spacer y={3} />
          <Card className="w-full basis-1/2 py-3" isHoverable>
            <CardBody className="overflow-y-auto py-0 pl-0">
              <LogWrapper
                code={`Server is running at http://127.0.0.1:8080/
2023-12-04T20:14:59: Error: No recipients defined
2023-12-04T20:14:59:     at SMTPConnection._formatError (/Users/zhangyifan/Documents/projects/pm2-monitor/node_modules/nodemailer/lib/smtp-connection/index.js:790:19)
2023-12-04T20:14:59:     at SMTPConnection._setEnvelope (/Users/zhangyifan/Documents/projects/pm2-monitor/node_modules/nodemailer/lib/smtp-connection/index.js:1023:34)
2023-12-04T20:14:59:     at SMTPConnection.send (/Users/zhangyifan/Documents/projects/pm2-monitor/node_modules/nodemailer/lib/smtp-connection/index.js:621:14)
2023-12-04T20:14:59:     at sendMessage (/Users/zhangyifan/Documents/projects/pm2-monitor/node_modules/nodemailer/lib/smtp-transport/index.js:228:28)
2023-12-04T20:14:59:     at /Users/zhangyifan/Documents/projects/pm2-monitor/node_modules/nodemailer/lib/smtp-transport/index.js:289:21
2023-12-04T20:14:59:     at SMTPConnection.<anonymous> (/Users/zhangyifan/Documents/projects/pm2-monitor/node_modules/nodemailer/lib/smtp-connection/index.js:213:17)
2023-12-04T20:14:59:     at Object.onceWrapper (node:events:628:28)
2023-12-04T20:14:59:     at SMTPConnection.emit (node:events:514:28)
2023-12-04T20:14:59:     at SMTPConnection.emit (node:domain:489:12)
2023-12-04T20:14:59:     at SMTPConnection._actionEHLO (/Users/zhangyifan/Documents/projects/pm2-monitor/node_modules/nodemailer/lib/smtp-connection/index.js:1347:14) {
2023-12-04T20:14:59:   code: 'EENVELOPE',
2023-12-04T20:14:59:   command: 'API'
2023-12-04T20:14:59: }
2023-12-04T20:14:59: Error: No recipients defined
2023-12-04T20:14:59:     at SMTPConnection._formatError (/Users/zhangyifan/Documents/projects/pm2-monitor/node_modules/nodemailer/lib/smtp-connection/index.js:790:19)
2023-12-04T20:14:59:     at SMTPConnection._setEnvelope (/Users/zhangyifan/Documents/projects/pm2-monitor/node_modules/nodemailer/lib/smtp-connection/index.js:1023:34)
2023-12-04T20:14:59:     at SMTPConnection.send (/Users/zhangyifan/Documents/projects/pm2-monitor/node_modules/nodemailer/lib/smtp-connection/index.js:621:14)
2023-12-04T20:14:59:     at sendMessage (/Users/zhangyifan/Documents/projects/pm2-monitor/node_modules/nodemailer/lib/smtp-transport/index.js:228:28)
2023-12-04T20:14:59:     at /Users/zhangyifan/Documents/projects/pm2-monitor/node_modules/nodemailer/lib/smtp-transport/index.js:289:21
2023-12-04T20:14:59:     at SMTPConnection.<anonymous> (/Users/zhangyifan/Documents/projects/pm2-monitor/node_modules/nodemailer/lib/smtp-connection/index.js:213:17)
2023-12-04T20:14:59:     at Object.onceWrapper (node:events:628:28)
2023-12-04T20:14:59:     at SMTPConnection.emit (node:events:514:28)
2023-12-04T20:14:59:     at SMTPConnection.emit (node:domain:489:12)
2023-12-04T20:14:59:     at SMTPConnection._actionEHLO (/Users/zhangyifan/Documents/projects/pm2-monitor/node_modules/nodemailer/lib/smtp-connection/index.js:1347:14) {
2023-12-04T20:14:59:   code: 'EENVELOPE',
2023-12-04T20:14:59:   command: 'API'
2023-12-04T20:14:59: }
                
`}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
