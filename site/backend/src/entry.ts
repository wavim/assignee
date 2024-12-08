import { config } from "dotenv";
import express from "express";

config();

const app = express();
app.set("port", process.env.SERVER_PORT);

app.use(express.static("../frontend/dist"));

app.listen(app.get("port"), () => {
	console.log(
		`Express started on http://localhost:${app.get(
			"port",
		)}; Ctrl+C to terminate.`,
	);
});
