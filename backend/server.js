import "./services/cloudinary.js";
import express from "express";
import cors from "cors";
import loginRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import ticketRoute from "./routes/ticketRoute.js";
import departmentRoute from "./routes/departmentRoute.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

//routes
app.use("/auth", loginRoute);
app.use("/user", userRoute);
app.use("/ticket", ticketRoute);
app.use("/department", departmentRoute);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
