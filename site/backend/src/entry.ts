import express from "express";
import { configs } from "./configs/configs.js";

const app = express();

app.set("port", configs.app.port);
app.use(express.static(`./${configs.app.static}`));

app.listen(app.get("port"), () => {
	console.log(
		`Express started on http://localhost:${app.get(
			"port",
		)}; Ctrl+C to terminate.`,
	);
});
