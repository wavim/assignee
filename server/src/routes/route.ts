// @ts-types="npm:@types/express"
import { json, Router } from "npm:express";

export const route = Router().use(json());

route.get("/69", (_, res) => {
  res.json({ foo: 69 });
});
