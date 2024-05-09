import express from "express";
import globalErrorHandler from "./controllers/errorController.js";
import usersRoute from "./routes/usersRoutes.js";
import AppError from "./utils/AppError.js";

const app = express();

app.use(express.json());
app.use(express.static());

app.use("/v1/users", usersRoute);
app.all("*", (req, res, next) => {
  next(new AppError("This route does not exist on this server", 404));
});
app.use(globalErrorHandler);

export default app;
