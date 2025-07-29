import { join } from "jsr:@std/path";

// @ts-types="npm:@types/express"
import express from "npm:express";
// @ts-types="npm:@types/compression"
import compression from "npm:compression";

const app = express()
  .use(compression())
  .use(express.static(join(import.meta.dirname!, "../public")));

app.listen(5450, () => {
  console.log(
    "Assignee started on http://localhost:5450; Ctrl+C to terminate.",
  );
});
