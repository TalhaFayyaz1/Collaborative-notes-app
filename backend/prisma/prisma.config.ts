import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "./schema.prisma",
  datasources: {
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL,
    },
  },
});
