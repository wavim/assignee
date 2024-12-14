import express from "express";
import { config } from "./config/config.js";

const app = express();

app.set("port", config.app.port);
app.use(express.static(`./${config.app.static}`));

app.listen(app.get("port"), () => {
	console.log(
		`Express started on http://localhost:${app.get(
			"port",
		)}; Ctrl+C to terminate.`,
	);
});
