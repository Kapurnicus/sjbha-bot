import * as express from "express";

const app = express();
app.use(express.json({ type: "application/json" }))

app.get("/status", (req, res) => {
  res.send("Up and running")
})

export default app;