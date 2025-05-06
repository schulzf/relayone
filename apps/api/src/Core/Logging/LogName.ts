export const LogName = {
  server: "server",
} as const;

export type LogName = (typeof LogName)[keyof typeof LogName];
