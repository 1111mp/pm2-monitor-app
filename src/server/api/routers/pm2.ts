import { z } from "zod";
import pm2, { type ProcessDescription, type Proc } from "pm2";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const status = {
  connected: false,
};

const middleware =
  <T extends (...args: any[]) => Promise<any>>(fn: T) =>
  async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    if (!status.connected) {
      try {
        await connect();
        status.connected = true;
      } catch (err) {
        status.connected = false;
        throw err;
      }
    }

    return fn(...args);
  };

/**
 * Either connects to a running pm2 daemon (“God”) or launches and daemonizes one.
 * Once launched, the pm2 process will keep running after the script exits.
 */
const connect = (): Promise<void> =>
  new Promise((resolve, reject) =>
    pm2.connect((err) => (err ? reject(err) : resolve())),
  );

/**
 * Disconnects from the pm2 daemon.
 */
const disconnect = () => pm2.disconnect();

/**
 * Gets the list of running processes being managed by pm2.
 */
const list = middleware(
  (): Promise<ProcessDescription[]> =>
    new Promise((resolve, reject) =>
      pm2.list((err, apps) => (err ? reject(err) : resolve(apps))),
    ),
);

/**
 * Returns various information about a process: eg what stdout/stderr and pid files are used.
 * @param process - Can either be the name as given in the pm2.start options,
 * a process id, or the string “all” to indicate that all scripts should be restarted.
 */
const describe = middleware(
  (process: string | number): Promise<ProcessDescription[]> =>
    new Promise((resolve, reject) =>
      pm2.describe(process, (err, descs) =>
        err ? reject(err) : resolve(descs),
      ),
    ),
);

/**
 * Stops a process but leaves the process meta-data in pm2’s list
 * @param process - Can either be the name as given in the pm2.start options,
 * a process id, or the string “all” to indicate that all scripts should be restarted.
 */
const stop = middleware(
  (process: string | number): Promise<Proc> =>
    new Promise((resolve, reject) =>
      pm2.stop(process, (err, proc) => (err ? reject(err) : resolve(proc))),
    ),
);

/**
 * Stops and restarts the process.
 * @param process - Can either be the name as given in the pm2.start options,
 * a process id, or the string “all” to indicate that all scripts should be restarted.
 */
const restart = middleware(
  (process: string | number): Promise<Proc> =>
    new Promise((resolve, reject) =>
      pm2.restart(process, (err, proc) => (err ? reject(err) : resolve(proc))),
    ),
);

/**
 * Zero-downtime rolling restart. At least one process will be kept running at
 * all times as each instance is restarted individually.
 * Only works for scripts started in cluster mode.
 * @param process - Can either be the name as given in the pm2.start options,
 * a process id, or the string “all” to indicate that all scripts should be restarted.
 */
const reload = middleware(
  (process: string | number): Promise<Proc> =>
    new Promise((resolve, reject) =>
      pm2.reload(process, (err, proc) => (err ? reject(err) : resolve(proc))),
    ),
);

/**
 * Stops the process and removes it from pm2’s list.
 * The process will no longer be accessible by its name
 * @param process - Can either be the name as given in the pm2.start options,
 * a process id, or the string “all” to indicate that all scripts should be restarted.
 */
const del = middleware(
  (process: string | number): Promise<Proc> =>
    new Promise((resolve, reject) =>
      pm2.delete(process, (err, proc) => (err ? reject(err) : resolve(proc))),
    ),
);

/**
 * Kills the pm2 daemon (same as pm2 kill). Note that when the daemon is killed, all its
 * processes are also killed. Also note that you still have to explicitly disconnect
 * from the daemon even after you kill it.
 */
const killDaemon = middleware(
  (): Promise<ProcessDescription> =>
    new Promise((resolve, reject) =>
      pm2.killDaemon((err, proc) => (err ? reject(err) : resolve(proc))),
    ),
);

// pm2.connect((err) => {
//   console.log("init pm2");
//   if (err) {
//     console.log(err);
//     pm2.disconnect();
//     process.exit(1);
//   }

//   pm2.launchBus((err, bus) => {
//     if (err) {
//       console.log(err);
//       pm2.disconnect();
//       process.exit(1);
//     }

//     bus.on("*", (data) => {
//       console.log("***", data);
//     });

//     bus.on("process:event", (data) => {
//       console.log("process:event", data);
//     });

//     bus.on("process:exceptions", (data) => {
//       console.log("process:exceptions", data);
//     });

//     bus.on("process:msg", (data) => {
//       console.log("process:msg", data);
//     });
//   });
// });

export const pm2Router = createTRPCRouter({
  list: publicProcedure.query(() => list()),

  describe: publicProcedure
    .input(z.string().or(z.number()))
    .query(({ input }) => describe(input)),

  logs: publicProcedure
    .input(
      z.object({ pm_out_log_path: z.string(), pm_err_log_path: z.string() }),
    )
    .query(async ({ input }) => {
      const { pm_out_log_path, pm_err_log_path } = input;
    }),

  stop: publicProcedure
    .input(z.string().or(z.number()))
    .mutation(({ input }) => stop(input)),

  restart: publicProcedure
    .input(z.string().or(z.number()))
    .mutation(({ input }) => restart(input)),

  reload: publicProcedure
    .input(z.string().or(z.number()))
    .mutation(({ input }) => reload(input)),

  delete: publicProcedure
    .input(z.string().or(z.number()))
    .mutation(({ input }) => del(input)),

  kill: publicProcedure.mutation(async () => {
    await killDaemon();

    status.connected = false;
    disconnect();
  }),
});
