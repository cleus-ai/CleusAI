#!/usr/bin/env ts-node
// Generator: pnpm ts-node tools/generators/create-route.ts <route-name>
import { writeFileSync, mkdirSync } from "fs";
import path from "path";

const name = process.argv[2];
if (!name) { console.error("Usage: create-route.ts <route-name>"); process.exit(1); }

const dir = `apps/api/src/routes`;
const content = `import { Router } from "express";
import { authenticate } from "../middleware/auth";

export const ${name}Router = Router();
${name}Router.use(authenticate);

${name}Router.get("/", async (req: any, res, next) => {
  try {
    res.json({ data: [] });
  } catch (e) { next(e); }
});
`;

writeFileSync(path.join(dir, `${name}.ts`), content);
console.log(`Created ${dir}/${name}.ts`);
