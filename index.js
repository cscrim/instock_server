import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
