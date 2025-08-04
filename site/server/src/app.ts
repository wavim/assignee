// @ts-types="@types/express"
import express from "express";
// @ts-types="@types/compression"
import compression from "compression";

import { join } from "@std/path";
import { init } from "/db/crons.ts";
import { route } from "/routes/route.ts";

init();

const src = join(
  import.meta.dirname!,
  "../public",
);
const app = express()
  // MO TODO https://github.com/denoland/deno/issues/30259
  // .use(compression())
  .use("/api", route)
  .use(express.static(src))
  .get("/*E404", (_, res) => res.sendFile(join(src, "index.html")));

app.listen(5450, () => {
  console.log(
    "Assignee started on http://localhost:5450; Ctrl+C to terminate.",
  );
});
