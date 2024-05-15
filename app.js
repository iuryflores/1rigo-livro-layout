import express from "express";
import logger from "morgan";
import cors from "cors";
import pdfRoutes from "./routes/pdf.routes.js";

const app = express();

const port = 3005;

app.use(cors());
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50b", extended: true }));

app.use("/", pdfRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}!`);
});
