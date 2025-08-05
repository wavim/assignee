// @ts-types="@types/express"
import express from "express";
// @ts-types="@types/compression"
import compression from "compression";

import { join } from "@std/path";
import { init } from "/database/crons.ts";
import { route } from "/routes/route.ts";

init();

const src = join(
  import.meta.dirname!,
  "../public",
);
const app = express()
  // MO ISSUE https://github.com/denoland/deno/issues/30259
  // MO ISSUE downgrading to deno@2.4.2 to fix
  .use(compression())
  .use("/api", route)
  .use(express.static(src))
  .get("/*E404", (_, res) => res.sendFile(join(src, "index.html")));

app.listen(5450, () => {
  console.log(
    "Assignee started on http://localhost:5450; Ctrl+C to terminate.",
  );
});
