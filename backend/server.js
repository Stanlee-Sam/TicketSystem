import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import loginRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import ticketRoute from "./routes/ticketRoute.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

//routes
app.use("/auth", loginRoute);
app.use("/user", userRoute);
app.use("/ticket", ticketRoute);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
