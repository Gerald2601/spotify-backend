const express = require("express");
const cors = require("cors");

const app = express();
const { connectDB } = require("./src/mongo");
const { disconnectDB } = require("./src/mongo");

const albumRouter = require("./src/controller/albumRouter");
const genreRouter = require("./src/controller/genreRouter");
const songRouter = require("./src/controller/songRouter");
const User = require("./src/controller/userRouter");
const playlistRouter = require("./src/controller/playlistRouter");
const artistRouter = require("./src/controller/artistsRouter");
const { authRouter, configSecurity } = require("./src/controller/authRouter");

const PORT = process.env.PORT || 8080;
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

configSecurity(app);
app.use(express.json());
app.use("/songs", songRouter);
app.use("/", User);
app.use("/", authRouter);
app.use("/", artistRouter);
app.use("/", playlistRouter);
app.use("/", albumRouter);
app.use("/", genreRouter);

if (process.env.NODE_ENV !== "test") {
  connectDB().then(async (error) => {
    if (error) {
      console.log(error);
    }
  });
}

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`Server is up and running in port ${PORT}`);
  }
});

module.exports = { app, server };
