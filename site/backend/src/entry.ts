import express from "express";
import { configs } from "configs/configs";

const app = express();
// app.set("port", process.env.SERVER_PORT);
app.use(express.static("../public"));

app.listen(app.get("port"), () => {
	console.log(
		`Express started on http://localhost:${app.get(
			"port",
		)}; Ctrl+C to terminate.`,
	);
});
