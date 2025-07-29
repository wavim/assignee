// @ts-types="@types/express"
import express from "express";
// @ts-types="@types/compression"
import compression from "compression";

import { join } from "@std/path";
import { route } from "/routes/route.ts";

const src = join(import.meta.dirname!, "../public");

const app = express()
  .use(compression())
  .use("/api", route)
  .use(express.static(src))
  .get("/*NFOUND", (_, res) => res.sendFile(join(src, "index.html")));

app.listen(5450, () => {
  console.log(
    "Assignee started on http://localhost:5450; Ctrl+C to terminate.",
  );
});
