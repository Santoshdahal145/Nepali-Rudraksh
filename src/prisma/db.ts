import "dotenv/config";
import { Temporal as TemporalPolyfill } from "@js-temporal/polyfill";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./contract.d";
import contractJson from "./contract.json" with { type: "json" };

const global = globalThis as typeof globalThis & {
  Temporal?: typeof TemporalPolyfill;
};

if (!global.Temporal) {
  global.Temporal = TemporalPolyfill;
}

export const db = postgres<Contract>({
  contractJson,
  url: process.env["DATABASE_URL"]!,
});