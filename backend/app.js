const express = require("express");
const morgan = require("morgan");
const instructorRouter = require("./routes/instructorRoutes");
const courseRouter = require("./routes/courseRoutes");
const adminRouter = require("./routes/adminRoutes");
const individualTraineeRouter = require("./routes/individualTraineeRoutes");
const authRouter = require("./routes/authRoutes");
const cors = require("cors");

const app = express();

app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/instructor", instructorRouter);
app.use("/api/course", courseRouter);
app.use("/api/admin", adminRouter);
app.use("/api/individual-trainee", individualTraineeRouter);
app.use("/api/auth", authRouter);

module.exports = app;
